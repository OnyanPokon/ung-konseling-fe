import { useAuth, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { HariLayanansService, KonselisService, KonselorsService, TiketsService } from '@/services';
import { Button, Card, Descriptions, Form, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

const RegistrationForm = () => {
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const [form] = Form.useForm();
  const [selectedKonselor, setSelectedKonselor] = React.useState(null);

  const { execute: fetchKonseli, ...getAllKonseli } = useAbortableService(KonselisService.getByUserId, { onUnauthorized });
  const { execute: fetchKonselors, ...getAllKonselors } = useAbortableService(KonselorsService.getAll, { onUnauthorized });
  const { execute: fetchHariLayanan, ...getAllHariLayanan } = useAbortableService(HariLayanansService.getByKonselorId, { onUnauthorized });

  const storeTickets = useService(TiketsService.store, { onUnauthorized });

  React.useEffect(() => {
    fetchKonselors({
      token: token,
      page: 1,
      per_page: 9999
    });

    fetchKonseli({
      token: token,
      id: user.id
    });
  }, [fetchKonseli, fetchKonselors, token, user.id]);

  const konselors = getAllKonselors.data ?? [];
  const hariLayanan = getAllHariLayanan.data ?? [];
  const konseli = getAllKonseli.data ?? [];
  const handleChangeKonselor = (value) => {
    setSelectedKonselor(value);

    form.setFieldsValue({ jadwal_konselor: undefined });

    fetchHariLayanan({
      token: token,
      id: value
    });
  };

  const onCreate = async (values) => {
    const { message, isSuccess } = await storeTickets.execute(
      {
        ...values,
        konseli_id: konseli.id,
        status: 'pending',
        urgent: 'cukup_mendesak'
      },
      token
    );
    if (isSuccess) {
      success('Berhasil', message);
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  return (
    <div>
      <Card className="w-full" title="Mendaftar Layanan Konseling">
        <Form form={form} onFinish={onCreate}>
          <Descriptions column={4} layout="vertical" size="small" className="mb-4">
            <Descriptions.Item label="Jenis Masalah">
              <Form.Item className="m-0 w-full" name="type" rules={[{ required: true, message: 'Jenis Masalah harus diisi' }]}>
                <Select placeholder="Jenis Masalah" size="large" className="w-full">
                  <Select.Option value="pribadi">Pribadi</Select.Option>
                  <Select.Option value="sosial">Sosial</Select.Option>
                  <Select.Option value="akademik">Akademik</Select.Option>
                  <Select.Option value="karir">Karir</Select.Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Layanan">
              <Form.Item className="m-0 w-full" name="service_type" rules={[{ required: true, message: 'Jenis Layanan harus diisi' }]}>
                <Select placeholder="Jenis Layanan" size="large" className="w-full">
                  <Select.Option value="bimbingan">Bimbingan</Select.Option>
                  <Select.Option value="konseling">Konseling</Select.Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Konselor">
              <Form.Item className="m-0 w-full" name="konselor_id" rules={[{ required: true, message: 'Konselor harus diisi' }]}>
                <Select placeholder="Konselor" size="large" className="w-full" onChange={handleChangeKonselor}>
                  {konselors.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.user.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Jadwal Konselor">
              <Form.Item className="m-0 w-full" name="hari_layanan_id" rules={[{ required: true, message: 'Hari layanan harus diisi' }]}>
                <Select placeholder="Jadwal hari layanan konselor" size="large" className="w-full" disabled={!selectedKonselor} loading={getAllHariLayanan.isLoading}>
                  {hariLayanan.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.day_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi masalah">
              <Form.Item className="m-0 w-full" name="desc" rules={[{ required: true, message: 'Deskripsi masalah harus diisi' }]}>
                <TextArea placeholder="Masukan deskripsi masalah" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <Form.Item className="w-fit">
            <Button loading={storeTickets.isLoading} block type="primary" htmlType="submit" className="w-fit">
              Ajukan Pendaftaran
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegistrationForm;
