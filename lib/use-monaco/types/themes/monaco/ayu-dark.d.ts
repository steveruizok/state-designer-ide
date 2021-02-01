declare const _default: {
    base: string;
    inherit: boolean;
    rules: ({
        token: string;
        foreground: string;
        fontstyle?: undefined;
    } | {
        token: string;
        fontstyle: string;
        foreground?: undefined;
    } | {
        token: string;
        foreground: string;
        fontstyle: string;
    })[];
    colors: {
        'editor.background': string;
        'editor.foreground': string;
        'editorIndentGuide.background': string;
        'editorIndentGuide.activeBackground': string;
    };
};
export default _default;
