/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        swcPlugins: [["next-superjson-plugin", {}]],
    },
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "res.cloudinary.com",
            "avatars.githubusercontent.com",
        ],
    },
    eslint: {
        // Disable ESLint during production builds
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
