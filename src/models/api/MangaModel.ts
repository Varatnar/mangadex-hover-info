export interface MangaModel {
    chapter: never;
    manga: MangaDataModel;
}

export interface MangaDataModel {
    artist: string;
    author: string;
    cover_url: string;
    description: string;
    genres: number[];
    hentai: number; // 0/1 seem to be the only possibilities but the payload is not an actual boolean, will leave as number for now
    lang_flag: string;
    lang_name: string;
    links: never;
    status: number;
    title: string;
}
