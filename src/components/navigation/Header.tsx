import { Button } from '@/components/ui/button';
import { GithubIcon, MenuIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
          <a href='/' className="text-xl font-bold">Assemble</a>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Projects</Button>
          <Button variant="ghost">Community</Button>
        </nav>
        <div className="flex items-center space-x-4">
          <a href="https://github.com/Himanshu8747/Assemble">
            <GithubIcon className="h-5 w-5" />
          </a>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
