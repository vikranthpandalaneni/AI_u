import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useAuth } from '../contexts/AuthContext'
import { useWorldStore } from '../stores/worldStore'
import { generateSlug } from '../lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Palette,
  Bot,
  Coins,
  Users,
  Rocket,
  Globe,
  Mic,
  Video,
  MessageCircle,
  Calendar,
  Languages,
  Share2,
  DollarSign,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Name and describe your world' },
  { id: 2, title: 'Theme & Design', description: 'Customize the look and feel' },
  { id: 3, title: 'AI Features', description: 'Configure AI capabilities' },
  { id: 4, title: 'Blockchain & Monetization', description: 'Set up payments and NFTs' },
  { id: 5, title: 'Community & Events', description: 'Enable social features' },
  { id: 6, title: 'Deploy', description: 'Launch your world' }
]

const COLOR_THEMES = [
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { name: 'Red', value: 'red', color: 'bg-red-500' }
]

export function CreateWorldPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createWorld, loading } = useWorldStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [worldData, setWorldData] = useState({
    title: '',
    description: '',
    slug: '',
    theme: {
      color: 'blue',
      mode: 'light'
    },
    features: {
      chat: true,
      voice: false,
      video: false,
      nft: false,
      crypto: false,
      events: false,
      translations: false,
      social: false
    },
    public: true,
    domain: '',
    pricing: {
      free: true,
      premium: false,
      price: 0
    }
  })

  const progress = (currentStep / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTitleChange = (title: string) => {
    setWorldData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setWorldData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }))
  }

  const handleDeploy = async () => {
    if (!user) {
      console.error('No user found - cannot deploy world')
      return
    }

    try {
      const result = await createWorld({
        ...worldData,
        user_id: user.id
      })

      if (result.data) {
        navigate(`/w/${result.data.slug}`)
      } else if (result.error) {
        console.error('Failed to create world:', result.error)
      }
    } catch (error) {
      console.error('Failed to create world:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">World Name *</label>
              <Input
                value={worldData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="My Amazing AI World"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={worldData.description}
                onChange={(e) => setWorldData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what makes your world special..."
                className="w-full p-3 border rounded-md resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">ai-universe.com/w/</span>
                <Input
                  value={worldData.slug}
                  onChange={(e) => setWorldData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="my-world"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">Color Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <Button
                    key={theme.value}
                    variant={worldData.theme.color === theme.value ? 'default' : 'outline'}
                    onClick={() => setWorldData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, color: theme.value }
                    }))}
                    className="flex items-center gap-2 h-12"
                  >
                    <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Mode</label>
              <div className="flex gap-3">
                <Button
                  variant={worldData.theme.mode === 'light' ? 'default' : 'outline'}
                  onClick={() => setWorldData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, mode: 'light' }
                  }))}
                  className="flex-1"
                >
                  Light Mode
                </Button>
                <Button
                  variant={worldData.theme.mode === 'dark' ? 'default' : 'outline'}
                  onClick={() => setWorldData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, mode: 'dark' }
                  }))}
                  className="flex-1"
                >
                  Dark Mode
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Visibility</label>
              <div className="flex gap-3">
                <Button
                  variant={worldData.public ? 'default' : 'outline'}
                  onClick={() => setWorldData(prev => ({ ...prev, public: true }))}
                  className="flex-1 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Public
                </Button>
                <Button
                  variant={!worldData.public ? 'default' : 'outline'}
                  onClick={() => setWorldData(prev => ({ ...prev, public: false }))}
                  className="flex-1 flex items-center gap-2"
                >
                  <EyeOff className="w-4 h-4" />
                  Private
                </Button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${worldData.features.chat ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-lg">AI Chat</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.chat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('chat')}
                    >
                      {worldData.features.chat ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced conversational AI powered by OpenAI and Claude
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${worldData.features.voice ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg">Voice AI</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.voice ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('voice')}
                    >
                      {worldData.features.voice ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Natural voice interactions with ElevenLabs synthesis
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${worldData.features.video ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-500" />
                      <CardTitle className="text-lg">Video Agents</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.video ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('video')}
                    >
                      {worldData.features.video ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Interactive video AI personalities with Tavus
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="opacity-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-orange-500" />
                      <CardTitle className="text-lg">AI Copilot</CardTitle>
                    </div>
                    <Badge variant="secondary">Pro</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    In-app help and guidance with Dappier integration
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${worldData.features.nft ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <CardTitle className="text-lg">NFT Identities</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.nft ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('nft')}
                    >
                      {worldData.features.nft ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Mint unique NFT identities with Algorand blockchain
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${worldData.features.crypto ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg">Crypto Payments</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.crypto ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('crypto')}
                    >
                      {worldData.features.crypto ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Accept cryptocurrency payments and subscriptions
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Pricing Model</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="free"
                    checked={worldData.pricing.free}
                    onChange={() => setWorldData(prev => ({
                      ...prev,
                      pricing: { free: true, premium: false, price: 0 }
                    }))}
                  />
                  <label htmlFor="free" className="flex-1">
                    <div className="font-medium">Free Access</div>
                    <div className="text-sm text-muted-foreground">Anyone can access your world</div>
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="premium"
                    checked={worldData.pricing.premium}
                    onChange={() => setWorldData(prev => ({
                      ...prev,
                      pricing: { free: false, premium: true, price: 9.99 }
                    }))}
                  />
                  <label htmlFor="premium" className="flex-1">
                    <div className="font-medium">Premium Access</div>
                    <div className="text-sm text-muted-foreground">Charge for access to your world</div>
                  </label>
                  {worldData.pricing.premium && (
                    <div className="flex items-center gap-2">
                      <span>$</span>
                      <Input
                        type="number"
                        value={worldData.pricing.price}
                        onChange={(e) => setWorldData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, price: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-20"
                        step="0.01"
                        min="0"
                      />
                      <span>/month</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${worldData.features.events ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-lg">Live Events</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.events ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('events')}
                    >
                      {worldData.features.events ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Host virtual meetups and conferences with River
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${worldData.features.translations ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg">Multi-Language</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.translations ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('translations')}
                    >
                      {worldData.features.translations ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Global reach with Lingo API translations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${worldData.features.social ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-purple-500" />
                      <CardTitle className="text-lg">Social Sharing</CardTitle>
                    </div>
                    <Button
                      variant={worldData.features.social ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeatureToggle('social')}
                    >
                      {worldData.features.social ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Reddit integration and viral content sharing
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="opacity-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <CardTitle className="text-lg">Community Hub</CardTitle>
                    </div>
                    <Badge variant="secondary">Pro</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced community features and moderation
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Ready to Launch!</h3>
              <p className="text-muted-foreground mb-6">
                Your AI world is configured and ready to deploy. Review your settings below.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  World Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">{worldData.title}</div>
                  <div className="text-sm text-muted-foreground">{worldData.description}</div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{worldData.theme.color} theme</Badge>
                  <Badge variant="outline">{worldData.public ? 'Public' : 'Private'}</Badge>
                  {worldData.pricing.premium && (
                    <Badge variant="outline">${worldData.pricing.price}/month</Badge>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Enabled Features:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(worldData.features).map(([key, enabled]) => {
                      if (!enabled) return null
                      const labels = {
                        chat: 'AI Chat',
                        voice: 'Voice AI',
                        video: 'Video Agents',
                        nft: 'NFT Identities',
                        crypto: 'Crypto Payments',
                        events: 'Live Events',
                        translations: 'Multi-Language',
                        social: 'Social Sharing'
                      }
                      return (
                        <Badge key={key} variant="secondary">
                          {labels[key as keyof typeof labels]}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Domain (Optional)</label>
              <Input
                value={worldData.domain}
                onChange={(e) => setWorldData(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="myworld.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Connect your own domain with Entri integration
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create AI World</h1>
            <p className="text-muted-foreground">
              Build your personalized AI-powered experience in minutes
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center mt-2 min-w-0">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    step.id < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!worldData.title}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleDeploy}
              disabled={loading || !worldData.title || !user}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy World
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  )
}