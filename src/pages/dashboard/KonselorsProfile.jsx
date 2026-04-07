import { DataLoader } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { AuthService, KonselorsService } from '@/services';
import { EditOutlined, IdcardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, Menu, Select, Typography } from 'antd';
import React from 'react';

const ProfileSettings = () => {
  const { token, user, logout, onUnauthorized } = useAuth();
  const modal = useCrudModal();
  const [activeMenu, setActiveMenu] = React.useState('profil');
  const { success, error } = useNotification();
  const [formProfile] = Form.useForm();
  const [formBiodata] = Form.useForm();
  const { execute, ...getAllKonselor } = useAbortableService(KonselorsService.getByUserId);
  const updateKonselors = useService(KonselorsService.update, onUnauthorized);

  const konselor = React.useMemo(() => getAllKonselor.data ?? {}, [getAllKonselor.data]);

  const fetchKonselor = React.useCallback(() => {
    execute({
      token: token,
      id: user?.id
    });
  }, [execute, token, user?.id]);

  React.useEffect(() => {
    fetchKonselor();
  }, [fetchKonselor]);

  const updateUserProfil = useService(AuthService.updateProfile);
  const udpateUserPassword = useService(AuthService.changePassword);

  React.useEffect(() => {
    if (user) {
      formProfile.setFieldsValue({
        name: user.name,
        email: user.email,
        roleId: user.role?.id
      });
    }

    if (konselor) {
      formBiodata.setFieldsValue({
        nip: konselor.nip,
        phone: konselor.phone,
        gender: konselor.gender,
        is_active: konselor.is_active
      });
    }
  }, [formBiodata, formProfile, konselor, user]);

  const onSubmitUpdateUserProfile = async (values) => {
    const { message, isSuccess } = await updateUserProfil.execute(values, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchKonselor();
    } else {
      error('Gagal', message);
    }
  };

  const onSubmitChangePassword = async (values) => {
    const { message, isSuccess } = await udpateUserPassword.execute(values, token);
    if (isSuccess) {
      success('Berhasil', message);
      logout();
    } else {
      error('Gagal', message);
    }
  };

  const onSubmitUpdateKonselorBiodata = async (values) => {
    const { message, isSuccess } = await updateKonselors.execute(konselor.id, { ...values, _method: 'PUT' }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchKonselor();
    } else {
      error('Gagal', message);
    }
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {getAllKonselor.isLoading ? (
        <DataLoader type="profil" />
      ) : (
        <>
          <div className="col-span-12 flex w-full flex-col gap-y-4 lg:col-span-4">
            <Card className="w-full" cover={<img src="/image_asset/card_background.png" />}>
              <div className="relative px-4">
                <div className="group absolute -top-16">
                  <div className="relative">
                    <Avatar shape="square" size={90} src={konselor.profile_picture} style={{ backgroundColor: '#fff', padding: '12px', color: 'black' }} className="shadow-md" />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <Button
                        onClick={() => {
                          modal.edit({
                            title: `Edit Foto Profil`,
                            data: { ...konselor },
                            formFields: [
                              {
                                label: `Foto Profil ${Modul.KONSELOR}`,
                                name: 'profile_picture',
                                type: InputType.UPLOAD,
                                max: 1,
                                beforeUpload: () => {
                                  return false;
                                },
                                getFileList: (data) => {
                                  return [
                                    {
                                      url: data?.profile_picture,
                                      name: data?.name
                                    }
                                  ];
                                },
                                accept: ['.jpg', '.jpeg', '.png', '.webp'],
                                rules: [
                                  {
                                    required: true,
                                    message: `Foto Profil ${Modul.KONSELOR} harus diisi`
                                  }
                                ]
                              }
                            ],
                            onSubmit: async (values) => {
                              const { message, isSuccess } = await updateKonselors.execute(konselor.id, { ...values, _method: 'PUT' }, token, values.profile_picture.file);
                              if (isSuccess) {
                                success('Berhasil', message);
                                fetchKonselor({ token: token, id: user.id });
                              } else {
                                error('Gagal', message);
                              }
                              return isSuccess;
                            }
                          });
                        }}
                        icon={<EditOutlined />}
                        variant="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 px-4">
                <Typography.Title level={5}>{user?.name}</Typography.Title>
                <Typography.Text>{user?.role}</Typography.Text>
              </div>
            </Card>
            <Card className="w-full">
              <Menu onClick={(e) => setActiveMenu(e.key)} mode="vertical" defaultSelectedKeys={[activeMenu]}>
                <Menu.Item key="profil" icon={<UserOutlined />}>
                  Profil Pengguna
                </Menu.Item>
                <Menu.Item key="biodata" icon={<IdcardOutlined />}>
                  Biodata
                </Menu.Item>
                <Menu.Item key="password" icon={<LockOutlined />}>
                  Ganti Password
                </Menu.Item>
              </Menu>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {activeMenu === 'profil' ? (
              <Card className="w-full" title="Profile Konselor">
                <Form key="profil" layout="vertical" form={formProfile} onFinish={onSubmitUpdateUserProfile}>
                  <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                    <Input placeholder="Masukan Nama Konselor" size="large" />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Field Email harus diisi' }]}>
                    <Input placeholder="Masukan Email" size="large" />
                  </Form.Item>

                  <Form.Item>
                    <Button loading={updateUserProfil.isLoading} type="primary" htmlType="submit">
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : activeMenu === 'password' ? (
              <Card className="w-full" title="Ganti Kata Sandi">
                <Form layout="vertical" onFinish={onSubmitChangePassword}>
                  <Form.Item label="Kata Sandi Lama" name="current_password" rules={[{ required: true, message: 'Password lama harus diisi' }]}>
                    <Input.Password size="large" />
                  </Form.Item>
                  <Form.Item label="Kata Sandi Baru" name="new_password" rules={[{ required: true, message: 'Password baru harus diisi' }]}>
                    <Input.Password size="large" />
                  </Form.Item>
                  <Form.Item label="Ulangi Kata Sandi Baru" name="new_password_confirmation" rules={[{ required: true, message: 'Konfirmasi Password harus diisi' }]}>
                    <Input.Password size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button loading={udpateUserPassword.isLoading} type="primary" htmlType="submit">
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : activeMenu === 'biodata' ? (
              <Card className="w-full" title="Profile Konselor">
                <Form key="biodata" layout="vertical" form={formBiodata} onFinish={onSubmitUpdateKonselorBiodata}>
                  <Form.Item label="NIP" name="nip" rules={[{ required: true, message: 'Field NIP harus diisi' }]}>
                    <Input placeholder="Masukan NIP Konselor" size="large" />
                  </Form.Item>
                  <Form.Item label="Telepon" name="phone" rules={[{ required: true, message: 'Field Telepon harus diisi' }]}>
                    <Input placeholder="Masukan Telepon" size="large" />
                  </Form.Item>
                  <Form.Item label="Jenis Kelamin" name="gender" rules={[{ required: true, message: 'Field Jenis Kelamin harus diisi' }]}>
                    <Select placeholder="Pilih Jenis Kelamin" size="large">
                      <Select.Option value="L">Laki-laki</Select.Option>
                      <Select.Option value="P">Perempuan</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Status Aktif" name="is_active" rules={[{ required: true, message: 'Field Status Aktif harus diisi' }]}>
                    <Select placeholder="Pilih Status Aktif" size="large">
                      <Select.Option value={true}>Aktif</Select.Option>
                      <Select.Option value={false}>Tidak Aktif</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button loading={updateKonselors.isLoading} type="primary" htmlType="submit">
                      Simpan
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : (
              <div>null</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
