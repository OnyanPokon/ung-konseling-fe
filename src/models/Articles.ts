import Model from './Model';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  thumbnail: string;
  status: 'publikasi' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  judul: string;
  konten: string;
  thumbnail: string;
  status: 'publikasi' | 'draft';
}

interface FormValue {
  _method?: 'PUT';
  title: string;
  content: string;
  thumbnail: string;
  status: 'publikasi' | 'draft';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Articles extends Model {
  constructor(
    public id: number,
    public title: string,
    public slug: string,
    public content: string,
    public thumbnail: string,
    public status: 'publikasi' | 'draft',
    public created_at: string,
    public udpated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Articles> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Articles>;
    return new Articles(apiData.id, apiData.judul, apiData.slug, apiData.konten, asset(apiData.thumbnail), apiData.status, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Articles>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(articles: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(articles)) return articles.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(articles._method ? { _method: articles._method } : {}),
      judul: articles.title,
      konten: articles.content,
      thumbnail: articles.thumbnail,
      status: articles.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.artikel = Articles;
