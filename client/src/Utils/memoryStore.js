// In-Memory & Persistent Cache Memory Store Utility

const MEMORY_KEYS = {
  SAVED_JOBS: 'savedJobs',
  APPLIED_JOBS: 'appliedJobs',
  USER: 'user',
  TOKEN: 'token',
};

const cache = {
  savedJobs: null,
  appliedJobs: null,
  user: null,
};

export const getSavedJobs = () => {
  if (cache.savedJobs !== null) return cache.savedJobs;
  try {
    const data = localStorage.getItem(MEMORY_KEYS.SAVED_JOBS);
    cache.savedJobs = data ? JSON.parse(data) : [];
  } catch (e) {
    cache.savedJobs = [];
  }
  return cache.savedJobs;
};

export const saveJobToMemory = (jobId) => {
  const current = getSavedJobs();
  if (!current.includes(jobId)) {
    const updated = [...current, jobId];
    cache.savedJobs = updated;
    try {
      localStorage.setItem(MEMORY_KEYS.SAVED_JOBS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist saved job:", e);
    }
  }
};

export const removeSavedJobFromMemory = (jobId) => {
  const current = getSavedJobs();
  const updated = current.filter((id) => id !== jobId);
  cache.savedJobs = updated;
  try {
    localStorage.setItem(MEMORY_KEYS.SAVED_JOBS, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to remove saved job:", e);
  }
};

export const isJobSaved = (jobId) => {
  return getSavedJobs().includes(jobId);
};

export const getAppliedJobs = () => {
  if (cache.appliedJobs !== null) return cache.appliedJobs;
  try {
    const data = localStorage.getItem(MEMORY_KEYS.APPLIED_JOBS);
    cache.appliedJobs = data ? JSON.parse(data) : [];
  } catch (e) {
    cache.appliedJobs = [];
  }
  return cache.appliedJobs;
};

export const addAppliedJobToMemory = (jobId) => {
  const current = getAppliedJobs();
  if (!current.includes(jobId)) {
    const updated = [...current, jobId];
    cache.appliedJobs = updated;
    try {
      localStorage.setItem(MEMORY_KEYS.APPLIED_JOBS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist applied job:", e);
    }
  }
};

export const hasAppliedToJob = (jobId) => {
  return getAppliedJobs().includes(jobId);
};

// Bookmarks/applied markers are per-account. Clearing them on logout (and
// whenever a different account signs in) stops the previous user's saved jobs
// from showing up on the public homepage and for the next login.
export const clearSessionMemory = () => {
  cache.savedJobs = [];
  cache.appliedJobs = [];
  try {
    localStorage.removeItem(MEMORY_KEYS.SAVED_JOBS);
    localStorage.removeItem(MEMORY_KEYS.APPLIED_JOBS);
  } catch (e) {
    console.error("Failed to clear session memory:", e);
  }
};

export const syncSessionMemory = (nextUser) => {
  const nextId = nextUser && (nextUser._id || nextUser.id);
  if (!nextId) return;

  try {
    const raw = localStorage.getItem(MEMORY_KEYS.USER);
    const previousUser = raw ? JSON.parse(raw) : null;
    const previousId = previousUser && (previousUser._id || previousUser.id);
    if (previousId && String(previousId) !== String(nextId)) {
      clearSessionMemory();
    }
  } catch (e) {
    // A malformed stored user means we cannot prove it is the same account —
    // treat it as a different one.
    clearSessionMemory();
  }
};
