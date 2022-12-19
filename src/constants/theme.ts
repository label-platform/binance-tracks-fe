import { Theme, createTheme } from '@mui/material';

export const theme: Theme = createTheme({
    palette: {
        primary: {
            main: '#674AE9',
            light: '#AA93F8',
            dark: '#150F2A',
        },
        error: {
            main: '#FF2606',
            light: '#AA93F8',
        },
        dark: {
            main: '#121212',
            light: '#2e2e2e',
        },
        light: {
            main: 'rgba(255, 255, 255, 0.87)',
            light: '#AA93F8',
        },
        warning: {
            main: '#F5ED17',
            light: '#AA93F8',
        },
        success: {
            main: '#00A264',
            light: '#AA93F8',
        },
        text: {
            disabled: 'rgba(255, 255, 255, 0.38)',
            secondary: 'rgba(255, 255, 255, 0.6)',
            primary: 'rgba(255, 255, 255, 0.87)',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 360,
            md: 600,
            lg: 900,
            xl: 120,
        },
    },
    typography: {
        fontSize: 16,
    },
    clesson: {
        grey: 'rgb(143, 143, 143)',
        main: '#121212',
        secondary: '#2E2E2E',
        metal: {
            outline:
                'conic-gradient(from 180deg at 50% 50%, #838383 -89.2deg, #868686 88.95deg, #FFFFFF 230.84deg, #838383 270.8deg, #868686 448.95deg)',
            inline: 'conic-gradient(from 180deg at 50% 50%, #A7A7A7 -103.91deg, #A9A9A9 0.9deg, #B9B9B9 23.66deg, #FAFAFA 46.31deg, #E2E2E2 60.2deg, #ABABAB 81.98deg, #AAAAAA 184.58deg, #BBBBBB 201.87deg, #F4F4F4 220.54deg, #DCDCDC 232.41deg, #A7A7A7 256.09deg, #A9A9A9 360.9deg)',
            border: `conic-gradient(
                from 180deg at 50% 50%,
                #838383 -89.2deg,
                #868686 88.95deg,
                #ffffff 257.84deg,
                #838383 270.8deg,
                #868686 448.95deg
            )`,
        },
        quality: {
            common: '#ababab',
            uncommon: '#00A264',
            rare: '#69A3FF',
            epic: '#C530D2',
            legendary: '#FF9838',
        },
        attribute: {
            comfort: 'rgba(195, 119, 255, 0.87)',
            efficiency: 'rgba(89, 178, 144, 0.87)',
            luck: 'rgba(225, 175, 0, 0.87)',
            resilience: 'rgba(255, 102, 56, 0.87)',
        },
    },
});
