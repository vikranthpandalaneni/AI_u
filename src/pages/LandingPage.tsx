import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Header } from '../components/layout/Header'
import {
  Sparkles,
  Zap,
  Globe,
  Users,
  Calendar,
  DollarSign,
  Mic,
  Video,
  MessageCircle,
  Coins,
  Languages,
  TrendingUp,
  Shield,
  Rocket,
  ArrowRight,
  Check,
  Star
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Chat',
    description: 'Advanced conversational AI with OpenAI and Claude integration',
    color: 'text-purple-500'
  },
  {
    icon: Mic,
    title: 'Voice AI',
    description: 'Natural voice interactions powered by ElevenLabs',
    color: 'text-blue-500'
  },
  {
    icon: Video,
    title: 'Video Agents',
    description: 'Interactive video AI personalities with Tavus',
    color: 'text-green-500'
  },
  {
    icon: Coins,
    title: 'Blockchain & NFTs',
    description: 'Mint NFT identities and crypto monetization with Algorand',
    color: 'text-orange-500'
  },
  {
    icon: Calendar,
    title: 'Live Events',
    description: 'Host virtual meetups and conferences with River',
    color: 'text-pink-500'
  },
  {
    icon: DollarSign,
    title: 'Monetization',
    description: 'Subscription management and payments with RevenueCat',
    color: 'text-emerald-500'
  },
  {
    icon: Languages,
    title: 'Multi-Language',
    description: 'Global reach with Lingo API translations',
    color: 'text-indigo-500'
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Professional branding with Entri domain management',
    color: 'text-cyan-500'
  }
]

const integrations = [
  'OpenAI', 'ElevenLabs', 'Tavus', 'Algorand', 'River', 'RevenueCat',
  'Lingo', 'Entri', 'Supabase', 'Netlify', 'Sentry', 'Reddit API',
  'DEV++', 'Dappier', 'Pica', '21st.dev'
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '1 AI World',
      'Basic AI chat',
      'Community support',
      'Public worlds only',
      'AI Universe branding'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For creators and businesses',
    features: [
      'Unlimited AI Worlds',
      'All AI features',
      'Custom domains',
      'Private worlds',
      'Analytics dashboard',
      'Priority support',
      'Remove branding'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'White-label solution',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Advanced analytics'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

const trendingWorlds = [
  {
    title: 'AI Startup Advisor',
    description: 'Get personalized advice for your startup journey',
    creator: 'TechGuru',
    views: '12.5K',
    category: 'Business'
  },
  {
    title: 'Language Learning Buddy',
    description: 'Practice conversations in 50+ languages',
    creator: 'PolyglotAI',
    views: '8.3K',
    category: 'Education'
  },
  {
    title: 'Meditation & Mindfulness',
    description: 'Guided meditation with AI voice coaching',
    creator: 'ZenMaster',
    views: '15.7K',
    category: 'Wellness'
  }
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              🚀 15+ AI Integrations • No Code Required
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Build Your Own{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Universe
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create personalized AI-powered worlds with chat, voice, video, blockchain, 
              and monetization features. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth?mode=signup">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore">
                  Explore Worlds
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Deploy in minutes
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                15+ integrations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Build Amazing AI Worlds
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful integrations that work together seamlessly to create 
              engaging AI-powered experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Worlds */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trending AI Worlds</h2>
            <p className="text-xl text-muted-foreground">
              Discover what creators are building with AI Universe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingWorlds.map((world, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{world.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {world.views}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{world.title}</CardTitle>
                  <CardDescription>{world.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      by {world.creator}
                    </span>
                    <Button variant="ghost" size="sm">
                      Visit World
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/explore">
                Explore All Worlds
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">
              15+ premium integrations working together seamlessly
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-background rounded-lg border hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-center">
                  {integration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-lg text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to={plan.name === 'Enterprise' ? '/contact' : '/auth?mode=signup'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your AI Universe?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators building the future of AI-powered experiences.
              Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth?mode=signup">
                  Start Building Free
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600" asChild>
                <Link to="/explore">
                  Explore Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AI Universe</span>
              </div>
              <p className="text-muted-foreground">
                Build, deploy, and monetize AI-powered worlds with no code required.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/explore" className="hover:text-foreground">Explore Worlds</Link></li>
                <li><Link to="/events" className="hover:text-foreground">Events</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/discord" className="hover:text-foreground">Discord</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link to="/status" className="hover:text-foreground">Status</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 AI Universe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}