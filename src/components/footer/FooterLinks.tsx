import { MessagesSquareIcon, UsersIcon, CodeIcon, BookOpenIcon } from 'lucide-react';

interface FooterSection {
  title: string;
  links: Array<{
    href: string;
    text: string;
    icon?: React.ReactNode;
  }>;
}

const footerSections: FooterSection[] = {
  features: {
    title: "Features",
    links: [
      { href: "/chat", text: "Real-time Chat", icon: <MessagesSquareIcon className="h-4 w-4" /> },
      { href: "/collaborate", text: "Team Collaboration", icon: <UsersIcon className="h-4 w-4" /> },
      { href: "/share", text: "Code Sharing", icon: <CodeIcon className="h-4 w-4" /> },
      { href: "/docs", text: "Documentation", icon: <BookOpenIcon className="h-4 w-4" /> }
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { href: "/docs", text: "Documentation" },
      { href: "/blog", text: "Blog" },
      { href: "/tutorials", text: "Tutorials" },
      { href: "/showcase", text: "Showcase" }
    ]
  },
  company: {
    title: "Company",
    links: [
      { href: "/about", text: "About Us" },
      { href: "/careers", text: "Careers" },
      { href: "/privacy", text: "Privacy Policy" },
      { href: "/terms", text: "Terms of Service" }
    ]
  }
};

function FooterLink({ href, text, icon }: { href: string; text: string; icon?: React.ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${icon ? 'flex items-center space-x-2' : ''}`}
      >
        {icon && icon}
        <span>{text}</span>
      </a>
    </li>
  );
}

export function FooterLinks() {
  return (
    <>
      {Object.entries(footerSections).map(([key, section]) => (
        <div key={key}>
          <h3 className="font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <FooterLink 
                key={link.href}
                href={link.href}
                text={link.text}
                icon={link.icon}
              />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}