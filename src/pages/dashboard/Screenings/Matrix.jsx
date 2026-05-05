import Modul from '@/constants/Modul';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Button, Popover } from 'antd';
import { AssessmentQuestion as QuestionsModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { ScreeningsService } from '@/services';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Matrix = () => {
  const navigate = useNavigate();
  const { screeningId } = useParams();
  const { token, onUnauthorized } = useAuth();

  const { execute, ...getAllMatrixes } = useAbortableService(ScreeningsService.getMatrix, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllMatrixes.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const fetchMatrixes = React.useCallback(async () => {
    const res = await execute({
      token: token,
      id: screeningId,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });

    const data = res?.data;

    if (!data) return;

    const questions = data.questions;
    const respondents = data.rows;

    setColumns(generateColumns(questions));
    setRows(respondents);
  }, [execute, screeningId, filterValues.search, pagination.page, pagination.perPage, token]);

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
        width: 200, // 👉 fix kecil
        fixed: 'left',
        ellipsis: true
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
            <div className="news-text text-">{index + 1}</div>
          </Popover>
        ),
        dataIndex: `q_${q.id}`,
        key: `q_${q.id}`,
        align: 'center',
        render: (value) => <span style={{ color: value < 6 ? 'red' : 'inherit' }}>{value ?? '-'}</span>
      }))
    ];
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/screenings')} type="text" />
          <DataTableHeader model={QuestionsModel} modul={Modul.RESPON_MATRIX} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
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
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Matrix;
