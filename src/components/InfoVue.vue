<template>
    <div class="popup" id="mangadex-hover-popup" v-bind:style="popupStatus">
        <img width="200" :src="manga.imagePath">
        <div class="manga-description">
            <span>{{manga.description}}</span>
            <div>
                <span v-for="tag in manga.tags" class="tag-description badge">{{tag.name}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { MangaInfo } from "../MangaInfo";

    @Component
    export default class InfoVue extends Vue {

        // basic init with empty manga
        public manga: MangaInfo = new MangaInfo("", "No description", []);

        public popupStatus = {
            visibility: "visible",
            left: "0px",
            top: "0px"
        };

        public changeManga(newManga: MangaInfo) {
            this.manga = newManga;
        }

        public hide(): void {
            console.log("Hidding");
            this.popupStatus.visibility = "hidden";
        }

        public clearData() {
            this.manga = new MangaInfo("", "", []);
        }

        public moveLocationToElement(element: HTMLElement) {
            console.log("Chaging location");
            this.popupStatus.left = `${(window.pageXOffset || document.documentElement.scrollLeft) + element.parentElement.getBoundingClientRect().left + element.parentElement.getBoundingClientRect().width}px`;
            this.popupStatus.top = `${(window.pageYOffset || document.documentElement.scrollTop) + element.parentElement.getBoundingClientRect().top}px`;
            this.popupStatus.visibility = "visible";
        }
    };
</script>

<style scoped>

    .popup {
        background-color: inherit;
        position: absolute;
        width: 600px;
        height: 300px;
        z-index: 9999999;
    }

    div.manga-description {
        background-color: inherit;
        width: 390px;
        margin-left: 10px;
        float: right;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 17;
        -webkit-box-orient: vertical;
    }

    span.tag-description {
        background-color: #2b2b2b;
        border: solid 1px #676767;
    }

</style>
