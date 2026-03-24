import { DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { SesiKonselingsService } from '@/services';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Card, Skeleton, Alert, Tag, Space, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SESI_KONSELING_REPORT_TEMPLATE } from './ReportTemplates';
import { EditOutlined, PrinterOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import html2pdf from 'html2pdf.js';
import { reportFormFields } from './FormFields';

const Report = () => {
  const modal = useCrudModal();
  // const [form] = Form.useForm();
  const { success, error } = useNotification();
  const { token, onUnauthorized } = useAuth();
  const { sesi_konseling_id } = useParams();
  const { execute, ...getAllReportDetails } = useAbortableService(SesiKonselingsService.getReport, { onUnauthorized });
  const uploadAndFinal = useService(SesiKonselingsService.uploadAndFinal, onUnauthorized);
  const updateReportValue = useService(SesiKonselingsService.updateReportValue, onUnauthorized);

  const fetchReportDetails = React.useCallback(() => {
    execute({
      token: token,
      sesi_konseling_id: sesi_konseling_id
    });
  }, [execute, sesi_konseling_id, token]);

  React.useEffect(() => {
    fetchReportDetails();
  }, [fetchReportDetails, token]);

  const reportDetails = React.useMemo(() => {
    return getAllReportDetails.data ?? {};
  }, [getAllReportDetails.data]);

  const editorRef = useRef(null);

  const handlePrint = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePrint');
    }
  };

  const buildVariables = (data) => {
    return {
      nama_kegiatan: data.nama_kegiatan,
      jenis_layanan: data.jenis_layanan,
      tujuan_kegiatan: data.tujuan_kegiatan,
      waktu_tempat: data.waktu_tempat,
      peserta: data.jumlah_peserta,
      uraian_kegiatan: data.uraian_kegiatan,
      hasil_dampak: data.hasil_dampak,
      rekomendasi_tindak_lanjut: data.rekomendasi,
      penanggung_jawab: data.konselor,
      nama_konselor: data.konselor
    };
  };

  const renderTemplate = (template, variables) => {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      return variables[key.trim()] ?? '-';
    });
  };

  const variables = React.useMemo(() => {
    if (!reportDetails) return {};
    return buildVariables(reportDetails);
  }, [reportDetails]);

  const generatePdfBlob = async () => {
    const element = document.createElement('div');
    element.innerHTML = editorRef.current.getContent();

    const opt = {
      margin: 0.5,
      filename: 'laporan.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const worker = html2pdf().set(opt).from(element);

    const pdf = await worker.toPdf().get('pdf'); // 👈 ambil instance jsPDF
    const blob = pdf.output('blob'); // 👈 convert ke Blob

    return blob;
  };

  return (
    <Space direction="vertical" size="middle" className="flex w-full">
      <Card
        title={
          <div className="flex items-center gap-x-3">
            <DataTableHeader modul={Modul.REPORT} />
            {!getAllReportDetails.isLoading && reportDetails?.status === 'final' && (
              <Tag icon={<CheckCircleOutlined />} color="success" className="ml-2">
                FINAL
              </Tag>
            )}
            {!getAllReportDetails.isLoading && reportDetails?.status !== 'final' && (
              <Tag icon={<InfoCircleOutlined />} color="processing" className="ml-2">
                DRAFT
              </Tag>
            )}
          </div>
        }
        extra={
          <div className="inline-flex items-center gap-x-2">
            <Tooltip title={reportDetails?.status === 'final' ? 'Laporan sudah final dan tidak dapat dipublish ulang.' : 'Publish Laporan sebagai Final'}>
              <Button
                disabled={reportDetails.status === 'final'}
                variant="outlined"
                shape="round"
                color="primary"
                icon={<PrinterOutlined />}
                type="primary"
                loading={uploadAndFinal.isLoading}
                onClick={async () => {
                  try {
                    const blob = await generatePdfBlob();

                    const file = new File([blob], 'laporan.pdf', { type: 'application/pdf' });

                    const { message, isSuccess } = await uploadAndFinal.execute(sesi_konseling_id, token, file);

                    if (isSuccess) {
                      success('Berhasil', message);
                      handlePrint();
                    } else {
                      error('Gagal', message);
                    }

                    return isSuccess;
                    // eslint-disable-next-line no-unused-vars
                  } catch (err) {
                    error('Error', 'Gagal generate PDF');
                  }
                }}
              >
                Publish Laporan
              </Button>
            </Tooltip>
            <Tooltip title={reportDetails?.status === 'final' ? 'Laporan sudah final dan isinya tidak dapat diedit lagi.' : 'Edit isi nilai laporan'}>
              <Button
                disabled={reportDetails.status === 'final'}
                variant="outlined"
                shape="round"
                color="primary"
                icon={<EditOutlined />}
                type="primary"
                onClick={() => {
                  modal.edit({
                    title: `Edit Value Laporan`,
                    data: { ...reportDetails },
                    formFields: reportFormFields,

                    onSubmit: async (values) => {
                      const { message, isSuccess } = await updateReportValue.execute(sesi_konseling_id, values, token);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchReportDetails();
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
              >
                Edit Value
              </Button>
            </Tooltip>
          </div>
        }
      >
        <Skeleton loading={getAllReportDetails.isLoading} active>
          <div className="flex w-full flex-col gap-y-4">
            {!getAllReportDetails.isLoading && reportDetails?.status === 'final' && (
              <Alert message="Laporan Sudah Bersifat Final" description="Laporan ini telah berhasil dipublish dan berstatus akhir. Seluruh data sudah dikunci dan dokumen ini tidak dapat diubah atau dipublish ulang." type="success" showIcon />
            )}
            {!getAllReportDetails.isLoading && reportDetails?.status !== 'final' && Object.keys(reportDetails).length > 0 && (
              <Alert message="Laporan Masih Berupa Draft" description="Pastikan semua data pada laporan telah sesuai sebelum Anda melakukan Publish. Setelah proses Publish Laporan, dokumen tidak dapat diubah kembali." type="info" showIcon />
            )}
            <div className="w-full max-w-full overflow-x-auto">
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={renderTemplate(SESI_KONSELING_REPORT_TEMPLATE, variables)}
                apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
                init={{
                  plugins: ['print'],
                  height: '100vh',
                  visual: false,
                  content_style: `
                        body {
                        background: #fff;
                        }

                        /* Disable the blue "focus" border for the editable region */
                        .editable-section:focus-visible {
                        outline: none !important;
                        }

                        .header,
                        .footer {
                        font-size: 0.8rem;
                        color: #ddd;
                        }

                        .header {
                        display: flex;
                        justify-content: space-between;
                        padding: 0 0 1rem 0;
                        }

                        .header .right-text {
                        text-align: right;
                        }

                        .footer {
                        padding:2rem 0 0 0;
                        text-align: center;
                        }

                        /* Apply page-like styling */
                        @media (min-width: 840px) {
                        html {
                            background: #eceef4;
                            min-height: 100%;
                            padding: 0.5rem;
                        }

                        body {
                            background-color: #fff;
                            box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                            box-sizing: border-box;
                            margin: 1rem auto 0;
                            max-width: 820px;
                            min-height: calc(100vh - 1rem);
                            padding: 2rem 6rem 2rem 6rem;
                        }
                        }
                        `
                }}
              />
            </div>
          </div>
        </Skeleton>
      </Card>
    </Space>
  );
};

export default Report;
