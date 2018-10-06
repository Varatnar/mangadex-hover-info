import { MangaInfo } from "./MangaInfo";

export class InfoContainer {

    private readonly _mainContainer: HTMLDivElement;
    private readonly _image: HTMLImageElement;

    private currentDataUrl: string;

    public constructor(doc: HTMLDocument) {
        this._mainContainer = doc.createElement("div");
        this._mainContainer.classList.add("globalPopUp");

        this._image = doc.createElement("img");
        this._image.width = 200;
        this._mainContainer.appendChild(this._image);
        doc.body.appendChild(this._mainContainer);
    }

    public changeInfo(data: MangaInfo, sourcePath: string): void {
        this.currentDataUrl = sourcePath;
        this._image.src = data.imagePath || "";
    }

    public updatePosition(event: MouseEvent) {
        this._mainContainer.style.left = `${event.clientX + 10}px`;
        this._mainContainer.style.top = `${event.clientY + 10}px`;
    }

    public hide() {
        this._mainContainer.style.visibility = "hidden";
    }

    public show() {
        this._mainContainer.style.visibility = "visible";
    }

    public alreadyGoodData(element: HTMLLinkElement) {
        return element.href === this.currentDataUrl;
    }
}
