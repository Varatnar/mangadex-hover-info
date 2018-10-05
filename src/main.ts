const globalPopUp: HTMLDivElement = document.createElement("div");
globalPopUp.classList.add("globalPopUp");
document.body.appendChild(globalPopUp);

const globalImage: HTMLImageElement = document.createElement("img");
globalImage.width = 200;
globalPopUp.appendChild(globalImage);

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
        element.addEventListener("mouseover", (event) => {

            globalPopUp.style.left = `${event.clientX + 10}px`;
            globalPopUp.style.top = `${event.clientY + 10}px`;

            globalPopUp.style.visibility = "visible";

            retrieveImagePathForManga(element.href).then((imagePath) => {
                globalImage.src = imagePath;
            });
        });

        element.addEventListener("mouseout", () => {
            globalPopUp.style.visibility = "hidden";
            globalImage.src = "";
        });
    });
}

addOnMouseOver();
