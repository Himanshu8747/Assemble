import React from "react";
import { Button } from "@/components/ui/button";
import { CodeIcon, UsersIcon, MessageSquareIcon } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Collaborate on Code in Real-Time
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        A powerful platform for developers to code together, share ideas, and
        build amazing projects in real-time.
      </p>
      <div className="flex justify-center gap-4 mb-12">
        <Button size="lg" onClick={onGetStarted}>
          Get Started
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <FeatureCard
          icon={<CodeIcon className="h-6 w-6" />}
          title="Real-Time Coding"
          description="Code together in real-time with multiple developers"
        />
        <FeatureCard
          icon={<UsersIcon className="h-6 w-6" />}
          title="Team Collaboration"
          description="Work seamlessly with your team members"
        />
        <FeatureCard
          icon={<MessageSquareIcon className="h-6 w-6" />}
          title="Instant Chat"
          description="Communicate effectively with built-in chat"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
