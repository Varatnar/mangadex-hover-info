import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import { pipe } from 'ramda';
import { Tag } from '../src/models/Tag';

const tagsDataPath = 'src/assets/tags.json';

// todo: quick and dirty fix, change selector later
const ignoredTagName = [
    'Shounen',
    'Shoujo',
    'Seinen',
    'Josei',
    'Ongoing',
    'Completed',
    'Cancelled',
    'Hiatus',
];

const orderById = (array: Tag[]) => {
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

const removeUnwantedTag = (array: Tag[]) =>
    array.filter((tag) => !ignoredTagName.includes(tag.name));

const cleanupTags = pipe(orderById, removeUnwantedTag);

// todo: add more constants/variables (less hardcoding)
(async () => {
    if (process.argv.length < 3) {
        console.log('Need to pass a logged in search snapshot html file path');
    }

    const html = await fs.readFileSync(
        path.resolve(__dirname, process.argv[2])
    );

    let tags: Tag[] = [];

    const pageContent: HTMLElement = new JSDOM(html).window.document
        .documentElement;

    // Step one retrieve every checkbox sections
    pageContent.querySelectorAll('div.custom-checkbox').forEach((element) => {
        const potentialId = element
            .querySelector('input')
            ?.getAttribute('value');

        if (potentialId == null) {
            throw new Error('Unexpected id');
        }

        // get the id
        const id = parseInt(potentialId, 10);

        // get the english name
        const name =
            element.querySelector('label')?.textContent ?? 'error-name';

        if (name === 'error-name') {
            throw new Error(`Unexpected name for id ${id}`);
        }

        tags.push(new Tag(id, name));
    });

    tags = cleanupTags(tags);

    try {
        console.log(`${tags.length} tags will be saved...`);
        fs.writeFileSync(tagsDataPath, JSON.stringify(tags, null, 2), 'utf-8');
        console.log(`Tags saved to ${tagsDataPath}`);
    } catch (error) {
        console.error(error);
    }
})();
