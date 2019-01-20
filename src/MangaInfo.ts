import * as tagsData from "./assets/tags.json";
import { Tag } from "./models/Tag";

export class MangaInfo {

    public static readonly data: Tag[] = tagsData as any;

    public static getTagForIndex(index: number): Tag {
        for (const tagData of MangaInfo.data) {
            if (tagData.id === index) {
                return tagData;
            }
        }

        throw new Error(`Could not find tag with index [${index}]`);
    }

    public static withEmptyContent() {
        return new MangaInfo("", "", []);
    }

    private readonly _imagePath: string;
    private readonly _description: string;
    private readonly _tags: Tag[];

    constructor(imgPath: string, desc: string, tags: number[]) {
        this._imagePath = imgPath;
        this._description = desc;
        this._tags = [];

        tags.forEach((tag) => {
            this._tags.push(MangaInfo.getTagForIndex(tag));
        });
    }

    public addTags(tags: Tag[]): void {
        tags.forEach((tag) => {
            this._tags.push(tag);
        });
    }

    get imagePath(): string {
        return this._imagePath;
    }

    get description(): string {
        return this._description;
    }

    get tags(): Tag[] {
        return this._tags;
    }
}
