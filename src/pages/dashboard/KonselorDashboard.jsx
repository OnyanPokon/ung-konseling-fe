import { CalendarOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';

const KonselorDashboard = () => {
  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4">
        <div className="inline-flex w-full justify-between">
          <div className="flex-col gap-y-1">
            <span>Jadwal Hari Ini</span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              0
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
              0
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
              0
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
