# AI Universe - Complete Platform

A comprehensive no-code AI World builder platform with 15+ sponsor API integrations. Users can create personalized AI-powered "Worlds" (mini-apps) with chat, voice, video, blockchain, monetization, events, and social features.

## 🚀 Features

### Core AI Features
- **AI Chat**: Advanced conversational AI with OpenAI and Claude integration
- **Voice AI**: Natural voice interactions powered by ElevenLabs
- **Video Agents**: Interactive video AI personalities with Tavus
- **AI Copilot**: In-app help and guidance with Dappier

### Blockchain & Monetization
- **NFT Identities**: Mint unique NFT identities with Algorand
- **Crypto Payments**: Blockchain-based monetization
- **Subscriptions**: Recurring revenue with RevenueCat
- **IPFS Storage**: Decentralized storage via Nodely

### Community & Events
- **Live Events**: Virtual meetups and conferences with River
- **Social Sharing**: Reddit API integration for viral content
- **Build-in-Public**: DEV++ community integration
- **Multi-Language**: Global reach with Lingo API translations

### Deployment & Infrastructure
- **Custom Domains**: Professional branding with Entri
- **Auto-Deployment**: Netlify integration
- **Real-time Database**: Supabase backend
- **Error Monitoring**: Sentry integration

### UI & Design
- **Dynamic UI**: Pica dashboard generation
- **Responsive Design**: 21st.dev components
- **Dark/Light Mode**: Theme switching
- **Mobile-First**: PWA ready

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Database**: Supabase (Postgres + Auth + Realtime + Storage)
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Netlify with PWA support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-universe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys for all the integrations.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database schema (see Database Setup section)
   - Update your `.env` with Supabase credentials

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Setup

Create these tables in your Supabase project:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Worlds table
CREATE TABLE ai_worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  theme JSONB DEFAULT '{"color": "blue", "mode": "light"}',
  features JSONB DEFAULT '{}',
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional tables for subscriptions, events, NFTs, analytics, etc.
-- See full schema in the project documentation
```

Enable Row Level Security (RLS) and create appropriate policies for each table.

## 🔧 API Integrations

### Required API Keys

1. **Supabase** - Database and authentication
2. **OpenAI** - AI chat functionality
3. **ElevenLabs** - Voice synthesis
4. **Tavus** - Video AI agents
5. **Algorand** - Blockchain and NFTs
6. **RevenueCat** - Subscription management
7. **River** - Live events platform
8. **Lingo** - Multi-language support
9. **Entri** - Custom domain management
10. **Netlify** - Deployment platform
11. **Sentry** - Error monitoring
12. **Reddit API** - Social sharing
13. **DEV++** - Developer community
14. **Dappier** - AI copilot
15. **Pica** - UI generation
16. **21st.dev** - Design components

### Integration Setup

Each integration requires specific setup steps. See the individual integration guides in the `/docs` folder for detailed instructions.

## 🎨 Design System

The platform uses a comprehensive design system with:

- **Color System**: 6 color ramps (primary, secondary, accent, success, warning, error)
- **Typography**: 3 font weights maximum, proper line spacing
- **Spacing**: Consistent 8px spacing system
- **Components**: shadcn/ui with custom extensions
- **Animations**: Framer Motion for micro-interactions
- **Responsive**: Mobile-first breakpoints

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set environment variables in Netlify dashboard
   - Deploy automatically on push to main branch

### PWA Configuration

The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- App manifest for installation
- Optimized caching strategies

## 📱 User Flows

### 1. User Registration & Onboarding
- Email/password signup with Supabase Auth
- 3-step onboarding wizard
- Profile setup with avatar upload

### 2. World Creation
- 6-step world builder wizard
- Theme and design customization
- Feature selection and configuration
- One-click deployment

### 3. World Management
- Dashboard with analytics
- Real-time chat interface
- Event management
- Revenue tracking

### 4. Public World Experience
- Custom-themed world interface
- AI chat interactions
- Voice and video features
- Monetization and NFT minting

## 🔒 Security

- Row Level Security (RLS) on all database tables
- JWT-based authentication with Supabase
- API key management through environment variables
- CORS configuration for secure API access
- Input validation and sanitization

## 📊 Analytics & Monitoring

- User activity tracking
- World performance metrics
- Revenue analytics
- Error monitoring with Sentry
- Real-time dashboard updates

## 🌐 Internationalization

- Multi-language support with Lingo API
- RTL language support
- Dynamic content translation
- Language detection and switching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Documentation: `/docs` folder
- Issues: GitHub Issues
- Community: Discord server
- Email: support@ai-universe.com

## 🎯 Roadmap

- [ ] Advanced AI model selection
- [ ] More blockchain integrations
- [ ] Enhanced analytics dashboard
- [ ] Mobile app development
- [ ] Enterprise features
- [ ] API marketplace

---

Built with ❤️ by the AI Universe team. Powered by 15+ amazing sponsor APIs.