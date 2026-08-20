"use client"

import React, { useState } from 'react';

interface PrivacySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const privacyData: PrivacySection[] = [
  {
    id: 'sec-1',
    title: '1. Information We Collect',
    content: (
      <>
        <p className="mb-4">
          Depending on how you use Toastrelay, we may collect the following information:
        </p>

        <h4 className="font-semibold text-gray-900 mb-2">1.1 Account Information</h4>
        <p className="mb-2">When you create an account, we may collect:</p>
        <ul className="list-disc pl-5 space-y-1 mb-6">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Password or authentication information</li>
          <li>Profile information</li>
          <li>Account preferences</li>
          <li>Information necessary to verify or secure your account</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">1.2 Event Information</h4>
        <p className="mb-2">When you create or manage an event, we may collect information such as:</p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Event name and description</li>
          <li>Event date, time, location, or venue</li>
          <li>Event category, images, and branding</li>
          <li>Ticket information and RSVP settings</li>
          <li>Guest, attendee information, and event schedule</li>
        </ul>
        <p className="mb-6">
          Some event information may be publicly displayed when you choose to make your event discoverable.
        </p>

        <h4 className="font-semibold text-gray-900 mb-2">1.3 Attendee and Guest Information</h4>
        <p className="mb-2">
          When you RSVP to, register for, or purchase a ticket to an event, we may collect information provided by you or required by the event organizer, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Name, email address, and phone number</li>
          <li>Ticket information and RSVP status</li>
          <li>Guest information and event preferences</li>
        </ul>
        <p className="mb-6">
          Organizers are responsible for ensuring that any additional information they request through Toastrelay is appropriate and lawful.
        </p>

        <h4 className="font-semibold text-gray-900 mb-2">1.4 Payment Information</h4>
        <p className="mb-2">
          When you make a payment through Toastrelay, payment information may be processed by third-party providers (such as Paystack). Toastrelay does not generally store your complete payment card details. We may receive details such as:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-6">
          <li>Transaction reference, amount paid, and currency</li>
          <li>Payment status, channel, and method information</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">1.5 Host and Payout Information</h4>
        <p className="mb-2">
          Organizers who receive funds may be required to provide information necessary for processing payouts, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-6">
          <li>Bank account details, bank name, and account name</li>
          <li>Business or identity verification information where required</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">1.6 Content You Upload</h4>
        <p className="mb-2">
          Toastrelay allows you to upload photos, videos, documents, profile images, and messages. You are responsible for ensuring you have the necessary rights to upload this content.
        </p>

        <h4 className="font-semibold text-gray-900 mb-2 pt-4">1.7 Technical Information</h4>
        <p className="mb-2">We automatically collect technical data to operate and secure the platform, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address and approximate location</li>
          <li>Browser, device type, and operating system</li>
          <li>Pages accessed, session info, errors, and usage metrics</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sec-2',
    title: '2. How We Use Your Information',
    content: (
      <>
        <p className="mb-4">We use personal information to:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Create and manage user accounts and provide Toastrelay services</li>
          <li>Process RSVPs, registrations, ticket sales, contributions, and payouts</li>
          <li>Send transaction details, updates, and event-related communications</li>
          <li>Provide customer support, troubleshoot, and maintain security</li>
          <li>Prevent fraud, abuse, and enforce our Terms of Use</li>
          <li>Comply with legal obligations and analyze platform performance</li>
        </ul>
        <p>We may also use aggregated or de-identified information for analytics and service improvement.</p>
      </>
    ),
  },
  {
    id: 'sec-3',
    title: '3. Public Event Information',
    content: (
      <p>
        Depending on the organizer&apos;s settings, publicly visible event details may include the event name, description, date, venue, ticket details, images, and organizer information. Organizers must not publish sensitive personal information about guests without permission.
      </p>
    ),
  },
  {
    id: 'sec-4',
    title: '4. Information Shared With Event Organizers',
    content: (
      <p>
        When you register for or interact with an event, relevant details are shared with the organizer to manage attendance, tickets, or communications. Organizers must use this information solely for legitimate event purposes and are prohibited from selling attendee data.
      </p>
    ),
  },
  {
    id: 'sec-5',
    title: '5. Service Providers',
    content: (
      <p>
        We rely on trusted third-party providers (such as Paystack for payment processing, along with cloud storage, email delivery, hosting, analytics, and security services) to operate Toastrelay securely.
      </p>
    ),
  },
  {
    id: 'sec-6',
    title: '6. Payments',
    content: (
      <p>
        Payments are processed by third-party providers and are subject to their terms. Transaction details are used to confirm purchases, issue tickets, handle payouts, process refunds, and prevent fraud. Toastrelay may delay or review suspicious transactions.
      </p>
    ),
  },
  {
    id: 'sec-7',
    title: '7. Cookies and Similar Technologies',
    content: (
      <p>
        We use cookies and local storage to keep you signed in, remember your preferences, improve performance, and protect against security risks and abuse.
      </p>
    ),
  },
  {
    id: 'sec-8',
    title: '8. Legal Bases for Processing',
    content: (
      <p>
        We process personal data to fulfill contractual obligations, meet legal requirements, protect user safety, defend legal claims, pursue legitimate interests, or based on your consent (which you may withdraw where applicable).
      </p>
    ),
  },
  {
    id: 'sec-9',
    title: '9. Data Retention',
    content: (
      <p>
        We retain personal data as long as necessary to fulfill the purposes outlined in this policy or comply with legal, tax, and accounting requirements. Deleting an account does not guarantee immediate deletion of information required for audit or fraud prevention purposes.
      </p>
    ),
  },
  {
    id: 'sec-10',
    title: '10. Data Security',
    content: (
      <p>
        We implement technical and organizational security measures to protect your information. However, no internet service is 100% secure, and you are responsible for keeping your login credentials confidential.
      </p>
    ),
  },
  {
    id: 'sec-11',
    title: '11. Your Privacy Rights',
    content: (
      <>
        <p className="mb-4">
          Subject to applicable law, you may have rights to access, correct, delete, restrict, object to processing, or request portability of your personal information.
        </p>
        <p>
          To exercise your rights, email us at:{' '}
          <a href="mailto:privacy@toastrelay.com" className="text-primary-600 hover:underline">
            privacy@toastrelay.com
          </a>
        </p>
      </>
    ),
  },
  {
    id: 'sec-12',
    title: '12. Children\'s Privacy',
    content: (
      <p>
        Toastrelay is not intended for children without required parental/guardian consent. If you believe a child has unlawfully provided us with personal data, please contact us immediately.
      </p>
    ),
  },
  {
    id: 'sec-13',
    title: '13. International Data Processing',
    content: (
      <p>
        Some service providers may process or store data outside Nigeria. We take appropriate measures to ensure cross-border processing complies with data protection standards.
      </p>
    ),
  },
  {
    id: 'sec-14',
    title: '14. Data Breaches',
    content: (
      <p>
        In the event of a security incident affecting your personal information, we will assess the situation and issue required notifications to users and regulatory authorities in compliance with applicable law.
      </p>
    ),
  },
  {
    id: 'sec-15',
    title: '15. Third-Party Websites and External Events',
    content: (
      <>
        <p className="mb-4">
          Our platform may contain links to external sites. Toastrelay is not responsible for the privacy practices, security, or content of third-party websites.
        </p>
        <p>
          When you interact with an external event, Toastrelay may redirect you to a website or service operated by the event organizer or another third party. Information you provide after leaving Toastrelay is subject to that third party&apos;s privacy policy and terms. Toastrelay does not control how third parties collect or process information on their websites.
        </p>
      </>
    ),
  },
  {
    id: 'sec-16',
    title: '16. Changes to This Privacy Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Continued use of Toastrelay following an update indicates acknowledgment of the revised policy.
      </p>
    ),
  },
  {
    id: 'sec-17',
    title: '17. Contact Us',
    content: (
      <div className="space-y-1">
        <p>Toastrelay is operated by:</p>
        <p className="font-semibold text-gray-900">BRYME PLATFORMS LTD</p>
        <p>Nigeria</p>
        <p className="pt-2">For privacy inquiries or requests:</p>
        <p>
          Email:{' '}
          <a href="mailto:support@toastrelay.com" className="text-primary-600 hover:underline">
            support@toastrelay.com
          </a>
        </p>
        <p>
          Website:{' '}
          <a href="https://toastrelay.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
            https://toastrelay.com
          </a>
        </p>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700 antialiased">
      <div className="mx-auto max-w-6xl px-6 pt-20 lg:pt-32 pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Truly Fixed Left Sidebar (on desktop) */}
          <aside className="lg:col-span-4">
            <div className="mt-16 lg:mt-20 lg:fixed lg:top-12 lg:w-[280px] space-y-8">
              {/* Category Title */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Legal
              </h1>

              {/* Navigation Tabs */}
              <div className="space-y-2 border-l border-gray-200 pl-4 text-sm">
                <a href="/terms" className="block text-gray-400 transition-colors hover:text-gray-600">
                  Terms of Use
                </a>
                <div className="border-l-2 border-black -ml-[18px] pl-3 font-semibold text-gray-900">
                  Privacy Policy
                </div>
              </div>

              {/* Sub-Section Navigation Links */}
              <nav className="space-y-2 border-t border-gray-100 pt-6 text-xs text-gray-400 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {privacyData.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left transition-colors ${
                        isActive
                          ? 'border-l-2 border-primary-600 pl-2 font-medium text-primary-600'
                          : 'hover:text-gray-600'
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Scrolling Right Main Content Panel */}
          <main className="lg:col-span-8 lg:col-start-5">
            {/* Main Header */}
            <header className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Privacy Policy
              </h2>
              <p className="text-sm text-gray-400">
                Effective Date: August 16, 2026 | Last Updated: August 16, 2026
              </p>
            </header>

            {/* Document Intro Text */}
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 mb-10">
              <p>
                Toastrelay is operated by BRYME PLATFORMS LTD (&quot;Toastrelay&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Toastrelay provides tools for creating, managing, discovering, and participating in events, including event pages, RSVPs, ticketing, contributions, guest management, event galleries, messaging, and related services.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, disclose, and protect personal information when you use Toastrelay. By using Toastrelay, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>

            {/* Document Sections */}
            <div className="space-y-10 border-t border-gray-100 pt-8">
              {privacyData.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-12">
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <div className="text-sm leading-relaxed text-gray-600 border-b border-gray-100 pb-8">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}