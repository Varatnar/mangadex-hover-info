import * as fs from "fs";
import { JSDOM } from "jsdom";
import * as path from "path";
import { pipe } from "ramda";
import { Tag } from "../src/models/Tag";

const tagsDataPath = "src/assets/tags.json";

// todo: quick and dirty fix, change selector later
const ignoredTagName = [
    "Shounen",
    "Shoujo",
    "Seinen",
    "Josei",
    "Ongoing",
    "Completed",
    "Cancelled",
    "Hiatus",
];

const orderById = (array: any[]) => {
    return array.sort((a, b) => {
        if (a.id > b.id) {
            return 1;
        } else if (a.id < b.id) {
            return -1;
        } else {
            return 0;
        }
    });
};

const removeUnwantedTag = (array: any[]) => array.filter((tag) => !ignoredTagName.includes(tag.name));

const cleanupTags = pipe(orderById, removeUnwantedTag);

// todo: add more constants/variables (less hardcoding)
(async () => {

    if (process.argv.length < 3) {
        console.log("Need to pass a logged in search snapshot html file path");
    }

    const html = await fs.readFileSync(path.resolve(__dirname, process.argv[2]));

    let tags: Tag[] = [];

    const pageContent: HTMLElement = new JSDOM(html).window.document.documentElement;

    // Step one retrieve every checkbox sections
    pageContent.querySelectorAll("div.custom-checkbox")
               .forEach((element) => {
                   let id: number;
                   let name: string;

                   // get the id
                   id = parseInt(element.querySelector("input").getAttribute("value"), 10);

                   // get the english name
                   name = element.querySelector("label").textContent;

                   tags.push(new Tag(id, name));
               });

    tags = cleanupTags(tags);

    try {
        console.log(`${tags.length} tags will be saved...`);
        fs.writeFileSync(tagsDataPath, JSON.stringify(tags, null, 2), "utf-8");
        console.log(`Tags saved to ${tagsDataPath}`);
    } catch (error) {
        console.error(error);
    }

})();
