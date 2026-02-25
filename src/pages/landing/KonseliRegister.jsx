import { Avatar, Button, Card, Form, Input, Steps, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import React from 'react';
import { Reveal } from '@/components';
import { FormItem } from '@/components/dashboard/input';
import { additionalDataFormFields, formFields } from '../dashboard/Konselis/FormFields';
import { useNotification, useService } from '@/hooks';
import { AuthService } from '@/services';
import { useNavigate } from 'react-router-dom';

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
          <Steps current={current} items={[{ title: 'Data Diri' }, { title: 'Data Tambahan' }, { title: 'Password' }]} className="mb-8" />

          <Form form={form} layout="vertical" className="flex flex-col justify-between">
            {current === 0 && (
              <>
                <div className="mb-12 flex flex-col gap-y-4">
                  <FormItem formFields={formFields()} />
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
                  <FormItem formFields={additionalDataFormFields()} />
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrent(0)}>Kembali</Button>

                  <Button type="primary" loading={regisKonseli.isLoading} onClick={handleNext}>
                    Selanjutnya
                  </Button>
                </div>
              </>
            )}
            {current === 2 && (
              <>
                <div className="mb-12 flex flex-col gap-y-4">
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
