<template>
    <div class="popup" id="mangadex-hover-popup" v-bind:style="popupStatus">
        <img class="manga-image" :src="manga.imagePath">
        <div class="manga-description">
            <span v-html="this.bbcodeFormat()"></span>
            <div class="tags-box">
                <p v-if="manga.tags.length > 0"><b>Tags :</b><br>
                    <span v-for="tag in manga.tags" class="tag-description badge">{{tag.name}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script src="./InfoVue.script.ts" lang="ts">
</script>

<style scoped>

    .manga-image {
        width: 200px;
        float: left;
        margin-right: 3px;
    }

    .popup {
        background-color: inherit;
        padding: 1px;
        border: 1px white solid;
        position: absolute;
        overflow: auto;
        width: 600px;
        z-index: 9999999;
    }

    div.manga-description {
        background-color: inherit;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 17;
        -webkit-box-orient: vertical;
    }

    .tags-box {
        float: bottom;
    }

    span.tag-description {
        background-color: #2b2b2b;
        border: solid 1px #676767;
    }

</style>
