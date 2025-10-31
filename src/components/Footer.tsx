


const Footer: React.FC = () => {
    const year= new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">

          {/* Brand + short description */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                S$
              </div>
              <span className="text-lg font-semibold">ShareSpend</span>
            </div>
            <p className="text-sm text-gray-400">
              Simple expense sharing with friends and roommates — track, split
              and settle easily.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:w-1/3">
            <div>
              <h4 className="text-sm font-semibold mb-2">Product</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><a href="/Features" className="hover:underline">Features</a></li>
                <li><a href="/Hero" className="hover:underline">Pricing</a></li>
                <li><a href="HowItWorks" className="hover:underline">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Company</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><a href="/about" className="hover:underline">About</a></li>
                <li><a href="/careers" className="hover:underline">Careers</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Legal</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><a href="https://openai.com/policies/privacy-policy/" target='_blank' className="hover:underline">Privacy Policy</a></li>
                <li><a href="https://openai.com/policies/terms-of-use/" target="_blank" className="hover:underline">Terms of Service</a></li>
                <li><a href="https://www.notion.com/security" target='_blank' className="hover:underline">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Contact + Social */}
          <div className="md:w-1/3">
            <h4 className="text-sm font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-400 mb-3">hello@sharespend.app</p>
            <div className="flex items-center gap-3">
              {/* Simple social icons (SVG inline) */}
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-white" target="_blank">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 19c7.732 0 11.965-6.405 11.965-11.965 0-.182 0-.365-.012-.545A8.55 8.55 0 0 0 22 4.557a8.3 8.3 0 0 1-2.357.646 4.12 4.12 0 0 0 1.804-2.27 8.27 8.27 0 0 1-2.605.996A4.123 4.123 0 0 0 12.07 8.1a11.7 11.7 0 0 1-8.502-4.31 4.12 4.12 0 0 0 1.276 5.499A4.06 4.06 0 0 1 2.8 8.86v.05a4.123 4.123 0 0 0 3.305 4.038 4.09 4.09 0 0 1-1.085.145c-.265 0-.52-.026-.77-.074a4.126 4.126 0 0 0 3.849 2.865A8.263 8.263 0 0 1 2 17.54a11.66 11.66 0 0 0 6.29 1.84"/>
                </svg>
              </a>

              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-white" target="_blank">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12.073C22 6.507 17.523 2 12 2S2 6.507 2 12.073c0 4.991 3.657 9.128 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.9h-2.33v7.03C18.343 21.2 22 17.064 22 12.073z"/>
                </svg>
              </a>

              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-white" target="_blank">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
          <p>© {year} ShareSpend. All rights reserved.</p>
          <p className="mt-3 md:mt-0">Built with ❤️ • <a href="https://openai.com/policies/privacy-policy/" target="_blank" className="hover:underline">Privacy</a></p>
        </div>
      </div>

    </footer>
  )
}

export default Footer;