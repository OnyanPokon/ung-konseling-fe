import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space, Tabs, Empty, Button, Popconfirm } from 'antd';
import { Assessments as AssessmentsModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { AssessmentFormFields } from './FormFields';
import { AssessmentsService, PeriodsService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, DatabaseOutlined, LinkOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { DELETE, UPDATE, READ } = Action;
const modulName = Modul.ASSESSMENT;

const Assessments = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();

  const { execute: fetchAssessments, ...getAllAssessments } = useAbortableService(AssessmentsService.getAll, { onUnauthorized });
  const { execute: fetchPeriods, ...getAllPeriods } = useAbortableService(PeriodsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllAssessments.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchAllData = React.useCallback(() => {
    fetchAssessments({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
    fetchPeriods({ token: token });
  }, [fetchAssessments, fetchPeriods, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const assessments = React.useMemo(() => getAllAssessments.data ?? [], [getAllAssessments.data]);
  const periods = React.useMemo(() => getAllPeriods.data ?? [], [getAllPeriods.data]);

  const storeAssessments = useService(AssessmentsService.store, onUnauthorized);
  const updateAssessments = useService(AssessmentsService.update, onUnauthorized);
  const deleteAssessments = useService(AssessmentsService.delete, onUnauthorized);

  const [activeTab, setActiveTab] = React.useState(null);

  React.useEffect(() => {
    if (periods.length > 0 && !activeTab) {
      setActiveTab(String(periods[0].id));
    }
  }, [activeTab, periods]);

  const groupedData = React.useMemo(() => {
    return assessments.reduce((acc, item) => {
      const periodId = item.period?.id;
      if (!periodId) return acc;

      if (!acc[periodId]) {
        acc[periodId] = [];
      }

      acc[periodId].push(item);
      return acc;
    }, {});
  }, [assessments]);

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

  if (user && user.eitherCan([UPDATE, AssessmentsModel], [DELETE, AssessmentsModel], [READ, AssessmentsModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${modulName}`}
            model={AssessmentsModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${modulName}`,
                data: { ...record, period_id: record.period.id },
                formFields: AssessmentFormFields({ options: { periods } }),
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
            model={AssessmentsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ASSESSMENT}`,
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
          <Button variant="outlined" color="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => navigate(`/dashboard/assessments/${record.id}/questions`)} />
          <Button variant="outlined" color="primary" shape="circle" icon={<DatabaseOutlined />} onClick={() => navigate(`/dashboard/assessments/${record.id}/matrix`)} />
          <Popconfirm
            title="Bagikan Tautan"
            description={
              <a href={`${window.location.origin}/assessment/${record.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {window.location.origin + '/assessment/' + record.slug}
              </a>
            }
            onConfirm={() => {
              const url = `${window.location.origin}/assessment/${record.slug}`;
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
      formFields: AssessmentFormFields({ options: { periods } }),
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

  const renderTabsContent = () => {
    if (!periods.length) {
      return <Empty description="Belum ada Periode yang tersedia." />;
    }

    const tabItems = periods.map((period) => ({
      key: String(period.id),
      label: period.name,
      children: (
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={groupedData[period.id] || []}
            columns={column}
            loading={getAllAssessments.isLoading}
            map={(assessment) => ({ key: assessment.id, ...assessment })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      )
    }));

    return <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} type="card" />;
  };

  return (
    <Card title={<DataTableHeader model={AssessmentsModel} modul={Modul.ASSESSMENT} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllAssessments.isLoading || getAllPeriods.isLoading} active>
        {renderTabsContent()}
      </Skeleton>
    </Card>
  );
};

export default Assessments;
