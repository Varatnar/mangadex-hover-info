
/**
 * Given an url, find the image for the manga.
 *
 * @param mangaPath URL to manga page
 */
function retrieveImagePathForManga(mangaPath: string): Promise<string> {
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

            return imagePath;
        })
        .catch((err) => {
            console.log(err);
            throw new Error("Unexpected error");
        });
}

/**
 * Add event listener on all the page's manga link.
 */
function addOnMouseOver() {

    const selector = "div.chapter-container > div > div > a";

    document.querySelectorAll(selector).forEach((element: HTMLLinkElement) => {
        element.addEventListener("mouseover", () => {

            const image: HTMLImageElement = document.createElement("img");

            retrieveImagePathForManga(element.href).then((imagePath) => {
                image.src = imagePath;
                element.parentElement.appendChild(image);
            });
        });
    });
}

addOnMouseOver();
