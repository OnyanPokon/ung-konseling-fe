/* eslint-disable react/prop-types */
import CounselingTicket from '@/components/dashboard/ConselingTicket';
import { Role } from '@/constants';
import { Avatar, Badge, Descriptions, Drawer, Tabs } from 'antd';

const DetailDrawer = ({ drawer, setDrawer, user }) => {
  return (
    <Drawer placement="right" width={500} open={drawer.open} onClose={() => setDrawer({ open: false, data: null })} title="Detail Tiket">
      <Tabs>
        <Tabs.TabPane tab="Detail Tiket" key="tiket">
          <CounselingTicket
            type={drawer?.data?.tiket?.type}
            ticket_number={drawer?.data?.tiket?.ticket_number}
            desc={drawer?.data?.tiket?.desc}
            created_at={drawer?.data?.tiket?.created_at}
            status={drawer?.data?.tiket?.status}
            day_name={drawer?.data?.hari_layanan?.day_name}
            service_type={drawer.data?.tiket?.service_type}
          />
        </Tabs.TabPane>
        {(user.is(Role.KONSELOR) || user.is(Role.ADMIN)) && (
          <Tabs.TabPane tab="Detail Konseli" key="konseli">
            <Avatar size={64} className="mb-4" style={{ backgroundColor: '#a5a5a5' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Nama Konseli">{drawer?.data?.tiket?.konseli?.user.name}</Descriptions.Item>
              <Descriptions.Item label="Email Kosneli">{drawer?.data?.tiket?.konseli?.user.email}</Descriptions.Item>
              <Descriptions.Item label="NIM Konseli">{drawer?.data?.tiket?.konseli?.nim}</Descriptions.Item>
              <Descriptions.Item label="Nomor Telp">{drawer?.data?.tiket?.konseli?.phone}</Descriptions.Item>
              <Descriptions.Item label="Nomor Telp">{drawer?.data?.tiket?.konseli?.phone}</Descriptions.Item>
              <Descriptions.Item label="Domisili">{drawer?.data?.tiket?.konseli?.domicile}</Descriptions.Item>
              <Descriptions.Item label="Jurusan">{drawer?.data?.tiket?.konseli?.major}</Descriptions.Item>
              <Descriptions.Item label="Umur">{drawer?.data?.tiket?.konseli?.age}</Descriptions.Item>
              <Descriptions.Item label="Jenis Kelamin">{drawer?.data?.tiket?.konseli?.gender}</Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>
        )}
        {(user.is(Role.KONSELI) || user.is(Role.ADMIN)) && (
          <Tabs.TabPane tab="Detail Konselor" key="konseli">
            <Avatar size={64} className="mb-4" style={{ backgroundColor: '#a5a5a5' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Nama Konselor">{drawer?.data?.konselor?.user.name}</Descriptions.Item>
              <Descriptions.Item label="Email ">{drawer?.data?.konselor?.user.email}</Descriptions.Item>

              <Descriptions.Item label="Nomor Telp">
                {(() => {
                  let status;
                  switch (drawer?.data?.konselor?.is_active) {
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
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="Detail Sesi Konseling" key="sesi">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Jam Mulai">{drawer?.data?.start_time}</Descriptions.Item>
            <Descriptions.Item label="Jam Selesai">{drawer?.data?.end_time}</Descriptions.Item>
            <Descriptions.Item label="Tempat">{drawer?.data?.place}</Descriptions.Item>
            <Descriptions.Item label="Catatan Konselor">{drawer?.data?.note}</Descriptions.Item>
            <Descriptions.Item label="status">{drawer?.data?.status}</Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default DetailDrawer;
