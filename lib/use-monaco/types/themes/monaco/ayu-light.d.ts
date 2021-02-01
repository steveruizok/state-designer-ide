declare const _default: {
    base: string;
    inherit: boolean;
    rules: ({
        token: string;
        foreground: string;
        fontStyle?: undefined;
    } | {
        token: string;
        fontStyle: string;
        foreground?: undefined;
    } | {
        token: string;
        foreground: string;
        fontStyle: string;
    })[];
    colors: {
        'editor.background': string;
        'editor.foreground': string;
        'editorIndentGuide.background': string;
        'editorIndentGuide.activeBackground': string;
    };
};
export default _default;
