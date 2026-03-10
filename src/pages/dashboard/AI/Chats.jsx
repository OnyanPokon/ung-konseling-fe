import { useAuth, useService } from '@/hooks';
import AiService from '@/services/AiService';
import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Spin, Typography } from 'antd';
import React, { useEffect } from 'react';

const Chats = () => {
  const { token } = useAuth();
  const [messages, setMessages] = React.useState([]);
  const [initLoading, setInitLoading] = React.useState(true);
  const [chatLoading, setChatLoading] = React.useState(false);
  const sendChat = useService(AiService.chat);
  const [form] = Form.useForm();

  useEffect(() => {
    const initChat = async () => {
      setInitLoading(true);

      const { data } = await sendChat.execute(
        {
          messages: []
        },
        token
      );

      const reply = data.reply;

      if (reply) {
        setMessages([
          {
            role: 'assistant',
            content: reply
          }
        ]);
      }

      setInitLoading(false);
    };

    initChat();
    // eslint-disable-next-line
  }, []);

  const handleSend = async (values) => {
    const userMessage = {
      role: 'user',
      content: values.message
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setChatLoading(true);
    form.resetFields();

    const { data } = await sendChat.execute(
      {
        messages: updatedMessages
      },
      token
    );

    const reply = data.reply;

    if (reply) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: reply
        }
      ]);
    }

    setChatLoading(false);
  };

  console.log(messages);

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8" title={'Chat Bot'}>
        <div className="flex max-h-96 min-h-64 flex-col gap-y-2 overflow-y-auto">
          {initLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spin />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <>
                  {msg.role === 'user' ? (
                    <div className="flex w-full items-end justify-end">
                      <div className="max-w-lg rounded-lg bg-gray-300 p-4">{msg.content}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex w-full items-end justify-end">
                        <div className="p-4">{msg.content}</div>
                      </div>
                      <hr className="mb-2" />
                    </>
                  )}
                </>
              ))}

              {chatLoading && (
                <div className="flex w-full justify-start">
                  <div className="rounded-lg bg-blue-100 p-4">AI sedang mengetik...</div>
                </div>
              )}
            </>
          )}
        </div>
        <Form form={form} onFinish={handleSend} className="w-full border-t">
          <div className="mt-4 flex w-full items-end gap-2">
            <Form.Item className="flex-1" style={{ margin: 0 }} name="message">
              <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 4 }} placeholder="Jelaskan masalah kamu" />
            </Form.Item>

            <Button icon={<SendOutlined />} size="large" htmlType="submit" />
          </div>
        </Form>
      </Card>
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
    </div>
  );
};

export default Chats;
