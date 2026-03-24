import Modul from '@/constants/Modul';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Button, Popover } from 'antd';
import { Questions as QuestionsModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { AssessmentsService } from '@/services';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';

const Matrix = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const { token, onUnauthorized } = useAuth();

  const { execute, ...getAllMatrixes } = useAbortableService(AssessmentsService.getMatrix, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllMatrixes.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  const fetchMatrixes = React.useCallback(async () => {
    const res = await execute({
      token: token,
      id: assessmentId,
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

    // Generate chart data: average score per question
    const newChartData = questions.map((q, index) => {
      const qKey = `q_${q.id}`;
      const validScores = respondents.map((r) => r[qKey]).filter((val) => val !== null && val !== undefined);
      const avg = validScores.length > 0 ? validScores.reduce((a, b) => a + Number(b), 0) / validScores.length : 0;
      return {
        pertanyaan: `Q${index + 1}`,
        nilai: Number(avg.toFixed(2)),
        fullText: q.text
      };
    });
    setChartData(newChartData);
  }, [execute, assessmentId, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    if (assessmentId) {
      fetchMatrixes();
    }
  }, [fetchMatrixes, assessmentId, token]);

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
          <Popover content={<div className="news-text max-w-sm">{q.text}</div>} title={`Pertanyaan Ke - ${index + 1}`}>
            <div className="news-text">Q {index + 1}</div>
          </Popover>
        ),
        dataIndex: `q_${q.id}`,
        key: `q_${q.id}`,
        align: 'center',
        render: (value) => <span style={{ color: value < 6 ? 'red' : 'inherit' }}>{value ?? '-'}</span>
      }))
    ];
  };

  const chartConfig = {
    data: chartData,
    xField: 'pertanyaan',
    yField: 'nilai',
    label: {
      text: 'nilai',
      style: {
        textBaseline: 'bottom'
      }
    },
    style: {
      radiusTopLeft: 8,
      radiusTopRight: 8,
      fill: '#3b82f6' // blue-500
    },
    tooltip: {
      title: 'fullText'
    },
    meta: {
      nilai: {
        alias: 'Rata-rata Nilai'
      },
      pertanyaan: {
        alias: 'Pertanyaan'
      }
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/assessments')} type="text" />
          <DataTableHeader model={QuestionsModel} modul={Modul.RESPON_MATRIX} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        </div>
      }
    >
      <Skeleton loading={getAllMatrixes.isLoading} active>
        {chartData.length > 0 && (
          <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">Statistik Rata-rata Jawaban per Pertanyaan</h3>
            <div style={{ height: 320 }}>
              <Column {...chartConfig} />
            </div>
          </div>
        )}

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
