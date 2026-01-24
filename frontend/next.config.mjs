/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                // For production image hosting domain (like Cloudinary, Imgix, etc.)
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
                port: '',
                pathname: '/**',
            },
            {
                // For Google profile images (e.g., OAuth avatars)
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '**',
            }
        ],
    },
    allowedDevOrigins: [process.env.NEXT_PUBLIC_CROSS_ORIGIN],
};

export default nextConfig;
