import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Badge, Card, Skeleton, Space } from 'antd';
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

  const jadwalKonselors = getAllJadwalKonselors.data ?? [];
  const hariLayanans = getAllHariLayanans.data ?? [];
  const konselors = getAllKonselors.data ?? [];

  const storeJadwalKonselors = useService(JadwalKonselorsService.store, onUnauthorized);
  const updateJadwalKonselors = useService(JadwalKonselorsService.update, onUnauthorized);
  const deleteJadwalKonselors = useService(JadwalKonselorsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Hari Layanan',
      dataIndex: ['work_day', 'day_name'],
      sorter: (a, b) => a.work_day.day_name.length - b.work_day.day_name.length,
      searchable: true
    },
    {
      title: 'Nama',
      dataIndex: ['konselor', 'user', 'name'],
      sorter: (a, b) => a.konselor.user.name.length - b.konselor.user.name.length,
      searchable: true
    },
    {
      title: 'Email',
      dataIndex: ['konselor', 'user', 'email'],
      sorter: (a, b) => a.konselor.user.email.length - b.konselor.user.email.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: ['konselor', 'is_active'],
      sorter: (a, b) => a.konselor.is_active.length - b.konselor.is_active.length,
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
          <Edit
            title={`Edit ${modulName}`}
            model={JadwalKonselorModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { konselor_id: record.konselor.id, hari_layanan_id: record.work_day.id },
                formFields: JadwalKonselorFormFields({ options: { hariLayanans, konselors } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateJadwalKonselors.execute(record.id, values, token);
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
          <Delete
            title={`Delete ${modulName}`}
            model={JadwalKonselorModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.JADWAL_KONSELOR}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteJadwalKonselors.execute(record.id, token);
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
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={jadwalKonselors}
            columns={column}
            loading={getAllJadwalKonselors.isLoading}
            map={(jadwalKonselor) => ({ key: jadwalKonselor.id, ...jadwalKonselor })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default JadwalKonselors;
