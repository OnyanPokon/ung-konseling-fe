import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { SesiKonselingsService } from '@/services';
import { Card, Descriptions, Image, Skeleton, Steps, Tag, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

const ANSWER_LABELS = {
  sangat_setuju: 'Sangat Setuju',
  setuju: 'Setuju',
  tidak_setuju: 'Tidak Setuju',
  sangat_tidak_setuju: 'Sangat Tidak Setuju'
};

const ANSWER_COLORS = {
  sangat_setuju: 'green',
  setuju: 'blue',
  tidak_setuju: 'orange',
  sangat_tidak_setuju: 'red'
};

const QUESTIONS = [
  { name: 'q1_topik_sesuai', label: '1. Topik yang dibahas dalam layanan sesuai dengan kebutuhan saya.' },
  { name: 'q2_pemahaman_baru', label: '2. Saya memperoleh pemahaman baru setelah mengikuti layanan.' },
  { name: 'q3_merasa_lebih_baik', label: '3. Saya merasa lebih baik setelah mengikuti layanan.' },
  { name: 'q4_rencana_tindakan', label: '4. Saya memiliki rencana tindakan setelah mengikuti layanan.' },
  { name: 'q5_berkaitan_masalah', label: '5. Layanan yang saya ikuti berkaitan dengan masalah yang sedang saya hadapi.' },
  { name: 'q6_manfaat_layanan', label: '6. Layanan memberikan manfaat bagi saya dalam menghadapi masalah.' },
  { name: 'q7_layanan_sudah_baik', label: '7. Saya merasa layanan yang diberikan konselor sudah baik.' }
];

const Show = () => {
  const { token, onUnauthorized } = useAuth();
  const { sesi_konseling_id } = useParams();
  const { execute, ...getAllSesiKonselings } = useAbortableService(SesiKonselingsService.getById, { onUnauthorized });

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

  const stepsItems = QUESTIONS.map((question) => {
    const answer = sesiKonseling.laiseg?.[question.name];

    return {
      description: (
        <Card title={<div className="p-2">{question.label}</div>} size="small">
          <Tag color={ANSWER_COLORS[answer] ?? 'default'}>
            {ANSWER_LABELS[answer] ?? '-'}
          </Tag>
        </Card>
      )
    };
  });

  if (sesiKonseling.laiseg?.catatan_lainnya) {
    stepsItems.push({
      description: (
        <Card title={<div className="p-2">Catatan / Saran / Lainnya</div>} size="small">
          <Typography.Text>{sesiKonseling.laiseg.catatan_lainnya}</Typography.Text>
        </Card>
      )
    });
  }

  return (
    <div>
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
              <Descriptions bordered column={2} className="mb-6" size="small">
                <Descriptions.Item label="Hari, Tanggal Layanan">{sesiKonseling.counseling_date}</Descriptions.Item>
                <Descriptions.Item label="Jenis Layanan">{sesiKonseling.tiket.service_type}</Descriptions.Item>
                <Descriptions.Item label="Pemberi Layanan">{sesiKonseling.konselor.user.name}</Descriptions.Item>
                <Descriptions.Item label="Pendaftar Layanan">{sesiKonseling.tiket.konseli.user.name}</Descriptions.Item>
              </Descriptions>
              <Steps
                current={-1}
                direction="vertical"
                items={stepsItems}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Show;
