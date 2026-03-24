import { CustomRadioScale } from '@/components';
import { Button, Form, Input, Typography, Skeleton, Empty } from 'antd';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentsService } from '@/services';
import useAbortableService from '@/hooks/useAbortableService';
import { useAuth, useService } from '@/hooks';

const Assessment = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const navigate = useNavigate();

  const { slug } = useParams();
  const { onUnauthorized } = useAuth();
  const { execute: fetchAssessment, ...assessmentService } = useAbortableService(AssessmentsService.getBySlug, { onUnauthorized });
  const storeResponse = useService(AssessmentsService.storeResponse);

  useEffect(() => {
    if (slug) {
      fetchAssessment({ slug });
    }
  }, [slug, fetchAssessment]);

  const handleClearForm = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan formulir? Semua jawaban akan dihapus.')) {
      form.resetFields();
    }
  };

  const onFinish = async (formValues) => {
    const { name, email, institution, ...questionAnswers } = formValues;

    const answers = Object.entries(questionAnswers).map(([key, value]) => ({
      question_id: parseInt(key, 10),
      score: value
    }));

    const payload = {
      assessment_id: assessmentData.id,
      name,
      email,
      institution,
      answers
    };

    const { message, isSuccess } = await storeResponse.execute(payload);
    if (isSuccess) {
      navigate('/success_assessment');
    } else {
      navigate('/failed_assessment', { state: { message } });
    }
    return isSuccess;
  };

  const isLoading = assessmentService.isLoading;
  const assessmentData = assessmentService.data;

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#F0F2F5] px-4 py-8 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-3xl space-y-5">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 pt-10 shadow-sm sm:p-8">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </div>
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </div>
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <Skeleton active title={false} paragraph={{ rows: 3 }} />
          </div>
        </div>
      </section>
    );
  }

  if (!assessmentData) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#F0F2F5] px-4 py-8 font-sans sm:px-6 lg:px-8">
        <Empty description="Assessment tidak ditemukan atau tidak tersedia" />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F0F2F5] px-4 py-8 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto mt-12 max-w-3xl space-y-5">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute left-0 top-0 h-2.5 w-full bg-blue-600"></div>
          <div className="p-6 pt-10 sm:p-8">
            <div className="mb-4">
              <span className="mb-4 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">{assessmentData.period?.name || 'Assessment'}</span>
              <h1 className="mb-3 text-3xl font-bold text-gray-900">{assessmentData.title}</h1>
              <p className="text-[15px] leading-relaxed text-gray-600">{assessmentData.description}</p>
            </div>
            <div className="mt-6 flex items-center border-t border-gray-100 pt-4 text-sm font-medium text-red-500">* Wajib diisi</div>
          </div>
        </div>

        <Form form={form} onFinish={onFinish} className="space-y-5" layout="vertical">
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <div className="mb-4">
              <Typography.Text className="flex items-start text-[16px] font-medium leading-snug text-gray-800 hover:text-gray-900 sm:text-lg">
                <span>Nama Lengkap</span>
              </Typography.Text>
            </div>
            <Form.Item name="name" rules={[{ required: true, message: 'Nama wajib di isi' }]} className="mb-0">
              <Input size="large" name="name" placeholder="Masukan Nama" />
            </Form.Item>
          </div>
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <div className="mb-4">
              <Typography.Text className="flex items-start text-[16px] font-medium leading-snug text-gray-800 hover:text-gray-900 sm:text-lg">
                <span>Email</span>
              </Typography.Text>
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email wajib di isi' },
                { type: 'email', message: 'Email tidak valid' }
              ]}
              className="mb-0"
            >
              <Input size="large" name="email" placeholder="Masukan Email" />
            </Form.Item>
          </div>
          <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
            <div className="mb-4">
              <Typography.Text className="flex items-start text-[16px] font-medium leading-snug text-gray-800 hover:text-gray-900 sm:text-lg">
                <span>Institusi/Universitas/Fakultas/Jurusan</span>
              </Typography.Text>
            </div>
            <Form.Item name="institution" rules={[{ required: true, message: 'Institusi/Universitas/Fakultas/Jurusan wajib di isi' }]} className="mb-0">
              <Input size="large" name="institution" placeholder="Masukan Institusi/Universitas/Fakultas/Jurusan" />
            </Form.Item>
          </div>
          {assessmentData.questions?.map((q, index) => {
            const isAnswered = values && values[q.id] !== undefined;

            return (
              <div key={q.id} className={`rounded-xl border bg-white shadow-sm ${isAnswered ? 'border-gray-200' : 'border-gray-200'} relative p-6 transition-all duration-300 sm:p-8`}>
                {isAnswered && <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-l-xl bg-blue-500 transition-colors"></div>}

                <div className="mb-6">
                  <h3 className="flex items-start text-[16px] font-medium leading-snug text-gray-800 hover:text-gray-900 sm:text-lg">
                    <span className="mr-2 mt-0.5">{index + 1}.</span>
                    <span>{q.question_text}</span>
                  </h3>
                </div>

                <Form.Item name={q.id} rules={[{ required: true, message: 'Harap isi penilaian ini sebelum mengirim' }]} className="mb-0">
                  <CustomRadioScale />
                </Form.Item>
              </div>
            );
          })}

          <div className="flex items-center justify-between pb-12 pt-4">
            <button type="button" className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-gray-800" onClick={handleClearForm}>
              Kosongkan formulir
            </button>
            <Button htmlType="submit" size="large" type="primary" loading={storeResponse.isLoading}>
              Kirim Jawaban
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default Assessment;
