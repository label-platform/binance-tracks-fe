/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 추후 옵션 삭제
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        config.resolve.fallback = { fs: false, path: false };
        config.devtool = 'source-map';
        return config;
    },
    images: {
        domains: ['prod-tracks.s3.amazonaws.com'],
    },
    i18n,
};

module.exports = nextConfig;
