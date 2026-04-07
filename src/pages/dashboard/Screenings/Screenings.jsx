import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space, Button, Popconfirm } from 'antd';
import { Screenings as ScreeningsModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { ScreeningFormFields } from './FormFields';
import { ScreeningsService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, DatabaseOutlined, LinkOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.SCREENING;

const Screenings = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();

  const { execute: fetchScreenings, ...getAllScreenings } = useAbortableService(ScreeningsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllScreenings.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchAllData = React.useCallback(() => {
    fetchScreenings({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [fetchScreenings, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const screenings = React.useMemo(() => getAllScreenings.data ?? [], [getAllScreenings.data]);

  const storeScreenings = useService(ScreeningsService.store, onUnauthorized);
  const updateScreenings = useService(ScreeningsService.update, onUnauthorized);
  const deleteScreenings = useService(ScreeningsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Judul',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, ScreeningsModel], [DELETE, ScreeningsModel], [READ, ScreeningsModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={ScreeningsModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record },
                formFields: ScreeningFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateScreenings.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAllData();
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
            model={ScreeningsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.SCREENING}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteScreenings.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAllData();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button variant="outlined" color="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => navigate(`/dashboard/screenings/${record.id}/questions`)} />
          <Button variant="outlined" color="primary" shape="circle" icon={<DatabaseOutlined />} onClick={() => navigate(`/dashboard/screenings/${record.id}/matrix`)} />
          <Popconfirm
            title="Bagikan Tautan"
            description={
              <a href={`${window.location.origin}/screenings/${record.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {window.location.origin + '/screenings/' + record.slug}
              </a>
            }
            onConfirm={() => {
              const url = `${window.location.origin}/screenings/${record.slug}`;
              navigator.clipboard
                .writeText(url)
                .then(() => success('Berhasil', 'Tautan berhasil disalin'))
                .catch(() => error('Gagal', 'Tautan gagal disalin'));
            }}
            okText="Salin"
            cancelText="Batal"
            icon={<CopyOutlined className="text-blue-500" />}
          >
            <Button variant="outlined" color="primary" shape="circle" icon={<LinkOutlined />} />
          </Popconfirm>
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${modulName}`,
      formFields: ScreeningFormFields(),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeScreenings.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAllData();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={ScreeningsModel} modul={Modul.SCREENING} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllScreenings.isLoading} active>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={screenings} columns={column} loading={getAllScreenings.isLoading} map={(screening) => ({ key: screening.id, ...screening })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Screenings;
