import { redirect } from 'next/navigation';

/**
 * Legacy route kept for old links and product-page breadcrumbs:
 * category browsing lives on /products with a ?category= filter.
 */
export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/products?category=${encodeURIComponent(slug)}`);
}
