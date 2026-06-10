import { useAuth, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { LaisegService, SesiKonselingsService } from '@/services';
import { Alert, Button, Card, Descriptions, Form, Image, Radio, Skeleton, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  const relatedToProblem = Form.useWatch('related_to_problem', form);

  console.log(relatedToProblem);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      sesi_konseling_id: sesi_konseling_id,
      related_to_problem: values.related_to_problem === true || values.related_to_problem === 'true',

      benefits_if_yes: values.related_to_problem ? values.benefits_if_yes : '-',

      benefits_if_no: values.related_to_problem ? '-' : values.benefits_if_no
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
            <Alert type="info" showIcon description="Isi setiap bagan formulir dengan singkat" className="mb-4" closable />
            <Descriptions bordered column={2} className="mb-2" size="small">
              <Descriptions.Item label="Hari, Tanggal Layanan">{sesiKonseling.counseling_date}</Descriptions.Item>
              <Descriptions.Item label="Jenis Layanan">{sesiKonseling.tiket.service_type}</Descriptions.Item>
              <Descriptions.Item label="Pemberi Layanan">{sesiKonseling.konselor.user.name}</Descriptions.Item>
              <Descriptions.Item label="Pendaftar Layanan">{sesiKonseling.tiket.konseli.user.name}</Descriptions.Item>
            </Descriptions>

            <Form onFinish={handleSubmit} form={form}>
              <Form.Item name="discussion_topic" className="m-0 mb-2" rules={[{ required: true, message: 'Topik bahasan wajib diisi' }]}>
                <Card title={<div className="p-2">1. Topik - topik apa yang dibahas melalui layanan tersebut?</div>} size="small">
                  <TextArea placeholder="Masukan Jawaban" />
                </Card>
              </Form.Item>
              <Form.Item name="new_understanding" className="m-0 mb-2" rules={[{ required: true, message: 'Pemahaman baru wajib diisi' }]}>
                <Card title={<div className="p-2">2. Hal - hal atau pemahaman baru apakah yang anda peroleh dari layanan tersebut?</div>} size="small">
                  <TextArea placeholder="Masukan Jawaban" />
                </Card>
              </Form.Item>
              <Form.Item name="feelings_after_service" className="m-0 mb-2" rules={[{ required: true, message: 'Perasaan setelah layanan wajib diisi' }]}>
                <Card title={<div className="p-2">3. Bagaimanakah perasaan anda setelah mengikuti layanan tersebut?</div>} size="small">
                  <TextArea placeholder="Masukan Jawaban" />
                </Card>
              </Form.Item>
              <Form.Item name="plan_after_service" className="m-0 mb-2" rules={[{ required: true, message: 'Rencana setelah layanan wajib diisi' }]}>
                <Card title={<div className="p-2">4. Hal - hal apakah yang akan anda lakukan setelah mengikuti layanan tersebut?</div>} size="small">
                  <TextArea placeholder="Masukan Jawaban" />
                </Card>
              </Form.Item>
              <Form.Item
                name="related_to_problem"
                className="m-0 mb-2"
                rules={[
                  {
                    required: true,
                    message: 'Pilihan wajib diisi'
                  }
                ]}
              >
                <Card title={<div className="p-2">5. Apakah layanan yang anda ikuti berkaitan dengan masalah yang sedang anda hadapi?</div>} size="small">
                  <Radio.Group
                    options={[
                      { value: true, label: 'Ya' },
                      { value: false, label: 'Tidak' }
                    ]}
                    onChange={(e) => {
                      if (e.target.value) {
                        form.setFieldValue('benefits_if_no', undefined);
                      } else {
                        form.setFieldValue('benefits_if_yes', undefined);
                      }
                    }}
                  />
                </Card>
              </Form.Item>
              {String(relatedToProblem) === 'true' && (
                <Form.Item
                  name="benefits_if_yes"
                  className="m-0 mb-2"
                  rules={[
                    {
                      required: true,
                      message: 'Keuntungan wajib diisi'
                    }
                  ]}
                >
                  <Card title={<div className="p-2">Jika jawaban anda &apos;Ya&apos;, apa keuntungan yang anda rasakan setelah mengikuti layanan tersebut?</div>} size="small">
                    <TextArea placeholder="Masukan Jawaban" />
                  </Card>
                </Form.Item>
              )}
              {String(relatedToProblem) === 'false' && (
                <Form.Item
                  name="benefits_if_no"
                  className="m-0 mb-2"
                  rules={[
                    {
                      required: true,
                      message: 'Keuntungan wajib diisi'
                    }
                  ]}
                >
                  <Card title={<div className="p-2">Jika jawaban anda &apos;Tidak&apos;, apa keuntungan yang anda rasakan setelah mengikuti layanan tersebut?</div>} size="small">
                    <TextArea placeholder="Masukan Jawaban" />
                  </Card>
                </Form.Item>
              )}
              <Form.Item name="suggestion_and_messages" className="m-0 mb-2" rules={[{ required: true, message: 'Saran dan pesan wajib diisi' }]}>
                <Card title={<div className="p-2">6. Tanggapan, saran, dan pesan apa yang ingin anda sampaikan kepada konselor terkait layanan yang anda ikuti tersebut?</div>} size="small">
                  <TextArea placeholder="Masukan Jawaban" />
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
