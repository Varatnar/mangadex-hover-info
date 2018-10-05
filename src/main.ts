import { InfoContainer } from "./InfoContainer";
import { MangaInfo } from "./MangaInfo";

const globalPopUp: InfoContainer = new InfoContainer(document);

let timeoutId: number;

/**
 * Given an url, find the image for the manga.
 *
 * @param mangaPath URL to manga page
 */
function retrieveMangaInfoForManga(mangaPath: string): Promise<MangaInfo> {
    console.log(`Retrieving page ${mangaPath}`);

    let imagePath: string;

    return fetch(mangaPath)
        .then((response) => response.text())
        .then((text) => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");
            const image: HTMLImageElement = htmlDocument.documentElement.querySelector("div.card-body > div > div > img");

            imagePath = image.src;

            console.log(imagePath);

            const descriptionTag: HTMLDivElement = htmlDocument.documentElement.querySelector("div.card-body > div > div > div:nth-child(9) >div:nth-child(2)");

            return new MangaInfo(imagePath, descriptionTag.innerHTML);
        })
        .catch((err) => {
            console.log(err);
            throw new Error("Unexpected error");
        });
}

/**
 * Add event listener on all the page's manga link.
 */
function addOnMouseOver(): void {

    const selector = "div.chapter-container > div > div > a";

    document.querySelectorAll(selector).forEach((element: HTMLLinkElement) => {
        element.addEventListener("mouseover", (event) => {

            if (!timeoutId) {
                timeoutId = window.setTimeout(() => {
                    timeoutId = null;

                    globalPopUp.updatePosition(event);
                    globalPopUp.show();

                    retrieveMangaInfoForManga(element.href).then((mangaInfo) => {
                        globalPopUp.changeImage(mangaInfo.imagePath);
                    });
                }, 1000);
            }

        });

        element.addEventListener("mouseout", () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                globalPopUp.hide();
                globalPopUp.changeImage(""); // Removing image from tooltip
            }
        });
    });
}

addOnMouseOver();
