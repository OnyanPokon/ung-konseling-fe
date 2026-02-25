import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const FailedRegisterKonseli = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Result
        status="error"
        title="Gagal Mendaftar Konseli!"
        subTitle="Terjadi kesalahan saat mendaftar konseli. Silakan coba lagi."
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/konseli_register')}>
            Coba Lagi
          </Button>,
          <Button key="buy" onClick={() => navigate('/')}>
            Ke Beranda
          </Button>
        ]}
      />
    </div>
  );
};

export default FailedRegisterKonseli;
