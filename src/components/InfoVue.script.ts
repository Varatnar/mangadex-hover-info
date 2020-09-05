import { BBCodeParser } from '@varatnar/bbcode-parser/bin/BBCodeParser';
import { Component, Vue } from 'vue-property-decorator';
import { MangaInfo } from '../MangaInfo';

const parser = BBCodeParser.withDefault();

@Component
export default class InfoVueScript extends Vue {
    // basic init with empty manga
    public manga: MangaInfo = MangaInfo.withEmptyContent();

    // with default values
    public popupStatus: PopUpStatus = {
        top: '0px',
        left: '0px',
        visibility: 'hidden',
    };

    public changeManga(newManga: MangaInfo): void {
        this.manga = newManga;
    }

    public hide(): void {
        this.popupStatus.visibility = 'hidden';
    }

    public clearData(): void {
        this.manga = MangaInfo.withEmptyContent();
    }

    public moveLocationToElement(element: HTMLElement): void {
        this.popupStatus.left = `${
            (window.pageXOffset || document.documentElement.scrollLeft) +
            (element.parentElement?.getBoundingClientRect().left ?? 0) +
            (element.parentElement?.getBoundingClientRect().width ?? 0)
        }px`;
        this.popupStatus.top = `${
            (window.pageYOffset || document.documentElement.scrollTop) +
            (element.parentElement?.getBoundingClientRect().top ?? 0)
        }px`;
        this.popupStatus.visibility = 'visible';
    }

    private bbcodeFormat(): string {
        let outputString;

        try {
            outputString = parser.parse(this.manga.description);
        } catch (e) {
            console.log(e);
            outputString = this.manga.description;
        }

        return outputString;
    }
}

interface PopUpStatus {
    top: string;
    left: string;
    visibility: string;
}
