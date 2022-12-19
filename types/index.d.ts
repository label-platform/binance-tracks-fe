import '@emotion/react';
import { ThemeOptions, Theme as BaseTheme } from '@mui/system';
import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles/createPalette';
import { AnimatePresenceProps as EAnimatePresenceProps } from 'framer-motion';

declare global {
    interface Window {
        ReactNativeWebView: {
            postMessage: (value: string) => void;
        };
    }
}

type CustomPaletteColorOptions = {
    light?: string;
    main: string;
    dark?: string;
    contrastText?: string;
};

interface ExtendedPaletteOptions extends PaletteOptions {
    dark?: CustomPaletteColorOptions;
    light?: CustomPaletteColorOptions;
    primary?: CustomPaletteColorOptions;
    error?: CustomPaletteColorOptions;
    warning?: CustomPaletteColorOptions;
    success?: CustomPaletteColorOptions;
}

interface ExtendedThemeOptions extends Omit<ThemeOptions, 'palette'> {
    palette: ExtendedPaletteOptions;
    clesson: {
        grey: string;
        secondary: string;
        main: string;
        metal: {
            outline: string;
            inline: string;
            border: string;
        };
        quality: {
            common: string;
            uncommon: string;
            rare: string;
            epic: string;
            legendary: string;
        };
        attribute: {
            efficiency: string;
            luck: string;
            comfort: string;
            resilience: string;
        };
    };
}

interface ExtendedTheme extends BaseTheme {
    palette: ExtendedPaletteOptions;
    clesson: {
        grey: string;
        secondary: string;
        main: string;
        metal: {
            outline: string;
            inline: string;
            border: string;
        };
        quality: {
            common: string;
            uncommon: string;
            rare: string;
            epic: string;
            legendary: string;
        };
        attribute: {
            efficiency: string;
            luck: string;
            comfort: string;
            resilience: string;
        };
    };
}

declare module '@mui/material/styles' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends ExtendedTheme {}
    // allow configuration using `createTheme`
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface ThemeOptions extends ExtendedThemeOptions {}
}

declare module '@mui/material' {
    export function createTheme(options?: ExtendedThemeOptions, ...args: object[]): Theme;
}

declare module '@emotion/react' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends ExtendedThemeOptions {}
}

declare module 'framer-motion' {
    export interface AnimatePresenceProps extends EAnimatePresenceProps {
        children: JSX.Element;
    }
}

declare module '*.svg';
