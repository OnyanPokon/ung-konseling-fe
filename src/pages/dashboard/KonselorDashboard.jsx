import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { KonselorsService } from '@/services';
import { CalendarOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React from 'react';

const KonselorDashboard = () => {
  const { token, onUnauthorized } = useAuth();
  const { execute, ...getAllOverview } = useAbortableService(KonselorsService.getOverview, { onUnauthorized });

  const overview = getAllOverview.data ?? [];

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
      <Card className="col-span-4">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Jadwal Hari Ini</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_sesi_konseling_hari_ini ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl text-white">
            <CalendarOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-4">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Menunggu Verifikasi</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_tiket_menunggu_verifikasi ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl text-white">
            <CalendarOutlined />
          </div>
        </div>
      </Card>
      <Card className="col-span-4">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Layanan Aktif</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {overview.total_sesi_konseling_aktif ?? 0}
            </Typography.Title>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">
            <CalendarOutlined />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KonselorDashboard;
