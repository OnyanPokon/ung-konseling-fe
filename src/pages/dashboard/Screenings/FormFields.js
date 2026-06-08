import { InputType } from '@/constants';

const currentYear = new Date().getFullYear();

const yearOptions = Array.from({ length: 3 }, (_, index) => {
  const year = currentYear - 2 + index;

  return {
    label: String(year),
    value: String(year)
  };
});

export const ScreeningFormFields = () => [
  {
    label: `Judul Screening`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'Judul Screening wajib diisi' },
      { max: 255, message: 'Judul maksimal 255 karakter' }
    ]
  },
  {
    label: `Deskripsi`,
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [{ required: true, message: 'Deskripsi wajib diisi' }]
  },
  {
    label: `Status Publish`,
    name: 'is_published',
    type: InputType.SELECT,
    options: [
      {
        label: 'Publish',
        value: true
      },
      {
        label: 'Draft',
        value: false
      }
    ],
    rules: [{ required: true, message: 'Status Publish wajib diisi' }]
  }
];

export const screeningMatrixFilterFields = () => [
  {
    label: `Tahun Respon`,
    name: 'year',
    type: InputType.SELECT,
    options: yearOptions,
    rules: [{ required: true, message: 'Tahun wajib diisi' }]
  }
];
