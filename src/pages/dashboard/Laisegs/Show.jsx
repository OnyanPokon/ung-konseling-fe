import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { SesiKonselingsService } from '@/services';
import { Card, Descriptions, Image, Skeleton, Steps, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

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
                items={[
                  {
                    description: (
                      <Card title={<div className="p-2">1. Topik - topik apa yang dibahas melalui layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.discussion_topic}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">2. Hal - hal atau pemahaman baru apakah yang anda peroleh dari layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.new_understanding}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">3. Bagaimanakah perasaan anda setelah mengikuti layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.feelings_after_service}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">4. Hal - hal apakah yang akan anda lakukan setelah mengikuti layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.plan_after_service}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">4. Apakah layanan yang anda ikuti berkaitan dengan masalah yang sedang anda hadapi?</div>} size="small">
                        {sesiKonseling.laiseg.related_to_problem ? 'Ya' : 'Tidak'}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">5. Jika jawaban anda &apos;Ya&apos;, apa keuntungan yang anda rasakan setelah mengikuti layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.benefits_if_yes}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">6. Jika jawaban anda &apos;tidak&apos;, apa keuntungan yang anda rasakan setelah mengikuti layanan tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.benefits_if_no}
                      </Card>
                    )
                  },
                  {
                    description: (
                      <Card title={<div className="p-2">7. Tanggapan, saran, dan pesan apa yang ingin anda sampaikan kepada konselor terkait layanan yang anda ikuti tersebut?</div>} size="small">
                        {sesiKonseling.laiseg.suggestions_and_messages}
                      </Card>
                    )
                  }
                ]}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Show;
