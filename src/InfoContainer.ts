export class InfoContainer {

    private _mainContainer: HTMLDivElement;
    private image: HTMLImageElement;

    public constructor(doc: HTMLDocument) {
        this._mainContainer = doc.createElement("div");
        this._mainContainer.classList.add("globalPopUp");

        this.image = doc.createElement("img");
        this.image.width = 200;
        this._mainContainer.appendChild(this.image);
        doc.body.appendChild(this._mainContainer);
    }

    public changeImage(path: string): void {
        this.image.src = path;
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
}
