import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { KonselisService } from '@/services';
import { Card, Skeleton, Space } from 'antd';
import { Konselis as KonselisModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { additionalDataFormFields, formFields } from './FormFields';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.KONSELIS;

const Konselis = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllKonselis } = useAbortableService(KonselisService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllKonselis.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchKonselis = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchKonselis();
  }, [fetchKonselis, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const konselis = getAllKonselis.data ?? [];

  const storeKonselis = useService(KonselisService.store, onUnauthorized);
  const updateKonselis = useService(KonselisService.update, onUnauthorized);
  const deleteKonselis = useService(KonselisService.delete, onUnauthorized);

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
      title: 'NIM',
      dataIndex: 'nim',
      sorter: (a, b) => a.nim.length - b.nim.length,
      searchable: true
    },
    {
      title: 'Nomor Telp',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, KonselisModel], [DELETE, KonselisModel], [READ, KonselisModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={KonselisModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record, name: record.user.name, email: record.user.email },
                formFields: [...formFields(), ...additionalDataFormFields()],

                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateKonselis.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchKonselis({ token: token, page: pagination.page, per_page: pagination.per_page });
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
            model={KonselisModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.KONSELIS}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteKonselis.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchKonselis({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      formFields: [...formFields(), ...additionalDataFormFields()],
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeKonselis.execute({ ...values, password: 'password' }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchKonselis({ token: token, page: pagination.page, per_page: pagination.perPage });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={KonselisModel} modul={Modul.KONSELIS} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllKonselis.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={konselis} columns={column} loading={getAllKonselis.isLoading} map={(konselis) => ({ key: konselis.id, ...konselis })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Konselis;
