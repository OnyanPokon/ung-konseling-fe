import { Delete } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Badge, Card, Skeleton, Space, Tabs } from 'antd';
import { JadwalKonselors as JadwalKonselorModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { HariLayanansService, JadwalKonselorsService, KonselorsService } from '@/services';
import { JadwalKonselorFormFields } from './FormFields';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.JADWAL_KONSELOR;

const JadwalKonselors = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllJadwalKonselors } = useAbortableService(JadwalKonselorsService.getAll, { onUnauthorized });
  const { execute: fetchHariLayanans, ...getAllHariLayanans } = useAbortableService(HariLayanansService.getAll, { onUnauthorized });
  const { execute: fetchKonselors, ...getAllKonselors } = useAbortableService(KonselorsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllJadwalKonselors.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const [activeTab, setActiveTab] = React.useState(null);

  const fetchJadwalKonselors = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchJadwalKonselors();
    fetchHariLayanans({ token: token });
    fetchKonselors({ token: token });
  }, [fetchHariLayanans, fetchJadwalKonselors, fetchKonselors, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const jadwalKonselors = React.useMemo(() => getAllJadwalKonselors.data ?? [], [getAllJadwalKonselors.data]);
  const hariLayanans = getAllHariLayanans.data ?? [];
  const konselors = getAllKonselors.data ?? [];

  const storeJadwalKonselors = useService(JadwalKonselorsService.store, onUnauthorized);
  const deleteJadwalKonselors = useService(JadwalKonselorsService.delete, onUnauthorized);

  const groupedData = React.useMemo(() => {
    return Object.values(
      jadwalKonselors.reduce((acc, item) => {
        const workDayId = item.work_day?.id;

        if (!workDayId) return acc;

        if (!acc[workDayId]) {
          acc[workDayId] = {
            work_day: item.work_day,
            konselor: []
          };
        }

        acc[workDayId].konselor.push({
          jadwal_konselor_id: item.id, // ✅ simpan ini
          konselor_id: item.konselor.id,
          is_active: item.konselor.is_active,
          user: item.konselor.user
        });

        return acc;
      }, {})
    );
  }, [jadwalKonselors]);

  React.useEffect(() => {
    if (groupedData.length > 0 && !activeTab) {
      setActiveTab(String(groupedData[0].work_day.id));
    }
  }, [activeTab, groupedData]);

  console.log(groupedData);

  const column = [
    {
      title: 'Nama',
      dataIndex: ['user', 'name'],
      sorter: (a, b) => a.user.name.length - b.user.name.length,
      searchable: true
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      sorter: (a, b) => a.user.email.length - b.user.email.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      sorter: (a, b) => a.is_active.length - b.is_active.length,
      searchable: true,
      render: (record) =>
        (() => {
          let status;
          switch (record) {
            case true:
              status = <Badge status="processing" text="Aktif" />;
              break;
            case false:
              status = <Badge status="error" text="Non Aktif" />;
              break;
          }
          return status;
        })()
    }
  ];
  if (user && user.eitherCan([UPDATE, JadwalKonselorModel], [DELETE, JadwalKonselorModel], [READ, JadwalKonselorModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Delete
            title={`Delete ${modulName}`}
            model={JadwalKonselorModel}
            onClick={() => {
              console.log(record);
              modal.delete.default({
                title: `Delete ${Modul.JADWAL_KONSELOR}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteJadwalKonselors.execute(record.jadwal_konselor_id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchJadwalKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${modulName}`,
      formFields: JadwalKonselorFormFields({ options: { hariLayanans, konselors } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeJadwalKonselors.execute({ ...values, password: 'password' }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchJadwalKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={JadwalKonselorModel} modul={Modul.JADWAL_KONSELOR} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllJadwalKonselors.isLoading}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          {groupedData.map((item) => (
            <Tabs.TabPane key={item.work_day.id} tab={item.work_day.day_name}>
              <div className="w-full max-w-full overflow-x-auto">
                <DataTable
                  data={item.konselor}
                  columns={column}
                  loading={getAllJadwalKonselors.isLoading}
                  map={(row) => ({
                    key: row.jadwal_konselor_id,
                    ...row
                  })}
                  handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
                  pagination={pagination}
                />
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Skeleton>
    </Card>
  );
};

export default JadwalKonselors;
