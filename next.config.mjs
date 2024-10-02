/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    webpack: (config) => {
        config.module.rules.push({
            test: /\.worker\.js$/,
            use: { loader: 'worker-loader' },
        });
        return config;
    },
};

export default nextConfig;
