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

export default class Screenings extends Model {
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Screenings> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Screenings>;
    return new Screenings(apiData.id, apiData.title, apiData.description, apiData.slug, apiData.is_published, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Screenings>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(screenings: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(screenings)) return screenings.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      title: screenings.title,
      description: screenings.description,
      is_published: screenings.is_published
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.screening = Screenings;
