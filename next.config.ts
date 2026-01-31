import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-c862495e2a464bad971453f49478d349.r2.dev",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "76.13.135.206",
                port: "5000",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "connect-src 'self' https: http: ws: wss:; media-src 'self' blob: https:; default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: ws: wss: data: blob:;",
                    },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);
