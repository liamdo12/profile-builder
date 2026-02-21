# Profile Builder Documentation

Welcome to the Profile Builder documentation hub. This directory contains comprehensive documentation for the full-stack AI-powered resume management platform.

**Last Updated:** 2026-02-21
**Total Documentation:** 2,506 lines across 6 files

## Quick Navigation

### For New Team Members
Start here to understand the project:
1. **[project-overview-pdr.md](./project-overview-pdr.md)** - Project vision, features, and requirements
2. **[codebase-summary.md](./codebase-summary.md)** - Codebase structure and statistics
3. **[tech-stack.md](./tech-stack.md)** - Technology stack and dependencies

### For Frontend Developers
Build and modify the React frontend:
1. **[frontend-guide.md](./frontend-guide.md)** - Complete development guide (773 LOC)
2. **[code-standards.md](./code-standards.md)** - Frontend code patterns and conventions
3. **[system-architecture.md](./system-architecture.md)** - Architecture and data flows

### For System/Architecture Understanding
Deep dive into system design:
1. **[system-architecture.md](./system-architecture.md)** - Complete architecture documentation
2. **[codebase-summary.md](./codebase-summary.md)** - Codebase organization
3. **[project-overview-pdr.md](./project-overview-pdr.md)** - Requirements and features

### For Code Review
Review and understand code standards:
1. **[code-standards.md](./code-standards.md)** - Coding conventions and patterns
2. **[frontend-guide.md](./frontend-guide.md)** - Component patterns and best practices
3. **[tech-stack.md](./tech-stack.md)** - Technology choices and rationale

## Documentation Files

### 1. project-overview-pdr.md (185 LOC)
**Purpose:** Project vision, functional requirements, and product roadmap

**Key Sections:**
- Project summary and core features
- Functional requirements (6 major areas)
- Non-functional requirements
- Success metrics and KPIs
- Development roadmap phases
- Technology migration history
- Deployment information

**When to Read:** Starting point for understanding project goals and scope

---

### 2. tech-stack.md (190 LOC)
**Purpose:** Complete technology dependency reference

**Key Sections:**
- Frontend stack (React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui)
- Backend stack (Spring Boot 3, PostgreSQL, AI APIs)
- Infrastructure (Docker, Docker Compose)
- Styling architecture and theming
- Component architecture patterns
- Dependency version table
- Migration notes (Ant Design → shadcn/ui)

**When to Read:** Understanding tech choices, upgrading dependencies, integrating new tools

---

### 3. code-standards.md (421 LOC)
**Purpose:** Code conventions, patterns, and quality standards

**Key Sections:**
- File organization and naming conventions
- TypeScript standards and patterns
- React component patterns
- Styling with Tailwind CSS and dark mode
- Error handling strategies
- Backend Java conventions
- Performance standards
- Security guidelines
- Git and commit conventions
- Code review checklist

**When to Read:** Writing new code, code review, onboarding developers

---

### 4. system-architecture.md (515 LOC)
**Purpose:** System design and architectural decisions

**Key Sections:**
- High-level architecture diagram
- Data flow architectures (4 major flows)
- Component hierarchy and organization
- Database schema and tables
- AI integration architecture (multi-LLM)
- State management patterns
- Error handling strategy
- Security architecture
- Deployment strategy
- Scalability considerations

**When to Read:** Understanding system design, planning new features, debugging complex flows

---

### 5. frontend-guide.md (773 LOC)
**Purpose:** Detailed frontend development guide

**Key Sections:**
- Project structure and directory organization
- UI components (shadcn/ui primitives)
- Layout and page components
- API integration and HTTP clients
- TypeScript type definitions
- Styling system (Tailwind CSS v4)
- Theming (light/dark mode)
- Component patterns and hooks
- Routing and navigation
- Notifications (Sonner)
- PDF export (html2pdf.js)
- Build and deployment
- Testing best practices
- Performance optimization
- Troubleshooting guide

**When to Read:** Frontend development, component creation, debugging UI issues

---

### 6. codebase-summary.md (422 LOC)
**Purpose:** Comprehensive codebase overview generated from repomix

**Key Sections:**
- Project statistics (179 files, ~280K tokens)
- Repository structure
- Frontend architecture with features
- Pages breakdown (8 pages)
- Backend architecture
- AI agent architecture
- Database schema
- API integration details
- Development workflow
- Code quality standards
- Key metrics and timeline
- Developer quick reference

**When to Read:** Codebase navigation, understanding structure, quick reference

---

## Recent Migration (Feb 2026)

### Ant Design → shadcn/ui + Tailwind CSS v4

**Major Changes:**
- UI Framework: Ant Design → shadcn/ui (Radix UI + Tailwind CSS v4)
- Styling: CSS-in-JS → CSS-first Tailwind v4 with CSS custom properties
- Navigation: Horizontal header → Sidebar with mobile hamburger
- Theme: Dark-only → Dark/light toggle with localStorage
- Notifications: antd message → Sonner toast
- Icons: @ant-design/icons → lucide-react
- Export: New html2pdf.js for PDF generation

**Documentation Coverage:**
All migration changes are documented with:
- Before/after comparisons
- Updated code examples
- New component structures
- Styling system details
- Theme implementation guide

**Related Files:**
- See [tech-stack.md](./tech-stack.md) for dependency changes
- See [frontend-guide.md](./frontend-guide.md) for implementation details
- See [code-standards.md](./code-standards.md) for styling patterns

## Core Features Documented

### Resume Management
- Upload and parse resume documents
- Store parsed data (contact, experience, education, skills)
- View and edit resume sections

### Job Description Analysis
- Analyze job description requirements
- Extract keywords and skills
- Calculate resume-to-JD match percentage

### Resume Generation (Manual)
- Create tailored resumes from parsed data
- Line-by-line editing interface
- Real-time preview and PDF export

### Smart Resume Generation (AI)
- AI-powered resume customization
- Multi-LLM orchestration (Claude, GPT-4, Gemini)
- Company research integration
- HR validation and compliance checks
- PDF export with formatting

## Architecture Highlights

### Frontend
- React 19 with TypeScript for type safety
- shadcn/ui components for consistent UI
- Tailwind CSS v4 for responsive styling
- React Router for client-side routing
- Sonner for toast notifications
- html2pdf.js for PDF generation

### Backend
- Spring Boot 3 for REST APIs
- PostgreSQL with pgvector for embeddings
- Multi-LLM integration (Claude, GPT-4, Gemini)
- Specialized AI agents for content generation
- JPA for database access

### Database
- 7 core tables for data management
- pgvector extension for semantic search
- Flyway migrations for schema management

## Getting Started

### For Frontend Development
```bash
# Start development server
cd frontend
npm install
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

See [frontend-guide.md](./frontend-guide.md) for detailed instructions.

### For Backend Development
```bash
# Start backend
cd backend
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Local Environment
```bash
# Start PostgreSQL
docker-compose up
```

## Code Quality Standards

### Frontend
- TypeScript: Full type safety (no `any`)
- ESLint: Code style and best practices
- Testing: 70% coverage target
- File size: Components < 200 LOC
- Naming: Explicit, self-documenting

### Backend
- Java conventions: PascalCase classes, camelCase methods
- JPA: Proper entity and relationship definitions
- Testing: Unit + integration tests
- Error handling: Custom exceptions + GlobalExceptionHandler
- Documentation: JavaDoc for public APIs

## Performance Targets

- API response time: < 2 seconds
- PDF generation: < 10 seconds
- Resume parsing: < 5 seconds
- UI interactions: < 100ms
- Uptime: 99.5%

## Security Considerations

- No sensitive data in repositories
- API keys via environment variables
- Input validation on all endpoints
- SQL injection prevention via JPA
- XSS protection via React
- HTTPS enforced in production
- Secure file upload handling

## Development Workflow

### Planning
- Create plan in `/plans` directory
- Document requirements and architecture
- Break down into phases

### Implementation
- Create feature branch
- Follow code standards
- Run linting before commit
- Write tests alongside code

### Review
- Submit pull request
- Code review against standards
- Tests must pass
- Documentation updated

### Deployment
- Merge to main after approval
- Docker build and push
- Deploy to production

## Maintenance

### Documentation Updates
- Update codebase-summary.md quarterly with repomix
- Keep tech-stack.md current with dependencies
- Sync code-standards.md with actual patterns
- Review architecture docs during refactors

### Code Quality
- Regular linting and formatting
- Dependency updates and security patches
- Performance monitoring
- Error tracking and fixes

## Resources

### Frontend
- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

### Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Git Documentation](https://git-scm.com/doc)
- [Docker Documentation](https://docs.docker.com)

## Questions & Issues

### Common Questions
See troubleshooting sections in:
- [frontend-guide.md#troubleshooting](./frontend-guide.md)
- [codebase-summary.md#developer-quick-reference](./codebase-summary.md)

### Reporting Issues
- Backend issues: Check backend logs and error responses
- Frontend issues: Check browser console and network tab
- Database issues: Check migrations and connections

## Contribution Guidelines

1. Read relevant documentation before contributing
2. Follow code standards in [code-standards.md](./code-standards.md)
3. Write tests for new features
4. Update documentation with changes
5. Submit pull request with clear description

## Version History

| Date | Change | File(s) |
|------|--------|---------|
| 2026-02-21 | Initial documentation suite created | All |
| 2026-02-21 | shadcn/ui migration documented | All (focus: tech-stack, frontend-guide) |

## Contact & Support

**Documentation Maintainer:** docs-manager agent
**Last Updated:** 2026-02-21 01:27 UTC
**Review Schedule:** Quarterly

For documentation updates or corrections, submit an issue or pull request with the proposed changes.

---

**Start with [project-overview-pdr.md](./project-overview-pdr.md) if you're new to the project.**
