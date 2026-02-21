# Profile Builder - Project Overview & PDR

## Project Summary

Profile Builder is a full-stack AI-powered resume management and generation platform. It enables users to upload resumes, analyze job descriptions, and generate tailored resume versions using intelligent algorithms and AI models.

**Status:** Active Development
**Version:** 0.0.0
**Last Updated:** 2026-02-21

## Core Features

### 1. Resume Management
- Upload and store resume documents (PDF/Word)
- Parse resume content into structured data
- View and manage resume documents

### 2. Smart Resume System
- AI-powered resume generation and customization
- Multi-LLM orchestration (Claude, GPT-4, Gemini)
- Context-aware content generation
- HR validation and compliance checks

## Technical Architecture

### Frontend Stack (React 19 + TypeScript)
- **Build Tool:** Vite 7
- **UI Framework:** shadcn/ui (Radix UI + Tailwind CSS v4)
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Routing:** React Router v7
- **State Management:** React hooks + Context API
- **HTTP Client:** Axios
- **Notifications:** Sonner (toast notifications)
- **Icons:** lucide-react
- **Export:** html2pdf.js for PDF generation
- **Utilities:** clsx, tailwind-merge, class-variance-authority

### Backend Stack (Java/Spring Boot)
- **Framework:** Spring Boot 3
- **Database:** PostgreSQL with pgvector extension
- **ORM:** JPA/Hibernate
- **AI Integration:** Claude API, OpenAI GPT-4, Google Gemini
- **Web Server:** Embedded Tomcat
- **Containerization:** Docker & Docker Compose

## Project Functional Requirements

### FR1: User Document Management
- Upload resume documents in multiple formats
- Store documents securely with versioning
- Retrieve and list uploaded documents
- Delete documents when no longer needed

### FR2: Resume Parsing
- Parse resume documents into structured data
- Extract sections: contact, summary, experience, education, skills
- Support various resume formats and layouts

### FR3: Smart Resume Generation
- AI-powered resume generation and tailoring
- Context-aware content creation
- Multiple model orchestration (Claude, GPT-4, Gemini)
- HR validation and compliance feedback
- PDF download with formatted layout

### FR4: Theme & Accessibility
- Light and dark theme support
- Theme preference persistence
- Mobile-responsive design
- Touch-friendly UI components
- Accessible color contrasts

## Non-Functional Requirements

### NFR1: Performance
- API response time: < 2 seconds
- PDF generation: < 10 seconds
- Resume parsing: < 5 seconds
- UI interactions: < 100ms

### NFR2: Reliability
- 99.5% uptime target
- Graceful error handling
- Automatic retry mechanisms
- Database transaction consistency

### NFR3: Security
- HTTPS encryption
- Secure file storage
- API rate limiting
- Input validation and sanitization
- No sensitive data in logs

### NFR4: Scalability
- Stateless backend design
- Database connection pooling
- Horizontal scaling support
- Caching strategies for AI responses

### NFR5: Maintainability
- Clean code architecture
- Comprehensive API documentation
- Component-based frontend structure
- Automated testing (unit, integration)

## Success Metrics

1. **User Engagement:** 80%+ resume generation completion rate
2. **AI Quality:** 85%+ HR validation pass rate
3. **Performance:** 95%+ API response time < 2s
4. **Reliability:** 99%+ uptime SLA
5. **Code Quality:** 70%+ test coverage

## Development Roadmap

### Phase 1: Core Foundation (COMPLETE)
- Basic resume upload and parsing
- Simple resume builder
- Database schema and APIs

### Phase 2: Smart Generation (IN PROGRESS)
- Multi-LLM orchestration
- Smart resume generation
- HR validation system
- Responsive UI redesign (shadcn/ui migration)

### Phase 3: Advanced Features (PLANNED)
- Resume templates
- Career path recommendations
- Interview preparation
- Portfolio integration

## Technology Migration History

### Recent: Ant Design → shadcn/ui (Feb 2026)
- Migrated from Ant Design to shadcn/ui + Tailwind CSS v4
- Introduced CSS-first theming with CSS custom properties
- Implemented dark/light theme toggle
- Improved mobile responsiveness with Tailwind breakpoints
- Added Sonner toast notifications replacing antd message
- Updated icon library to lucide-react
- Restructured component organization (layout, shared, ui, resume)

## Deployment

### Development
```bash
cd frontend && npm run dev
cd backend && mvn spring-boot:run
```

### Production
- Docker containerization
- Docker Compose orchestration
- Environment-based configuration
- Database migrations via Flyway

## Team & Contacts

**Architects:** Full-stack team
**Last Updated By:** Documentation Manager
**Review Schedule:** Quarterly
