import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Bayou Charity',
  description:
    'How Bayou Family Fishing & Charity collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <main className="relative z-10 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card dark:glass-card--dark rounded-2xl p-8 md:p-12 bg-[var(--cream)] dark:bg-[var(--green-deep)]">
          {/* Page title */}
          <h1 className="font-playfair text-4xl md:text-5xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-2">
            Privacy Policy
          </h1>
          <p className="font-serif text-[var(--text-mid)] dark:text-[var(--cream)] text-sm mb-10">
            Effective date: April 3, 2026
          </p>

          <div className="space-y-10 font-serif text-[var(--text-dark)] dark:text-[var(--cream)] leading-relaxed">

            {/* Section 1 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-3">
                When you sign in to Bayou Family Fishing &amp; Charity using Google or Facebook, we
                receive basic profile information from those providers — your name, email address,
                and profile photo. We store only what&apos;s needed to create and manage your account.
              </p>
              <p className="mb-3">
                If you use the Members Portal, we also collect the content you voluntarily
                contribute: fishing trip photos, pin locations, species caught, captions, and
                comments.
              </p>
              <p>
                We do not collect payment information, Social Security numbers, or sensitive
                personal data.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-3">
                <li>Create and manage your member account</li>
                <li>Display your pins and posts to other members on the community map and feed</li>
                <li>Send admin notifications and service communications</li>
                <li>Respond to your questions and requests</li>
                <li>Improve the site and member experience over time</li>
              </ul>
              <p>
                We do not sell, rent, or share your personal information with third parties for
                marketing purposes.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                3. How We Store Your Information
              </h2>
              <p className="mb-3">
                Your data is stored in a secure cloud database hosted by{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--amber)] hover:underline"
                >
                  Supabase
                </a>
                . All data is transmitted over encrypted HTTPS connections. Access to the database
                is restricted by role-based security policies — only you and authorized
                administrators can access your account data.
              </p>
              <p>
                We retain your data as long as your account is active. You may request deletion at
                any time (see Section 6).
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                4. Third-Party Login Providers
              </h2>
              <p className="mb-3">
                We support sign-in via{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--amber)] hover:underline"
                >
                  Google
                </a>{' '}
                and{' '}
                <a
                  href="https://www.facebook.com/policy.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--amber)] hover:underline"
                >
                  Facebook
                </a>
                . Their privacy policies govern how they handle your data on their platforms.
              </p>
              <p>
                BFF only receives basic profile information from these providers. We do not receive
                passwords or payment information.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                5. Cookies
              </h2>
              <p>
                We use session cookies to keep you signed in while you use the site. We do not use
                advertising cookies, tracking pixels, or third-party analytics cookies.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                6. Your Rights
              </h2>
              <p className="mb-3">
                You have the right to request a copy of your data, correct inaccurate information,
                or have your account and associated data deleted. To exercise any of these rights,
                email us at{' '}
                <a
                  href="mailto:kyle@bayoucharity.org"
                  className="text-[var(--amber)] hover:underline"
                >
                  kyle@bayoucharity.org
                </a>{' '}
                or visit our{' '}
                <Link href="/data-deletion" className="text-[var(--amber)] hover:underline">
                  data deletion page
                </Link>
                .
              </p>
              <p>We will respond to all requests within 30 days.</p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                7. Children&apos;s Privacy
              </h2>
              <p>
                We do not knowingly collect personal information from children under 13. If you
                believe a child under 13 has provided us with their information, please contact us
                at{' '}
                <a
                  href="mailto:kyle@bayoucharity.org"
                  className="text-[var(--amber)] hover:underline"
                >
                  kyle@bayoucharity.org
                </a>{' '}
                and we will delete it promptly.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                8. Changes to This Policy
              </h2>
              <p>
                If we update this privacy policy, the revised version will be posted on this page
                and is effective immediately upon posting. We encourage you to check back
                periodically.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-playfair text-2xl text-[var(--green-deep)] dark:text-[var(--gold)] mb-3">
                Contact
              </h2>
              <address className="not-italic space-y-1">
                <p className="font-semibold">Bayou Family Fishing &amp; Charity</p>
                <p>
                  <a
                    href="mailto:kyle@bayoucharity.org"
                    className="text-[var(--amber)] hover:underline"
                  >
                    kyle@bayoucharity.org
                  </a>
                </p>
                <p>
                  <a href="tel:5045411838" className="text-[var(--amber)] hover:underline">
                    504-541-1838
                  </a>
                </p>
                <p>Louisiana, USA</p>
              </address>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-[var(--green-water)]/30">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--amber)] hover:text-[var(--gold)] transition-colors font-serif"
            >
              <span aria-hidden="true">←</span> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
