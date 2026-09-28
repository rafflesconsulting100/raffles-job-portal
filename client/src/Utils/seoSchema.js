// JSON-LD structured data builders for RafflesJobs.
// Imported by React pages (via useSeo / JobDetailPage) and by the build-time
// prerender plugin, so it must stay a dependency-free ES module.
//
// Rules followed here:
//   * Only facts that exist in the database or in the visible page are emitted.
//   * No invented statistics, salaries, expiry dates or keyword stuffing.
//   * Markup that cannot be derived reliably (e.g. ambiguous salary strings)
//     is omitted instead of guessed.

import { SITE_URL, SITE_NAME, jobPath, absoluteUrl } from './seoConfig.js';

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: 'Raffles Jobs',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/rafflelogo.png`,
  email: 'hr@rafflesconsulting.in',
  telephone: '+91-7397242159',
  address: {
    streetAddress: '24, Pavalam St, Veerappanchatram',
    addressLocality: 'Erode',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.linkedin.com/company/raffle-consulting-in/',
    'https://www.instagram.com/raffles_jobs',
  ],
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EmploymentAgency',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    sameAs: ORGANIZATION.sameAs,
    address: {
      '@type': 'PostalAddress',
      ...ORGANIZATION.address,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORGANIZATION.telephone,
      contactType: 'customer service',
      email: ORGANIZATION.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/jobs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** items: [{ name, path? }] — last entry is the current page (no path). */
export function breadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const listItems = items.map((item, index) => {
    const entry = {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
    };
    if (item.path) entry.item = canonical(item.path);
    return entry;
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

function canonical(path) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function faqSchema(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** ItemList of job landing pages (used on /jobs and category landing pages). */
export function jobItemListSchema(jobs, { name, url } = {}) {
  const list = (jobs || []).filter((job) => job && job.slug);
  if (list.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: name || 'Job openings',
    ...(url ? { url } : {}),
    numberOfItems: list.length,
    itemListElement: list.map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(jobPath(job.slug)),
      name: `${job.title} at ${job.company}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// JobPosting helpers
// ---------------------------------------------------------------------------

const EMPLOYMENT_TYPES = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACT',
  internship: 'INTERNSHIP',
};

// Only places we can identify from the location string itself are mapped to a
// country. Unknown locations simply omit addressCountry rather than guessing.
const INDIAN_PLACES = [
  'india',
  'chennai',
  'bangalore',
  'bengaluru',
  'mumbai',
  'delhi',
  'ncr',
  'hyderabad',
  'pune',
  'kolkata',
  'coimbatore',
  'kochi',
  'ernakulam',
  'thrissur',
  'malappuram',
  'malapuram',
  'trivandrum',
  'thiruvananthapuram',
  'kozhikode',
  'mysore',
  'mysuru',
  'hubli',
  'hubballi',
  'vellore',
  'velore',
  'erode',
  'tirunelveli',
  'madurai',
  'trichy',
  'tiruchirappalli',
  'salem',
  'tiruppur',
  'noida',
  'gurgaon',
  'gurugram',
  'ghaziabad',
  'faridabad',
  'jaipur',
  'ahmedabad',
  'indore',
  'bhopal',
  'ludhiana',
  'chandigarh',
  'nagpur',
  'surat',
  'vadodara',
  'patna',
  'guwahati',
  'bhubaneswar',
  'lucknow',
  'kanpur',
  'rajasthan',
  'gujarat',
  'maharashtra',
  'karnataka',
  'tamil nadu',
  'kerala',
  'telangana',
  'andhra pradesh',
  'west bengal',
  'punjab',
  'haryana',
  'uttar pradesh',
  'madhya pradesh',
  'bihar',
  'odisha',
  'assam',
  'goa',
  'jammu',
  'pan india',
];

function deriveCountry(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return undefined;
  return INDIAN_PLACES.some((place) =>
    new RegExp(`(^|[^a-z])${place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i').test(value)
  )
    ? 'India'
    : undefined;
}

const REMOTE_LOCATION_VALUES = /^(remote|work from home|wfh|anywhere|india)$/i;

function buildSingleLocation(rawLoc, jobType) {
  const raw = String(rawLoc || '').trim();
  if (!raw) return null;
  if (jobType === 'Remote' && REMOTE_LOCATION_VALUES.test(raw)) return null;

  const [locality, region] = raw.split(',').map((part) => part.trim()).filter(Boolean);
  const address = { '@type': 'PostalAddress', addressLocality: locality || raw };
  if (region && region !== locality) address.addressRegion = region;
  const country = deriveCountry(raw);
  if (country) address.addressCountry = country;

  return { '@type': 'Place', address };
}

export function buildJobLocation(job) {
  let rawList = [];
  if (Array.isArray(job.locations) && job.locations.length > 0) {
    rawList = job.locations;
  } else if (job.location) {
    rawList = String(job.location).split(/[|]/).map((s) => s.trim()).filter(Boolean);
  }
  if (rawList.length === 0) return null;

  const places = rawList
    .map((loc) => buildSingleLocation(loc, job.jobType))
    .filter(Boolean);

  if (places.length === 0) return null;
  return places.length === 1 ? places[0] : places;
}

/**
 * Parses salary text only when both a currency and a pay period are explicit.
 * Anything ambiguous (e.g. "17,000-20,000") returns null so we never publish
 * a wrong baseSalary.
 */
export function parseSalary(text) {
  const value = String(text || '').trim();
  if (!value) return null;

  const hasCurrency = /(₹|\brs\b|\binr\b)/i.test(value);
  // `\blpa\b` has to be listed explicitly: `p\.?\s*a\.?` can never start inside
  // the word "LPA" because there is no word boundary before the "P".
  const periodMatch = value.match(
    /\b(per\s*(month|annum|year|hour|day)|p\.?\s*a\.?|\blpa\b|monthly|yearly|annually|hourly)\b/i
  );
  if (!hasCurrency || !periodMatch) return null;

  const lower = value.toLowerCase();
  const rawPeriod = periodMatch[0].toLowerCase();
  let unitText = 'MONTH';
  if (/hour/.test(rawPeriod)) unitText = 'HOUR';
  else if (/day/.test(rawPeriod)) unitText = 'DAY';
  else if (/year|annum|p\.?\s*a\.?|\blpa\b|annually|yearly/.test(rawPeriod)) unitText = 'YEAR';
  else if (/month|monthly/.test(rawPeriod)) unitText = 'MONTH';

  // "1.2 LPA" means 1.2 lakh per year — publish the real amount, not 1.2.
  let multiplier = 1;
  if (/\bcrore|\bcr\b/.test(lower)) multiplier = 10000000;
  else if (/\blpa\b|\blakh/.test(lower)) multiplier = 100000;

  const values = (value.match(/\d[\d,]*(?:\.\d+)?/g) || [])
    .map((num) => parseFloat(num.replace(/,/g, '')) * multiplier)
    .filter((num) => !Number.isNaN(num));
  if (values.length === 0) return null;

  const quantValue = { '@type': 'QuantitativeValue', currency: 'INR', unitText };
  if (/up to/i.test(value)) {
    quantValue.maxValue = Math.max(...values);
  } else if (values.length === 1) {
    quantValue.value = values[0];
  } else {
    quantValue.minValue = Math.min(...values);
    quantValue.maxValue = Math.max(...values);
  }

  return { '@type': 'MonetaryAmount', currency: 'INR', value: quantValue };
}

const VENDOR_PATTERNS = [
  /special\s+vendor\s+payout/i,
  /vendor\s+payout/i,
  /vendors\s+please\s+prioritize/i,
  /share\s+maximum\s+(quality\s+)?lineups/i,
  /maximum\s+lineups/i,
  /special\s+payout\s+(for\s+)?successful\s+joining/i,
  /\bspoc\b\s*[:-]/i,
  /commercials\s*[:-]/i,
  /billing\s+payout/i,
];

function sanitizeJobText(text) {
  if (!text) return '';
  const lines = String(text).split('\n');
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return !VENDOR_PATTERNS.some((pattern) => pattern.test(trimmed));
  });
  return filtered.join('\n').trim();
}

function toPlainDescription(job) {
  const mainDesc = sanitizeJobText(job.cleanDescription || job.description);
  const sections = [mainDesc];
  if (Array.isArray(job.responsibilities) && job.responsibilities.length > 0) {
    sections.push(`Responsibilities:\n${job.responsibilities.map((r) => `- ${r}`).join('\n')}`);
  }
  if (Array.isArray(job.requirements) && job.requirements.length > 0) {
    sections.push(`Requirements:\n${job.requirements.map((r) => `- ${r}`).join('\n')}`);
  }
  if (Array.isArray(job.benefits) && job.benefits.length > 0) {
    sections.push(`Benefits:\n${job.benefits.map((b) => `- ${b}`).join('\n')}`);
  }
  if (job.incentives) {
    sections.push(`Incentives: ${job.incentives}`);
  }
  if (job.allowances) {
    sections.push(`Allowances: ${job.allowances}`);
  }
  if (job.shift) {
    sections.push(`Shift: ${job.shift}`);
  }
  if (job.weekOff) {
    sections.push(`Week Off: ${job.weekOff}`);
  }
  if (Array.isArray(job.preferredLanguages) && job.preferredLanguages.length > 0) {
    sections.push(`Languages: ${job.preferredLanguages.join(', ')}`);
  }
  if (job.numberOfOpenings != null) {
    sections.push(`Number of openings: ${job.numberOfOpenings}`);
  }
  return sections
    .filter(Boolean)
    .join('\n\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim();
}

function isoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Builds a schema.org JobPosting object, or null when the job must not be
 * advertised (closed / expired / incomplete) or when required data is missing.
 */
export function jobPostingSchema(job, { url } = {}) {
  if (!job) return null;

  // Check expiration & closed status
  const deadline = job.expiresAt || job.applicationDeadline || job.validThrough;
  const validThroughIso = isoDate(deadline);
  const isExpired = Boolean(
    job.status === 'closed' ||
    (validThroughIso && new Date(validThroughIso).getTime() < Date.now())
  );
  if (isExpired) return null;

  const title = String(job.title || '').trim();
  const description = toPlainDescription(job);
  const datePosted = isoDate(job.createdAt || job.postedDate);
  const hiringOrganization = String(job.company || '').trim();
  const jobLocation = buildJobLocation(job);

  if (!title || !description || !datePosted || !hiringOrganization) return null;
  // Google needs at least one location, or an explicit remote marker.
  if (!jobLocation && job.jobType !== 'Remote') return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted,
    hiringOrganization: { '@type': 'Organization', name: hiringOrganization },
    directApply: true,
    identifier: {
      '@type': 'PropertyValue',
      name: SITE_NAME,
      value: String(job._id || job.id || ''),
    },
  };

  if (validThroughIso) {
    data.validThrough = validThroughIso;
  }

  if (url) data.url = url;
  if (jobLocation) data.jobLocation = jobLocation;
  if (job.jobType === 'Remote') data.jobLocationType = 'TELECOMMUTE';

  const employmentType = EMPLOYMENT_TYPES[String(job.jobType || '').toLowerCase()];
  if (employmentType) data.employmentType = employmentType;

  if (job.minEducation) {
    data.educationRequirements = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: job.minEducation,
    };
  }

  if (job.experienceYears) {
    data.experienceRequirements = {
      '@type': 'OccupationallyDefinedExperience',
      description: job.experienceYears,
    };
  }

  if (Array.isArray(job.skills) && job.skills.length > 0) {
    data.skills = job.skills.join(', ');
  }

  const salary = parseSalary(job.salary);
  if (salary) data.baseSalary = salary;

  return data;
}

/** Serialises a schema object into an application/ld+json script body. */
export function serializeSchema(schema) {
  if (!schema) return '';
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
