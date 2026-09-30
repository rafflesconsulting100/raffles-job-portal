const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const User = require('./models/User');
const OTP = require('./models/OTP');
const Job = require('./models/Job');
const Application = require('./models/Application');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { ensureEmployerFields } = require('./utils/ensureEmployerFields');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use(errorHandler);

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

const results = [];

function recordResult(testNum, title, passed, details = '') {
  results.push({ testNum, title, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${mark} [Test ${testNum}] ${title} ${details ? '(' + details + ')' : ''}`);
}

async function runTests() {
  // Assigned only after listen() succeeds, so the finally guard (`if (server)`)
  // never calls close() on an undefined handle.
  let server = null;

  await connectDB();
  await ensureEmployerFields();

  server = app.listen(TEST_PORT);
  console.log(`Test server running on port ${TEST_PORT}\n========================================`);

  const uniqueSuffix = Date.now();
  const testEmail = `test_emp_${uniqueSuffix}@example.com`;
  const testMobile = `98${String(uniqueSuffix).slice(-8)}`;
  const testPassword = 'Password@123';
  const testCompany = `Raffles Acme Tech ${uniqueSuffix}`;
  const validOtp = '123456';

  let employerId = null;
  let employerToken = null;
  let adminToken = null;
  let createdJobId = null;

  try {
    // -------------------------------------------------------------
    // Test 1: Employer registers with valid Company Name + Mobile Number -> Account created as pending
    // --------------------------------------------------
    await OTP.deleteMany({ email: testEmail });
    await OTP.create({ email: testEmail, otp: validOtp });

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: testCompany,
        mobileNumber: testMobile,
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const regData = await regRes.json();
    const test1Passed =
      regRes.status === 201 &&
      regData.success &&
      regData.user.approvalStatus === 'pending' &&
      regData.user.companyName === testCompany &&
      regData.user.mobileNumber === `+91${testMobile}` &&
      regData.user.role === 'Employer';

    if (test1Passed) {
      employerId = regData.user._id;
      employerToken = regData.token;
    }
    recordResult(1, 'Employer registers with valid Company Name + Mobile Number -> Account created as pending', test1Passed, `Status: ${regRes.status}, approvalStatus: ${regData.user?.approvalStatus}`);

    // -------------------------------------------------------------
    // Test 2: Employer registers without Company Name -> Registration rejected
    // -------------------------------------------------------------
    const noCompanyEmail = `nocomp_${uniqueSuffix}@example.com`;
    await OTP.create({ email: noCompanyEmail, otp: validOtp });
    const noCompRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: '',
        username: '',
        mobileNumber: 'TEST_MOBILE_NUMBER',
        email: noCompanyEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const noCompData = await noCompRes.json();
    const test2Passed = noCompRes.status === 400 && noCompData.message?.includes('Company name is required');
    recordResult(2, 'Employer registers without Company Name -> Registration rejected', test2Passed, `HTTP ${noCompRes.status}: "${noCompData.message}"`);

    // -------------------------------------------------------------
    // Test 3: Employer registers without Mobile Number -> Registration rejected
    // -------------------------------------------------------------
    const noMobileEmail = `nomob_${uniqueSuffix}@example.com`;
    await OTP.create({ email: noMobileEmail, otp: validOtp });
    const noMobRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Some Company',
        mobileNumber: '',
        email: noMobileEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const noMobData = await noMobRes.json();
    const test3Passed = noMobRes.status === 400 && noMobData.message?.includes('Mobile number is required');
    recordResult(3, 'Employer registers without Mobile Number -> Registration rejected', test3Passed, `HTTP ${noMobRes.status}: "${noMobData.message}"`);

    // -------------------------------------------------------------
    // Test 4: Employer registers without accepting Terms -> Registration rejected
    // -------------------------------------------------------------
    const noTermsEmail = `noterms_${uniqueSuffix}@example.com`;
    await OTP.create({ email: noTermsEmail, otp: validOtp });
    const noTermsRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Terms Test Co',
        mobileNumber: 'TEST_MOBILE_NUMBER',
        email: noTermsEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: false,
        otp: validOtp,
      }),
    });
    const noTermsData = await noTermsRes.json();
    const test4Passed = noTermsRes.status === 400 && noTermsData.message?.includes('Terms');
    recordResult(4, 'Employer registers without accepting Terms -> Registration rejected', test4Passed, `HTTP ${noTermsRes.status}: "${noTermsData.message}"`);

    // -------------------------------------------------------------
    // Test 5: Existing email -> Duplicate registration rejected
    // -------------------------------------------------------------
    await OTP.create({ email: testEmail, otp: validOtp });
    const dupEmailRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Dup Email Co',
        mobileNumber: 'TEST_MOBILE_NUMBER',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const dupEmailData = await dupEmailRes.json();
    const test5Passed = dupEmailRes.status === 400 && dupEmailData.message?.includes('already registered');
    recordResult(5, 'Existing email -> Duplicate registration rejected', test5Passed, `HTTP ${dupEmailRes.status}: "${dupEmailData.message}"`);

    // -------------------------------------------------------------
    // Test 6: Pending Employer logs in -> Employer access blocked & Pending approval message shown
    // -------------------------------------------------------------
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json();
    const pendingToken = loginData.token;

    // Test attempting an employer action while pending:
    const postJobRes = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pendingToken}`,
      },
      body: JSON.stringify({
        title: 'Software Engineer',
        company: testCompany,
        location: 'Bengaluru',
        description: 'Great role',
      }),
    });
    const postJobData = await postJobRes.json();
    const test6Passed =
      postJobRes.status === 403 &&
      postJobData.message === 'Your employer account is pending Admin approval.';
    recordResult(6, 'Pending Employer logs in -> Employer access blocked & Pending approval message shown', test6Passed, `HTTP ${postJobRes.status}: "${postJobData.message}"`);

    // -------------------------------------------------------------
    // Test 7: Admin sees the Employer in Admin Dashboard (Company Name, Mobile Number, Email, Pending status visible)
    // -------------------------------------------------------------
    const adminLoginRes = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passkey: process.env.ADMIN_PASSKEY || 'RafflesAdmin@2026',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.token;

    const adminEmployersRes = await fetch(`${BASE_URL}/admin/employers`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminEmployersData = await adminEmployersRes.json();
    const foundEmp = adminEmployersData.employers?.find((e) => e._id === employerId);

    const test7Passed =
      foundEmp &&
      foundEmp.companyName === testCompany &&
      foundEmp.mobileNumber === `+91${testMobile}` &&
      foundEmp.email === testEmail &&
      foundEmp.approvalStatus === 'pending';
    recordResult(7, 'Admin sees Employer in Admin Dashboard (Company, Mobile, Email, Pending visible)', !!test7Passed, foundEmp ? `Found: ${foundEmp.companyName}, ${foundEmp.mobileNumber}, ${foundEmp.approvalStatus}` : 'Not found');

    // -------------------------------------------------------------
    // Test 8: Admin approves Employer -> Status becomes approved
    // -------------------------------------------------------------
    const approveRes = await fetch(`${BASE_URL}/admin/employers/${employerId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const approveData = await approveRes.json();
    const test8Passed =
      approveRes.status === 200 &&
      approveData.success &&
      approveData.employer?.approvalStatus === 'approved' &&
      approveData.employer?.status === 'Active' &&
      approveData.employer?.employerAccess === true &&
      approveData.employer?.isApproved === true;
    recordResult(8, 'Admin approves Employer -> Status becomes approved', test8Passed, `approvalStatus: ${approveData.employer?.approvalStatus}, status: ${approveData.employer?.status}`);

    // -------------------------------------------------------------
    // Test 9: Approved Employer logs in -> Employer Dashboard accessible
    // -------------------------------------------------------------
    const approvedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const approvedLoginData = await approvedLoginRes.json();
    const approvedToken = approvedLoginData.token;
    const test9Passed =
      approvedLoginRes.status === 200 &&
      approvedLoginData.user?.approvalStatus === 'approved' &&
      approvedLoginData.user?.isApproved === true;
    recordResult(9, 'Approved Employer logs in -> Employer Dashboard accessible', test9Passed, `approvalStatus: ${approvedLoginData.user?.approvalStatus}`);

    // -------------------------------------------------------------
    // Test 10: Approved Employer can use existing Employer functionality
    // -------------------------------------------------------------
    const createJobRes = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedToken}`,
      },
      body: JSON.stringify({
        title: `Full Stack Engineer ${uniqueSuffix}`,
        company: testCompany,
        location: 'Remote',
        description: 'Exciting development opportunities.',
        numberOfOpenings: 2,
        preferredLanguages: ['English', 'Hindi'],
      }),
    });
    const createJobData = await createJobRes.json();
    const test10Passed = createJobRes.status === 201 && createJobData.success && createJobData.job?._id;
    if (test10Passed) {
      createdJobId = createJobData.job._id;
    }
    recordResult(10, 'Approved Employer can use existing Employer functionality (Post Job)', !!test10Passed, `Job ID: ${createdJobId}`);

    // -------------------------------------------------------------
    // Test 11: Admin rejects Employer -> Employer access blocked
    // -------------------------------------------------------------
    const rejectEmail = `reject_${uniqueSuffix}@example.com`;
    const rejectMobile = `97${String(uniqueSuffix).slice(-8)}`;
    await OTP.create({ email: rejectEmail, otp: validOtp });
    const regReject = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Reject Co',
        mobileNumber: rejectMobile,
        email: rejectEmail,
        password: testPassword,
        confirmPassword: testPassword,
        role: 'Employer',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const regRejectData = await regReject.json();
    const rejectedEmployerId = regRejectData.user?._id;
    const rejectedEmployerToken = regRejectData.token;

    // Admin rejects
    const rejectRes = await fetch(`${BASE_URL}/admin/employers/${rejectedEmployerId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const rejectData = await rejectRes.json();

    // Check employer access blocked with exact rejected message
    const rejectedAttempt = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rejectedEmployerToken}`,
      },
      body: JSON.stringify({
        title: 'Job While Rejected',
        company: 'Reject Co',
        location: 'Remote',
        description: 'Test',
      }),
    });
    const rejectedAttemptData = await rejectedAttempt.json();
    const test11Passed =
      rejectData.employer?.approvalStatus === 'rejected' &&
      rejectedAttempt.status === 403 &&
      rejectedAttemptData.message === 'Your employer account registration was not approved.';
    recordResult(11, 'Admin rejects Employer -> Employer access blocked with rejected message', test11Passed, `HTTP ${rejectedAttempt.status}: "${rejectedAttemptData.message}"`);

    // -------------------------------------------------------------
    // Test 12: Admin revokes Employer -> Employer access blocked
    // -------------------------------------------------------------
    const revokeRes = await fetch(`${BASE_URL}/admin/employers/${employerId}/revoke`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const revokeData = await revokeRes.json();

    const revokedAttempt = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedToken}`,
      },
      body: JSON.stringify({
        title: 'Job While Revoked',
        company: testCompany,
        location: 'Remote',
        description: 'Test',
      }),
    });
    const revokedAttemptData = await revokedAttempt.json();
    const test12Passed =
      revokeData.employer?.approvalStatus === 'revoked' &&
      revokedAttempt.status === 403 &&
      revokedAttemptData.message === 'Your employer access has been revoked. Please contact RafflesJobs support.';
    recordResult(12, 'Admin revokes Employer -> Employer access blocked with revoked message', test12Passed, `HTTP ${revokedAttempt.status}: "${revokedAttemptData.message}"`);

    // -------------------------------------------------------------
    // Test 13: Employer cannot approve itself
    // -------------------------------------------------------------
    const selfApproveAdminRoute = await fetch(`${BASE_URL}/admin/employers/${employerId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedToken}`,
      },
    });
    const selfApproveData = await selfApproveAdminRoute.json();
    const test13Passed = selfApproveAdminRoute.status === 403;
    recordResult(13, 'Employer cannot approve itself via Admin API (403 Forbidden)', test13Passed, `HTTP ${selfApproveAdminRoute.status}: "${selfApproveData.message}"`);

    // -------------------------------------------------------------
    // Test 14: Employer cannot modify its own role
    // -------------------------------------------------------------
    const updateRoleAttempt = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedToken}`,
      },
      body: JSON.stringify({ role: 'Admin' }),
    });
    const updateRoleData = await updateRoleAttempt.json();
    const userInDbAfterRole = await User.findById(employerId);
    const test14Passed = userInDbAfterRole.role === 'Employer';
    recordResult(14, 'Employer cannot modify its own role (Role remains Employer)', test14Passed, `Role in DB: ${userInDbAfterRole.role}`);

    // -------------------------------------------------------------
    // Test 15: Employer cannot modify approvalStatus through frontend profile requests
    // -------------------------------------------------------------
    const updateApprovalAttempt = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedToken}`,
      },
      body: JSON.stringify({
        approvalStatus: 'approved',
        status: 'Active',
        isApproved: true,
        employerAccess: true,
      }),
    });
    const userInDbAfterApproval = await User.findById(employerId);
    const test15Passed = userInDbAfterApproval.approvalStatus === 'revoked';
    recordResult(15, 'Employer cannot modify approvalStatus through frontend requests (Status remains revoked)', test15Passed, `approvalStatus in DB: ${userInDbAfterApproval.approvalStatus}`);

    // -------------------------------------------------------------
    // Test 16: Admin authentication remains unchanged
    // -------------------------------------------------------------
    const test16Passed = !!adminToken && adminLoginData.user?.role === 'Admin';
    recordResult(16, 'Admin authentication remains unchanged', test16Passed, `Admin user: ${adminLoginData.user?.username}`);

    // -------------------------------------------------------------
    // Test 17: Job Seeker authentication remains unchanged
    // -------------------------------------------------------------
    const seekerEmail = `seeker_${uniqueSuffix}@example.com`;
    await OTP.create({ email: seekerEmail, otp: validOtp });
    const seekerRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Candidate John',
        email: seekerEmail,
        password: testPassword,
        role: 'Job Seeker',
        acceptedTerms: true,
        otp: validOtp,
      }),
    });
    const seekerRegData = await seekerRegRes.json();
    const seekerToken = seekerRegData.token;

    const seekerProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${seekerToken}` },
    });
    const seekerProfileData = await seekerProfileRes.json();
    const test17Passed =
      seekerRegRes.status === 201 &&
      seekerRegData.user?.role === 'Job Seeker' &&
      seekerProfileData.user?.role === 'Job Seeker';
    recordResult(17, 'Job Seeker authentication remains unchanged', !!test17Passed, `Seeker: ${seekerProfileData.user?.username}, role: ${seekerProfileData.user?.role}`);

    // -------------------------------------------------------------
    // Test 18: Job Seeker Google Login endpoints remain unchanged
    // -------------------------------------------------------------
    const googleLoginCheck = await fetch(`${BASE_URL}/auth/job-seeker/google/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'invalid_dummy_token' }),
    });
    const googleLoginData = await googleLoginCheck.json();
    const test18Passed = googleLoginCheck.status === 401 && googleLoginData.success === false;
    recordResult(18, 'Job Seeker Google Login endpoints remain unchanged', test18Passed, `HTTP ${googleLoginCheck.status}`);

    // -------------------------------------------------------------
    // Test 19: Employer Google Login does NOT exist
    // -------------------------------------------------------------
    const empGoogleRes = await fetch(`${BASE_URL}/auth/employer/google/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'token' }),
    });
    const test19Passed = empGoogleRes.status === 404;
    recordResult(19, 'Employer Google Login does NOT exist (404 Not Found)', test19Passed, `HTTP ${empGoogleRes.status}`);

    // Cleanup created test records
    await User.deleteMany({ email: { $in: [testEmail, noCompanyEmail, noMobileEmail, noTermsEmail, rejectEmail, seekerEmail] } });
    if (createdJobId) {
      await Job.deleteOne({ _id: createdJobId });
    }
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    console.log('\n========================================');
    const passedCount = results.filter((r) => r.passed).length;
    console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
  }
}

runTests().catch(async (err) => {
  // Failures outside the try/finally (DB connect, seed, listen) must still
  // release the DB connection and exit non-zero.
  console.error('Test suite failed:', err);
  try {
    await mongoose.disconnect();
  } catch (disconnectErr) {
    console.error('Failed to disconnect:', disconnectErr);
  }
  process.exitCode = 1;
});
