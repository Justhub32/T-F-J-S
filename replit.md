# ChillVibes Lifestyle Media Community

## Overview

ChillVibes is a comprehensive lifestyle media platform - "Red Bull meets CNBC" - combining Tech+Finance and Jiu-Jitsu+Surf content with real-time information updates. The community features AI-powered content generation, user engagement through comments and photo sharing, and monetization through targeted advertising.

**Vision**: A digital lifestyle community spreading chill vibes across technology, finance, adventure sports, and wellness.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Enhancements (January 2025)

### Comprehensive Lifestyle Media Platform
- **Real-time News Integration**: Enhanced content service now fetches real-time tech and finance news via NEWS_API_KEY
- **Subcategory System**: Added detailed subcategories across all content areas:
  - **Tech**: AI & Innovation, Blockchain, Mobile Apps
  - **Finance**: Travel Rewards, Crypto/DeFi, Markets
  - **Jiu-Jitsu**: Training & Mindset, Destinations, Competitions
  - **Surf**: Forecasting, Destinations, Conservation, Gear Reviews
- **Advanced Content Generation**: Combines AI-generated original content with real-time news feeds
- **Enhanced Database Schema**: Added subcategory, realtime flags, source URLs, and tags to articles
- **Lifestyle-First Approach**: All content filtered through ChillVibes perspective of balanced living

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom ocean/surf theme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful APIs with JSON responses
- **File Upload**: Multer middleware for image handling
- **Development**: Hot reload with Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations
- **In-Memory Storage**: Fallback MemStorage class for development
- **File Storage**: Local filesystem for uploaded images

## Key Components

### Database Schema
- **Articles Table**: Stores blog posts with title, content, excerpt, category, images, and metadata
- **Users Table**: Basic user management (currently minimal implementation)
- **Categories**: Two main categories - "tech-finance" and "jiu-jitsu-surf"

### API Endpoints
- `GET /api/articles` - Retrieve articles with optional category filtering
- `GET /api/articles/featured` - Get featured articles for homepage
- `GET /api/articles/:id` - Get single article by ID
- `POST /api/articles` - Create new article (admin)
- `PUT /api/articles/:id` - Update existing article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)
- `POST /api/upload` - Upload images for articles

### Frontend Pages
- **Home**: Landing page with featured articles and category navigation
- **Category**: Filtered article listings by category
- **Article**: Individual article view with full content
- **Admin**: Content management interface for creating/editing articles
- **404**: Custom not found page

### UI Features
- **Rich Text Editor**: Custom editor with formatting tools for article content
- **Image Upload**: Drag-and-drop image uploads with preview
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Theme System**: Custom ocean/surf color palette with CSS variables
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

1. **Article Creation**: Admin creates articles through rich text editor → Images uploaded to `/uploads` → Article data saved to database
2. **Content Delivery**: Frontend fetches articles via API → TanStack Query caches responses → Components render with loading/error states
3. **Navigation**: Wouter handles client-side routing → Dynamic imports for code splitting → SEO-friendly URLs
4. **Image Serving**: Static file serving from `/uploads` directory → Optimized with error handling

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, ReactDOM, React Query)
- Radix UI component primitives for accessibility
- Wouter for lightweight routing
- Drizzle ORM for type-safe database operations

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- ESBuild for server bundling

### Backend Dependencies
- Express.js for HTTP server
- Multer for file uploads
- Neon Database for PostgreSQL hosting
- TSX for TypeScript execution

### UI/UX Libraries
- Date-fns for date formatting
- Lucide React for icons
- Class Variance Authority for component variants
- CLSX for conditional CSS classes

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public` directory
- **Backend**: ESBuild bundles TypeScript server to `dist/index.js`
- **Assets**: Static files served from build output

### Environment Configuration
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection
- Development/production build differentiation

### File Structure
- Monorepo structure with `client/`, `server/`, and `shared/` directories
- Shared TypeScript types and schemas between frontend/backend
- Centralized configuration files at root level

### Hosting Considerations
- Designed for deployment on platforms like Replit, Vercel, or similar
- Static asset serving through Express in production
- Database migrations handled via Drizzle Kit
- Environment variable configuration for external services