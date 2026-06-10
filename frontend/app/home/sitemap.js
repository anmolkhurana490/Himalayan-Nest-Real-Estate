export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

	return [
		{
			url: `${baseUrl}/home/about`,
			lastModified: new Date(),
		},
		{
			url: `${baseUrl}/home/contact`,
			lastModified: new Date(),
		},
	];
}