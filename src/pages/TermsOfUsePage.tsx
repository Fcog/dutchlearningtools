import { Header } from "../components/Header";

export default function TermsOfUsePage() {
  return (
    <div className="app">
      <Header backTo="/" />
      <main className="main policy-main">
        <h2 className="policy-title">Terms of Use</h2>
        <p className="policy-date">Last updated: July 9, 2026</p>

        <section className="policy-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using Dutch Learning Tools, you agree to be bound by
            these Terms of Use. If you do not agree, please do not use the
            service.
          </p>
        </section>

        <section className="policy-section">
          <h3>2. Description of Service</h3>
          <p>
            Dutch Learning Tools is a free educational platform designed to help
            users practice Dutch grammar through interactive exercises — including
            verb conjugation, separable and positional verbs, articles, plurals,
            word order, prepositions, adjectives, diminutives, negation and
            idiomatic expressions.
          </p>
        </section>

        <section className="policy-section">
          <h3>3. User Accounts</h3>
          <p>
            You may use the service without creating an account. If you choose
            to register, you are responsible for maintaining the confidentiality
            of your credentials and for all activity under your account. You
            must provide a valid email address and keep your account information
            accurate.
          </p>
        </section>

        <section className="policy-section">
          <h3>4. Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>
              Attempt to gain unauthorised access to any part of the service
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              service
            </li>
            <li>Scrape, copy, or redistribute content without permission</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>5. Intellectual Property</h3>
          <p>
            All content, exercises, and code on Dutch Learning Tools are the
            property of the service owner. You may not reproduce or redistribute
            any content without prior written permission.
          </p>
        </section>

        <section className="policy-section">
          <h3>6. Disclaimer of Warranties</h3>
          <p>
            The service is provided "as is" without warranties of any kind. We
            do not guarantee that the service will be error-free, uninterrupted,
            or that the linguistic content will be free of inaccuracies.
          </p>
        </section>

        <section className="policy-section">
          <h3>7. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we shall not be liable for
            any indirect, incidental, or consequential damages arising from your
            use of the service.
          </p>
        </section>

        <section className="policy-section">
          <h3>8. Changes to These Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. Updated
            terms will be posted on this page. Continued use of the service
            constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="policy-section">
          <h3>9. Email Communications</h3>
          <p>
            The daily exercise email is an optional service. It is sent only
            after you explicitly opt in, and you may withdraw your consent at
            any time using the unsubscribe link included in every email or the
            toggle on your account page. Opting out of the daily exercise email
            does not affect essential transactional emails (such as account
            verification and password resets), which are required to operate
            your account.
          </p>
        </section>

        <section className="policy-section">
          <h3>10. Contact</h3>
          <p>
            For questions about these Terms, please contact us at{" "}
            <a
              href="mailto:info@dutchlearningtools.nl"
              className="policy-link"
            >
              info@dutchlearningtools.nl
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
