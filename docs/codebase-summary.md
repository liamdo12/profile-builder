# Codebase Summary

**Generated:** 2026-02-28
**Repository:** Profile Builder (Full-stack AI Resume Platform)
**Status:** Active Development

## Project Statistics

- **Total Files:** 179
- **Total Tokens:** ~280K (repomix output)
- **Primary Languages:** TypeScript/React (Frontend), Java/Spring Boot (Backend)
- **Database:** PostgreSQL with pgvector

## Repository Structure

```
profile-builder/
├── frontend/                          # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/                # Component library
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── layout/                # AppLayout, Sidebar (Theme removed)
│   │   │   ├── resume/                # Resume-specific components
│   │   │   ├── cover-letter/          # Cover letter with document section
│   │   │   ├── job-crawler/           # Job crawler components
│   │   │   │   ├── job-search-form.tsx
│   │   │   │   ├── job-search-list.tsx
│   │   │   │   ├── telegram-setup-section.tsx
│   │   │   │   ├── crawl-schedule-section.tsx
│   │   │   │   └── job-results-section.tsx
│   │   │   └── shared/                # Shared components
│   │   ├── pages/                     # Route components (9 pages)
│   │   ├── api/                       # API client helpers
│   │   │   ├── job-crawler-api.ts     # Job crawler API client
│   │   │   └── resumeApi.ts           # Resume/document API
│   │   ├── lib/                       # Utility functions
│   │   │   └── format-est-timestamp.ts # EST timestamp formatter
│   │   ├── types/                     # TypeScript interfaces
│   │   │   ├── job-crawler.ts         # Job crawler types
│   │   │   ├── smart-resume.ts        # Resume types
│   │   │   └── document.ts            # Document types
│   │   ├── styles/                    # Global CSS + templates
│   │   ├── App.tsx                    # Root component
│   │   └── main.tsx                   # Entry point
│   ├── Dockerfile                     # Multi-stage build (frontend)
│   ├── package.json                   # Dependencies
│   └── vite.config.ts                 # Build configuration
│
├── backend/                           # Spring Boot 3 + Java
│   ├── src/main/java/com/profilebuilder/
│   │   ├── ai/                        # AI integration
│   │   │   └── agent/                 # Specialized AI agents
│   │   ├── config/                    # Spring configuration
│   │   │   ├── AsyncConfig.java       # Async task executor (NEW)
│   │   │   └── RestTemplateConfig.java # Rest client config (NEW)
│   │   ├── controller/                # REST endpoints
│   │   │   ├── JobSearchController.java (NEW)
│   │   │   ├── TelegramController.java (NEW)
│   │   │   ├── CrawlScheduleController.java (NEW)
│   │   │   └── CrawledJobController.java (NEW)
│   │   ├── service/                   # Business logic
│   │   │   ├── JobSearchService.java (NEW)
│   │   │   ├── CrawledJobService.java (NEW)
│   │   │   ├── TelegramConfigService.java (NEW)
│   │   │   ├── CrawlScheduleService.java (NEW)
│   │   │   ├── TelegramNotificationService.java (NEW)
│   │   │   ├── CrawlerClientService.java (NEW)
│   │   │   ├── CrawlOrchestrationService.java (NEW)
│   │   │   └── CrawlSchedulerService.java (NEW)
│   │   ├── model/                     # Entities, DTOs, Enums
│   │   │   ├── entity/
│   │   │   │   ├── JobSearch.java (NEW)
│   │   │   │   ├── CrawledJob.java (NEW)
│   │   │   │   ├── TelegramConfig.java (NEW)
│   │   │   │   └── CrawlSchedule.java (NEW)
│   │   │   ├── dto/
│   │   │   │   ├── JobSearchRequest.java (NEW)
│   │   │   │   ├── JobSearchResponse.java (NEW)
│   │   │   │   ├── CrawledJobResponse.java (NEW)
│   │   │   │   ├── TelegramConfigRequest.java (NEW)
│   │   │   │   ├── TelegramConfigResponse.java (NEW)
│   │   │   │   ├── CrawlerResponse.java (NEW)
│   │   │   │   └── CrawlScheduleRequest.java (NEW)
│   │   │   └── enum/
│   │   │       └── SourceSite.java (NEW: LINKEDIN, INDEED, GITHUB)
│   │   ├── repository/                # JPA repositories
│   │   │   ├── JobSearchRepository.java (NEW)
│   │   │   ├── CrawledJobRepository.java (NEW)
│   │   │   ├── TelegramConfigRepository.java (NEW)
│   │   │   └── CrawlScheduleRepository.java (NEW)
│   │   ├── exception/                 # Custom exceptions
│   │   ├── util/                      # Utility classes
│   │   │   └── HashUtil.java (NEW: for URL hash generation)
│   │   └── security/                  # Security & auth
│   ├── src/main/resources/
│   │   ├── application.yml            # Configuration (updated with crawler settings)
│   │   ├── db/migrations/             # Flyway migrations
│   │   └── prompts/                   # AI prompts
│   ├── src/test/java/                 # Unit tests
│   ├── pom.xml                        # Maven dependencies
│   └── Dockerfile                     # Multi-stage build (backend)
│
├── crawler/                           # Node.js Crawler Microservice (NEW)
│   ├── src/
│   │   ├── scrapers/                  # Scraper implementations
│   │   │   ├── linkedin-scraper.js
│   │   │   ├── indeed-scraper.js
│   │   │   └── github-scraper.js
│   │   ├── server.js                  # Express server
│   │   └── utils/
│   ├── Dockerfile                     # Multi-stage (Playwright base image)
│   ├── package.json                   # Dependencies (playwright, express, stealth-plugin)
│   └── .dockerignore
│
├── infra/                             # Infrastructure as Code (Terraform) [ARCHIVED - AWS removed March 2026]
│
├── docs/                              # Documentation (NEW)
│   ├── project-overview-pdr.md        # Project overview & requirements
│   ├── tech-stack.md                  # Technology stack details
│   ├── code-standards.md              # Code standards & conventions
│   ├── system-architecture.md         # System architecture & flows
│   └── codebase-summary.md            # This file
│
├── plans/                             # Development plans & tracking
│   ├── 260221-0023-frontend-shadcn-redesign/
│   │   ├── plan.md
│   │   └── phase-*.md                 # Phase-by-phase breakdown
│   └── 260220-2205-resume-generation-rewrite/
│       └── ...
│
├── .github/workflows/                 # GitHub Actions CI/CD (deploy removed)
├── docker-compose.yml                 # Local dev environment
├── .gitignore                         # Updated with Terraform entries
├── .repomixignore                     # Files excluded from repomix
├── CLAUDE.md                          # Claude Code instructions
└── README.md                          # Project overview
```

## Frontend Architecture

### Tech Stack
- **Framework:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.3.1
- **UI Framework:** shadcn/ui (Radix UI + Tailwind CSS v4)
- **Styling:** Tailwind CSS 4.2.0 with CSS variables
- **Routing:** React Router 7.13.0
- **HTTP:** Axios 1.13.5
- **Notifications:** Sonner 2.0.7
- **Icons:** lucide-react 0.575.0
- **PDF Export:** html2pdf.js 0.14.0
- **HTML Sanitization:** DOMPurify 3.3.1 (for safe HTML rendering)

### Key Features Implemented

**Pages (9 total)**
1. LandingPage - Public marketing page (light-only, soft gradient design)
2. LoginPage - User login with email/password (light styling)
3. RegisterPage - User registration with email/password (light styling)
4. DocumentListPage - Browse uploaded documents with delete action
5. SmartResumeSetupPage - AI resume setup with inline document upload/delete
6. SmartResumeResultPage - AI-generated resume display
7. CoverLetterSetupPage - 3-step cover letter with bordered sections, paste support
8. CoverLetterResultPage - Generated cover letter display with on-demand evaluation
9. JobCrawlerPage - Job search automation with Telegram notifications (PREMIUM+ only, 4 tabs)

**Component Organization**
- `src/components/ui/` - 15 shadcn/ui primitive components (added AlertDialog)
- `src/components/layout/` - AppLayout, AppSidebar (ThemeProvider/ThemeToggle removed)
- `src/components/landing/` - Landing page sections (light-only design, no noise overlay)
- `src/components/resume/` - SmartResumePaper, HrValidationPanel, RecommendationCard
- `src/components/cover-letter/` - CoverLetterDisplay, CoverLetterEvaluationPanel, DocumentSection
- `src/components/job-crawler/` - JobSearchForm, JobSearchList, TelegramSetupSection, CrawlScheduleSection, JobResultsSection
- `src/components/auth/` - ProtectedRoute, RequireRole
- `src/components/shared/` - GenerationOverlay, common UI patterns

**Auth Context** (NEW)
- `src/contexts/auth-context.tsx` - AuthProvider context with token state management
- `src/contexts/auth-context-value.ts` - AuthContextValue interface & token types
- `src/contexts/use-auth.ts` - useAuth hook for accessing auth state and methods
- Token hydration on app load, axios interceptor for Bearer token injection
- Automatic token refresh on 401 errors with request retry queue

**Styling System**
- Tailwind CSS v4 (CSS-first configuration)
- CSS custom properties for light-only theme
- Mobile-first responsive design (sm, md, lg, xl breakpoints)
- Touch-friendly UI (44px minimum tap targets)
- **Landing Page Design (Feb 2026):** Light-only soft gradient aesthetic with pastel indigo/purple palette

### Recent UI Enhancements (Feb 2026)

**Dark Mode Removal & Light Theme:**
- Landing page redesigned with light-only soft gradient aesthetic (pastel indigo/purple)
- Auth pages (Login, Register) now light-only
- Removed: ThemeProvider, ThemeToggle, dark mode CSS, landing-noise-overlay.tsx
- All pages now light-only (no theme toggle)

**Telegram Notifications Enhanced:**
- Job messages now include source site emoji (LinkedIn/Indeed/GitHub)
- Date posted timestamp included in notifications

**Session Token Updates:**
- Refresh token changed from 7 days to 24 hours
- Access token remains 15 minutes

**Document Management:**
- New DELETE /api/documents/{id} endpoint
- Frontend deleteDocument() API function with AlertDialog confirmation
- Delete buttons on DocumentListPage, SmartResumeSetupPage, CoverLetterSetupPage

**UI Component Improvements:**
- New AlertDialog component for confirmations
- Clipboard paste support (Cmd+V) for image uploads via FileUploadDropzone
- EST timestamp formatting via shared formatEstTimestamp() utility
- Inline resume upload in SmartResumeSetupPage and CoverLetterSetupPage
- DocumentSection component with bordered step separation on CoverLetterSetupPage

**Page Removals:**
- UploadPage deleted (upload functionality moved inline to SmartResumeSetupPage, CoverLetterSetupPage)

**UI Framework Migration (Feb 2026):**
- From Ant Design → shadcn/ui + Tailwind CSS v4
- Removed: antd, @ant-design/icons, @ant-design/colors
- Added: shadcn/ui, tailwindcss, lucide-react, sonner, html2pdf.js
- Navigation: Horizontal header → Sidebar with mobile hamburger
- Notifications: antd message → Sonner toast
- Theme: Dark-only → Dark/light toggle with persistence
- File structure: Reorganized into layout, shared, ui, resume, landing directories

**Smart Resume Enhancement (Feb 2026):**
- Enhanced recommendation system with structured `RecommendationItem` objects
- Added two-column layout (sticky resume + scrollable validation)
- New `recommendation-card.tsx` component for displaying suggestions
- Integrated DOMPurify for sanitized `<b>` tag rendering
- Backend support for section-specific recommendations with metadata
- Dual-mode resume generation (from scratch vs. apply recommendations)
- Score-based recommendation count: 0-5 based on overall ATS score

### State Management Pattern
- React hooks (useState, useEffect, useContext)
- ThemeProvider context for light/dark mode
- Local component state for forms and UI
- Axios interceptors for API calls

## Backend Architecture

### Tech Stack
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Build Tool:** Maven 3.8+
- **Database:** PostgreSQL 16
- **ORM:** Spring Data JPA / Hibernate
- **Migration:** Flyway
- **Security:** Spring Security 6, JWT (jjwt 0.12.6)
- **Password Hashing:** bcrypt via Spring Security
- **AI Integration:** Claude, OpenAI GPT-4, Google Gemini APIs
- **Testing:** JUnit 5, Mockito, Spring Boot Test

### REST API Endpoints (Controllers)

**AuthController** (NEW - Authentication)
- POST /api/auth/register - Register new user (email, password) → creates BASIC user
- POST /api/auth/login - Login (email, password) → returns accessToken + refreshToken
- POST /api/auth/refresh - Refresh access token using refresh token
- GET /api/auth/me - Get current authenticated user info

**AdminController** (NEW - User Management)
- GET /api/admin/users - List all users (ADMIN only)
- PUT /api/admin/users/{id} - Update user role (ADMIN only)

**DocumentController** (Updated - Now Scoped to User)
- POST /api/documents/upload - Upload documents (requires authentication)
- GET /api/documents - List user's documents
- GET /api/documents/{id} - Get document details
- DELETE /api/documents/{id} - Delete document

**SmartResumeController** (Updated - Now Scoped to User)
- POST /api/smart-resumes/generate - AI-powered generation (user-scoped)
- GET /api/smart-resumes/{id} - Get user's AI resume
- GET /api/smart-resumes/{id}/validation - Get HR validation

**CoverLetterController** (Updated - Role-Protected)
- POST /api/cover-letter/generate - Generate cover letter (@PreAuthorize PREMIUM/ADMIN)
- GET /api/cover-letter/{id} - Retrieve generated cover letter
- POST /api/cover-letter/{id}/evaluate - Evaluate cover letter quality

**JobSearchController** (NEW - Job Crawler Management)
- POST /api/job-searches - Create job search (@PreAuthorize PREMIUM/ADMIN)
- GET /api/job-searches - List user's searches (paginated)
- PUT /api/job-searches/{id} - Update search criteria
- DELETE /api/job-searches/{id} - Delete search

**TelegramController** (NEW - Telegram Integration)
- POST /api/telegram - Add Telegram config (chatId)
- GET /api/telegram - Get current config
- POST /api/telegram/verify - Send test message to verify chat_id
- DELETE /api/telegram - Remove Telegram integration

**CrawlScheduleController** (NEW - Schedule Configuration)
- GET /api/crawl-schedule - Get schedule config
- PUT /api/crawl-schedule - Update interval and enable/disable

**CrawledJobController** (NEW - Job Results)
- GET /api/crawled-jobs - List jobs (paginated, user-scoped)
- POST /api/crawled-jobs/crawl-now - Trigger immediate crawl
- DELETE /api/crawled-jobs/{id} - Delete individual job result

### Service Layer

**Authentication & Authorization** (NEW)
- **AuthService** - User registration, login, token generation/validation, refresh token handling
- User authentication via Spring Security with JWT tokens

**Core Services**
- **DocumentService** - Manage document uploads (user-scoped queries)
- **JdExtractionService** - Extract JD requirements & keywords

**Smart Resume Services**
- **SmartResumeOrchestrationService** - Orchestrates full workflow
- **SmartResumeGenerationService** - AI-powered content generation with dual-mode support:
  - Mode A: Generate complete resume from scratch
  - Mode B: Apply targeted recommendations to existing resume

**Cover Letter Services**
- **CoverLetterOrchestrationService** - Orchestrates company research → cover letter generation pipeline
- **CoverLetterGenerationService** - Manages persistence, evaluation, and retrieval of cover letters

**Job Crawler Services (NEW)**
- **JobSearchService** - Manage search criteria (create, update, delete, enable/disable)
- **CrawledJobService** - Manage job results (save, delete, deduplicate by URL hash)
- **TelegramConfigService** - Telegram integration (add, verify, enable/disable)
- **CrawlScheduleService** - Schedule configuration (get, update intervals)
- **TelegramNotificationService** - Send job notifications to Telegram
- **CrawlerClientService** - HTTP client to Node.js crawler (port 3001)
- **CrawlOrchestrationService** - Main orchestrator (searches → crawler → save jobs → notify)
- **CrawlSchedulerService** - Scheduled task executor (@Scheduled, default 6-hour interval)

### AI Agent Architecture

**Specialized AI Agents** (Located in `ai/agent/`)
- **ResumeGeneratorAgent** - Generate AI-enhanced resume content
- **HrValidatorAgent** - Validate ATS compliance
- **CompanyResearchAgent** - Web search (Tavily) to research target company
- **CoverLetterGeneratorAgent** - Generate tailored cover letter content
- **CoverLetterEvaluatorAgent** - Evaluate cover letter quality and relevance

**Multi-LLM Orchestration**
- Primary: Claude API (claude-3.5-sonnet)
- Secondary: OpenAI GPT-4
- Tertiary: Google Gemini
- Fallback mechanism for reliability

### Database Schema

**Tables (9 main)**
1. **documents** - Uploaded files metadata
2. **smart_generated_resumes** - AI-generated resumes
3. **smart_hr_validations** - HR validation feedback
4. **pb_generated_cover_letters** - Generated cover letters with company research
5. **pb_cover_letter_evaluations** - Cover letter evaluation results
6. **pb_job_searches** - User-configured job search criteria (NEW)
7. **pb_crawled_jobs** - Scraped job results with deduplication hash (NEW)
8. **pb_telegram_configs** - Telegram bot settings per user (NEW)
9. **pb_crawl_schedules** - Crawler schedule configuration (NEW)

### Configuration
- `application.yml` - Spring Boot configuration
- Environment variables for API keys
- Multi-profile support (dev, test, prod)

## API Integration

### AI Model Integration
- **Claude API:** Main model for resume generation
- **OpenAI GPT-4:** Alternative/fallback
- **Google Gemini:** Additional option

### Prompt Management
- Organized by function in `src/main/resources/prompts/`
- Parameterized for flexibility
- Versioned for consistency
- Includes: resume-generator, hr-validator, company-research, cover-letter-generator, cover-letter-evaluator

### Request/Response Pattern
```json
{
  "status": "success|error",
  "data": { /* response data */ },
  "message": "User-friendly message",
  "timestamp": "ISO-8601"
}
```

## Development Workflow

### Local Development Setup
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Database
docker-compose up  # PostgreSQL + pgvector
```

### Build & Test
- Frontend: `npm run build`, `npm run lint`
- Backend: `mvn clean package`, `mvn test`

### Git Workflow
- Feature branches from main
- Conventional commit messages
- Code review before merge
- Automated testing via CI/CD (planned)

## Code Quality Standards

### Frontend Standards
- TypeScript: All code must be type-safe (no `any`)
- Linting: ESLint with React hooks rules
- Testing: Unit & integration tests (70% coverage target)
- File size: Components < 200 lines (split large components)
- Naming: PascalCase for components, camelCase for variables
- Security: DOMPurify sanitization for HTML rendering, input validation

### Backend Standards
- Java conventions: PascalCase for classes, camelCase for methods
- JPA: All entities properly annotated
- Testing: Unit tests for services, integration tests for controllers
- Error handling: Custom exceptions with GlobalExceptionHandler
- Documentation: JavaDoc for public APIs

## Documentation Structure

**New Documentation Files (Feb 2026)**
1. **project-overview-pdr.md** (780 LOC)
   - Project summary and vision
   - Functional & non-functional requirements
   - Success metrics and roadmap

2. **tech-stack.md** (280 LOC)
   - Complete technology dependencies
   - Version information
   - Migration history

3. **code-standards.md** (450 LOC)
   - File organization conventions
   - Naming standards
   - Code patterns and best practices
   - Performance guidelines

4. **system-architecture.md** (550 LOC)
   - High-level architecture diagrams
   - Data flow architectures
   - Component hierarchy
   - Database schema details
   - AI integration architecture
   - Deployment strategy

5. **codebase-summary.md** (This file)
   - Repository overview
   - Key statistics and structure
   - Architecture summaries
   - Development workflow

## Key Metrics

### Code Statistics
- Frontend: ~2,500 LOC (React/TypeScript)
- Backend: ~3,500 LOC (Java/Spring Boot)
- Database: 7 main tables + migration scripts
- Documentation: ~2,500 LOC (NEW)

### Performance Targets
- API response: < 2 seconds
- PDF generation: < 10 seconds
- Smart resume generation: < 5 seconds
- UI interactions: < 100ms

### Reliability Targets
- Uptime: 99.5%
- AI model fallback mechanism implemented
- Graceful error handling in all services

## Recent Development (Feb 2026)

### Completed Phases
1. **Foundation Setup** - Database, backend services, basic frontend
2. **UI Framework Migration** - Ant Design → shadcn/ui + Tailwind v4
3. **Smart Resume System** - AI orchestration, HR validation, company research
4. **Responsive Design** - Mobile-first Tailwind CSS implementation
5. **Cover Letter Generator** - Company research agent, cover letter generation, evaluation pipeline
6. **Job Crawler with Telegram Notifications** - Multi-source job scraper, scheduled crawling, Telegram alerts (NEW)

### Job Crawler Feature (NEW - Feb 2026)

**Architecture:**
- **Microservice Design:** Separate Node.js crawler service (port 3001) using Playwright + stealth plugin
- **Multi-Source Scraping:** LinkedIn, Indeed, GitHub job listings
- **Scheduled Execution:** Configurable intervals (default 6 hours) with CrawlSchedulerService
- **Deduplication:** MD5 hashing of source URLs to prevent duplicate saves
- **Real-Time Notifications:** Telegram bot integration for instant job alerts
- **User Isolation:** All data scoped by user_id with role-based access (@PreAuthorize PREMIUM/ADMIN)

**Components:**
- Backend: 4 entities, 4 repositories, 8 services, 4 controllers, 2 config classes
- Frontend: JobCrawlerPage with 4 tabs, 5 specialized components, API client, TypeScript types
- Microservice: Express server with 3 scraper implementations, health endpoint

**Integration Points:**
- Frontend nav: Sidebar item "Job Crawler" (PREMIUM+ only)
- Backend APIs: 12 new REST endpoints with @PreAuthorize role checks
- Database: 4 new tables with proper indexes and user scoping
- Configuration: application.yml updated with crawler and Telegram settings

### Current Focus
- Code refinement and optimization
- Documentation updates (in progress)
- Testing coverage improvement
- Performance optimization

### Next Phases
- Resume templates and styling
- Career path recommendations
- Interview preparation features
- Portfolio integration
- Advanced job filtering and matching

## Key Files to Review

### Frontend Entry Points
- `/frontend/src/main.tsx` - Application bootstrap
- `/frontend/src/App.tsx` - Root component with routing
- `/frontend/src/components/layout/app-layout.tsx` - Main layout

### Backend Entry Points
- `/backend/src/main/java/com/profilebuilder/ProfileBuilderApplication.java` - Spring Boot entry
- `/backend/src/main/java/com/profilebuilder/config/` - Configuration classes
- `/backend/src/main/java/com/profilebuilder/service/` - Business logic

### Database Setup
- `/backend/db/migrations/` - Database schema
- `/docker-compose.yml` - Local environment setup

## Developer Quick Reference

### Common Commands
```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check code style

# Backend
mvn spring-boot:run  # Run application
mvn test             # Run tests
mvn clean package    # Build JAR

# Docker
docker-compose up    # Start local PostgreSQL
```

### API Testing
- Bruno collections in `backend/collections/`
- Postman-compatible (can import .bru files)
- Includes sample requests for all endpoints

### Dependencies Management
- Frontend: NPM via package.json
- Backend: Maven via pom.xml
- Database: PostgreSQL 14+ (Docker image)

## Security Considerations

- No sensitive data in repositories (env vars used)
- API keys managed via environment variables
- Input validation on all endpoints
- SQL injection prevention via JPA parameterized queries
- Frontend: HTTPS in production, XSS protection via React
- File upload: Type and size validation

## Deployment Readiness

### Local Development
- Docker files created for containerization (frontend, backend)
- Docker Compose for local PostgreSQL + application stack
- Environment-based configuration (dev, test, prod)
- Database migrations automated (Flyway)

### Production
- AWS infrastructure removed (March 2026) — all ECS, RDS, S3, ALB, ECR, SSM resources torn down
- `infra/` directory kept for historical reference (Terraform modules)
- CI/CD deploy pipeline removed; Dockerfiles still available for future platform deployment
- File storage: local filesystem only (S3 SDK removed from backend)

## Future Considerations

- Implement message queue for async processing
- Add Redis caching layer for AI responses
- Kubernetes deployment support
- Microservices architecture (if needed)
- Enhanced monitoring and logging
- Performance metrics collection
