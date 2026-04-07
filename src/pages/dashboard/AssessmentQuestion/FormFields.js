import { InputType } from '@/constants';

export const QuestionFormFields = () => [
  {
    label: `Pertanyaan`,
    name: 'question_text',
    type: InputType.LONGTEXT,
    rules: [{ required: true, message: 'Pertanyaan wajib diisi' }]
  },
  {
    label: `Skala`,
    name: 'scale',
    type: InputType.NUMBER,
    extra: {
      min: 1,
      max: 10
    },
    rules: [{ required: true, message: 'Skala wajib diisi' }]
  }
];
