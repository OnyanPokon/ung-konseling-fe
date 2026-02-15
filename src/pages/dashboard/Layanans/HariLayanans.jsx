import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { HariLayanans as HariLayananModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { HariLayanansService } from '@/services';
import { HariLayananFormFields } from './FormFields';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.HARI_LAYANAN;

const HariLayanans = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllHariLayanans } = useAbortableService(HariLayanansService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllHariLayanans.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchHariLayanans = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchHariLayanans();
  }, [fetchHariLayanans, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const hariLayanans = getAllHariLayanans.data ?? [];

  const storeHariLayanans = useService(HariLayanansService.store, onUnauthorized);
  const updateHariLayanans = useService(HariLayanansService.update, onUnauthorized);
  const deleteHariLayanans = useService(HariLayanansService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'day_name',
      sorter: (a, b) => a.day_name.length - b.day_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, HariLayananModel], [DELETE, HariLayananModel], [READ, HariLayananModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={HariLayananModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record, name: record.user.name, email: record.user.email },
                formFields: HariLayananFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateHariLayanans.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHariLayanans({ token: token, page: pagination.page, per_page: pagination.per_page });
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
            model={HariLayananModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.HARI_LAYANAN}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteHariLayanans.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchHariLayanans({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      formFields: HariLayananFormFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeHariLayanans.execute({ ...values, password: 'password' }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchHariLayanans({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={HariLayananModel} modul={Modul.HARI_LAYANAN} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllHariLayanans.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={hariLayanans}
            columns={column}
            loading={getAllHariLayanans.isLoading}
            map={(hariLayanan) => ({ key: hariLayanan.id, ...hariLayanan })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default HariLayanans;
