const User = require('../models/User');

async function ensureEmployerFields() {
  try {
    const employers = await User.find({ role: 'Employer' });
    if (!employers || employers.length === 0) return 0;

    let updatedCount = 0;
    for (const emp of employers) {
      let needsSave = false;

      // 1. Ensure companyName
      if (!emp.companyName && emp.username) {
        emp.companyName = emp.username;
        needsSave = true;
      }
      if (!emp.username && emp.companyName) {
        emp.username = emp.companyName;
        needsSave = true;
      }

      // 2. Ensure mobileNumber
      if (!emp.mobileNumber && emp.contactNumber) {
        emp.mobileNumber = emp.contactNumber;
        needsSave = true;
      }
      if (!emp.contactNumber && emp.mobileNumber) {
        emp.contactNumber = emp.mobileNumber;
        needsSave = true;
      }

      // 3. Ensure approvalStatus
      if (!emp.approvalStatus) {
        if (emp.status === 'Rejected') {
          emp.approvalStatus = 'rejected';
        } else if (emp.status === 'Pending' || emp.status === 'pending') {
          emp.approvalStatus = 'pending';
        } else if (emp.status === 'Suspended') {
          emp.approvalStatus = 'revoked';
        } else if (emp.status === 'Active' && emp.isApproved !== false && emp.employerAccess !== false) {
          emp.approvalStatus = 'approved';
        } else {
          emp.approvalStatus = 'pending';
        }
        needsSave = true;
      }

      if (needsSave) {
        await emp.save();
        updatedCount += 1;
      }
    }

    if (updatedCount > 0) {
      console.log(`Employer backfill: synchronized fields for ${updatedCount} employer(s)`);
    }
    return updatedCount;
  } catch (err) {
    console.error('Employer field backfill error:', err.message);
    return 0;
  }
}

module.exports = { ensureEmployerFields };
