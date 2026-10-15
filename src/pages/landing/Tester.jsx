import { Button, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'

const Tester = () => {
    const [form] = Form.useForm()
    const handleSubmit = () => {
        const allValues = form.getFieldsValue(true);
        console.log("hasil", allValues)
    }
    return (
        <section>
            <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col items-center justify-center px-6 py-28">
                <Form form={form} layout="vertical" className="flex flex-col justify-between w-full">

                    <div className="mb-12 grid grid-cols-6 gap-4">
                        <Form.Item className="col-span-6 m-0" label="Isi Laporan Kegiatan" name="laporan_kegiatan" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                            <TextArea placeholder="Masukan Laporan" size="large" />
                        </Form.Item>
                        <Form.Item className="col-span-6 m-0" label="Hasil yang dipelajari" name="hasil_dipelajari" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                            <TextArea placeholder="Masukan hasil" size="large" />
                        </Form.Item>
                        <Form.Item className="col-span-6 m-0" label="Kendala yang diahadapi" name="kendala_dihadapi" rules={[{ required: true, message: 'Field Nama harus diisi' }]}>
                            <TextArea placeholder="Masukan kendala" size="large" />
                        </Form.Item>
                    </div>


                    <div className="flex gap-4">

                        <Button type="primary" onClick={handleSubmit}>
                            Selanjutnya
                        </Button>
                    </div>

                </Form>
            </div>
        </section>

    )
}

export default Tester