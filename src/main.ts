import { InfoContainer } from "./InfoContainer";
import { MangaInfo } from "./MangaInfo";

const globalPopUp: InfoContainer = new InfoContainer(document);

let timeoutId: number;

/**
 * Given an url, find the info for the manga.
 *
 * @param mangaPath URL to manga page
 */
async function retrieveMangaInfoForManga(mangaPath: string): Promise<MangaInfo> {
    console.log(`Retrieving page ${mangaPath}`);

    try {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(await (await fetch(mangaPath)).text(), "text/html");
        const image: HTMLImageElement = htmlDocument.documentElement.querySelector("div.card-body > div > div > img");

        let description: string = "COULD NOT FIND DESCRIPTION !!";
        htmlDocument.documentElement.querySelectorAll("div.card-body > div > div > div").forEach((div: HTMLDivElement) => {
            if (div.querySelector("div:nth-child(1)").innerHTML.includes("Description")) {
                description = div.querySelector("div:nth-child(2)").innerHTML;
            }
        });

        return new MangaInfo(image.src, description);
    } catch (err) {
        console.log(err);
        throw new Error("Unexpected error");
    }
}

/**
 * Add event listener on all the page's manga link.
 */
function addOnMouseOver(): void {

    const selector = "div.chapter-container > div > div > a";

    document.querySelectorAll(selector).forEach((element: HTMLLinkElement) => {
        element.addEventListener("mouseover", (event) => {

            // Simily caching..
            if (globalPopUp.alreadyGoodData(element)) {
                globalPopUp.updatePosition(event);
                globalPopUp.show();
                return;
            }

            if (!timeoutId) {
                timeoutId = window.setTimeout(async () => {
                    globalPopUp.changeInfo(null, ""); // Removing image from tooltip
                    timeoutId = null;

                    globalPopUp.updatePosition(event);
                    globalPopUp.show();

                    globalPopUp.changeInfo((await retrieveMangaInfoForManga(element.href)), element.href);

                }, 1000);
            }

        });

        element.addEventListener("mouseout", () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                globalPopUp.hide();
            }
        });
    });
}

addOnMouseOver();
