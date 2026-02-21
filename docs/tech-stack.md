# Technology Stack

## Frontend

### Core Framework
- **React 19.2.0** - UI library with server components support
- **TypeScript ~5.9.3** - Type-safe JavaScript
- **Vite 7.3.1** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 4.2.0** - Utility-first CSS framework (CSS-first config)
- **@tailwindcss/vite 4.2.0** - Tailwind integration with Vite
- **shadcn/ui** - High-quality Radix UI component library
- **Radix UI 1.4.3** - Headless UI primitives (via shadcn/ui)
- **class-variance-authority 0.7.1** - Type-safe component variants
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.5.0** - Merge Tailwind classes intelligently

### Navigation & Routing
- **React Router DOM 7.13.0** - Client-side routing

### State & Data
- **Axios 1.13.5** - HTTP client for API calls
- **React Hooks** - State management (useState, useContext, useEffect)
- **React Context** - Application state (theme, user preferences)

### Notifications & UI Feedback
- **Sonner 2.0.7** - Toast notifications library
- **lucide-react 0.575.0** - Icon library (replaces @ant-design/icons)

### File & Document Export
- **html2pdf.js 0.14.0** - Client-side PDF generation from HTML

### Development Tools
- **ESLint 9.39.1** - Code linting
- **eslint-plugin-react-hooks 7.0.1** - React hooks linting
- **eslint-plugin-react-refresh 0.4.24** - Fast refresh linting
- **@types/react 19.2.7** - TypeScript definitions for React
- **@types/react-dom 19.2.3** - TypeScript definitions for React DOM
- **@vitejs/plugin-react 5.1.1** - Vite React plugin with HMR

### Build Output
- Distribution: `dist/` directory with code splitting and optimization

## Backend

### Core Framework
- **Spring Boot 3.x** - Java framework for REST APIs
- **Spring Data JPA** - Data access layer
- **Hibernate** - ORM implementation

### Database
- **PostgreSQL 14+** - Primary relational database
- **pgvector** - Vector storage extension for AI embeddings
- **Flyway** - Database migration tool

### AI & LLM Integration
- **Claude API** - Primary AI model for resume generation
- **OpenAI GPT-4** - Alternative/fallback model
- **Google Gemini API** - Additional model option
- **Custom AI Orchestration** - Multi-LLM routing and fallback logic

### API & Web
- **Embedded Tomcat** - Web server
- **Jackson** - JSON serialization/deserialization
- **Spring Web** - REST controller support

### File Handling
- **Spring Boot File Upload** - Resume document handling
- **PDF Processing Libraries** - Resume parsing utilities

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking library
- **Spring Boot Test** - Integration testing utilities

### Build & Deployment
- **Maven 3.8+** - Build automation
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Infrastructure

### Development
- **Local Docker Compose** - Backend + PostgreSQL local environment
- **Vite Dev Server** - Frontend with HMR (Hot Module Replacement)

### Production
- **Docker Containers** - Containerized services
- **PostgreSQL** - Managed database
- **Environment-based Configuration** - Via application.yml and .env files

## Version Control & CI/CD
- **Git** - Version control
- **GitHub** - Repository hosting (planned: GitHub Actions for CI/CD)

## Styling Architecture (Tailwind CSS v4)

### Theme System
- **CSS Variables:** Defined in `globals.css` using `@theme` block
- **Dark Mode:** Toggle-based with `.dark` class
- **Color Palette:**
  - Primary: HSL(217 91% 60%)
  - Background/Foreground: Light (white/dark text), Dark (dark bg/light text)
  - Sidebar Colors: Separate variables for navigation
  - Accent & Muted: Contextual colors

### Custom Properties
- `--radius` - Border radius (0.5rem default)
- `--font-sans` - Font family (Inter + system fonts)
- All color variables scoped to `:root` (light) and `.dark` (dark mode)

### File Organization
- **globals.css** - Tailwind imports, @theme definition, dark mode, base layers
- **Component CSS:** Inline Tailwind classes (no separate CSS files for components)
- **Template CSS:** Specific styles for resume rendering (`ResumeTemplate.css`, `smart-resume-template.css`)

## Component Architecture

### Directory Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (card, button, input, etc.)
│   ├── layout/          # AppLayout, AppSidebar, ThemeProvider, ThemeToggle
│   ├── resume/          # Resume-specific components (paper view, section renderer)
│   └── shared/          # Shared components across pages
├── pages/               # Page components (DocumentList, Upload, Analysis, etc.)
├── api/                 # API client helpers
├── types/               # TypeScript type definitions
├── styles/              # Global CSS and template-specific styles
└── config.ts            # Application configuration
```

### Component Patterns
- **Functional Components:** All components use hooks
- **Props Interface:** Explicit TypeScript interfaces for component props
- **Composition:** Nested components for complex UIs
- **Accessibility:** ARIA attributes, semantic HTML, keyboard navigation
- **Responsive:** Mobile-first design with Tailwind breakpoints (sm, md, lg, xl)

## Key Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | Core UI library |
| typescript | ~5.9.3 | Type safety |
| vite | 7.3.1 | Build and dev |
| tailwindcss | 4.2.0 | Styling |
| react-router-dom | 7.13.0 | Routing |
| axios | 1.13.5 | HTTP client |
| sonner | 2.0.7 | Notifications |
| lucide-react | 0.575.0 | Icons |
| html2pdf.js | 0.14.0 | PDF export |

## Migration Notes (Feb 2026)

### From Ant Design to shadcn/ui
**Removed Dependencies:**
- antd (Ant Design)
- @ant-design/icons
- @ant-design/colors

**Added Dependencies:**
- tailwindcss v4.2.0
- @tailwindcss/vite
- shadcn/ui
- radix-ui
- sonner (replaces antd message)
- lucide-react (replaces @ant-design/icons)
- html2pdf.js (new for PDF export)
- class-variance-authority
- clsx
- tailwind-merge

**Benefits:**
- Smaller bundle size
- Better customization with CSS variables
- Improved accessibility via Radix UI
- Modern CSS-first Tailwind v4
- Native dark mode support
- Better mobile responsiveness

## Performance Considerations

- **Code Splitting:** Vite automatic chunk splitting for pages
- **Tree Shaking:** Tailwind and component imports optimized
- **Bundle Size:** shadcn/ui components are tree-shakeable
- **CSS:** Tailwind CSS v4 CSS-in-markup approach (no large CSS files)
- **Icons:** lucide-react tree-shakes unused icons
