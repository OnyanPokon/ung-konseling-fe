import Modul from '@/constants/Modul';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Button, Popover, Descriptions, Typography } from 'antd';
import { AssessmentQuestion as QuestionsModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { ScreeningsService } from '@/services';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { screeningMatrixFilterFields } from './FormFields';

const Matrix = () => {
  const navigate = useNavigate();
  const { screeningId } = useParams();
  const { token, onUnauthorized } = useAuth();

  const { execute, ...getAllMatrixes } = useAbortableService(ScreeningsService.getMatrix, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllMatrixes.totalData });
  const [filterValues, setFilterValues] = React.useState({
    search: '',
    year: String(new Date().getFullYear())
  });

  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const fetchMatrixes = React.useCallback(async () => {
    const res = await execute({
      token: token,
      id: screeningId,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search,
      year: filterValues.year
    });

    const data = res?.data;

    if (!data) return;

    const questions = data.questions;
    const respondents = data.rows;

    setColumns(generateColumns(questions));
    setRows(respondents);
  }, [execute, token, screeningId, pagination.page, pagination.perPage, filterValues.search, filterValues.year]);

  React.useEffect(() => {
    if (screeningId) {
      fetchMatrixes();
    }
  }, [fetchMatrixes, screeningId, token]);

  const generateColumns = (questions) => {
    return [
      {
        title: 'Nama',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        ellipsis: true
      },
      {
        title: 'Tahun',
        dataIndex: 'createdAt',
        key: 'createdAt',
        fixed: 'left',
        ellipsis: true,
        render: (value) => new Date(value).getFullYear()
      },

      ...questions.map((q, index) => ({
        title: (
          <Popover
            content={
              <div className="max-w-sm">
                <div className="font-semibold">Pertanyaan Ke - {index + 1}</div>
                <b>Skala {q.scale}</b>
                <div>{q.text}</div>
              </div>
            }
          >
            <div className="news-text text-">Q - {index + 1}</div>
          </Popover>
        ),
        dataIndex: `q_${q.id}`,
        key: `q_${q.id}`,
        align: 'center',
        width: 80,
        render: (value) => <span style={{ color: value < 6 ? 'red' : 'inherit' }}>{value ?? '-'}</span>
      }))
    ];
  };

  const filter = {
    formFields: screeningMatrixFilterFields(),
    initialData: {
      year: filterValues.year
    },
    isLoading: getAllMatrixes.isLoading,
    onSubmit: (values) => {
      setFilterValues({
        year: values.year
      });
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/screenings')} type="text" />
          <DataTableHeader model={QuestionsModel} modul={Modul.RESPON_MATRIX} filter={filter} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        </div>
      }
    >
      <Skeleton loading={getAllMatrixes.isLoading} active>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={rows}
            columns={columns}
            loading={getAllMatrixes.isLoading}
            map={(row, index) => ({
              key: index,
              ...row
            })}
            pagination={pagination}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions bordered size="small" column={1} title={<Typography.Title level={5}>Detail Responden</Typography.Title>}>
                  <Descriptions.Item label="Nama">{record.name}</Descriptions.Item>
                  <Descriptions.Item label="Jenis Kelamin">{record.gender}</Descriptions.Item>
                  <Descriptions.Item label="Umur">{record.age}</Descriptions.Item>
                  <Descriptions.Item label="Pekerjaan">{record.job}</Descriptions.Item>
                  <Descriptions.Item label="Institusi">{record.institution}</Descriptions.Item>
                  <Descriptions.Item label="Domisili">{record.domisili}</Descriptions.Item>
                  <Descriptions.Item label="Pekerjaan Orang Tua">{record.parent_job}</Descriptions.Item>
                </Descriptions>
              ),
              rowExpandable: (record) => record.name !== 'Not Expandable'
            }}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Matrix;
