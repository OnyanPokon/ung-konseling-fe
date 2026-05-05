import { FacebookFilled, InstagramFilled, TikTokFilled } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 pb-4 pt-24">
        <div className="grid w-full grid-cols-6 gap-12">
          <div className="col-span-6 flex flex-col gap-y-6 lg:col-span-1">
            <small>SINLA BK UNG</small>
            <div className="flex items-center gap-x-2">
              <Button onClick={() => window.open('https://www.instagram.com/upabkung/', '_blank')} type="primary" shape="circle" icon={<InstagramFilled />} />
              <Button onClick={() => window.open('https://www.facebook.com/upabkung/', '_blank')} type="primary" shape="circle" icon={<FacebookFilled />} />
              <Button onClick={() => window.open('https://www.tiktok.com/@upabkung', '_blank')} type="primary" shape="circle" icon={<TikTokFilled />} />
            </div>
          </div>
          <div className="col-span-6 flex items-center justify-center lg:col-span-4">
            <div className="col-span-12 flex flex-col gap-y-3 lg:col-span-4">
              <b>SINLA BK Universitas Negeri Gorontalo</b>
              <Typography.Text>Unit Penunjang Akademik Bimbingan dan Konseling</Typography.Text>
              <Typography.Text>Universitas Negeri Gorontalo</Typography.Text>
              <Typography.Text>Telp : 0852-4045-9954</Typography.Text>
              <Typography.Text>
                Laman :{' '}
                <a href="https://up-bimbingankonseling.ung.ac.id/" target="_blank" rel="noopener noreferrer">
                  https://up-bimbingankonseling.ung.ac.id/
                </a>
              </Typography.Text>
            </div>
          </div>
          <div className="col-span-6 lg:col-span-1">
            <div className="inline-flex items-center gap-x-2">
              <Image width={64} src="/image_asset/ung.png" />
              <Image width={64} src="/image_asset/brand_logo.jpeg" />
            </div>
          </div>
          <div className="col-span-6 flex items-center justify-center border-t-2 py-6">
            <small className="text-gray-500">SINLA BK UNG</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
