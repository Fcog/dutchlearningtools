import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">© {new Date().getFullYear()} Dutch Learning Tools</span>
        <nav className="footer-links">
          <Link to="/guides" className="footer-link">Guides</Link>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms-of-use" className="footer-link">Terms of Use</Link>
        </nav>
      </div>
    </footer>
  );
}
