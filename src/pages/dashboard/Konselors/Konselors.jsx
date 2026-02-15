import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Badge, Card, Skeleton, Space } from 'antd';
import { Konselors as KonselorModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';
import { KonselorsService } from '@/services';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.KONSELOR;

const Konselors = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllKonselors } = useAbortableService(KonselorsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllKonselors.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchKonselors = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchKonselors();
  }, [fetchKonselors, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const konselors = getAllKonselors.data ?? [];

  const storeKonselors = useService(KonselorsService.store, onUnauthorized);
  const updateKonselors = useService(KonselorsService.update, onUnauthorized);
  const deleteKonselors = useService(KonselorsService.delete, onUnauthorized);

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

  if (user && user.eitherCan([UPDATE, KonselorModel], [DELETE, KonselorModel], [READ, KonselorModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={KonselorModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record, name: record.user.name, email: record.user.email },
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateKonselors.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
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
            model={KonselorModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.KONSELOR}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteKonselors.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeKonselors.execute({ ...values, password: 'password' }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={KonselorModel} modul={Modul.KONSELOR} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllKonselors.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={konselors} columns={column} loading={getAllKonselors.isLoading} map={(konselor) => ({ key: konselor.id, ...konselor })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Konselors;
