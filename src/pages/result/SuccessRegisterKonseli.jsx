import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const SuccessRegisterKonseli = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Result
        status="success"
        title="Berhasil Mendaftar Konseli!"
        subTitle="Selamat! Anda telah berhasil mendaftar sebagai konseli. Silakan login untuk melanjutkan."
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/auth/login')}>
            Masuk
          </Button>,
          <Button key="buy" onClick={() => navigate('/')}>
            Ke Beranda
          </Button>
        ]}
      />
    </div>
  );
};

export default SuccessRegisterKonseli;
