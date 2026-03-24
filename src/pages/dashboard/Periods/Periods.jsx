import dayjs from 'dayjs';
import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { Periods as PeriodsModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';
import { PeriodsService } from '@/services';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.PERIOD;

const Periods = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllPeriods } = useAbortableService(PeriodsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPeriods.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchPeriods = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const periods = getAllPeriods.data ?? [];

  const storePeriods = useService(PeriodsService.store, onUnauthorized);
  const updatePeriods = useService(PeriodsService.update, onUnauthorized);
  const deletePeriods = useService(PeriodsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama Periode',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'start_date',
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
      searchable: true
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'end_date',
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, PeriodsModel], [DELETE, PeriodsModel], [READ, PeriodsModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={PeriodsModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: {
                  ...record,
                  start_date: record.start_date ? dayjs(record.start_date) : null,
                  end_date: record.end_date ? dayjs(record.end_date) : null
                },
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePeriods.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
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
            model={PeriodsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.PERIOD}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePeriods.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        const { message, isSuccess } = await storePeriods.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPeriods({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={PeriodsModel} modul={Modul.PERIOD} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllPeriods.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={periods} columns={column} loading={getAllPeriods.isLoading} map={(period) => ({ key: period.id, ...period })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Periods;
