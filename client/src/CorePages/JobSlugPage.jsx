import React from 'react';
import { useParams } from 'react-router-dom';
import { categoryBySlug } from '../Utils/seoConfig';
import CategoryJobsPage from './CategoryJobsPage';
import JobDetailPage from './JobDetailPage';

/**
 * Resolves /jobs/:slug.
 * Category slugs are reserved in server/utils/slug.js, so a slug is either a
 * known category (-> category landing page) or a job (-> job detail page).
 * Head metadata is managed by the page component itself.
 */
export default function JobSlugPage() {
  const { slug } = useParams();
  const category = categoryBySlug(slug);

  if (category) {
    return <CategoryJobsPage category={category} />;
  }

  return <JobDetailPage slug={slug} />;
}
