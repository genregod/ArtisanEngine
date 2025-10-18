
# SmartArt AIO

**Your all-in-one release management platform for artists**

SmartArt AIO is a modern productivity platform designed to help music artists plan releases, schedule multi-platform posts, generate AI-powered content, and analyze performance—all from one powerful dashboard.

## 🎵 Features

### Release Management
- Plan and track your music releases with waterfall and momentum strategies
- Organize releases with timeline visualization
- Track release milestones and deliverables

### Content Calendar
- Pre-built content week templates based on proven marketing strategies
- Multi-platform scheduling for Instagram, TikTok, Facebook, and YouTube
- Drag-and-drop calendar interface for easy content planning
- Visual preview of scheduled posts

### AI-Powered Tools
- Generate captions optimized for each platform
- Create video scripts and ad copy
- A/B testing variations for content
- Platform-specific character limit enforcement

### Analytics Dashboard
- Track Spotify algorithm metrics
- Monitor YouTube performance
- Engagement analytics across all platforms
- Visual data representation with charts and graphs

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **Wouter** - Lightweight routing
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
- **Passport** - Authentication

### Development Tools
- **Vite** - Fast build tool and dev server
- **TypeScript** - Static typing
- **ESBuild** - Fast JavaScript bundler

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd smartart-aio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - The application uses Replit's secrets management
   - Configure your database connection
   - Set up any required API keys for AI features

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
smartart-aio/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
│   └── index.html
├── server/                # Backend application
│   ├── db.ts             # Database configuration
│   ├── routes.ts         # API routes
│   ├── index.ts          # Server entry point
│   └── replitAuth.ts     # Authentication setup
├── shared/               # Shared types and schemas
│   └── schema.ts
└── attached_assets/      # Marketing materials and documentation
```

## 🎨 Design System

SmartArt AIO follows a modern productivity design framework with these key principles:

- **Color Palette**: Royal Purple (#6B46C1) primary, Pink Accent (#EC4899) for engagement
- **Typography**: Inter for UI, Poppins for headings, JetBrains Mono for code
- **Components**: Consistent card-based layouts with purple accents
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

See `design_guidelines.md` for complete design specifications.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## 🔐 Authentication

The application uses Replit Auth for secure authentication. Users are automatically authenticated when they access the application through Replit.

## 📊 Database Schema

The application uses PostgreSQL with Drizzle ORM. Key tables include:
- Users - User accounts and profiles
- Releases - Music release planning and tracking
- Content - Scheduled posts and content calendar
- Analytics - Performance metrics and tracking

## 🌐 Deployment

The application is configured for deployment on Replit with autoscaling:

```bash
npm run build
npm start
```

The production build serves both the API and client on port 5000.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Advanced AI content generation
- [ ] Multi-user collaboration
- [ ] Advanced analytics and reporting
- [ ] Integration with more social platforms
- [ ] Mobile applications
- [ ] Automated posting to platforms

## 💡 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- Design inspired by modern productivity tools
- Built with the Replit platform
- Uses Shadcn/UI component library
- Marketing strategies based on industry best practices

---

**Built with ❤️ for artists who want to focus on their craft while managing their digital presence efficiently.**
