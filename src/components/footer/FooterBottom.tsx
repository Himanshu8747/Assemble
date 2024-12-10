export function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Assemble. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </div>
  );
}