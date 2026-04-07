import Model from './Model';

export interface IncomingApiData {
  id: number;
  screening_id: number;
  screening?: {
    id: number;
    title: string;
  };
  question_text: string;
  scale: number;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  screening_id: number;
  question_text: string;
  scale: number;
}

interface FormValue {
  screening_id: number;
  question_text: string;
  scale: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ScreeningQuestions extends Model {
  constructor(
    public id: number,
    public screening_id: number,
    public screening:
      | {
          id: number;
          title: string;
        }
      | undefined,
    public question_text: string,
    public scale: number,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ScreeningQuestions> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ScreeningQuestions>;
    return new ScreeningQuestions(
      apiData.id,
      apiData.screening_id,
      apiData.screening ? { id: apiData.screening.id, title: apiData.screening.title } : undefined,
      apiData.question_text,
      apiData.scale,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, ScreeningQuestions>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(questions: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(questions)) return questions.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      screening_id: questions.screening_id,
      question_text: questions.question_text,
      scale: questions.scale
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.screening_question = ScreeningQuestions;
