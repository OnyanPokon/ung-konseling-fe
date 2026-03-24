import { Button, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const FailedAssessment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const errorMessage = state?.message || 'Mohon maaf, terjadi kesalahan saat menyimpan respons Anda. Silakan periksa koneksi Anda dan coba kembali.';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F0F2F5] px-4 py-8">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <Result
          status="error"
          title="Gagal Mengirim Assessment!"
          subTitle={errorMessage}
          extra={[
            <Button type="primary" size="large" key="back" onClick={() => navigate(-1)}>
              Coba Lagi
            </Button>,
            <Button size="large" key="home" onClick={() => navigate('/')}>
              Ke Beranda
            </Button>
          ]}
        />
      </div>
    </div>
  );
};

export default FailedAssessment;
