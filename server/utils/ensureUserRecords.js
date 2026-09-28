const User = require('../models/User');

// The User schema keeps a sparse unique index on firebaseUid. MongoDB sparse
// indexes still index an explicit null (they only skip missing fields), so any
// legacy document that stores `firebaseUid: null` or `''` would collide with
// the next one and break registration with E11000. Strip those placeholders so
// the index behaves the way the schema intends.
async function ensureUserRecords() {
  try {
    const result = await User.collection.updateMany(
      { $or: [{ firebaseUid: null }, { firebaseUid: '' }] },
      { $unset: { firebaseUid: '' } }
    );

    const cleared = (result && result.modifiedCount) || 0;
    if (cleared > 0) {
      console.log(`User backfill: cleared empty firebaseUid on ${cleared} user(s)`);
    }
    return cleared;
  } catch (err) {
    console.error('User backfill error:', err.message);
    return 0;
  }
}

module.exports = { ensureUserRecords };
