import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import useSeo from '../Utils/useSeo';

const sections = [
  {
    title: 'Information we collect',
    body: [
      'Account details you provide when you register: username, email address, mobile number and password. Phone numbers are verified with a one-time password (OTP).',
      'Profile information you add afterwards, including your resume, education and preferences. Resumes and avatar images are uploaded and stored by our media hosting provider, Cloudinary.',
      'Job applications you submit: your resume, cover letter and answers to employer screening questions.',
      'Job postings and company details published by employers.',
      'Basic technical data such as login sessions and device information used to keep your account secure.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'To create and manage your account and keep you signed in securely.',
      'To send your application, resume and screening answers to the employer who posted the job you applied for.',
      'To show employers the applications they receive and to let job seekers track their applications.',
      'To display job postings to candidates and to improve search, matching and the overall reliability of the service.',
      'To contact you about account activity, such as OTP verification or application updates.',
    ],
  },
  {
    title: 'Who can see your information',
    body: [
      'Employers can see the applications you submit to their job postings, including your resume and screening answers.',
      'Your profile is visible to employers according to your account settings.',
      'We use third-party service providers to operate the service — for example Google (sign-in) and Cloudinary (file storage). They receive only the data required to provide those services.',
    ],
  },
  {
    title: 'Cookies and local storage',
    body: [
      'We use a session cookie to keep you signed in, and browser local storage to remember your session and display saved jobs. You can clear cookies and local storage at any time through your browser settings, which will sign you out.',
    ],
  },
  {
    title: 'Data retention and your choices',
    body: [
      'Your information is kept for as long as your account is active or as needed to provide the service. You can request correction or deletion of your account data at any time by contacting us.',
      'Job seekers may withdraw an application from their dashboard. Employers may edit or remove their job postings at any time.',
    ],
  },
  {
    title: 'Security',
    body: [
      'Passwords are stored only as hashes, authentication sessions use signed tokens, and file uploads are handled over encrypted connections. No method of transmission is completely secure, so please contact us immediately if you suspect unauthorised access to your account.',
    ],
  },
];

export default function PrivacyPage() {
  useSeo({ path: '/privacy' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 text-[#1e293b]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-4 text-xs font-semibold text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-[#2B2A8C]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700">Privacy Policy</li>
          </ol>
        </nav>

        <header className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2B2A8C]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Privacy Policy</h1>
              <p className="text-xs font-semibold text-gray-500">
                How RafflesJobs handles your information
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            This policy explains what information we collect when you use
            RafflesJobs, why we collect it, and the choices you have. It applies
            to job seekers and employers using this website.
          </p>
        </header>

        <div className="mt-6 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-extrabold text-[#0F172A]">{section.title}</h2>
              <ul className="mt-3 space-y-3">
                {section.body.map((paragraph, index) => (
                  <li key={index} className="text-sm leading-7 text-gray-600">
                    {paragraph}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#0F172A]">Contact us</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              For questions about this policy or to request access to or deletion
              of your data, contact us:
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:hr@rafflesconsulting.in" className="hover:text-[#2B2A8C]">
                  hr@rafflesconsulting.in
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <a href="tel:+917397242159" className="hover:text-[#2B2A8C]">
                  +91 7397242159
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
                <span>24, Pavalam St, Veerappanchatram, Erode, Tamil Nadu</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
