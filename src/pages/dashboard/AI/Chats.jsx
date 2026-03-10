import { useAuth, useService } from '@/hooks';
import AiService from '@/services/AiService';
import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from 'antd';
import React from 'react';

const Chats = () => {
  const { token } = useAuth();
  const [chatLoading, setChatLoading] = React.useState(false);
  const sendChat = useService(AiService.chat);
  const [form] = Form.useForm();
  const [messages, setMessages] = React.useState({});
  const [displayText, setDisplayText] = React.useState('');

  const typingEffect = (text) => {
    let index = 0;

    setDisplayText('');

    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleSend = async (values) => {
    form.resetFields();

    setMessages({});
    setDisplayText('');
    setChatLoading(true);

    const { data } = await sendChat.execute(
      {
        messages: [
          {
            role: 'user',
            content: values.message
          }
        ]
      },
      token
    );

    const reply = data.reply;

    setChatLoading(false);

    if (reply) {
      setMessages({
        role: 'assistant',
        content: reply
      });

      typingEffect(reply);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8" title={'Chat Bot'}>
        <Form form={form} onFinish={handleSend} className="mb-4 w-full">
          <div className="flex w-full items-end gap-2">
            <Form.Item className="flex-1" style={{ margin: 0 }} name="message">
              <Input.TextArea size="large" autoSize={{ minRows: 2, maxRows: 4 }} placeholder="Jelaskan masalah kamu" />
            </Form.Item>
            <Button icon={<SendOutlined />} size="large" htmlType="submit" />
          </div>
        </Form>
        <div className="flex max-h-96 min-h-64 flex-col gap-y-2 overflow-y-auto">
          <div className="flex w-full items-end justify-end">
            <div className="rounded-md bg-blue-50 p-4">
              Saya siap membantu kamu menemukan solusi untuk masalah kamu. Silakan berbagi cerita atau masalah yang kamu hadapi, dan saya akan melakukan yang terbaik untuk memahami situasi kamu dan memberikan saran yang relevan.
            </div>
          </div>
          <hr className="mb-2" />
          {messages.role === 'assistant' && (
            <>
              <div className="flex w-full flex-col items-start justify-start gap-y-4">
                <span className="px-2">Jawaban dari AI :</span>
                <div className="rounded-md bg-blue-50 p-4 text-left">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
              <hr className="mb-2" />
            </>
          )}

          {chatLoading && (
            <div className="flex w-full justify-start">
              <div className="rounded-lg bg-blue-50 p-4">AI sedang mengetik...</div>
            </div>
          )}
        </div>
      </Card>
      <div className="col-span-12 h-fit lg:col-span-4">
        <Card
          className="col-span-4 h-fit"
          style={{
            backgroundImage: "url('/image_asset/ai_card_bg.png')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="text-white">
            <Typography.Title level={5} style={{ color: '#fff' }}>
              Chat Bot
            </Typography.Title>
            <p>Berinteraksi dengan ai chat</p>
          </div>
        </Card>
        <Card className="mt-4">
          <Typography.Text>
            Fitur AI ini hanya bersifat membantu memberikan solusi dan bukan merupakan acuan utama dalam penyelesaian masalah konseling. Untuk penanganan profesional, Anda diharapkan dapat mendaftar pada layanan konseling yang tersedia.
          </Typography.Text>
        </Card>
      </div>
    </div>
  );
};

export default Chats;
