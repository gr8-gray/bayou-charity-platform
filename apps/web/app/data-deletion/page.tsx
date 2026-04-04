import Link from 'next/link'

export const metadata = {
  title: 'Data Deletion — Bayou Charity',
  description: 'Request deletion of your Bayou Family Fishing member data.',
}

export default function DataDeletionPage() {
  return (
    <main className="relative z-10 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card dark:glass-card--dark rounded-2xl p-8 md:p-12 bg-cream dark:bg-green-deep/60">

          <h1 className="font-playfair text-3xl md:text-4xl text-green-deep dark:text-gold mb-6">
            Data Deletion Request
          </h1>

          <p className="font-serif text-text-dark dark:text-cream mb-10 leading-relaxed">
            If you used Facebook or Google to log in to the Bayou Family Fishing
            member portal, you can request deletion of your account and all
            associated data at any time. Requests are processed within 30 days.
          </p>

          {/* What Gets Deleted */}
          <section className="mb-8">
            <h2 className="font-playfair text-xl md:text-2xl text-green-deep dark:text-gold mb-3">
              What Gets Deleted
            </h2>
            <ul className="font-serif text-text-dark dark:text-cream space-y-2 list-disc list-inside leading-relaxed">
              <li>Your member account and profile information</li>
              <li>All fishing pins and associated photos you have uploaded</li>
              <li>All comments you have posted</li>
              <li>Any other data associated with your account</li>
            </ul>
          </section>

          {/* What Is NOT Affected */}
          <section className="mb-8">
            <h2 className="font-playfair text-xl md:text-2xl text-green-deep dark:text-gold mb-3">
              What Is NOT Affected
            </h2>
            <p className="font-serif text-text-dark dark:text-cream leading-relaxed">
              Donations made through Zeffy are managed on a separate platform
              with separate records. Requesting deletion of your Bayou Family
              Fishing account does not affect any donation history or receipts
              held by Zeffy.
            </p>
          </section>

          {/* How to Request */}
          <section className="mb-8">
            <h2 className="font-playfair text-xl md:text-2xl text-green-deep dark:text-gold mb-3">
              How to Request Deletion
            </h2>
            <ol className="font-serif text-text-dark dark:text-cream space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Email{' '}
                <a
                  href="mailto:kyle@bayoucharity.org"
                  className="text-amber underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  kyle@bayoucharity.org
                </a>{' '}
                with the subject line <strong>"Data Deletion Request"</strong>
              </li>
              <li>Include your full name and the email address on your account</li>
              <li>You will receive a confirmation reply within 5 business days</li>
              <li>Deletion will be completed within 30 days of your request</li>
              <li>A final confirmation email will be sent once deletion is complete</li>
            </ol>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="font-playfair text-xl md:text-2xl text-green-deep dark:text-gold mb-3">
              Contact
            </h2>
            <address className="font-serif text-text-dark dark:text-cream not-italic leading-relaxed space-y-1">
              <p className="font-semibold">Bayou Family Fishing &amp; Charity</p>
              <p>
                <a
                  href="mailto:kyle@bayoucharity.org"
                  className="text-amber underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  kyle@bayoucharity.org
                </a>
              </p>
              <p>
                <a
                  href="tel:5045411838"
                  className="text-amber underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  504-541-1838
                </a>
              </p>
              <p>Louisiana, USA</p>
            </address>
          </section>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-serif text-amber hover:opacity-80 transition-opacity"
          >
            <span aria-hidden="true">←</span> Back to Home
          </Link>

        </div>
      </div>
    </main>
  )
}
