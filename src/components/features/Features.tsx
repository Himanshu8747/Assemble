import { Code, Users2, MessageCircle, GitGraphIcon as Git, Lock, Zap, Share2, Palette, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
)

export default function Features() {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-blue-600" />,
      title: "Real-Time Coding",
      description: "Code together in real-time with multiple developers on the same project"
    },
    {
      icon: <Users2 className="w-6 h-6 text-green-600" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members in a shared workspace"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Instant Chat",
      description: "Communicate effectively with built-in chat and discussion features"
    },
    {
      icon: <Git className="w-6 h-6 text-orange-600" />,
      title: "Version Control",
      description: "Built-in Git integration for seamless code versioning and collaboration"
    },
    {
      icon: <Lock className="w-6 h-6 text-red-600" />,
      title: "Secure Workspace",
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Fast Performance",
      description: "Lightning-fast code synchronization and minimal latency"
    },
    {
      icon: <Share2 className="w-6 h-6 text-indigo-600" />,
      title: "Easy Sharing",
      description: "Share your workspace with a single click and invite collaborators"
    },
    {
      icon: <Palette className="w-6 h-6 text-pink-600" />,
      title: "Customizable IDE",
      description: "Personalize your coding environment with themes and extensions"
    },
    {
      icon: <Terminal className="w-6 h-6 text-gray-600" />,
      title: "Integrated Terminal",
      description: "Access command line tools directly within the platform"
    }
  ]

  return (
    <section className="py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Developers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to code, collaborate, and ship amazing projects together
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg transition-colors duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  )
}

