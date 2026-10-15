import { useAuth, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { LaisegService, SesiKonselingsService } from '@/services';
import { Alert, Button, Card, Descriptions, Form, Image, Radio, Skeleton, Space, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ANSWER_OPTIONS = [
  { value: 'sangat_setuju', label: 'Sangat Setuju' },
  { value: 'setuju', label: 'Setuju' },
  { value: 'tidak_setuju', label: 'Tidak Setuju' },
  { value: 'sangat_tidak_setuju', label: 'Sangat Tidak Setuju' }
];

const QUESTIONS = [
  { name: 'q1_topik_sesuai', label: '1. Topik yang dibahas dalam layanan sesuai dengan kebutuhan saya.' },
  { name: 'q2_pemahaman_baru', label: '2. Saya memperoleh pemahaman baru setelah mengikuti layanan.' },
  { name: 'q3_merasa_lebih_baik', label: '3. Saya merasa lebih baik setelah mengikuti layanan.' },
  { name: 'q4_rencana_tindakan', label: '4. Saya memiliki rencana tindakan setelah mengikuti layanan.' },
  { name: 'q5_berkaitan_masalah', label: '5. Layanan yang saya ikuti berkaitan dengan masalah yang sedang saya hadapi.' },
  { name: 'q6_manfaat_layanan', label: '6. Layanan memberikan manfaat bagi saya dalam menghadapi masalah.' },
  { name: 'q7_layanan_sudah_baik', label: '7. Saya merasa layanan yang diberikan konselor sudah baik.' }
];

const Create = () => {
  const { token, onUnauthorized } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const { sesi_konseling_id } = useParams();
  const { execute, ...getAllSesiKonselings } = useAbortableService(SesiKonselingsService.getById, { onUnauthorized });
  const storeLaiseg = useService(LaisegService.store);

  const sesiKonseling = getAllSesiKonselings.data ?? {};

  const fetchSesiKonseling = React.useCallback(() => {
    execute({
      token,
      id: sesi_konseling_id
    });
  }, [execute, sesi_konseling_id, token]);

  React.useEffect(() => {
    fetchSesiKonseling();
  }, [fetchSesiKonseling]);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      sesi_konseling_id: sesi_konseling_id
    };

    const { message, isSuccess } = await storeLaiseg.execute(payload, token);

    if (isSuccess) {
      success('Berhasil', message);
      navigate(-1);
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  return (
    <div>
      <Card
        title={
          <div className="flex w-full flex-col items-center justify-center gap-y-2 py-6">
            <div className="mb-4 flex w-full items-center justify-center gap-2">
              <Image width={38} preview={false} src={'/image_asset/ung.png'} />
              <Image width={40} preview={false} src={'/image_asset/brand_logo.jpeg'} />
            </div>
            <Typography.Title level={5} className="text-center">
              PENILAIAN HASIL
              <br />
              LAYANAN BIMBINGAN DAN KONSELING
              <br />
              (LAISEG)
            </Typography.Title>
          </div>
        }
      >
        {!Object.entries(sesiKonseling).length ? (
          <Skeleton active />
        ) : (
          <>
            <Alert type="info" showIcon description="Pilih salah satu jawaban untuk setiap pertanyaan" className="mb-4" closable />
            <Descriptions bordered column={2} className="mb-2" size="small">
              <Descriptions.Item label="Hari, Tanggal Layanan">{sesiKonseling.counseling_date}</Descriptions.Item>
              <Descriptions.Item label="Jenis Layanan">{sesiKonseling.tiket.service_type}</Descriptions.Item>
              <Descriptions.Item label="Pemberi Layanan">{sesiKonseling.konselor.user.name}</Descriptions.Item>
              <Descriptions.Item label="Pendaftar Layanan">{sesiKonseling.tiket.konseli.user.name}</Descriptions.Item>
            </Descriptions>

            <Form onFinish={handleSubmit} form={form}>
              {QUESTIONS.map((question) => (
                <Form.Item key={question.name} name={question.name} className="m-0 mb-2" rules={[{ required: true, message: 'Pertanyaan ini wajib dijawab' }]}>
                  <Card title={<div className="p-2">{question.label}</div>} size="small">
                    <Radio.Group>
                      <Space direction="vertical">
                        {ANSWER_OPTIONS.map((opt) => (
                          <Radio key={opt.value} value={opt.value}>
                            {opt.label}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Card>
                </Form.Item>
              ))}

              <Form.Item name="catatan_lainnya" className="m-0 mb-2">
                <Card title={<div className="p-2">Catatan / Saran / Lainnya (Opsional)</div>} size="small">
                  <TextArea placeholder="Masukan catatan atau masukan lainnya..." rows={4} />
                </Card>
              </Form.Item>

              <Form.Item>
                <div className="flex w-full items-center justify-center gap-x-2">
                  <Button loading={storeLaiseg.isLoading} htmlType="submit" className="w-full" type="primary" size="large">
                    Kirim
                  </Button>
                  <Button htmlType="reset" className="w-full" size="large">
                    Reset
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default Create;
