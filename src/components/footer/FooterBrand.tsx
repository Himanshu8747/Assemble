import { CodeIcon, GithubIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FooterBrand() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CodeIcon className="h-6 w-6" />
        <span className="text-xl font-bold">Assemble</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Empowering developers to collaborate, learn, and build amazing projects together.
      </p>
      <div className="flex space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}