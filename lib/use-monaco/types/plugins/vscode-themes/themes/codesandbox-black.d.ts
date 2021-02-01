declare const theme: {
    name: string;
    type: string;
    colors: any;
    tokenColors: ({
        name: string;
        scope: string[];
        settings: {
            foreground: string;
            fontStyle: string;
            background?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        name: string;
        scope: string[];
        settings: {
            foreground: string;
            fontStyle?: undefined;
            background?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        name: string;
        scope: string[];
        settings: {
            background: string;
            foreground: string;
            fontStyle?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        name: string;
        scope: string[];
        settings: {
            "text-decoration": string;
            foreground?: undefined;
            fontStyle?: undefined;
            background?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        name: string;
        scope: string[];
        settings: {
            "-webkit-font-smoothing": string;
            foreground?: undefined;
            fontStyle?: undefined;
            background?: undefined;
            "text-decoration"?: undefined;
        };
    } | {
        name: string;
        scope: string;
        settings: {
            foreground: string;
            fontStyle?: undefined;
            background?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        name: string;
        scope: string;
        settings: {
            foreground: string;
            fontStyle: string;
            background?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
    } | {
        scope: string;
        settings: {
            foreground: string;
            fontStyle?: undefined;
            background?: undefined;
            "text-decoration"?: undefined;
            "-webkit-font-smoothing"?: undefined;
        };
        name?: undefined;
    })[];
};
export default theme;
