import { Button } from "@/components/ui/button";
import { GithubIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Link to="/" className="text-xl font-bold">
            Assemble
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/features">Features</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/community">Community</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Himanshu8747/Assemble"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
