import { Vue } from "vue-property-decorator";
import InfoVue from "./components/InfoVue.vue";
import { MangaInfo } from "./MangaInfo";
import { MangaModel } from "./models/api/MangaModel";

const BASE_MANGADEX_URL: string = "https://mangadex.org";
const BASE_API_URL: string = `${BASE_MANGADEX_URL}/api`;
const BASE_MANGA_API_URL: string = `${BASE_API_URL}/manga`;

let timeoutId: number;

/**
 * Given a manga id, find the info for the manga.
 *
 * @param mangaId Id of manga
 */
async function retrieveMangaInfoWithApiCall(mangaId: string): Promise<MangaInfo> {
    console.log(`Retrieving manga info with id [${mangaId}]`);

    try {
        const mangaData: MangaModel = await (await fetch(`${BASE_MANGA_API_URL}/${mangaId}`)).json();

        return new MangaInfo(mangaData.manga.cover_url, mangaData.manga.description, mangaData.manga.genres);

    } catch (err) {
        console.log(err);
        throw new Error("Unexpected error");
    }
}

function extractMangaIdFromUrl(mangaUrl: string): string {
    const splitUrl = mangaUrl.split("/");
    return splitUrl[splitUrl.length - 2];
}

// Adding mouse hover events
(() => {
    const vueContainer = document.createElement("div");
    vueContainer.id = "vueContainer";
    document.body.appendChild(vueContainer);

    const vueContainerWrapper = new Vue({
        render: (h) => h(InfoVue),
    }).$mount("#vueContainer");

    const vueContainerElement = vueContainerWrapper.$children[0];

    const selector = "div.chapter-container > div > div > a";

    document.querySelectorAll(selector).forEach((element: HTMLLinkElement) => {
        element.addEventListener("mouseover", () => {

            if (!timeoutId) {
                timeoutId = window.setTimeout(async () => {
                    // @ts-ignore
                    vueContainerElement.clearData();
                    timeoutId = null;

                    // @ts-ignore
                    vueContainerElement.moveLocationToElement(element);

                    // @ts-ignore
                    vueContainerElement.changeManga((await retrieveMangaInfoWithApiCall(extractMangaIdFromUrl(element.href))));

                }, 300); // todo: don't hard code this value
            }

        });

        element.addEventListener("mouseout", () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                // @ts-ignore
                vueContainerElement.hide();
            }
        });
    });

})();
