import Model from './Model';

export interface IncomingApiData {
  id: number;
  title: string;
  description: string;
  slug: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  title: string;
  description: string;
  is_published: boolean;
}

interface FormValue {
  title: string;
  description: string;
  is_published: boolean;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Assessments extends Model {
  constructor(
    public id: number,

    public title: string,
    public description: string,
    public slug: string,
    public is_published: boolean,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Assessments> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Assessments>;
    return new Assessments(apiData.id, apiData.title, apiData.description, apiData.slug, apiData.is_published, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Assessments>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(assessments: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(assessments)) return assessments.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      title: assessments.title,
      description: assessments.description,
      is_published: assessments.is_published
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.assessment = Assessments;
