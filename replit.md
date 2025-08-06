# GovtJobsNow

## Overview

GovtJobsNow is a full-stack job portal web application designed to aggregate and display Indian government job listings. The application provides a clean, modern interface for job seekers to discover, search, filter, and apply for government positions across various departments and locations. The platform features automated job scraping capabilities, comprehensive search and filtering options, and a responsive design optimized for both desktop and mobile users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React** with **TypeScript** and styled with **Tailwind CSS** using the shadcn/ui component library. The application follows a modern component-based architecture with:

- **Routing**: Uses wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui styling for consistent, accessible components
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The backend is an **Express.js** server written in **TypeScript** that provides:

- **RESTful API**: Clean REST endpoints for job management operations
- **Data Storage**: In-memory storage with interfaces designed for easy migration to persistent databases
- **Web Scraping**: Mock scraping module that simulates job data collection from government websites
- **CORS Support**: Configured for frontend-backend communication
- **Development Integration**: Hot reload and error handling for development workflow

### Database Design
Currently uses an in-memory storage system with a well-defined interface that supports:

- **Job Entities**: Comprehensive job records with metadata (title, department, location, qualifications, deadlines, etc.)
- **Search & Filtering**: Advanced query capabilities with pagination
- **Future-Ready**: Interface designed for easy migration to PostgreSQL with Drizzle ORM (schema already defined)

### API Structure
RESTful endpoints following standard conventions:

- `GET /api/jobs` - List jobs with search/filter parameters
- `GET /api/jobs/:id` - Get individual job details  
- `POST /api/jobs` - Create new job listings (admin functionality)
- `PUT /api/jobs/:id` - Update existing jobs (admin functionality)
- `GET /api/stats` - Dashboard statistics

### Component Architecture
Modular React components organized by feature:

- **Layout Components**: Header, Footer, Hero section
- **Job Components**: Job cards, detail modals, filters sidebar
- **UI Components**: Reusable shadcn/ui components
- **Page Components**: Home, job detail, and error pages

### Scraping Module
Mock web scraping system that simulates data collection from government job portals:

- **Multi-source Support**: Designed to handle multiple government websites
- **Data Standardization**: Normalizes job data into consistent format
- **Scalable Architecture**: Easy to extend with real scraping implementations

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (prepared for future use)
- **drizzle-orm**: Type-safe database ORM with PostgreSQL schema definitions
- **express**: Node.js web framework for API server
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and developer experience
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development tools
- **wouter**: Lightweight routing library

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### Date and Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation

The application is structured to be easily deployable on Replit with all necessary configurations for development and production environments.