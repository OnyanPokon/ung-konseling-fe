import { InputType } from '@/constants';

export const QuestionFormFields = () => [
  {
    label: `Pertanyaan`,
    name: 'question_text',
    type: InputType.LONGTEXT,
    rules: [{ required: true, message: 'Pertanyaan wajib diisi' }]
  }
];
