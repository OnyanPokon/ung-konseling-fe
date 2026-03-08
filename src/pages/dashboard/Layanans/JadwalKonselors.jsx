import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Avatar, Badge, Button, Card, Descriptions, Skeleton } from 'antd';
import { JadwalKonselors as JadwalKonselorModel } from '@/models';
import React from 'react';
import { HariLayanansService, JadwalKonselorsService, KonselorsService } from '@/services';
import { JadwalKonselorFormFields } from './FormFields';
import { DataTableHeader } from '@/components';
import { DeleteOutlined } from '@ant-design/icons';

const modulName = Modul.JADWAL_KONSELOR;

const JadwalKonselors = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, onUnauthorized } = useAuth();
  const { execute, ...getAllJadwalKonselors } = useAbortableService(JadwalKonselorsService.getAll, { onUnauthorized });
  const { execute: fetchHariLayanans, ...getAllHariLayanans } = useAbortableService(HariLayanansService.getAll, { onUnauthorized });
  const { execute: fetchKonselors, ...getAllKonselors } = useAbortableService(KonselorsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllJadwalKonselors.totalData });
  const [activeTab, setActiveTab] = React.useState(null);

  const fetchJadwalKonselors = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchJadwalKonselors();
    fetchHariLayanans({ token: token });
    fetchKonselors({ token: token });
  }, [fetchHariLayanans, fetchJadwalKonselors, fetchKonselors, token]);

  const jadwalKonselors = React.useMemo(() => getAllJadwalKonselors.data ?? [], [getAllJadwalKonselors.data]);
  const hariLayanans = getAllHariLayanans.data ?? [];
  const konselors = getAllKonselors.data ?? [];

  const storeJadwalKonselors = useService(JadwalKonselorsService.store, onUnauthorized);
  const deleteJadwalKonselors = useService(JadwalKonselorsService.delete, onUnauthorized);

  const groupedData = React.useMemo(() => {
    return jadwalKonselors.reduce((acc, item) => {
      const workDayId = item.work_day?.id;
      if (!workDayId) return acc;

      if (!acc[workDayId]) {
        acc[workDayId] = [];
      }

      acc[workDayId].push({
        jadwal_konselor_id: item.id,
        konselor_id: item.konselor.id,
        is_active: item.konselor.is_active,
        user: item.konselor.user
      });

      return acc;
    }, {});
  }, [jadwalKonselors]);

  React.useEffect(() => {
    if (groupedData.length > 0 && !activeTab) {
      setActiveTab(String(groupedData[0].work_day.id));
    }
  }, [activeTab, groupedData]);

  const colorVariants = ['bg-yellow-50 text-yellow-500', 'bg-green-50 text-green-500', 'bg-blue-50 text-blue-500', 'bg-purple-50 text-purple-500', 'bg-pink-50 text-pink-500'];

  const onCreate = () => {
    modal.create({
      title: `Tambah ${modulName}`,
      formFields: JadwalKonselorFormFields({ options: { hariLayanans, konselors } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeJadwalKonselors.execute({ ...values, password: 'password' }, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchJadwalKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={JadwalKonselorModel} modul={Modul.JADWAL_KONSELOR} onStore={onCreate} />}>
      <Skeleton loading={getAllJadwalKonselors.isLoading}>
        <div className="grid w-full grid-cols-12 gap-4">
          <div
            className="col-span-12 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${hariLayanans.length}, minmax(0, 1fr))`
            }}
          >
            {hariLayanans.map((day, index) => {
              const colorClass = colorVariants[index % colorVariants.length];
              const konselorsPerDay = groupedData[day.id] || [];

              return (
                <div key={day.id} className="flex flex-col gap-y-4">
                  <div className={`rounded-md p-2 px-4 font-bold capitalize ${colorClass}`}>{day.day_name}</div>

                  <div className="flex flex-col gap-y-2">
                    {konselorsPerDay.length === 0 ? (
                      <div className="text-xs italic text-gray-400">Belum ada jadwal</div>
                    ) : (
                      konselorsPerDay.map((konselor) => (
                        <Card
                          key={konselor.id}
                          title={
                            <div className="inline-flex w-full items-center justify-between">
                              <div className="my-2 inline-flex items-center gap-x-2">
                                <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                <div className="flex flex-col">
                                  <small>{konselor.user.name}</small>
                                  <span className="text-xs font-normal">{konselor.user.email}</span>
                                </div>
                              </div>
                              <Button
                                variant="outlined"
                                color="danger"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  modal.delete.default({
                                    title: `Delete ${Modul.JADWAL_KONSELOR}`,
                                    onSubmit: async () => {
                                      const { isSuccess, message } = await deleteJadwalKonselors.execute(konselor.jadwal_konselor_id, token);
                                      if (isSuccess) {
                                        success('Berhasil', message);
                                        fetchJadwalKonselors({ token: token, page: pagination.page, per_page: pagination.per_page });
                                      } else {
                                        error('Gagal', message);
                                      }
                                      return isSuccess;
                                    }
                                  });
                                }}
                              />
                            </div>
                          }
                        >
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Status">{konselor.is_active ? <Badge status="processing" text="Aktif" /> : <Badge status="error" text="Non Aktif" />}</Descriptions.Item>
                          </Descriptions>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default JadwalKonselors;
