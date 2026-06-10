import propertyServerViewModel from "@/features/properties/viewmodel/propertyServerViewModel";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    const { getProperties } = propertyServerViewModel();

    // fetch all properties or implement pagination (upto 1000 listings)
    const pageCount = 10, pageLimit = 100;

    const items = [];
    for (let page = 1; page <= pageCount; page++) {
        const res = await getProperties({}, { page, limit: pageLimit });
        if (!res.success) continue;

        const propertiesData = res.properties.map(p => ({ id: p.id, updatedAt: p.updatedAt }));
        items.push(...propertiesData);

        if (page >= res.totalPages) break;
    }

    return items.filter(Boolean).map(p => ({
        url: `${baseUrl}/properties/${p.id}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8
    }));
}