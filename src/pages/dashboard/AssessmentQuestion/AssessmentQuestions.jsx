import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space, Button } from 'antd';
import { AssessmentQuestion as QuestionsModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { QuestionFormFields } from './FormFields';
import { AssessmentQuestionsService } from '@/services';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.QUESTION;

const AssessmentQuestions = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();

  const { execute, ...getAllQuestions } = useAbortableService(AssessmentQuestionsService.getAll, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllQuestions.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchQuestions = React.useCallback(() => {
    execute({
      token: token,
      screening_id: assessmentId,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, assessmentId, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    if (assessmentId) {
      fetchQuestions();
    }
  }, [fetchQuestions, assessmentId, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const questions = React.useMemo(() => getAllQuestions.data ?? [], [getAllQuestions.data]);

  const storeQuestions = useService(AssessmentQuestionsService.store, onUnauthorized);
  const updateQuestions = useService(AssessmentQuestionsService.update, onUnauthorized);
  const deleteQuestions = useService(AssessmentQuestionsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Pertanyaan',
      dataIndex: 'question_text',
      sorter: (a, b) => a.question_text.localeCompare(b.question_text),
      searchable: true
    },
    {
      title: 'Skala',
      dataIndex: 'scale',
      sorter: (a, b) => a.scale - b.scale,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, QuestionsModel], [DELETE, QuestionsModel], [READ, QuestionsModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={QuestionsModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: record,
                formFields: QuestionFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateQuestions.execute(record.id, { ...values, screening_id: Number(assessmentId) }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchQuestions();
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
            model={QuestionsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.QUESTION}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteQuestions.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchQuestions();
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
      formFields: QuestionFormFields(),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeQuestions.execute({ ...values, screening_id: Number(assessmentId) }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchQuestions();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/assessments')} type="text" />
          <DataTableHeader model={QuestionsModel} modul={Modul.QUESTION} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        </div>
      }
    >
      <Skeleton loading={getAllQuestions.isLoading} active>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={questions} columns={column} loading={getAllQuestions.isLoading} map={(question) => ({ key: question.id, ...question })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default AssessmentQuestions;
