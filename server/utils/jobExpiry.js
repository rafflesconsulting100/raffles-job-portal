/**
 * Job postings carry an optional deadline (`expiresAt`) that the employer
 * form advertises as "the listing automatically expires after this date".
 * Nothing used to enforce it: expired jobs stayed in GET /api/jobs, in
 * /sitemap.xml and still accepted applications.
 *
 * `expiresAt: null` is the schema default, and a Mongo `{ field: null }`
 * predicate matches both explicit nulls and missing fields, so jobs without
 * a deadline are always included.
 */
const notExpiredCondition = () => ({
  $or: [
    { expiresAt: null },
    { expiresAt: { $gte: new Date() } },
  ],
});

/** True when a job has a deadline that is already in the past. */
const isExpired = (job) => {
  if (!job || !job.expiresAt) return false;
  const deadline = new Date(job.expiresAt).getTime();
  return Number.isNaN(deadline) ? false : deadline < Date.now();
};

module.exports = { notExpiredCondition, isExpired };
