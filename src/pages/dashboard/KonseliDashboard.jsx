import CounselingTicket from '@/components/dashboard/ConselingTicket';
import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { JadwalKonselorsService, KonselisService, TiketsService } from '@/services';
import { Avatar, Badge, Calendar, Card, Descriptions, Empty, Skeleton, Spin, Tabs, Typography } from 'antd';
import React from 'react';

const dayMap = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6
};

const KonseliDashboard = () => {
  const { onUnauthorized, token, user } = useAuth();
  const { execute: fetchKonseli, ...getAllKonseli } = useAbortableService(KonselisService.getByUserId, { onUnauthorized });
  const { execute, ...getAllJadwalKonselors } = useAbortableService(JadwalKonselorsService.getAll, { onUnauthorized });
  const { execute: fetchTickets, ...getAllTickets } = useAbortableService(TiketsService.getAll, { onUnauthorized });

  const fetchJadwalKonselors = React.useCallback(() => {
    execute({
      token: token
    });
  }, [execute, token]);

  const jadwalKonselors = React.useMemo(() => getAllJadwalKonselors.data ?? [], [getAllJadwalKonselors.data]);
  const konseli = getAllKonseli.data ?? [];
  const tickets = getAllTickets.data ?? [];

  React.useEffect(() => {
    fetchJadwalKonselors();
    fetchKonseli({
      token: token,
      id: user.id
    });
  }, [fetchJadwalKonselors, fetchKonseli, fetchTickets, konseli.id, token, user.id]);

  React.useEffect(() => {
    if (!konseli?.id) return;

    fetchTickets({
      token: token,
      page: 1,
      perPage: 1,
      konseli_id: konseli.id
    });
  }, [fetchTickets, konseli?.id, token]);

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedKonselors, setSelectedKonselors] = React.useState([]);

  const groupedData = React.useMemo(() => {
    return jadwalKonselors.reduce((acc, item) => {
      const day = item.work_day?.day_name?.toLowerCase();

      if (!day) return acc;

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push({
        id: item.id,
        is_active: item.konselor.is_active,
        user: item.konselor.user
      });

      return acc;
    }, {});
  }, [jadwalKonselors]);

  const handleSelect = (date) => {
    const formatted = date.format('YYYY-MM-DD');
    setSelectedDate(formatted);

    const dayIndex = date.day();

    const matchedDay = Object.keys(groupedData).find((day) => dayMap[day] === dayIndex);

    if (!matchedDay) {
      setSelectedKonselors([]);
      return;
    }

    setSelectedKonselors(groupedData[matchedDay]);
  };

  const days = Object.keys(groupedData);

  const colorVariants = ['bg-yellow-50 text-yellow-500', 'bg-green-50 text-green-500', 'bg-blue-50 text-blue-500', 'bg-purple-50 text-purple-500', 'bg-pink-50 text-pink-500'];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-12 mb-4 flex flex-col gap-y-2 px-2">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Hai {user.name} 👋
        </Typography.Title>
        <span className="text-gray-500">Bagaimana Perasaanmu hari ini? Jangan ragu untuk berkomunikasi jika kamu memiliki masalah akademik maupun pribadi.</span>
      </div>

      <hr className="col-span-12 my-2" />
      <Card className="col-span-4 h-fit" title={'Kalender'}>
        <Calendar fullscreen={false} />
      </Card>
      <Card className="col-span-8" title={'Tiket'}>
        {getAllTickets.isLoading && <Skeleton active />}

        {!getAllTickets.isLoading && tickets.length === 0 && <Empty description="Belum ada tiket" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <div className="grid w-full grid-cols-4 gap-4">
          {!getAllTickets.isLoading &&
            tickets.length > 0 &&
            tickets.map((item) => (
              <div key={item.id} className="col-span-4">
                <CounselingTicket key={item.id} status={item.status} type={item.type} ticket_number={item.ticket_number} day_name={item.hari_layanan.day_name} desc={item.desc} created_at={item.created_at} service_type={item.service_type} />
              </div>
            ))}
        </div>
      </Card>

      <Card title={'Penjadwalan Konselor'} className="col-span-12">
        <Tabs>
          <Tabs.TabPane tab="Jadwal" key="jadwal">
            <div className="grid w-full grid-cols-12 gap-4">
              <div
                className="col-span-12 grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`
                }}
              >
                {days.map((day, index) => {
                  const colorClass = colorVariants[index % colorVariants.length];

                  return (
                    <div key={day} className="flex flex-col gap-y-4">
                      <div className={`rounded-md p-2 px-4 font-bold capitalize ${colorClass}`}>{day}</div>

                      <div className="flex flex-col gap-y-2">
                        {groupedData[day].map((konselor) => (
                          <Card
                            key={konselor.id}
                            title={
                              <div className="my-2 inline-flex items-center gap-x-2">
                                <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                <div className="flex flex-col">
                                  <small>{konselor.user.name}</small>
                                  <span className="text-xs font-normal">{konselor.user.email}</span>
                                </div>
                              </div>
                            }
                          >
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Status">{konselor.is_active ? <Badge status="processing" text="Aktif" /> : <Badge status="error" text="Non Aktif" />}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Kalender Jadwal" key="kalender">
            <div className="grid w-full grid-cols-12 gap-4">
              <Card title={'Jadwal Layanan Konseling'} className="col-span-8">
                {getAllJadwalKonselors.isLoading ? (
                  <div className="flex justify-center py-10">
                    <Spin />
                  </div>
                ) : jadwalKonselors.length === 0 ? (
                  <Empty description="Belum ada jadwal konselor" />
                ) : (
                  <Calendar
                    fullscreen={true}
                    dateCellRender={(value) => {
                      const dayIndex = value.day();

                      const matchedDay = Object.keys(groupedData).find((day) => dayMap[day] === dayIndex);

                      if (!matchedDay) return null;

                      const konselors = groupedData[matchedDay];

                      return (
                        <div className="relative h-full w-full">
                          <div className="absolute bottom-2 left-1 flex flex-col gap-y-1">
                            <Avatar.Group
                              max={{
                                count: 2,
                                style: { color: '#f56a00', backgroundColor: '#fde3cf' }
                              }}
                            >
                              {konselors.map((konselor) => (
                                <Avatar size={'small'} key={konselor.id} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                              ))}
                            </Avatar.Group>
                          </div>
                        </div>
                      );
                    }}
                    onSelect={handleSelect}
                  />
                )}
              </Card>
              <Card title={'Konselor'} className="col-span-4 h-fit">
                {selectedKonselors.length > 0 ? (
                  <div className="flex flex-col gap-y-2">
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Tanggal">{selectedDate ? selectedDate : '-'}</Descriptions.Item>
                      <Descriptions.Item label="Jumlah Konselor">{selectedKonselors.length}</Descriptions.Item>
                    </Descriptions>
                    {selectedKonselors.map((konselor) => (
                      <Card
                        title={
                          <div className="my-4 inline-flex items-center gap-x-2">
                            <Avatar size="large" style={{ backgroundColor: '#a5a5a5' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <div className="flex flex-col">
                              {konselor.user.name}
                              <small className="font-normal">{konselor.user.email}</small>
                            </div>
                          </div>
                        }
                        key={konselor.id}
                      >
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Status"></Descriptions.Item>
                          <Descriptions.Item label="Deskripsi Singkat">
                            {(() => {
                              let status;
                              switch (konselor.is_active) {
                                case true:
                                  status = <Badge status="processing" text="Aktif" />;
                                  break;
                                case false:
                                  status = <Badge status="error" text="Non Aktif" />;
                                  break;
                              }
                              return status;
                            })()}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    <Descriptions bordered column={1} className="mb-4">
                      <Descriptions.Item label="Tanggal">{selectedDate ? selectedDate : '-'}</Descriptions.Item>
                      <Descriptions.Item label="Jumlah Konselor">{selectedKonselors.length}</Descriptions.Item>
                    </Descriptions>
                    <Empty description="Tidak ada konselor yang dipilih untuk tanggal ini" />
                  </div>
                )}
              </Card>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default KonseliDashboard;
