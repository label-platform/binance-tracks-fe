module.exports = {
    i18n: {
        defaultLocale: 'kr',
        locales: ['en', 'kr'],
    },
    debug: process.env.NODE_ENV === 'development',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
