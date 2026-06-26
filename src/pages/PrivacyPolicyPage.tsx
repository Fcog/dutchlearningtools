import { Header } from '../components/Header';

export default function PrivacyPolicyPage() {
  return (
    <div className="app">
      <Header backTo="/" />
      <main className="main policy-main">
        <h2 className="policy-title">Privacy Policy</h2>
        <p className="policy-date">Last updated: June 26, 2026</p>

        <section className="policy-section">
          <h3>1. Information We Collect</h3>
          <p>
            When you create an account, we collect your email address and any information
            you provide during registration. We also collect usage data such as exercises
            completed, scores, and session timestamps to track your learning progress.
          </p>
        </section>

        <section className="policy-section">
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain the Dutch Learning Tools service</li>
            <li>Save and display your learning progress across sessions</li>
            <li>Improve the quality and content of our exercises</li>
            <li>Send transactional emails such as account verification</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>3. Data Storage</h3>
          <p>
            Your data is stored securely using Supabase, a hosted database platform.
            We do not sell or share your personal information with third parties for
            marketing purposes.
          </p>
        </section>

        <section className="policy-section">
          <h3>4. Cookies and Analytics</h3>
          <p>
            We use Google Analytics to understand how visitors use the site. This may
            involve the use of cookies. Analytics data is aggregated and does not
            personally identify you. You can opt out by using browser extensions that
            block Google Analytics.
          </p>
        </section>

        <section className="policy-section">
          <h3>5. Your Rights</h3>
          <p>
            You may request deletion of your account and associated data at any time
            by contacting us. Unauthenticated users do not have personal data stored
            beyond anonymous session cookies.
          </p>
        </section>

        <section className="policy-section">
          <h3>6. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date. Continued use of the service
            after changes constitutes acceptance of the new policy.
          </p>
        </section>

        <section className="policy-section">
          <h3>7. Contact</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:fcog111@gmail.com" className="policy-link">
              fcog111@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
