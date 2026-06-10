export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    return [
        {
            // Static page
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            // Static Home pages
            url: `${baseUrl}/home/sitemap.xml`,
            lastModified: new Date(),
        },
        {
            // Dynamic Property Pages
            url: `${baseUrl}/properties/sitemap.xml`,
            lastModified: new Date(),
        },
    ];
}
