const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div>
        <div className="footer__brand">WebYes Shop</div>
        <p className="footer__tagline">Your destination for premium fashion and accessories. Quality products, exceptional service.</p>
        <div className="footer__socials">
          {['f', 'in', '𝕏'].map((s) => (
            <button key={s} className="footer__social-btn" aria-label={s}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="footer__col-title">Quick Links</div>
        <ul className="footer__links">
          {['About Us','Contact','Store Locator','Careers'].map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </div>
      <div>
        <div className="footer__col-title">Customer Service</div>
        <ul className="footer__links">
          {['Shipping & Returns','Size Guide','FAQ','Track Order'].map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </div>
      <div>
        <div className="footer__col-title">Newsletter</div>
        <p className="footer__newsletter-text">Subscribe to get special offers and updates</p>
        <div className="footer__newsletter-form">
          <input type="email" className="footer__newsletter-input" placeholder="Your email" />
          <button className="footer__newsletter-btn">→</button>
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <span className="footer__copy">© 2026 WebYes Shop. All rights reserved.</span>
      <div className="footer__legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </footer>
)

export default Footer
