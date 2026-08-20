"use client"
import React, { useState } from 'react';

interface TermSection {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const termsData: TermSection[] = [
  {
    id: 'sec-1',
    number: '1',
    title: '1. About ToastRelay',
    content: (
      <>
        <p className="mb-4">
          ToastRelay provides technology that allows users and event organizers to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Create event pages</li>
          <li>Publish and discover events</li>
          <li>Manage RSVPs and guests</li>
          <li>Sell tickets</li>
          <li>Receive event-related contributions</li>
          <li>Manage attendee information</li>
          <li>Upload event content</li>
          <li>Communicate with attendees</li>
          <li>Manage event-related activities</li>
        </ul>
        <p>
          ToastRelay provides the technology and infrastructure for these activities.
          Unless expressly stated otherwise, ToastRelay is not the organizer, promoter, venue, performer, speaker, vendor, or producer of events listed on the platform.
        </p>
      </>
    ),
  },
  {
    id: 'sec-2',
    number: '2',
    title: '2. Accounts',
    content: (
      <>
        <p className="mb-4">
          Some ToastRelay features require an account. You agree to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Provide accurate information</li>
          <li>Keep your account information up to date</li>
          <li>Maintain the confidentiality of your login credentials</li>
          <li>Not share your account in a way that compromises its security</li>
          <li>Notify us of unauthorized access</li>
          <li>Not create accounts for fraudulent or deceptive purposes</li>
        </ul>
        <p>
          You are responsible for activity occurring through your account unless the activity resulted from a security failure attributable to ToastRelay.
        </p>
      </>
    ),
  },
  {
    id: 'sec-3',
    number: '3',
    title: '3. Event Organizers',
    content: (
      <>
        <p className="mb-4">
          If you create or manage an event on ToastRelay, you are responsible for your event. You are responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>The accuracy of your event information</li>
          <li>The legality of your event</li>
          <li>Your event&apos;s venue and logistics</li>
          <li>Ticket prices</li>
          <li>Event capacity</li>
          <li>Ticket availability</li>
          <li>Communications with attendees</li>
          <li>Delivering the event as advertised</li>
          <li>Any required licenses, permits, approvals, or permissions</li>
          <li>Refunds where applicable</li>
          <li>Your obligations to attendees</li>
          <li>Content you upload or publish</li>
        </ul>
        <p>
          You must not create an event that is fraudulent, misleading, unlawful, unsafe, or materially different from what is advertised.
        </p>
      </>
    ),
  },
  {
    id: 'sec-4',
    number: '4',
    title: '4. Event Discovery',
    content: (
      <p>
        ToastRelay may make eligible events discoverable through search, discovery pages, recommendations, categories, or other areas of the platform.
        By publishing an event, you understand that information you designate as public may be displayed to other users.
        ToastRelay may determine how events are ranked, displayed, recommended, or promoted.
        We do not guarantee that any event will receive a particular amount of visibility, traffic, registrations, or ticket sales.
      </p>
    ),
  },
  {
    id: 'sec-5',
    number: '5',
    title: '5. Tickets',
    content: (
      <>
        <p className="mb-4">
          Where ticketing is available, organizers are responsible for providing accurate ticket information, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Ticket name</li>
          <li>Ticket price</li>
          <li>Ticket quantity</li>
          <li>Ticket availability</li>
          <li>Sales period</li>
          <li>Entry conditions</li>
          <li>Event information</li>
        </ul>
        <p>
          A ticket purchased through ToastRelay represents a transaction associated with the relevant event.
          Unless expressly stated otherwise, the event organizer is responsible for fulfilling the ticket holder&apos;s right to attend the event.
        </p>
      </>
    ),
  },
  {
    id: 'sec-6',
    number: '6',
    title: '6. Payments',
    content: (
      <p>
        Payments may be processed through third-party payment providers, including Paystack.
        By making or receiving a payment through ToastRelay, you agree that applicable payment-provider terms may also apply.
        ToastRelay may charge platform fees, transaction fees, storage fees, or other fees disclosed at the time of purchase or activation.
        Applicable fees may be paid by the attendee, organizer, or another party depending on the configuration of the transaction.
      </p>
    ),
  },
  {
    id: 'sec-7',
    number: '7',
    title: '7. Organizer Payouts',
    content: (
      <>
        <p className="mb-4">
          Where ToastRelay facilitates payouts to event organizers, payouts are subject to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Successful payment processing</li>
          <li>Payment-provider requirements</li>
          <li>Account verification</li>
          <li>Fraud and risk checks</li>
          <li>Applicable laws and regulations</li>
          <li>ToastRelay&apos;s payout procedures</li>
        </ul>
        <p className="mb-4">
          ToastRelay may delay, restrict, or suspend payouts where reasonably necessary to investigate:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Fraud</li>
          <li>Chargebacks</li>
          <li>Payment disputes</li>
          <li>Suspicious transactions</li>
          <li>Event cancellation</li>
          <li>Breach of these Terms</li>
          <li>Illegal activity</li>
          <li>Material complaints relating to an event</li>
        </ul>
        <p>
          A payout restriction does not necessarily mean that ToastRelay has determined that an organizer has committed wrongdoing.
        </p>
      </>
    ),
  },
  {
    id: 'sec-8',
    number: '8',
    title: '8. Refunds and Cancellations',
    content: (
      <p>
        Refunds may be subject to the refund policy applicable to the event and the circumstances of the transaction.
        Event organizers are generally responsible for their event&apos;s cancellation and refund obligations, except where ToastRelay expressly assumes responsibility.
        ToastRelay may assist with refunds, disputes, or payment issues where appropriate.
        Where a refund is approved, the timing of the refund may depend on the payment provider and the original payment method.
        ToastRelay reserves the right to establish or update refund procedures for particular events, transaction types, or circumstances.
      </p>
    ),
  },
  {
    id: 'sec-9',
    number: '9',
    title: '9. Contributions',
    content: (
      <p>
        ToastRelay may allow users to make contributions or gifts associated with an event.
        Contributions are intended for the purpose communicated by the event organizer.
        Organizers must not use contribution features to facilitate fraud, money laundering, illegal activity, or deceptive fundraising.
        ToastRelay may review, restrict, suspend, or cancel contribution activity where reasonably necessary for security, compliance, or fraud prevention.
      </p>
    ),
  },
  {
    id: 'sec-10',
    number: '10',
    title: '10. Fees',
    content: (
      <>
        <p className="mb-4">
          Certain ToastRelay services may be free while others may require payment.
          Before you are charged, ToastRelay will communicate the applicable fee where reasonably practicable. Fees may include:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Ticketing or transaction fees</li>
          <li>Storage fees</li>
          <li>Optional paid features</li>
          <li>Other clearly disclosed platform services</li>
        </ul>
        <p>
          Unless otherwise stated, fees already incurred may be non-refundable.
          ToastRelay may change its pricing from time to time. Changes to pricing will not retroactively alter fees already incurred.
        </p>
      </>
    ),
  },
  {
    id: 'sec-11',
    number: '11',
    title: '11. Storage and Uploaded Content',
    content: (
      <p>
        ToastRelay may provide storage for event images, videos, documents, and other content.
        Storage availability and limits may depend on your plan or purchased storage allocation.
        Where storage is offered on a recurring basis, continued access may require an active payment arrangement.
        If storage expires or is cancelled, ToastRelay may restrict access to stored content and may eventually delete content after an applicable retention period.
        You are responsible for maintaining your own backups of important content.
      </p>
    ),
  },
  {
    id: 'sec-12',
    number: '12',
    title: '12. User Content',
    content: (
      <>
        <p className="mb-4">
          You retain ownership of content that you upload to ToastRelay, subject to the rights necessary for ToastRelay to operate the service.
          By uploading content, you grant ToastRelay a limited, non-exclusive, worldwide, royalty-free license to host, store, reproduce, process, display, transmit, and otherwise use that content solely as reasonably necessary to provide, maintain, secure, and improve the services.
        </p>
        <p className="mb-4">You represent that:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>You own or have permission to use the content</li>
          <li>The content does not infringe another person&apos;s rights</li>
          <li>You have obtained necessary permissions for identifiable people where required</li>
          <li>The content is not unlawful</li>
          <li>The content does not contain malicious code</li>
        </ul>
        <p>ToastRelay may remove content that violates these Terms or applicable law.</p>
      </>
    ),
  },
  {
    id: 'sec-13',
    number: '13',
    title: '13. Prohibited Activities',
    content: (
      <>
        <p className="mb-4">You must not use ToastRelay to:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Commit fraud</li>
          <li>Scam or deceive users</li>
          <li>Sell illegal goods or services</li>
          <li>Promote unlawful activities</li>
          <li>Facilitate money laundering</li>
          <li>Impersonate another person or organization</li>
          <li>Create fake events</li>
          <li>Misrepresent an event</li>
          <li>Collect personal information unlawfully</li>
          <li>Abuse or harass other users</li>
          <li>Upload malware</li>
          <li>Attempt unauthorized access to ToastRelay</li>
          <li>Interfere with platform security</li>
          <li>Scrape or systematically collect data without authorization</li>
          <li>Circumvent platform restrictions</li>
          <li>Abuse payment systems</li>
          <li>Use ToastRelay for activities that violate applicable laws</li>
        </ul>
        <p>ToastRelay may suspend or terminate accounts and events involved in prohibited activity.</p>
      </>
    ),
  },
  {
    id: 'sec-14',
    number: '14',
    title: '14. Attendee Responsibilities',
    content: (
      <>
        <p className="mb-4">As an attendee or guest, you are responsible for:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Providing accurate registration information</li>
          <li>Keeping your ticket or registration information secure</li>
          <li>Following event rules</li>
          <li>Following venue requirements</li>
          <li>Respecting organizers and other attendees</li>
          <li>Not misusing event information obtained through ToastRelay</li>
        </ul>
        <p>
          A ticket does not necessarily guarantee entry where the organizer or venue has lawful and clearly communicated entry requirements.
        </p>
      </>
    ),
  },
  {
    id: 'sec-15',
    number: '15',
    title: '15. Intellectual Property',
    content: (
      <>
        <p className="mb-4">
          ToastRelay and its software, branding, design, interfaces, trademarks, logos, text, graphics, and other original materials are owned by or licensed to BRYME PLATFORMS LTD.
        </p>
        <p className="mb-4">Except where expressly permitted, you may not:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Copy ToastRelay&apos;s software</li>
          <li>Reproduce its proprietary design</li>
          <li>Modify or create derivative versions</li>
          <li>Reverse engineer the platform</li>
          <li>Sell or redistribute ToastRelay&apos;s proprietary materials</li>
          <li>Use ToastRelay branding without permission</li>
        </ul>
        <p>
          &quot;ToastRelay&quot; and related product names, logos, and marks may be trademarks or brand assets of BRYME PLATFORMS LTD.
        </p>
      </>
    ),
  },
  {
    id: 'sec-16',
    number: '16',
    title: '16. Third-Party Services',
    content: (
      <p>
        ToastRelay may integrate with or rely on third-party services, including payment processors, email providers, cloud infrastructure, authentication services, and other technology providers.
        Your use of third-party services may be subject to their own terms and policies.
        ToastRelay is not responsible for the independent actions, availability, or policies of third-party services.
      </p>
    ),
  },
  {
    id: 'sec-17',
    number: '17',
    title: '17. External Events',
    content: (
      <>
        <p className="mb-4">
          Some events listed on ToastRelay may be hosted or managed entirely by third parties. For these events, ToastRelay may provide an event discovery page containing information supplied by the event creator. When you select an action such as purchasing a ticket, registering, RSVPing, or engaging with the event, ToastRelay may redirect you to a third-party website or service designated by the event creator.
        </p>
        <p className="mb-4">
          Once you leave ToastRelay, your interaction is governed by the terms, privacy policy, and practices of the third-party website or service. ToastRelay does not process or control transactions completed on external websites and is not responsible for the availability, accuracy, security, content, payment processing, refunds, cancellations, ticket fulfillment, or other activities of the external website or event organizer.
        </p>
        <p>
          You should review the third party&apos;s terms and privacy policy before providing personal information or making a payment.
        </p>
      </>
    ),
  },
  {
    id: 'sec-18',
    number: '18',
    title: '18. Fraud, Security, and Risk Controls',
    content: (
      <>
        <p className="mb-4">To protect users and the platform, ToastRelay may:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Monitor transactions for suspicious activity</li>
          <li>Review events</li>
          <li>Restrict accounts</li>
          <li>Delay payouts</li>
          <li>Suspend ticket sales</li>
          <li>Remove events</li>
          <li>Restrict features</li>
          <li>Request additional information</li>
          <li>Cooperate with payment providers and lawful authorities</li>
        </ul>
        <p>
          These measures may be taken where reasonably necessary to protect users, prevent fraud, comply with law, or protect ToastRelay.
        </p>
      </>
    ),
  },
  {
    id: 'sec-19',
    number: '19',
    title: '19. Suspension and Termination',
    content: (
      <>
        <p className="mb-4">We may suspend or terminate your access to ToastRelay where:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>You violate these Terms</li>
          <li>You engage in fraudulent activity</li>
          <li>Your activity creates a security risk</li>
          <li>Your activity exposes ToastRelay or other users to legal risk</li>
          <li>You fail to pay applicable fees</li>
          <li>Your event violates our policies</li>
          <li>We are required to do so by law</li>
          <li>We reasonably believe suspension is necessary to protect the platform or its users</li>
        </ul>
        <p>You may stop using ToastRelay at any time. Termination does not remove obligations that accrued before termination.</p>
      </>
    ),
  },
  {
    id: 'sec-20',
    number: '20',
    title: '20. Disclaimers',
    content: (
      <>
        <p className="mb-4">
          ToastRelay provides its platform on an &quot;as available&quot; basis. We do not guarantee that:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>ToastRelay will always be available</li>
          <li>The platform will be completely error-free</li>
          <li>Events will occur as advertised</li>
          <li>Organizers will fulfill their obligations</li>
          <li>Attendees will behave appropriately</li>
          <li>Payment providers will always be available</li>
          <li>Third-party services will remain available</li>
          <li>Any particular event will receive registrations or ticket sales</li>
        </ul>
        <p>
          ToastRelay does not guarantee the quality, safety, legality, authenticity, or performance of an event or organizer merely because the event appears on the platform.
        </p>
      </>
    ),
  },
  {
    id: 'sec-21',
    number: '21',
    title: '21. Events Are Organizer Responsibilities',
    content: (
      <p>
        Unless expressly stated otherwise, the event organizer is responsible for the actual event.
        This includes the venue, performers, speakers, food, transportation, security, ticket fulfillment, cancellations, event quality, and attendee experience.
        If an organizer cancels or materially changes an event, ToastRelay may take reasonable steps to assist affected users, but ToastRelay does not automatically assume the organizer&apos;s obligations.
      </p>
    ),
  },
  {
    id: 'sec-22',
    number: '22',
    title: '22. Limitation of Liability',
    content: (
      <p>
        To the maximum extent permitted by applicable law, BRYME PLATFORMS LTD and ToastRelay will not be liable for indirect, incidental, consequential, special, or punitive losses arising from your use of the platform or participation in an event.
        Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable law.
      </p>
    ),
  },
  {
    id: 'sec-23',
    number: '23',
    title: '23. Indemnification',
    content: (
      <>
        <p className="mb-4">
          To the extent permitted by applicable law, you agree to indemnify and hold harmless BRYME PLATFORMS LTD, ToastRelay, and their officers, employees, contractors, and service providers from claims, losses, liabilities, damages, and expenses arising from:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your violation of these Terms</li>
          <li>Your unlawful use of ToastRelay</li>
          <li>Your event</li>
          <li>Content you upload</li>
          <li>Your infringement of another person&apos;s rights</li>
          <li>Fraudulent or misleading activity associated with your account or event</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sec-24',
    number: '24',
    title: '24. Privacy',
    content: (
      <p>
        Your use of ToastRelay is also governed by our Privacy Policy.
        Our Privacy Policy explains how we collect, use, store, and protect personal information.
      </p>
    ),
  },
  {
    id: 'sec-25',
    number: '25',
    title: '25. Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time.
        When material changes are made, we may provide notice through ToastRelay or other appropriate means.
        Your continued use of ToastRelay after the updated Terms become effective means that you accept the updated Terms to the extent permitted by applicable law.
      </p>
    ),
  },
  {
    id: 'sec-26',
    number: '26',
    title: '26. Governing Law',
    content: (
      <p>
        These Terms shall be governed by the laws of the Federal Republic of Nigeria, subject to applicable mandatory legal requirements.
        Any dispute arising from these Terms or your use of ToastRelay shall be handled in accordance with applicable Nigerian law and the jurisdiction of the appropriate courts.
      </p>
    ),
  },
  {
    id: 'sec-27',
    number: '27',
    title: '27. Severability',
    content: (
      <p>
        If any provision of these Terms is determined to be invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law.
      </p>
    ),
  },
  {
    id: 'sec-28',
    number: '28',
    title: '28. Entire Agreement',
    content: (
      <p>
        These Terms, together with our Privacy Policy and any additional terms or policies expressly incorporated into the service, constitute the agreement governing your use of ToastRelay.
      </p>
    ),
  },
  {
    id: 'sec-29',
    number: '29',
    title: '29. Contact Us',
    content: (
      <div className="space-y-1">
        <p>ToastRelay is operated by:</p>
        <p className="font-semibold text-gray-900">BRYME PLATFORMS LTD</p>
        <p>Nigeria</p>
        <p className="pt-2">For questions regarding these Terms:</p>
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

export default function TermsOfUse() {
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
                <div className="border-l-2 border-black -ml-[18px] pl-3 font-semibold text-gray-900">
                  Terms of Use
                </div>
                <a href="/privacy" className="block text-gray-400 transition-colors hover:text-gray-600">
                  Privacy Policy
                </a>
              </div>

              {/* Sub-Section Navigation Links */}
              <nav className="space-y-2 border-t border-gray-100 pt-6 text-xs text-gray-400 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {termsData.map((item) => {
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
                Terms of Use
              </h2>
              <p className="text-sm text-gray-400">
                Effective Date: August 16, 2026
              </p>
            </header>

            {/* Document Intro Text */}
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 mb-10">
              <p className="font-semibold text-gray-900">Welcome to ToastRelay.</p>
              <p>
                These Terms of Use (&quot;Terms&quot;) govern your access to and use of ToastRelay, a platform operated by BRYME PLATFORMS LTD (&quot;ToastRelay&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By creating an account, accessing ToastRelay, creating an event, purchasing a ticket, registering for an event, making a contribution, or otherwise using our services, you agree to these Terms.
              </p>
              <p>
                If you do not agree to these Terms, you must not use ToastRelay.
              </p>
            </div>

            {/* Document Sections */}
            <div className="space-y-10 border-t border-gray-100 pt-8">
              {termsData.map((section) => (
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