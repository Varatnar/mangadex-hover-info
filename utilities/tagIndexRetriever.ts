import * as fs from "fs";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { Tag } from "../src/models/Tag";

const tagsDataPath = "src/assets/tags.json";

// todo: add more constants/variables (less hardcoding)
(() => {
    fetch("https://mangadex.org/search")
        .then((response) => {
            return response.text();
        })
        .then(async (html) => {
            const tags: Tag[] = [];
            const pageContent: HTMLElement = new JSDOM(html).window.document.documentElement;

            // Step one retrieve every checkbox sections
            pageContent.querySelectorAll("div.custom-checkbox").forEach((element) => {

                let id: number;
                let name: string;

                // get the id
                id = parseInt(element.querySelector("input").getAttribute("value"), 10);

                // get the english name
                name = element.querySelector("label > span").textContent;

                // console.log(`Id [${id}] => Name [\"${name}\"]`);
                tags.push(new Tag(id, name));
            });

            tags.sort((a, b) => {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1;
                } else {
                    return 0;
                }
            });

            try {
                await fs.writeFileSync(tagsDataPath, JSON.stringify(tags, null, 2), "utf-8");
            } catch (error) {
                console.error(error);
            }
        });
})();
