import Model from './Model';

export interface IncomingApiData {
  id: number;
  assessment_id: number;
  assessment?: {
    id: number;
    title: string;
  };
  question_text: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  assessment_id: number;
  question_text: string;
}

interface FormValue {
  assessment_id: number;
  question_text: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Questions extends Model {
  constructor(
    public id: number,
    public assessment_id: number,
    public assessment:
      | {
          id: number;
          title: string;
        }
      | undefined,
    public question_text: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Questions> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Questions>;
    return new Questions(apiData.id, apiData.assessment_id, apiData.assessment ? { id: apiData.assessment.id, title: apiData.assessment.title } : undefined, apiData.question_text, apiData.created_at, apiData.updated_at) as ReturnType<
      T,
      IncomingApiData,
      Questions
    >;
  }

  public static toApiData<T extends FormValue | FormValue[]>(questions: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(questions)) return questions.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      assessment_id: questions.assessment_id,
      question_text: questions.question_text
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.question = Questions;
