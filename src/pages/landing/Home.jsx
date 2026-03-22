import { Reveal } from '@/components';
import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ArticlesService } from '@/services';
import dateFormatterID from '@/utils/dateFormatterId';
import { Button, Card, Skeleton, Space, Typography } from 'antd';
import React from 'react';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(ArticlesService.getAllInLanding, { onUnauthorized });

  React.useEffect(() => {
    fetchNews({ page: 1, per_page: 4 });
  }, [fetchNews]);

  const news = getAllNews.data ?? [];

  return (
    <>
      <section className="mx-auto grid min-h-screen w-full max-w-screen-xl grid-cols-6 items-center gap-x-10 px-6 py-28">
        <div className="col-span-6 flex w-full flex-col gap-y-4 lg:col-span-3">
          <div className="flex flex-col gap-y-4">
            <strong className="text-2xl">
              <Reveal>Selamat Datang di</Reveal>
            </strong>
            <Typography.Title style={{ maring: 0 }}>
              <Reveal>SINLA-BK UNG</Reveal>
            </Typography.Title>
          </div>
          <Typography.Paragraph className="text-gray-500">
            <Reveal>Akses layanan Bimbingan dan Konseling kampus secara mudah, aman, dan terpercaya. Mulai sekarang dan dapatkan dukungan psikologis sesuai kebutuhanmu untuk menunyong kesuksesan akademik, pribadi, dan karir</Reveal>
          </Typography.Paragraph>
          <Space size="small">
            <Button variant="solid" size="large" color="primary" onClick={() => navigate('/auth/login')}>
              Mulai Layanan Sekarang
            </Button>
            <Button variant="outlined" size="large" color="primary" onClick={() => navigate('/konseli_register')}>
              Daftar
            </Button>
          </Space>
          <div>
            <span className="m-0 block text-xs">
              Butuh info lebih lanjut <a className="text-color-primary-500 hover:text-color-primary-200 font-bold underline">kunjungi website resmi kami</a>
            </span>
          </div>
        </div>
        <div className="order-last col-span-3 hidden grid-cols-12 gap-x-4 lg:grid">
          {/* <div className="col-span-6 flex flex-col gap-y-4">
                <Reveal>
                  <div className="inline-flex gap-x-4 rounded-xl bg-gray-100 p-5">
                    <DatabaseOutlined style={{ fontSize: '26px' }} className="text-blue-500" />
                    <p className="text-xs font-semibold">Akses cepat dan update mudah data desa {villageProfile?.data?.village_name}</p>
                  </div>
                </Reveal>
                <div className="landing-village-card-container flex min-h-80 flex-col gap-y-4 rounded-xl p-6 shadow-2xl shadow-blue-400">
                  <p className="text-xs font-semibold text-white">
                    Akses Cepat <FieldTimeOutlined />
                  </p>
                  <p className="text-4xl font-bold text-white">Desa {villageProfile?.data?.village_name}</p>
                </div>
              </div>
              <div className="col-span-6 flex flex-col gap-y-4">
                <div className="flex min-h-80 flex-col gap-y-4 rounded-xl bg-gradient-to-b from-blue-500 to-blue-300 p-6">
                  <p className="text-xs font-semibold text-white">
                    Praktis <FieldTimeOutlined />
                  </p>
                  <p className="text-4xl font-bold text-white">Mudah & Cepat</p>
                </div>
                <div className="inline-flex items-center gap-x-2">
                  <Button className="w-full" onClick={() => navigate('/mobile_landing')} variant="solid" color="primary" size="large">
                    Akses Dalam Genggaman
                  </Button>
                </div>
              </div> */}
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-32">
          <div className="mt-12 flex w-full items-center justify-center">
            <Typography.Title level={4}>Berita Terkini</Typography.Title>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
            {getAllNews.isLoading
              ? Array.from({ length: 4 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[280px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : news?.map((item) => (
                  <Card onClick={() => navigate(window.location.pathname + 'artikel/read/' + item.slug)} key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnail} className="h-52 object-cover" />}>
                    <div className="text-gray-500">
                      <Typography.Title level={5}>
                        <span className="news-text">{item.title}</span>
                      </Typography.Title>
                      <p className="news-text mb-4">{parse(item.content)}</p>
                      <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
