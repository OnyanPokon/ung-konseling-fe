import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { KonselisService, KonselorsService, SesiKonselingsService, TiketsService } from '@/services';
import { Tikets as TicketModel } from '@/models';
import React from 'react';
import { Avatar, Button, Card, Descriptions, Drawer, Popconfirm, Skeleton, Space, Tabs, Tag, Tooltip } from 'antd';
import { Action, Role } from '@/constants';
import { CheckOutlined, CloseOutlined, InfoOutlined } from '@ant-design/icons';
import { formFields, timeFormFields } from '../SesiKonselings/FormFields';
import dayjs from 'dayjs';
import { Delete } from '@/components/dashboard/button';

const { UPDATE } = Action;
const modulName = Modul.TICKETS;

const Tickets = () => {
  const { onUnauthorized, token, user } = useAuth();
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute: fetchKonselor, ...getAllKonselor } = useAbortableService(KonselorsService.getByUserId, { onUnauthorized });
  const { execute: fetchKonseli, ...getAllKonseli } = useAbortableService(KonselisService.getByUserId, { onUnauthorized });
  const { execute, ...getAllTickets } = useAbortableService(TiketsService.getAll, { onUnauthorized });
  const storeSesiKonseling = useService(SesiKonselingsService.store, onUnauthorized);
  const updateTicket = useService(TiketsService.update, onUnauthorized);
  const deleteTicket = useService(TiketsService.delete, onUnauthorized);
  const [filterValues, setFilterValues] = React.useState({ search: '' });
  const [drawer, setDrawer] = React.useState({ open: false, data: null });

  const pagination = usePagination({ totalData: getAllTickets.totalData });

  const konselor = getAllKonselor.data ?? [];
  const konseli = getAllKonseli.data ?? [];
  const tickets = getAllTickets.data ?? [];

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

  const fetchTickets = React.useCallback(() => {
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
    fetchTickets();
  }, [fetchTickets]);

  const column = [
    {
      title: 'Nomor Tiket',
      dataIndex: 'ticket_number',
      sorter: (a, b) => a.ticket_number.length - b.ticket_number.length,
      searchable: true
    },
    {
      title: 'Hari Layanan',
      dataIndex: ['hari_layanan', 'day_name'],
      sorter: (a, b) => a.hari_layhanan.day_name.length - b.hari_layhanan.day_name.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true,
      render: (record) =>
        (() => {
          let status;
          switch (record) {
            case 'pending':
              status = <Tag color="yellow">Pending</Tag>;
              break;
            case 'approved':
              status = <Tag color="blue">Disetujui</Tag>;
              break;
            case 'rejected':
              status = <Tag color="red">Ditolak</Tag>;
              break;
          }
          return status;
        })()
    },
    {
      title: 'Tanggal di Ajukan',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      searchable: true
    }
  ];

  if (user?.is(Role.KONSELOR)) {
    column.push({
      title: 'Nama Konseli',
      dataIndex: ['konseli', 'user', 'name'],
      sorter: (a, b) => (a.konseli?.user?.name || '').localeCompare(b.konseli?.user?.name || ''),
      searchable: true,
      render: (_, record) => record.konseli?.user?.name || '-'
    });
  }

  if (user?.is(Role.KONSELI)) {
    column.push({
      title: 'Nama Konselor',
      dataIndex: ['konselor', 'user', 'name'],
      sorter: (a, b) => (a.konselor?.user?.name || '').localeCompare(b.konselor?.user?.name || ''),
      searchable: true,
      render: (_, record) => record.konselor?.user?.name || '-'
    });
  }

  if (user && user.eitherCan([UPDATE, TicketModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            disabled={record.status === 'approved'}
            variant="outlined"
            shape="circle"
            icon={<CheckOutlined />}
            color="primary"
            onClick={() => {
              modal.create({
                title: `Tambah ${modulName}`,
                formFields: [...timeFormFields(), ...formFields()],
                onSubmit: async (values) => {
                  const sesiResponse = await storeSesiKonseling.execute(
                    {
                      ...values,
                      start_time: dayjs(values.start_time).format('HH:mm'),
                      end_time: dayjs(values.end_time).format('HH:mm'),
                      tiket_id: record.id,
                      konselor_id: record.konselor.id,
                      hari_layanan_id: record.hari_layanan.id,
                      status: 'dijadwalkan'
                    },
                    token
                  );

                  if (!sesiResponse.isSuccess) {
                    error('Gagal', sesiResponse.message);
                    return false;
                  }

                  const updateResponse = await updateTicket.execute(record.id, { ...record, status: 'approved' }, token);

                  if (!updateResponse.isSuccess) {
                    error('Gagal update tiket', updateResponse.message);
                    return false;
                  }

                  success('Berhasil', 'Sesi konseling berhasil dibuat & tiket di-approve');

                  fetchTickets();

                  return true;
                }
              });
            }}
          />
          <Popconfirm
            disabled={record.status === 'rejected' || record.status === 'approved'}
            title="Tolak Tiket"
            description="Apakah anda yakin menolak tiket ini?"
            onConfirm={async () => {
              const { message, isSuccess } = await updateTicket.execute(record.id, { ...record, status: 'rejected' }, token);
              if (isSuccess) {
                success('Berhasil', message);
                fetchTickets({ token: token, page: pagination.page, per_page: pagination.perPage, konselor_id: konselor.id });
              } else {
                error('Gagal', message);
              }
              return isSuccess;
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={record.status === 'rejected' || record.status === 'approved'} variant="outlined" shape="circle" icon={<CloseOutlined />} color="danger" />
          </Popconfirm>
          <Tooltip title="Detail Tiket">
            <Button
              variant="outlined"
              color="green"
              onClick={() => {
                setDrawer({ open: true, data: record });
              }}
              size="middle"
              icon={<InfoOutlined />}
              shape="circle"
            />
          </Tooltip>
        </Space>
      )
    });
  }

  if (user && user.is(Role.ADMIN)) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Delete
            title={`Delete ${modulName}`}
            model={TicketModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.KONSELOR}`,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteTicket.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTickets();
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

  return (
    <Card title={<DataTableHeader model={TicketModel} modul={modulName} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllTickets.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={tickets} columns={column} loading={getAllTickets.isLoading} map={(konselis) => ({ key: konselis.id, ...konselis })} pagination={pagination} />
        </div>
      </Skeleton>
      <Drawer placement="right" width={500} open={drawer.open} onClose={() => setDrawer({ open: false, data: null })} title="Detail Tiket">
        <Tabs>
          <Tabs.TabPane tab="Detail Tiket" key="tiket">
            <Descriptions column={1} bordered size="smal">
              <Descriptions.Item label="Hari Layanan">{drawer?.data?.hari_layanan.day_name}</Descriptions.Item>
              <Descriptions.Item label="Deskripsi Keluhan">{drawer?.data?.desc}</Descriptions.Item>
              <Descriptions.Item label="Status Tiket">{drawer?.data?.status}</Descriptions.Item>
              <Descriptions.Item label="Tipe Layanan">{drawer?.data?.type}</Descriptions.Item>
              <Descriptions.Item label="Mendesak">{drawer?.data?.urgent}</Descriptions.Item>
              <Descriptions.Item label="Tanggal Pengajuan Tiket">{drawer?.data?.created_at}</Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Detail Konseli" key="konseli">
            <Avatar size={64} className="mb-4" style={{ backgroundColor: '#a5a5a5' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <Descriptions column={1} bordered size="smal">
              <Descriptions.Item label="Nama Konseli">{drawer?.data?.konseli?.user.name}</Descriptions.Item>
              <Descriptions.Item label="Email Kosneli">{drawer?.data?.konseli?.user.email}</Descriptions.Item>
              <Descriptions.Item label="NIM Konseli">{drawer?.data?.konseli?.nim}</Descriptions.Item>
              <Descriptions.Item label="Nomor Telp">{drawer?.data?.konseli?.phone}</Descriptions.Item>
              <Descriptions.Item label="Nomor Telp">{drawer?.data?.konseli?.phone}</Descriptions.Item>
              <Descriptions.Item label="Domisili">{drawer?.data?.konseli?.domicile}</Descriptions.Item>
              <Descriptions.Item label="Jurusan">{drawer?.data?.konseli?.major}</Descriptions.Item>
              <Descriptions.Item label="Umur">{drawer?.data?.konseli?.age}</Descriptions.Item>
              <Descriptions.Item label="Jenis Kelamin">{drawer?.data?.konseli?.gender}</Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    </Card>
  );
};

export default Tickets;
