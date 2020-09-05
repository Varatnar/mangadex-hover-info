declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module '*.json' {
    const value: never;
    export default value;
}
