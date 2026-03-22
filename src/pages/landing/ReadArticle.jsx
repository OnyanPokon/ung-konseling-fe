import { useNotification, useService } from '@/hooks';
import { ArticlesService } from '@/services';
import { SocialMediaShare } from '@/utils/SocialMediaShare';
import { ArrowLeftOutlined, CustomerServiceOutlined, FacebookOutlined, ShareAltOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Button, FloatButton, Skeleton } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReadArticle = () => {
  const { slug } = useParams();
  const { error } = useNotification();
  const { execute: fetchArticle, ...getAllArticle } = useService(ArticlesService.getBySlug);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchArticle({ slug });
  }, [fetchArticle, slug]);

  const { data: news, loading } = getAllArticle;

  if (loading || !news) {
    return (
      <section className="bg-white pb-16 pt-8 antialiased lg:pb-24 lg:pt-28">
        <div className="mx-auto flex max-w-screen-xl justify-between px-4">
          <article className="mx-auto w-full max-w-2xl">
            <Skeleton paragraph={{ rows: 4 }} active className="mb-20" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
          </article>
        </div>
      </section>
    );
  }

  const shareData = {
    title: news.title,
    text: news.title,
    url: window.location.href
  };

  const handleShare = async () => {
    try {
      if (window.navigator.share) {
        await window.navigator.share(shareData);
      } else {
        await window.navigator.clipboard.writeText(shareData.url);
        error('Gagal', 'Gagal Membagikan');
      }
    } catch (error) {
      error('Gagal membagikan:', error);
    }
  };

  return (
    <section className="bg-white pb-16 pt-16 antialiased lg:pb-24 lg:pt-28">
      <div className="mx-auto flex max-w-screen-xl justify-center gap-x-16 px-4">
        <div className="hidden flex-col items-center gap-y-4 lg:flex">
          <div className="mt-1 flex flex-col items-center gap-y-1">
            <Button shape="circle" size="large" color="danger" variant="outlined" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="text-xs text-red-500">Kembali</span>
          </div>
          <Button className="mt-6" size="middle" icon={<ShareAltOutlined />} shape="circle" color="primary" variant="outlined" onClick={handleShare} />
          <Button
            size="middle"
            icon={<FacebookOutlined />}
            shape="circle"
            color="primary"
            variant="outlined"
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'facebook'
                }),
                '_blank'
              )
            }
          />
          <Button
            size="middle"
            icon={<WhatsAppOutlined />}
            shape="circle"
            color="green"
            variant="outlined"
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'whatsapp'
                }),
                '_blank'
              )
            }
          />
        </div>
        <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert w-full max-w-2xl">
          <div className="not-format mb-4 lg:mb-6">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-14 lg:text-4xl">{news?.title}</h1>
            {news?.thumbnail ? (
              <img src={news.thumbnail} alt={news.title} className="aspect-video w-full rounded-lg object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">Tidak ada gambar</div>
            )}
          </div>

          <div className="prose prose-lg text-justify leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: news?.content }} />
        </article>
        <FloatButton.Group className="lg:hidden" trigger="click" type="primary" style={{ insetInlineEnd: 24 }} icon={<CustomerServiceOutlined />}>
          <FloatButton icon={<ShareAltOutlined />} onClick={handleShare} />
          <FloatButton
            icon={<FacebookOutlined />}
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'facebook'
                }),
                '_blank'
              )
            }
          />
          <FloatButton
            icon={<WhatsAppOutlined />}
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'whatsapp'
                }),
                '_blank'
              )
            }
          />
        </FloatButton.Group>
      </div>
    </section>
  );
};

export default ReadArticle;
