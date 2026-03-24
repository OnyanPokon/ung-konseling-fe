import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const SuccessAssessment = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F0F2F5] px-4 py-8">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <Result
          status="success"
          title="Berhasil Mengirim Assessment!"
          subTitle="Terima kasih, respons Anda telah berhasil kami simpan. Masukan Anda sangat berarti bagi proses evaluasi kami."
          extra={[
            <Button type="primary" size="large" key="home" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          ]}
        />
      </div>
    </div>
  );
};

export default SuccessAssessment;
