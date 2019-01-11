import { MangaInfo } from "./MangaInfo";

export class InfoContainer {

    private readonly _mainContainer: HTMLDivElement;
    private readonly _image: HTMLImageElement;
    private readonly _description: HTMLSpanElement;

    private currentDataUrl: string;

    public constructor(doc: HTMLDocument) {
        this._mainContainer = doc.createElement("div");
        this._mainContainer.classList.add("globalPopUp");

        this._image = doc.createElement("img");
        this._image.width = 200;

        const descDiv = doc.createElement("div");
        descDiv.classList.add("manga-description");

        this._description = doc.createElement("span");

        descDiv.appendChild(this._description);

        this._mainContainer.appendChild(this._image);
        this._mainContainer.appendChild(descDiv);

        doc.body.appendChild(this._mainContainer);
    }

    public changeInfo(data: MangaInfo, sourcePath: string): void {
        this.currentDataUrl = sourcePath;
        this._image.src = data === null ? "" : data.imagePath;
        this._description.innerHTML = data === null ? "" : data.description;
    }

    public updatePosition(element: HTMLElement): InfoContainer {

        this._mainContainer.style.left = `${(window.pageXOffset || document.documentElement.scrollLeft) + element.parentElement.getBoundingClientRect().left + element.parentElement.getBoundingClientRect().width}px`;
        this._mainContainer.style.top = `${(window.pageYOffset || document.documentElement.scrollTop) + element.parentElement.getBoundingClientRect().top}px`;

        return this;
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
