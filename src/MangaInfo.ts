export class MangaInfo {

    private readonly _imagePath: string;
    private readonly _description: string;
    private readonly _tags: string[];

    constructor(imgPath: string, desc: string) {
        this._imagePath = imgPath;
        this._description = desc;
        this._tags = null;
    }

    public addTags(tags: string[]): void {
        tags.forEach((tag) => {
            tags.push(tag);
        });
    }

    get imagePath(): string {
        return this._imagePath;
    }

    get description(): string {
        return this._description;
    }

    get tags(): string[] {
        return this._tags;
    }
}
