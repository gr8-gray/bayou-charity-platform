import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Bayou Charity',
  description: 'Terms governing use of the Bayou Family Fishing & Charity website and member portal.',
}

export default function TermsPage() {
  return (
    <main className="relative z-10 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card dark:glass-card--dark rounded-2xl p-8 md:p-12 bg-cream dark:bg-green-deep/80">

          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-deep dark:text-gold mb-2">
            Terms of Service
          </h1>
          <p className="font-lora text-text-mid dark:text-cream/70 text-sm mb-10">
            Last updated: April 3, 2026
          </p>

          <div className="space-y-8 font-lora text-text-dark dark:text-cream/90 leading-relaxed">

            {/* 1. Acceptance */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                1. Acceptance
              </h2>
              <p>
                By accessing or using the Bayou Family Fishing &amp; Charity website and member
                portal (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Service. If
                you do not agree, please do not use the Site. Continued use after any posted
                update constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* 2. Member Accounts */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                2. Member Accounts
              </h2>
              <p>
                Access to the member portal requires approval by Bayou Family Fishing &amp; Charity
                staff. Each person may hold only one account. You agree to provide accurate,
                current, and complete information when registering and to keep your account
                credentials confidential. You are responsible for all activity that occurs under
                your account.
              </p>
            </section>

            {/* 3. User Content */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                3. User Content
              </h2>
              <p>
                Members retain ownership of content they submit (photos, pins, comments, and
                other posts). By submitting content, you grant Bayou Family Fishing &amp; Charity a
                non-exclusive, royalty-free license to display, reproduce, and distribute that
                content in connection with the organization&rsquo;s activities and mission.
              </p>
              <p className="mt-3">
                You agree not to post content that is offensive, harassing, defamatory, illegal,
                or that infringes any third-party rights. Bayou Family Fishing &amp; Charity reserves
                the right to remove any content at any time, without notice, at its sole
                discretion.
              </p>
            </section>

            {/* 4. Code of Conduct */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                4. Code of Conduct
              </h2>
              <p>
                All members and visitors are expected to treat one another with respect. The
                following are strictly prohibited:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-text-dark dark:text-cream/90">
                <li>Harassment, threats, or bullying of any kind</li>
                <li>Spam, unsolicited promotions, or repetitive posts</li>
                <li>Any activity that violates local, state, or federal law</li>
                <li>Impersonating another person, member, or organization</li>
              </ul>
            </section>

            {/* 5. Donations */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                5. Donations
              </h2>
              <p>
                Donation processing on this Site is handled by Zeffy and is subject to{' '}
                <a
                  href="https://www.zeffy.com/en-US/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber underline hover:opacity-80 transition-opacity"
                >
                  Zeffy&rsquo;s Terms of Use
                </a>
                . Bayou Family Fishing &amp; Charity is a 501(c)(3) nonprofit organization
                (status pending). Donations are made in good faith and are generally
                non-refundable; we cannot guarantee a refund on any contribution once processed.
              </p>
            </section>

            {/* 6. Intellectual Property */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                6. Intellectual Property
              </h2>
              <p>
                The Bayou Family Fishing &amp; Charity name, logo, branding, and overall site
                design are the exclusive property of Bayou Family Fishing &amp; Charity. Nothing
                on this Site grants you any license or right to use these assets without prior
                written permission.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                This Site and its content are provided &ldquo;as is&rdquo; without warranties of any
                kind, express or implied. Bayou Family Fishing &amp; Charity does not warrant that
                the Site will be uninterrupted, error-free, or free of harmful components. To
                the fullest extent permitted by law, Bayou Family Fishing &amp; Charity shall not
                be liable for any indirect, incidental, special, or consequential damages
                arising from your use of the Site.
              </p>
            </section>

            {/* 8. Termination */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                8. Termination
              </h2>
              <p>
                Bayou Family Fishing &amp; Charity reserves the right to suspend or permanently
                terminate any account at any time, with or without notice, for conduct that
                violates these Terms or that we determine, in our sole discretion, is harmful
                to the community or the organization.
              </p>
            </section>

            {/* 9. Changes to Terms */}
            <section>
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                9. Changes to Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time. Revised terms will be
                posted on this page with an updated date. Your continued use of the Site after
                changes are posted constitutes your acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-green-water/20 dark:border-cream/10 pt-8">
              <h2 className="font-playfair text-xl md:text-2xl font-semibold text-green-deep dark:text-gold mb-3">
                Contact
              </h2>
              <address className="not-italic space-y-1 text-text-dark dark:text-cream/90">
                <p className="font-semibold">Bayou Family Fishing &amp; Charity</p>
                <p>
                  <a
                    href="mailto:kyle@bayoucharity.org"
                    className="text-amber underline hover:opacity-80 transition-opacity"
                  >
                    kyle@bayoucharity.org
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+15045411838"
                    className="text-amber underline hover:opacity-80 transition-opacity"
                  >
                    504-541-1838
                  </a>
                </p>
                <p>Louisiana, USA</p>
              </address>
            </section>

          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-6 border-t border-green-water/20 dark:border-cream/10">
            <Link
              href="/"
              className="font-lora text-amber hover:opacity-80 transition-opacity text-sm"
            >
              &larr; Back to Home
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}
