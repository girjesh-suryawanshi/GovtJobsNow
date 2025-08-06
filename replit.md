# GovtJobsNow

## Overview

GovtJobsNow is a full-stack job portal web application designed to aggregate and display Indian government job listings. The application provides a clean, modern interface for job seekers to discover, search, filter, and apply for government positions across various departments and locations. The platform features automated job scraping capabilities, comprehensive search and filtering options, and a responsive design optimized for both desktop and mobile users.

## User Preferences

Preferred communication style: Simple, everyday language.
Filter order preference: Location filter should appear first in sidebar, followed by department and other filters.

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
Uses **PostgreSQL** with **Drizzle ORM** for persistent data storage:

- **Job Entities**: Comprehensive job records with metadata (title, department, location, qualifications, deadlines, etc.)
- **Search & Filtering**: Advanced query capabilities with pagination and database-level search
- **Duplicate Prevention**: Smart job insertion that prevents duplicate entries from scraping
- **Data Integrity**: Full ACID compliance with automatic cleanup of expired jobs

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

### Automated Job Scraping System
Comprehensive job scraping system that collects data from 25+ government sources:

- **Government Departments**: SSC, UPSC, IBPS, Railway Recruitment Board, Indian Army/Navy/Air Force, ISRO, DRDO
- **Banking Institutions**: State Bank of India, Punjab National Bank, Canara Bank, Union Bank, Reserve Bank of India  
- **State Governments**: Delhi, Maharashtra, Tamil Nadu, Karnataka, Uttar Pradesh employment portals
- **Job Blogs & Aggregators**: Sarkari Result, Free Job Alert, Freshers Live, Jagran Jobs, Naukri Government
- **Automated Scheduling**: Runs 4 times daily (every 6 hours) for fresh job listings
- **Smart Data Management**: Prevents duplicates and maintains data quality
- **Scalable Architecture**: Easy to add new job sources and extend functionality

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