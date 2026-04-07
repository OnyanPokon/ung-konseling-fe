import { DataLoader } from '@/components';
import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { AuthService, KonselisService } from '@/services';
import { EditOutlined, IdcardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, InputNumber, Menu, Select, Typography } from 'antd';
import React from 'react';

const ProfileSettings = () => {
  const { token, user, logout, onUnauthorized } = useAuth();
  const modal = useCrudModal();
  const [activeMenu, setActiveMenu] = React.useState('profil');
  const { success, error } = useNotification();
  const [formProfile] = Form.useForm();
  const [formBiodata] = Form.useForm();
  const { execute, ...getAllKonseli } = useAbortableService(KonselisService.getByUserId);
  const updateKonseli = useService(KonselisService.update, onUnauthorized);

  const konseli = React.useMemo(() => getAllKonseli.data ?? {}, [getAllKonseli.data]);

  const fetchKonseli = React.useCallback(() => {
    execute({
      token: token,
      id: user?.id
    });
  }, [execute, token, user?.id]);

  React.useEffect(() => {
    fetchKonseli();
  }, [fetchKonseli]);

  const updateUserProfil = useService(AuthService.updateProfile);
  const udpateUserPassword = useService(AuthService.changePassword);

  React.useEffect(() => {
    if (konseli) {
      formBiodata.setFieldsValue({
        nim: konseli.nim,
        phone: konseli.phone,
        gender: konseli.gender,
        major: konseli.major,
        age: konseli.age,
        domicile: konseli.domicile
      });
      formProfile.setFieldsValue({
        name: konseli.user?.name,
        email: konseli.user?.email
      });
    }
  }, [formBiodata, formProfile, konseli, user]);

  const onSubmitUpdateUserProfile = async (values) => {
    const { message, isSuccess } = await updateUserProfil.execute(values, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchKonseli();
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
    const { message, isSuccess } = await updateKonseli.execute(konseli.id, { ...values, _method: 'PUT' }, token);
    if (isSuccess) {
      success('Berhasil', message);
      fetchKonseli();
    } else {
      error('Gagal', message);
    }
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {getAllKonseli.isLoading ? (
        <DataLoader type="profil" />
      ) : (
        <>
          <div className="col-span-12 flex w-full flex-col gap-y-4 lg:col-span-4">
            <Card className="w-full" cover={<img src="/image_asset/card_background.png" />}>
              <div className="relative px-4">
                <div className="group absolute -top-16">
                  <div className="relative">
                    <Avatar shape="square" size={90} icon={<UserOutlined />} style={{ backgroundColor: '#fff', padding: '12px', color: 'black' }} className="shadow-md" />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <Button
                        onClick={() => {
                          modal.edit({
                            title: `Edit Foto Profil`,
                            data: { ...konseli },
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
                              const { message, isSuccess } = await updateKonseli.execute(konseli.id, { ...values, _method: 'PUT' }, token, values.profile_picture.file);
                              if (isSuccess) {
                                success('Berhasil', message);
                                fetchKonseli({ token: token, id: user.id });
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
                  <Form.Item label="NIM" name="nim" rules={[{ required: true, message: 'Field NIM harus diisi' }]}>
                    <Input placeholder="Masukan NIM Konselor" size="large" />
                  </Form.Item>
                  <Form.Item
                    label="Telepon"
                    name="phone"
                    rules={[
                      { required: true, message: 'Field Telepon harus diisi' },
                      { required: true, message: 'Nomor telepon wajib diisi' },
                      {
                        pattern: /^(08|628)[0-9]{8,11}$/,
                        message: 'Nomor telepon tidak valid (contoh: 081234567890)'
                      }
                    ]}
                  >
                    <Input placeholder="Masukan Nomor Telepon Konselor" size="large" />
                  </Form.Item>
                  <Form.Item label="Jenis Kelamin" name="gender" rules={[{ required: true, message: 'Field Jenis Kelamin harus diisi' }]}>
                    <Select placeholder="Pilih Jenis Kelamin" size="large">
                      <Select.Option value="L">Laki-laki</Select.Option>
                      <Select.Option value="P">Perempuan</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Jurusan" name="major" rules={[{ required: true, message: 'Field Jurusan harus diisi' }]}>
                    <Input placeholder="Masukan Jurusan" size="large" />
                  </Form.Item>
                  <Form.Item label="Umur" name="age" rules={[{ required: true, message: 'Field Umur harus diisi' }]}>
                    <InputNumber className="w-full" placeholder="Masukan Umur" size="large" min={19} max={20} />
                  </Form.Item>
                  <Form.Item
                    label="Domisili"
                    name="domicile"
                    rules={[
                      { required: true, message: `Domisili harus diisi` },
                      { min: 3, message: 'Domisili minimal 3 karakter' },
                      { max: 100, message: 'Domisili maksimal 100 karakter' },
                      {
                        validator: (_, value) => {
                          if (!value || value.trim() !== '') {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Domisili tidak boleh kosong'));
                        }
                      }
                    ]}
                  >
                    <Input placeholder="Masukan Domisili" size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button loading={updateKonseli.isLoading} type="primary" htmlType="submit">
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
