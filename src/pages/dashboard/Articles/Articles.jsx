import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { Card, Skeleton, Space } from 'antd';
import { Articles as ArticlesModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { useNavigate } from 'react-router-dom';
import { ArticlesService } from '@/services';
import useAbortableService from '@/hooks/useAbortableService';

const { DELETE, UPDATE, READ } = Action;

const Articles = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllArticles } = useAbortableService(ArticlesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllArticles.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchArticles = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles, token]);

  const articles = getAllArticles.data ?? [];

  const deleteArticle = useService(ArticlesService.delete);

  const column = [
    {
      title: 'Judul',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, ArticlesModel], [DELETE, ArticlesModel], [READ, ArticlesModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ARTICLES}`}
            model={ArticlesModel}
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.slug);
            }}
          />
          <Delete
            title={`Delete ${Modul.ARTICLES}`}
            model={ArticlesModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ARTICLES}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteArticle.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchArticles({ token: token, page: pagination.page, per_page: pagination.per_page });
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
    navigate(window.location.pathname + '/create');
  };

  return (
    <Card title={<DataTableHeader model={ArticlesModel} modul={Modul.ARTICLES} onStore={onCreate} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllArticles.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={articles} columns={column} loading={getAllArticles.isLoading} map={(konselor) => ({ key: konselor.id, ...konselor })} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Articles;
