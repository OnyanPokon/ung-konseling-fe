import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Descriptions, Pagination, Popconfirm, Skeleton, Space, Tag } from 'antd';
import { Konselors as KonselorModel } from '@/models';
import React from 'react';
import { DataTableHeader } from '@/components';
import { KonselisService, KonselorsService, SesiKonselingsService } from '@/services';
import { Action, Role } from '@/constants';
import { SesiKonselings as SesiKonselingModel } from '@/models';
import { CalendarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { timeFormFields } from './FormFields';
import { Delete } from '@/components/dashboard/button';
import DetailDrawer from './DetailDrawer';

const { DELETE, UPDATE, READ } = Action;

const SesiKonselings = () => {
  const { token, onUnauthorized, user } = useAuth();
  const { success, error } = useNotification();
  const modal = useCrudModal();
  const { execute: fetchKonselor, ...getAllKonselor } = useAbortableService(KonselorsService.getByUserId, { onUnauthorized });
  const { execute: fetchKonseli, ...getAllKonseli } = useAbortableService(KonselisService.getByUserId, { onUnauthorized });
  const { execute, ...getAllSesiKonselings } = useAbortableService(SesiKonselingsService.getAll, { onUnauthorized });

  const updateSesiKonsling = useService(SesiKonselingsService.update);
  const deleteSesiKonseling = useService(SesiKonselingsService.delete);

  const pagination = usePagination({ totalData: getAllSesiKonselings.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const [drawer, setDrawer] = React.useState({ open: false, data: null });

  const sesiKonselings = getAllSesiKonselings.data ?? [];
  const konselor = getAllKonselor.data ?? [];
  const konseli = getAllKonseli.data ?? [];

  React.useEffect(() => {
    fetchKonselor({
      token: token,
      id: user.id
    });

    fetchKonseli({
      token: token,
      id: user.id
    });
  }, [fetchKonseli, fetchKonselor, token, user.id]);

  const fetchSesiKonseling = React.useCallback(() => {
    if (!user?.role) return;

    if (user.role === Role.KONSELOR && !konselor?.id) return;

    if (user.role === Role.KONSELI && !konseli?.id) return;

    execute({
      token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search,

      ...(user.role === Role.KONSELOR ? { konselor_id: konselor.id } : {}),

      ...(user.role === Role.KONSELI ? { konseli_id: konseli.id } : {})
    });
  }, [execute, filterValues.search, konseli.id, konselor.id, pagination.page, pagination.perPage, token, user.role]);

  React.useEffect(() => {
    fetchSesiKonseling();
  }, [fetchSesiKonseling]);

  return (
    <Card title={<DataTableHeader model={KonselorModel} modul={Modul.SESI_KONSELINGS} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllSesiKonselings.isLoading}>
        <div className="flex w-full max-w-full flex-col gap-y-4 overflow-x-auto p-2">
          {sesiKonselings.map((item) => (
            <Card onClick={() => setDrawer({ open: true, data: item })} hoverable title={<span className="text-sm">{item.tiket.ticket_number}</span>} className="w-full bg-gray-50" key={item.id}>
              <Descriptions className="w-full" size="small" bordered column={3}>
                <Descriptions.Item label="No Tiket">{item.tiket.ticket_number}</Descriptions.Item>
                {user?.is(Role.KONSELOR) && <Descriptions.Item label="Konseli">{item.tiket.konseli.user.name}</Descriptions.Item>}
                {user?.is(Role.KONSELI) && <Descriptions.Item label="Konseli">{item.konselor.user.name}</Descriptions.Item>}
                <Descriptions.Item label="Hari">{item.hari_layanan.day_name}</Descriptions.Item>
                <Descriptions.Item label="Deskripsi">{item.tiket.desc}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  {(() => {
                    let status;
                    switch (item.status) {
                      case 'dijadwalkan':
                        return <Tag color="green">Dijadwalkan</Tag>;

                      case 'selesai':
                        return <Tag color="blue">Selesai</Tag>;

                      case 'dijadwalkan_ulang':
                        return <Tag color="gold">Dijadwalkan Ulang</Tag>;

                      case 'dibatalkan':
                        return <Tag color="red">Dibatalkan</Tag>;
                    }
                    return status;
                  })()}
                </Descriptions.Item>
                {user && (user.is(Role.ADMIN) || user.is(Role.KONSELOR)) && (
                  <Descriptions.Item label="Aksi" span={3}>
                    <Space size="small">
                      <Popconfirm
                        title="Tandai Selesai?"
                        disabled={item.status === 'dibatalkan' || item.status === 'selesai'}
                        description="Apakah anda yakin ingin menandai sesi konseling ini sebagai selesai?"
                        onConfirm={async () => {
                          const { message, isSuccess } = await updateSesiKonsling.execute(item.id, { status: 'selesai' }, token);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchSesiKonseling();
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button disabled={item.status === 'dibatalkan' || item.status === 'selesai'} variant="outlined" shape="circle" icon={<CheckOutlined />} color="blue" />
                      </Popconfirm>
                      <Popconfirm
                        title="Batalkan?"
                        disabled={item.status === 'selesai' || item.status === 'dibatalkan'}
                        description="Apakah anda yakin membatalkan sesi konsling?"
                        onConfirm={async () => {
                          const { message, isSuccess } = await updateSesiKonsling.execute(item.id, { status: 'dibatalkan' }, token);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchSesiKonseling();
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button disabled={item.status === 'selesai' || item.status === 'dibatalkan'} variant="outlined" shape="circle" icon={<CloseOutlined />} color="danger" />
                      </Popconfirm>
                      <Popconfirm
                        title="Jadwalkan ulang?"
                        disabled={item.status === 'dibatalkan'}
                        description="Apakah anda yakin ingin menjadwalkan ulang sesi konseling?"
                        onConfirm={() => {
                          modal.edit({
                            title: `Jadwalkan ulang`,
                            data: {
                              start_time: dayjs(item.start_time, 'HH:mm:ss'),
                              end_time: dayjs(item.end_time, 'HH:mm:ss')
                            },
                            formFields: timeFormFields(),
                            onSubmit: async (values) => {
                              const { message, isSuccess } = await updateSesiKonsling.execute(
                                item.id,
                                {
                                  ...item,
                                  start_time: dayjs(values.start_time).format('HH:mm'),
                                  end_time: dayjs(values.end_time).format('HH:mm'),
                                  status: 'dijadwalkan_ulang'
                                },
                                token
                              );
                              if (isSuccess) {
                                success('Berhasil', message);
                                fetchSesiKonseling();
                              } else {
                                error('Gagal', message);
                              }
                              return isSuccess;
                            }
                          });
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button disabled={item.status === 'dibatalkan'} variant="outlined" shape="circle" icon={<CalendarOutlined />} color="yellow" />
                      </Popconfirm>
                    </Space>
                  </Descriptions.Item>
                )}
                {user && user.eitherCan([UPDATE, SesiKonselingModel], [DELETE, SesiKonselingModel], [READ, SesiKonselingModel]) && (
                  <Descriptions.Item label="Aksi" span={3}>
                    <Space size="small">
                      <Delete
                        title={`Delete Sesi Konseling`}
                        model={SesiKonselingModel}
                        onClick={() => {
                          modal.delete.default({
                            title: `Delete ${Modul.KONSELOR}`,
                            onSubmit: async () => {
                              const { isSuccess, message } = await deleteSesiKonseling.execute(item.id, token);
                              if (isSuccess) {
                                success('Berhasil', message);
                                fetchSesiKonseling();
                              } else {
                                error('Gagal', message);
                              }
                              return isSuccess;
                            }
                          });
                        }}
                      />
                    </Space>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          ))}
        </div>
      </Skeleton>
      <Pagination className="mt-4" pageSize={pagination.perPage} current={pagination.page} onChange={pagination.onChange} />
      <DetailDrawer drawer={drawer} setDrawer={setDrawer} user={user} />
    </Card>
  );
};

export default SesiKonselings;
