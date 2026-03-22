import { DashboardFooter, DashboardSider } from '@/components';
import { Role } from '@/constants';
import { useAuth, useNotificationPusher } from '@/hooks';
import { BellOutlined, InboxOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Popover, Skeleton, Space, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { unreadCount, notifications, readNotification } = useNotificationPusher();

  useEffect(() => {
    if (token) return;
    navigate(`/auth/login?redirect=${pathname}`);
  }, [navigate, token, pathname]);

  // const breadcrumbItems = generateBreadcrumb(dashboardLink, pathname);

  const items = useMemo(
    () => [
      {
        key: '1',
        label: (
          <button
            onClick={() => {
              if (!user) return;
              if (user?.role === Role.KONSELI) {
                navigate('/profile_konseli');
              } else if (user?.role === Role.KONSELOR) {
                navigate('/profile_konselor');
              }
            }}
            className="flex min-w-32 items-center gap-x-2"
          >
            <UserOutlined />
            Pengaturan Profil
          </button>
        )
      },
      {
        key: '2',
        label: (
          <button onClick={logout} className="text-color-danger-500 flex min-w-32 items-center gap-x-2">
            <LogoutOutlined />
            Logout
          </button>
        )
      }
    ],
    [logout, navigate, user]
  );

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Layout className="min-h-screen font-sans">
      <DashboardSider collapsed={collapsed} onCloseMenu={() => setCollapsed(true)} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer
          }}
        >
          <div className="flex h-full w-full items-center justify-between px-4">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} color="default"></Button>
            <div className="flex items-center gap-x-2">
              {!user ? (
                <>
                  <Skeleton.Button active className="leading-4" size="small" />
                  <Skeleton.Avatar active className="leading-4" />
                </>
              ) : (
                <>
                  <span>Hai, {user.name}</span>
                  <Popover
                    content={
                      <>
                        <div className="flex max-h-96 w-full max-w-lg flex-col gap-y-2 overflow-auto">
                          {notifications.map((notif) => (
                            <div key={notif.id} className={`flex items-center gap-x-2 rounded-lg p-3 ${notif.read_at === null ? 'bg-gray-100' : 'bg-white'}`}>
                              <Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold">
                                <InboxOutlined color="#1675ff" />
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold">{notif?.data?.title}</span>
                                <span className="text-xs">{notif?.data?.message}</span>
                                <button onClick={() => readNotification(notif.id)} size="small" className="mt-1 w-fit text-xs text-blue-500 hover:text-blue-400" type="link">
                                  Tandai sudah dibaca
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    }
                  >
                    <Badge count={unreadCount} size="small">
                      <BellOutlined style={{ fontSize: 20 }} />
                    </Badge>
                  </Popover>

                  <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold">U</Avatar>
                      </Space>
                    </a>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px 0' }}>
          {/* <Breadcrumb
                        style={{ margin: '16px 0' }}
                        items={breadcrumbItems.map((item, index) => ({
                            title: index < breadcrumbItems.length - 1 ? <Link to={item.path}>{item.title}</Link> : item.title
                        }))}
                    /> */}

          <Outlet />
        </Content>

        <DashboardFooter />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
