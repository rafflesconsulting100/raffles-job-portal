const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');

dotenv.config({ path: './.env' });

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

const {
  registerToken,
  removeToken,
  getNotifications,
  notifyJobSeekersAboutNewJob,
  notifyEmployerAboutApplication,
} = require('./controllers/notificationController');

async function runNotificationTests() {
  await connectDB();
  console.log('--- STARTING NOTIFICATION END-TO-END VERIFICATION ---');

  const ts = Date.now();

  // Clean up any test users from previous runs
  await User.deleteMany({ email: /@testnotif\.com$/ });

  // 1. Create Employer A
  const employerA = await User.create({
    username: `EmpA_${ts}`,
    email: `empa_${ts}@testnotif.com`,
    password: 'Password123!',
    role: 'Employer',
    companyName: `CompanyA_${ts}`,
    status: 'Active',
    isApproved: true,
    employerAccess: true,
  });

  // 2. Create Job Seeker B
  const seekerB = await User.create({
    username: `SeekerB_${ts}`,
    email: `seekerb_${ts}@testnotif.com`,
    password: 'Password123!',
    role: 'Job Seeker',
    status: 'Active',
    deviceTokens: [{ token: `fcm_token_seeker_b_${ts}`, createdAt: new Date(), deviceType: 'android' }],
  });

  // 3. Create Job Seeker C
  const seekerC = await User.create({
    username: `SeekerC_${ts}`,
    email: `seekerc_${ts}@testnotif.com`,
    password: 'Password123!',
    role: 'Job Seeker',
    status: 'Active',
    deviceTokens: [{ token: `fcm_token_seeker_c_${ts}`, createdAt: new Date(), deviceType: 'android' }],
  });

  // 4. Create Unrelated Employer D
  const employerD = await User.create({
    username: `EmpD_${ts}`,
    email: `empd_${ts}@testnotif.com`,
    password: 'Password123!',
    role: 'Employer',
    companyName: `CompanyD_${ts}`,
    status: 'Active',
    isApproved: true,
    employerAccess: true,
  });

  console.log('✅ Created test users (Employer A, Seeker B, Seeker C, Employer D)');

  // -------------------------------------------------------------
  // TEST A: Employer Posts Job -> Notify Both Job Seekers
  // -------------------------------------------------------------
  const job = await Job.create({
    title: `Senior Engineer ${ts}`,
    company: employerA.companyName,
    creator: employerA._id,
    description: 'Great engineering job',
    location: 'Remote',
    category: 'IT',
    status: 'active',
  });

  console.log('✅ Employer A published job:', job._id);

  // Trigger notification
  const jobNotifyResult = await notifyJobSeekersAboutNewJob(job);
  console.log('Job notify result:', jobNotifyResult);

  // Check persistent notifications for Seeker B
  const seekerBNotifs = await Notification.find({
    recipient: seekerB._id,
    type: 'new_job',
    relatedJob: job._id,
  });
  if (seekerBNotifs.length !== 1) {
    throw new Error(`Seeker B should have exactly 1 notification, found: ${seekerBNotifs.length}`);
  }
  console.log('✅ Seeker B received persistent new_job notification for job', job._id);

  // Check persistent notifications for Seeker C
  const seekerCNotifs = await Notification.find({
    recipient: seekerC._id,
    type: 'new_job',
    relatedJob: job._id,
  });
  if (seekerCNotifs.length !== 1) {
    throw new Error(`Seeker C should have exactly 1 notification (CRITICAL BUG FIX: duplicate key error across multiple seekers), found: ${seekerCNotifs.length}`);
  }
  console.log('✅ Seeker C ALSO received persistent new_job notification (duplicate key error fixed!)');

  // Verify Employer A does NOT have a new_job notification
  const empANotifs = await Notification.find({
    recipient: employerA._id,
    relatedJob: job._id,
  });
  if (empANotifs.length !== 0) {
    throw new Error('Employer should not receive job notification for own job');
  }
  console.log('✅ Employer A did not receive self-notification');

  // Test Deduplication: Retrying notifyJobSeekersAboutNewJob should not duplicate
  const retryResult = await notifyJobSeekersAboutNewJob(job);
  const seekerBNotifsAfterRetry = await Notification.find({
    recipient: seekerB._id,
    type: 'new_job',
    relatedJob: job._id,
  });
  if (seekerBNotifsAfterRetry.length !== 1) {
    throw new Error(`Seeker B notifications duplicated on retry! Found: ${seekerBNotifsAfterRetry.length}`);
  }
  console.log('✅ Idempotency verified: Retrying job notification did not create duplicates');

  // -------------------------------------------------------------
  // TEST B: Job Seeker B Applies -> Notify Employer A Only
  // -------------------------------------------------------------
  const application = await Application.create({
    job: job._id,
    applicant: seekerB._id,
    resume: 'https://example.com/resume.pdf',
    resumeOriginalName: 'resume.pdf',
    status: 'pending',
  });
  console.log('✅ Seeker B applied for job:', application._id);

  const populatedApp = await Application.findById(application._id)
    .populate('job')
    .populate('applicant', 'username');

  const appNotifyResult = await notifyEmployerAboutApplication(populatedApp);
  console.log('App notify result:', appNotifyResult);

  // Verify Employer A received persistent new_application notification
  const empAAppNotifs = await Notification.find({
    recipient: employerA._id,
    type: 'new_application',
    relatedApplication: application._id,
  });
  if (empAAppNotifs.length !== 1) {
    throw new Error(`Employer A should have 1 new_application notification, found: ${empAAppNotifs.length}`);
  }
  console.log('✅ Employer A received persistent new_application notification with correct job & application ID');
  if (empAAppNotifs[0].relatedJob.toString() !== job._id.toString()) {
    throw new Error('relatedJob on notification mismatch');
  }

  // Verify Unrelated Employer D did NOT receive notification
  const empDAppNotifs = await Notification.find({
    recipient: employerD._id,
    type: 'new_application',
    relatedApplication: application._id,
  });
  if (empDAppNotifs.length !== 0) {
    throw new Error('Unrelated Employer D received application notification!');
  }
  console.log('✅ Recipient isolation verified: Unrelated Employer D received 0 notifications');

  // Verify Job Seeker B did NOT receive application notification
  const seekerBAppNotifs = await Notification.find({
    recipient: seekerB._id,
    type: 'new_application',
  });
  if (seekerBAppNotifs.length !== 0) {
    throw new Error('Candidate received employer notification!');
  }
  console.log('✅ Candidate did not receive employer notification');

  // -------------------------------------------------------------
  // TEST C: FCM Token Registration & Cross-Account Switching
  // -------------------------------------------------------------
  const sharedDeviceToken = `device_shared_phone_${ts}`;

  // Seeker B registers sharedDeviceToken
  const mockReq1 = {
    user: { id: seekerB._id.toString() },
    body: { token: sharedDeviceToken },
  };
  let mockRes1Status = null;
  let mockRes1Json = null;
  const mockRes1 = {
    status: (s) => { mockRes1Status = s; return mockRes1; },
    json: (j) => { mockRes1Json = j; return mockRes1; },
  };
  await registerToken(mockReq1, mockRes1, (err) => { if (err) throw err; });

  const updatedSeekerB = await User.findById(seekerB._id);
  const hasTokenB = updatedSeekerB.deviceTokens.some(t => (t.token || t) === sharedDeviceToken);
  if (!hasTokenB) {
    throw new Error('Seeker B failed to register device token');
  }
  console.log('✅ Device token registered for Seeker B');

  // Now Employer A logs in on the SAME device and registers sharedDeviceToken
  const mockReq2 = {
    user: { id: employerA._id.toString() },
    body: { token: sharedDeviceToken },
  };
  const mockRes2 = {
    status: () => mockRes2,
    json: () => mockRes2,
  };
  await registerToken(mockReq2, mockRes2, (err) => { if (err) throw err; });

  const refreshedSeekerB = await User.findById(seekerB._id);
  const seekerBStillHasToken = refreshedSeekerB.deviceTokens.some(t => (t.token || t) === sharedDeviceToken);
  if (seekerBStillHasToken) {
    throw new Error('CRITICAL FLAW: Old account still retains device token after account switch on same phone!');
  }
  console.log('✅ Cross-account protection verified: Device token disassociated from Seeker B when Employer A logged in');

  const refreshedEmployerA = await User.findById(employerA._id);
  const empAHasToken = refreshedEmployerA.deviceTokens.some(t => (t.token || t) === sharedDeviceToken);
  if (!empAHasToken) {
    throw new Error('Employer A should have device token');
  }
  console.log('✅ Device token correctly associated with new account (Employer A)');

  // Test token removal on logout
  const mockReqLogout = {
    user: { id: employerA._id.toString() },
    body: { token: sharedDeviceToken },
  };
  await removeToken(mockReqLogout, mockRes2, (err) => { if (err) throw err; });
  const loggedOutEmpA = await User.findById(employerA._id);
  const empAStillHasToken = loggedOutEmpA.deviceTokens.some(t => (t.token || t) === sharedDeviceToken);
  if (empAStillHasToken) {
    throw new Error('Token was not removed on logout!');
  }
  console.log('✅ Token successfully removed on logout');

  // Clean up test documents
  await Notification.deleteMany({ relatedJob: job._id });
  await Application.deleteMany({ job: job._id });
  await Job.deleteMany({ _id: job._id });
  await User.deleteMany({ email: /@testnotif\.com$/ });

  console.log('\n========================================');
  console.log('🎉 ALL END-TO-END NOTIFICATION TESTS PASSED!');
  console.log('========================================\n');
  process.exit(0);
}

runNotificationTests().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
