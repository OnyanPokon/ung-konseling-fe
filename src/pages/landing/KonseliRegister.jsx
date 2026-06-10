import { Avatar, Button, Card, Form, Input, InputNumber, Select, Steps, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import React from 'react';
import { Reveal } from '@/components';
import { useNotification, useService } from '@/hooks';
import { AuthService } from '@/services';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import Modul from '@/constants/Modul';

const KonseliRegister = () => {
  const [current, setCurrent] = React.useState(0);
  const { success, error } = useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const regisKonseli = useService(AuthService.regisKonseli);

  const handleNext = async () => {
    try {
      await form.validateFields();

      if (current < 2) {
        setCurrent(current + 1);
      } else {
        handleSubmit();
      }
    } catch (err) {
      console.log('Validation Failed:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const allValues = form.getFieldsValue(true);

      const { message, isSuccess } = await regisKonseli.execute(allValues);

      if (isSuccess) {
        success('Berhasil', message);
        form.resetFields();
        navigate('/success_register_konseli');
      } else {
        error('Gagal', message);
        navigate('/failed_register_konseli');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <div className="mx-auto flex min-h-screen w-full max-w-screen-md flex-col items-center justify-center px-6 py-28">
        <div className="my-12 flex flex-col items-center gap-y-2">
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            <Reveal color="#fff">Daftar Konseli Baru</Reveal>
          </Typography.Title>
          <p className="max-w-md text-center">Informasi ini akan kami gunakan untuk membangun profil akun konseli Anda</p>
        </div>

        <Card className="w-full">
          <Steps current={current} items={[{ title: 'Data Diri' }, { title: 'Akun' }]} className="mb-8" />

          <Form form={form} layout="vertical" className="flex flex-col justify-between">
            {current === 0 && (
              <>
                <div className="mb-12 grid grid-cols-6 gap-4">
                  <Form.Item className="col-span-6 m-0" label="Nama Lengkap" name="name" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                    <Input placeholder="Masukan Nama Konseli" size="large" />
                  </Form.Item>
                  <Form.Item className="col-span-6 m-0" label="NIM/NIP" name="nim" rules={[{ required: true, message: 'Field NIM/NIP harus diisi' }]}>
                    <Input placeholder="Masukan NIM/NIP" size="large" />
                  </Form.Item>
                  <Form.Item className="col-span-6 m-0" label="Alamat Domisili Saat ini" name="domicile" rules={[{ required: true, message: 'Field Domisili harus diisi' }]}>
                    <TextArea placeholder="Masukan Alamat Domisili" size="large" />
                  </Form.Item>
                  <Form.Item className="col-span-3 m-0" label="Umur" name="age" rules={[{ required: true, message: 'Field Umur harus diisi' }]}>
                    <InputNumber className="w-full" min={19} max={100} placeholder="Masukan Umur" size="large" />
                  </Form.Item>
                  <Form.Item className="col-span-3 m-0" label="Jenis Kelamin" name="gender" rules={[{ required: true, message: 'Field Jenis Kelamin harus diisi' }]}>
                    <Select placeholder="Pilih Jenis Kelamin" size="large">
                      <Select.Option value="L">Laki-laki</Select.Option>
                      <Select.Option value="P">Perempuan</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <Card className="bg-primary-100/20 mb-4">
                  <div className="relative">
                    <p className="text-secondary-500">Pastikan seluruh informasi yang Anda berikan sudah benar dan sesuai, karena data ini akan digunakan untuk membuat akun konseli Anda.</p>
                    <Avatar className="absolute -top-11 right-0" style={{ backgroundColor: '#142b71', color: '#fff' }} size="large">
                      <WarningOutlined />
                    </Avatar>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrent(0)}>Kembali</Button>

                  <Button type="primary" loading={regisKonseli.isLoading} onClick={handleNext}>
                    Selanjutnya
                  </Button>
                </div>
              </>
            )}
            {current === 1 && (
              <>
                <div className="mb-12 flex flex-col gap-y-4">
                  <Form.Item
                    className="m-0"
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Field Email harus diisi' },

                      {
                        required: true,
                        message: `Email ${Modul.KONSELIS} harus diisi`
                      },
                      {
                        type: 'email',
                        message: 'Format email tidak valid'
                      }
                    ]}
                  >
                    <Input className="w-full" placeholder="Masukan Email" size="large" />
                  </Form.Item>
                  <Form.Item
                    className="m-0"
                    label="Nomor Telepon"
                    name="phone"
                    rules={[
                      { required: true, message: 'Nomor telepon wajib diisi' },
                      {
                        pattern: /^(08|628)[0-9]{8,11}$/,
                        message: 'Nomor telepon tidak valid (contoh: 081234567890)'
                      }
                    ]}
                  >
                    <Input className="w-full" placeholder="Masukan Nomor Telepon" size="large" />
                  </Form.Item>
                  <Form.Item
                    className="m-0"
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: 'Password harus diisi' },
                      { min: 8, message: 'Password minimal 8 karakter' }
                    ]}
                  >
                    <Input.Password size="large" placeholder="Masukkan password" />
                  </Form.Item>

                  <Form.Item
                    className="m-0"
                    label="Konfirmasi Password"
                    name="password_confirmation"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Konfirmasi password harus diisi' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Password tidak sama'));
                        }
                      })
                    ]}
                  >
                    <Input.Password size="large" placeholder="Ulangi password" />
                  </Form.Item>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrent(0)}>Kembali</Button>

                  <Button type="primary" loading={regisKonseli.isLoading} onClick={handleSubmit}>
                    Daftar Sekarang
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default KonseliRegister;
