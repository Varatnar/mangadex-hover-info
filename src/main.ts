import { Vue } from "vue-property-decorator";
import InfoVue from "./components/InfoVue.vue";
import { MangaInfo } from "./MangaInfo";
import { MangaModel } from "./models/api/MangaModel";
import InfoVueScript from "./components/InfoVue.script";

const BASE_MANGADEX_URL: string = "https://mangadex.org";
const BASE_API_URL: string = `${BASE_MANGADEX_URL}/api`;
const BASE_MANGA_API_URL: string = `${BASE_API_URL}/manga`;

let timeoutId: number;

const similyCacheMap: Map<any, MangaInfo> = new Map();

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

async function similyCacheControl(cacheKey: any): Promise<MangaInfo> {
    if (similyCacheMap.has(cacheKey)) {
        return similyCacheMap.get(cacheKey);
    } else {
        const retrievedManga: MangaInfo = await retrieveMangaInfoWithApiCall(extractMangaIdFromUrl(cacheKey));
        similyCacheMap.set(cacheKey, retrievedManga);
        return retrievedManga;
    }
}

// Adding mouse hover events
(() => {
    const vueContainer = document.createElement("div");
    vueContainer.id = "vueContainer";
    document.body.appendChild(vueContainer);

    const vueContainerWrapper = new Vue({
        render: (h) => h(InfoVue),
    }).$mount("#vueContainer");

    const vueContainerElement = vueContainerWrapper.$children[0] as InfoVueScript;

    const selector = "div.chapter-container > div > div > a";

    document.querySelectorAll(selector).forEach((element: HTMLLinkElement) => {
        element.addEventListener("mouseover", () => {

            if (!timeoutId) {
                timeoutId = window.setTimeout(async () => {
                    vueContainerElement.clearData();
                    timeoutId = null;

                    vueContainerElement.moveLocationToElement(element);

                    vueContainerElement.changeManga((await similyCacheControl(element.href)));

                }, 300); // todo: don't hard code this value
            }

        });

        element.addEventListener("mouseout", () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                vueContainerElement.hide();
            }
        });
    });

})();
