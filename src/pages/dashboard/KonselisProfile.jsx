import { Button, Card, Descriptions, Form, Input } from 'antd';

const KonselisProfile = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card title="Biodata Konselis" className="col-span-6">
        <Form>
          <Descriptions column={2} layout="vertical" size="small" className="mb-4">
            <Descriptions.Item label="Nama Lengkap">
              <Form.Item className="m-0 w-full" name="name" rules={[{ required: true, message: 'Nama lengkap harus diisi' }]}>
                <Input placeholder="Nama Lengkap" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Form.Item className="m-0 w-full" name="email" rules={[{ required: true, message: 'Email harus diisi' }]}>
                <Input placeholder="Email" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">
              <Form.Item
                className="m-0 w-full"
                name="nim"
                rules={[
                  { required: true, message: 'NIM wajib diisi' },
                  { pattern: /^[0-9]{9}$/, message: 'NIM harus 9 digit angka' }
                ]}
              >
                <Input placeholder="NIM" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">
              <Form.Item
                className="m-0 w-full"
                name="phone"
                rules={[
                  { required: true, message: 'Nomor telepon wajib diisi' },
                  {
                    pattern: /^(08|628)[0-9]{8,11}$/,
                    message: 'Nomor telepon tidak valid (contoh: 081234567890)'
                  }
                ]}
              >
                <Input placeholder="No. Telepon" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <Form.Item className="w-fit">
            <Button block type="primary" htmlType="submit" className="w-fit">
              Simpan Perubahan
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Password" className="col-span-6">
        <Form>
          <Descriptions column={2} layout="vertical" size="small" className="mb-4">
            <Descriptions.Item label="Nama Lengkap">
              <Form.Item className="m-0 w-full" name="name" rules={[{ required: true, message: 'Nama lengkap harus diisi' }]}>
                <Input placeholder="Nama Lengkap" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Form.Item className="m-0 w-full" name="email" rules={[{ required: true, message: 'Email harus diisi' }]}>
                <Input placeholder="Email" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">
              <Form.Item
                className="m-0 w-full"
                name="nim"
                rules={[
                  { required: true, message: 'NIM wajib diisi' },
                  { pattern: /^[0-9]{9}$/, message: 'NIM harus 9 digit angka' }
                ]}
              >
                <Input placeholder="NIM" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">
              <Form.Item
                className="m-0 w-full"
                name="phone"
                rules={[
                  { required: true, message: 'Nomor telepon wajib diisi' },
                  {
                    pattern: /^(08|628)[0-9]{8,11}$/,
                    message: 'Nomor telepon tidak valid (contoh: 081234567890)'
                  }
                ]}
              >
                <Input placeholder="No. Telepon" size="large" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <Form.Item className="w-fit">
            <Button block type="primary" htmlType="submit" className="w-fit">
              Simpan Perubahan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default KonselisProfile;
