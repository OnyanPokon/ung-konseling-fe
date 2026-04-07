import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { AuthService } from '@/services';
import { DatabaseOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React from 'react';

const AdminDashboard = () => {
  const { token, onUnauthorized } = useAuth();
  const { execute, ...getAllOverview } = useAbortableService(AuthService.adminOverview, { onUnauthorized });

  const overview = getAllOverview.data ?? {};

  const fetchOverview = React.useCallback(() => {
    execute({
      token: token
    });
  }, [execute, token]);

  React.useEffect(() => {
    fetchOverview();
  }, [fetchOverview, token]);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-3">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Total Konselor</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_konselor ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl text-white">
            <UsergroupAddOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Total Konseli</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_konseli ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl text-white">
            <UserAddOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Total Tiket</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_tiket ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">
            <DatabaseOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-3">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Total Sesi Konseling</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_sesi_konseling ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">
            <DatabaseOutlined />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
