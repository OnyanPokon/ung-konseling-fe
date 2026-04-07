type ModelKeys = 'konseli' | 'konselor' | 'jadwal_konselor' | 'tiket' | 'hari_layanan' | 'user' | 'sesi_konseling' | 'artikel' | 'periode' | 'assessment' | 'question' | 'screening' | 'screening_question';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    konseli: undefined,
    konselor: undefined,
    jadwal_konselor: undefined,
    tiket: undefined,
    hari_layanan: undefined,
    user: undefined,
    sesi_konseling: undefined,
    artikel: undefined,
    periode: undefined,
    assessment: undefined,
    question: undefined,
    screening: undefined,
    screening_question: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
