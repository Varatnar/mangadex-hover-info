import { InfoContainer } from "./InfoContainer";
import { MangaInfo } from "./MangaInfo";
import { MangaModel } from "./models/api/MangaModel";

const globalPopUp: InfoContainer = new InfoContainer(document);

const BASE_MANGADEX_URL: string = "https://mangadex.org";
const BASE_API_URL: string = `${BASE_MANGADEX_URL}/api`;
const BASE_MANGA_API_URL: string = `${BASE_API_URL}/manga`;

let timeoutId: number;

/**
 * Given an url, find the info for the manga.
 *
 * @param mangaPath URL to manga page
 * @deprecated
 */
async function retrieveMangaInfoForManga(mangaPath: string): Promise<MangaInfo> {
    console.log(`Retrieving page ${mangaPath}`);

    try {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(await (await fetch(mangaPath)).text(), "text/html");
        const image: HTMLImageElement = htmlDocument.documentElement.querySelector("div.card-body > div > div > a > img");

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
 * Given a manga id, find the info for the manga.
 *
 * @param mangaId Id of manga
 */
async function retrieveMangaInfoWithApiCall(mangaId: string): Promise<MangaInfo> {
    console.log(`Retrieving manga info with id [${mangaId}]`);

    try {
        const mangaData: MangaModel = await(await fetch(`${BASE_MANGA_API_URL}/${mangaId}`)).json();

        console.log(mangaData);

        return new MangaInfo(mangaData.manga.cover_url, mangaData.manga.description);

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
        element.addEventListener("mouseover", () => {

            // Simily caching..
            if (globalPopUp.alreadyGoodData(element)) {
                globalPopUp.updatePosition(element)
                    .show();
                return;
            }

            if (!timeoutId) {
                timeoutId = window.setTimeout(async () => {
                    globalPopUp.changeInfo(null, ""); // Removing image from tooltip
                    timeoutId = null;

                    globalPopUp.updatePosition(element)
                        .show();

                    globalPopUp.changeInfo((await retrieveMangaInfoWithApiCall(extractMangaIdFromUrl(element.href))), element.href);

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

function extractMangaIdFromUrl(mangaUrl: string): string {
    const splitUrl = mangaUrl.split("/");
    return splitUrl[splitUrl.length - 2];
}

addOnMouseOver();
