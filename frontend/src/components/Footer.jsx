function Footer() {

  return (

    <footer className="mt-24 border-t border-border bg-surface">

      <div className="page-container py-14">

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">

          {/* LEFT */}

          <div className="max-w-md">

            <h2 className="font-heading text-2xl font-semibold tracking-tight text-text">

              CrowdFund

            </h2>

            <p className="mt-4 leading-relaxed text-text-muted">

              Empowering communities through transparent, meaningful, and human-centered crowdfunding.

            </p>

          </div>

          {/* RIGHT */}

          <div className="flex flex-col items-start gap-3 text-sm text-text-muted md:items-end">

            <div className="flex items-center gap-6">

              <a
                href="#"
                className="hover:text-text transition-colors"
              >
                About
              </a>

              <a
                href="#"
                className="hover:text-text transition-colors"
              >
                Support
              </a>

              <a
                href="#"
                className="hover:text-text transition-colors"
              >
                Contact
              </a>

            </div>

            <p>

              © 2026 CrowdFund.
              All rights reserved.

            </p>

          </div>

        </div>

      </div>

    </footer>

  );
}

export default Footer;