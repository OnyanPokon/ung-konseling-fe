import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space, Button, Popconfirm, Tooltip } from 'antd';
import { Assessments as AssessmentModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, DatabaseOutlined, LinkOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { AssessmentFormFields } from './FormFields';
import { AssessmentsService } from '@/services';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.ASSESSMENT;

const Assessments = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();

  const { execute: fetchAssessment, ...getAllAssessments } = useAbortableService(AssessmentsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllAssessments.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchAllData = React.useCallback(() => {
    fetchAssessment({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [fetchAssessment, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const assessments = React.useMemo(() => getAllAssessments.data ?? [], [getAllAssessments.data]);

  const storeAssessments = useService(AssessmentsService.store, onUnauthorized);
  const updateAssessments = useService(AssessmentsService.update, onUnauthorized);
  const deleteAssessments = useService(AssessmentsService.delete, onUnauthorized);

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

  if (user && user.eitherCan([UPDATE, AssessmentModel], [DELETE, AssessmentModel], [READ, AssessmentModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={AssessmentModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record },
                formFields: AssessmentFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateAssessments.execute(record.id, values, token);
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
            model={AssessmentModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${modulName}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteAssessments.execute(record.id, token);
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
          <Tooltip title="Lihat Pertanyaan">
            <Button variant="outlined" color="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => navigate(`/dashboard/assessments/${record.id}/questions`)} />
          </Tooltip>
          <Tooltip title="Lihat Matriks">
            <Button variant="outlined" color="primary" shape="circle" icon={<DatabaseOutlined />} onClick={() => navigate(`/dashboard/assessments/${record.id}/matrix`)} />
          </Tooltip>
          <Tooltip title="Bagikan Tautan">
            <Popconfirm
              title="Bagikan Tautan"
              description={
                <a href={`${window.location.origin}/assessments/${record.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {window.location.origin + '/assessments/' + record.slug}
                </a>
              }
              onConfirm={() => {
                const url = `${window.location.origin}/assessments/${record.slug}`;
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
          </Tooltip>
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${modulName}`,
      formFields: AssessmentFormFields(),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeAssessments.execute(values, token);
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
    <Card title={<DataTableHeader model={AssessmentModel} modul={Modul.ASSESSMENT} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllAssessments.isLoading} active>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={assessments}
            columns={column}
            loading={getAllAssessments.isLoading}
            map={(screening) => ({ key: screening.id, ...screening })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Assessments;
