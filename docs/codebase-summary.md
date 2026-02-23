# Codebase Summary

**Generated:** 2026-02-21
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
│   │   │   ├── layout/                # AppLayout, Sidebar, Theme
│   │   │   ├── resume/                # Resume-specific components
│   │   │   └── shared/                # Shared components
│   │   ├── pages/                     # Route components (8 pages)
│   │   ├── api/                       # API client helpers
│   │   ├── types/                     # TypeScript interfaces
│   │   ├── styles/                    # Global CSS + templates
│   │   ├── App.tsx                    # Root component
│   │   └── main.tsx                   # Entry point
│   ├── Dockerfile                     # Multi-stage build (frontend)
│   ├── nginx-ecs.conf                 # nginx config for ECS (path-based routing)
│   ├── package.json                   # Dependencies
│   └── vite.config.ts                 # Build configuration
│
├── backend/                           # Spring Boot 3 + Java
│   ├── src/main/java/com/profilebuilder/
│   │   ├── ai/                        # AI integration
│   │   │   └── agent/                 # Specialized AI agents
│   │   ├── config/                    # Spring configuration
│   │   ├── controller/                # REST endpoints
│   │   ├── service/                   # Business logic (includes S3Integration)
│   │   ├── model/                     # Entities, DTOs, Enums
│   │   ├── repository/                # JPA repositories
│   │   ├── exception/                 # Custom exceptions
│   │   └── util/                      # Utility classes (FileValidationUtil)
│   ├── src/main/resources/
│   │   ├── application.yml            # Configuration
│   │   ├── db/migrations/             # Flyway migrations
│   │   └── prompts/                   # AI prompts
│   ├── src/test/java/                 # Unit tests
│   ├── pom.xml                        # Maven dependencies
│   └── Dockerfile                     # Multi-stage build (backend)
│
├── infra/                             # Infrastructure as Code (Terraform) (NEW)
│   ├── main.tf                        # Root module orchestration
│   ├── variables.tf                   # Input variables
│   ├── outputs.tf                     # Output values
│   ├── providers.tf                   # AWS provider config
│   ├── backend.tf                     # Terraform state management
│   └── modules/                       # Reusable infrastructure modules
│       ├── vpc/                       # VPC, subnets, security groups
│       ├── ecr/                       # Elastic Container Registry
│       ├── rds/                       # PostgreSQL database
│       ├── s3/                        # Document storage (S3 buckets)
│       ├── secrets/                   # SSM Parameter Store + KMS encryption
│       ├── alb/                       # Application Load Balancer
│       └── ecs/                       # ECS Fargate services
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
├── .github/workflows/                 # GitHub Actions CI/CD
│   └── deploy-ecs.yml                 # Auto-deploy to ECS (OIDC auth)
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

**Pages (8 total)**
1. LoginPage - User login with email/password
2. RegisterPage - User registration with email/password
3. DocumentListPage - Browse uploaded documents
4. UploadPage - Upload resume documents
5. SmartResumeSetupPage - AI resume setup
6. SmartResumeResultPage - AI-generated resume display
7. CoverLetterSetupPage - 3-step cover letter generation (JD upload, resume select, master cover letter select)
8. CoverLetterResultPage - Generated cover letter display with on-demand evaluation
9. AdminUserManagementPage - (ADMIN only) User management with role updates

**Component Organization**
- `src/components/ui/` - 14 shadcn/ui primitive components
- `src/components/layout/` - AppLayout, AppSidebar, ThemeProvider, ThemeToggle
- `src/components/resume/` - SmartResumePaper, HrValidationPanel, RecommendationCard
- `src/components/cover-letter/` - CoverLetterDisplay, CoverLetterEvaluationPanel
- `src/components/shared/` - GenerationOverlay, ProtectedRoute, RequireRole, common UI patterns

**Auth Context** (NEW)
- `src/contexts/auth-context.tsx` - AuthProvider context with token state management
- `src/contexts/auth-context-value.ts` - AuthContextValue interface & token types
- `src/contexts/use-auth.ts` - useAuth hook for accessing auth state and methods
- Token hydration on app load, axios interceptor for Bearer token injection
- Automatic token refresh on 401 errors with request retry queue

**Styling System**
- Tailwind CSS v4 (CSS-first configuration)
- CSS custom properties for theming (30+ color variables)
- Dark/light mode with localStorage persistence
- Mobile-first responsive design (sm, md, lg, xl breakpoints)
- Touch-friendly UI (44px minimum tap targets)

### Recent Migrations & Updates

**UI Framework Migration (Feb 2026):**
- From Ant Design → shadcn/ui + Tailwind CSS v4
- Removed: antd, @ant-design/icons, @ant-design/colors
- Added: shadcn/ui, tailwindcss, lucide-react, sonner, html2pdf.js
- Navigation: Horizontal header → Sidebar with mobile hamburger
- Notifications: antd message → Sonner toast
- Theme: Dark-only → Dark/light toggle with persistence
- File structure: Reorganized into layout, shared, ui, resume directories

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

**Tables (5 main)**
1. **documents** - Uploaded files metadata
2. **smart_generated_resumes** - AI-generated resumes
3. **smart_hr_validations** - HR validation feedback
4. **pb_generated_cover_letters** - Generated cover letters with company research
5. **pb_cover_letter_evaluations** - Cover letter evaluation results

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

### Production (AWS ECS Fargate)
- **Infrastructure as Code (Terraform):** Complete IaC in `infra/` directory
  - VPC with multi-AZ public/private subnets
  - ECR repositories for frontend and backend images
  - RDS PostgreSQL 16 (db.t4g.micro, private subnet)
  - S3 buckets with versioning and KMS encryption
  - ALB with path-based routing (/api/* → backend, /* → frontend)
  - ECS Fargate Spot for cost optimization
  - SSM Parameter Store + KMS for secrets management

- **CI/CD Pipeline (GitHub Actions):** Auto-deploy to ECS staging
  - OIDC authentication (no stored AWS keys)
  - Build & push Docker images to ECR on main push
  - Update ECS service with new images
  - Automated deployment to staging environment

- **Frontend Deployment:** nginx-ecs.conf for path-based routing, VITE_API_HOST build arg
- **Backend Deployment:** Spring Boot JAR in Docker, environment variables injected from Secrets Manager
- **Database:** Automated migrations via Flyway on ECS startup
- **File Storage:** S3 integration with fallback to local filesystem support

## Future Considerations

- Implement message queue for async processing
- Add Redis caching layer for AI responses
- Kubernetes deployment support
- Microservices architecture (if needed)
- Enhanced monitoring and logging
- Performance metrics collection
