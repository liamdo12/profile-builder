# Code Standards & Architecture

## Frontend Code Standards

### File Organization

```
frontend/src/
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ... (other UI components)
│   ├── layout/                # Layout and theme
│   │   ├── app-layout.tsx     # Main layout wrapper
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   ├── theme-provider.tsx # Theme context
│   │   └── theme-toggle.tsx   # Dark/light theme toggle
│   ├── resume/                # Resume-specific components
│   │   ├── smart-resume-paper.tsx
│   │   ├── hr-validation-panel.tsx
│   │   ├── recommendation-card.tsx
│   │   └── smart-resume-template.css
│   └── shared/                # Shared components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       └── ... (common components)
├── pages/                     # Page components (routes)
│   ├── DocumentListPage.tsx
│   ├── UploadPage.tsx
│   ├── SmartResumeSetupPage.tsx
│   └── SmartResumeResultPage.tsx
├── api/                       # API client functions
│   ├── resumeApi.ts
│   └── smart-resume-api.ts
├── types/                     # TypeScript type definitions
│   ├── resume.ts
│   ├── smart-resume.ts
│   ├── document.ts
│   └── html2pdf.d.ts
├── styles/                    # Global and template CSS
│   ├── globals.css            # Tailwind imports, theme variables
│   ├── ResumeTemplate.css
│   └── smart-resume-template.css
├── config.ts                  # Application configuration
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

### Naming Conventions

**Files & Directories:**
- Page components: `PascalCase` + `.tsx` (e.g., `DocumentListPage.tsx`)
- Functional components: `PascalCase` + `.tsx` (e.g., `ResumeReviewPanel.tsx`)
- Utilities & helpers: `kebab-case` + `.ts` (e.g., `resume-utils.ts`)
- Types & interfaces: `kebab-case` + `.ts` (e.g., `resume.ts`)
- Styles: `kebab-case` + `.css` (e.g., `globals.css`)

**Components:**
```typescript
// Page Component
export default function DocumentListPage() { ... }

// Functional Component
export function ResumeReviewPanel({ ... }: Props) { ... }

// Props Interface
interface ResumeReviewPanelProps {
  resumeId: string;
  onClose: () => void;
}
```

**Variables & Functions:**
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- State: `camelCase`
- Event handlers: `handleEventName` or `onEventName`

```typescript
const API_BASE_URL = 'http://localhost:8080';
const [isLoading, setIsLoading] = useState(false);

function handleSubmit() { ... }
function onThemeChange(theme: 'light' | 'dark') { ... }
```

### TypeScript Standards

**Explicit Types:**
```typescript
// Good - explicit return type
function fetchResume(id: string): Promise<ResumeData> {
  // ...
}

// Good - explicit parameter types
const items: string[] = [];
const config: AppConfig = { ... };

// Good - explicit interface
interface ComponentProps {
  title: string;
  isVisible: boolean;
  onAction: (data: ActionData) => void;
}
```

**Avoid:**
- `any` type (use explicit types or generics)
- Implicit `unknown` types
- Untyped props in components

### React Component Patterns

**Functional Components with Hooks:**
```typescript
import { useState, useEffect } from 'react';

interface ComponentProps {
  initialValue?: string;
}

export function MyComponent({ initialValue = '' }: ComponentProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, [value]);

  return <div>{value}</div>;
}
```

**Event Handlers:**
```typescript
// Arrow function style (preferred)
const handleClick = () => {
  // Action
};

// Named function style (also acceptable)
function handleClick() {
  // Action
}

// In JSX
<button onClick={handleClick}>Click</button>
```

**Component Composition:**
```typescript
// Use composition over inheritance
function ResumeReview() {
  return (
    <Card>
      <CardHeader>
        <ResumeTitle />
      </CardHeader>
      <CardContent>
        <ResumeSections />
      </CardContent>
      <CardFooter>
        <ActionButtons />
      </CardFooter>
    </Card>
  );
}
```

### Styling Standards

**Tailwind CSS Classes:**
```typescript
// Use className directly (no need for CSS files)
<div className="flex items-center justify-between gap-4 p-4">
  <h1 className="text-lg font-semibold text-foreground">Title</h1>
</div>

// Use clsx for conditional classes
import { clsx } from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded-md font-medium',
  isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
)}>
  Submit
</button>

// Use tailwind-merge for class merging
import { cn } from '@/lib/utils'; // helper using tailwind-merge

<div className={cn('base-classes', customClasses)}>
  Content
</div>
```

**Dark Mode:**
```typescript
// Use .dark class automatically applied by ThemeProvider
<div className="bg-background text-foreground dark:bg-slate-950 dark:text-white">
  // Automatically switches based on theme
</div>

// CSS Variables (prefer for consistency)
<div className="bg-[var(--color-background)] text-[var(--color-foreground)]">
  // Uses defined theme variables
</div>
```

**Responsive Design:**
```typescript
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>

// Common breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
```

### Error Handling & Security

**Try-Catch Pattern:**
```typescript
async function loadResume(id: string) {
  try {
    const response = await api.get(`/resumes/${id}`);
    setResume(response.data);
  } catch (error) {
    const message = error instanceof AxiosError
      ? error.response?.data?.message || error.message
      : 'An unknown error occurred';
    toast.error(message);
  }
}
```

**HTML Sanitization (DOMPurify):**
```typescript
import DOMPurify from 'dompurify';

// Always sanitize user-generated or AI-generated HTML
const sanitized = DOMPurify.sanitize(htmlContent, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],  // Only safe tags
  ALLOWED_ATTR: []  // No attributes allowed
});

<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

**User Feedback:**
```typescript
import { toast } from 'sonner';

// Success
toast.success('Resume saved successfully');

// Error
toast.error('Failed to save resume');

// Loading (optional)
toast.loading('Saving resume...');

// Custom
toast.custom((t) => (
  <div>Custom notification</div>
));
```

## Backend Code Standards (Java)

### Project Structure
```
backend/
├── src/main/java/com/profilebuilder/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   ├── model/
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data transfer objects
│   │   └── enums/           # Enumerations
│   ├── repository/          # Data access layer
│   ├── exception/           # Custom exceptions
│   ├── util/                # Utility classes
│   └── ProfileBuilderApplication.java
├── src/main/resources/
│   ├── application.yml      # Configuration
│   ├── prompts/             # AI prompts
│   └── db/migrations/       # Flyway migrations
└── src/test/java/           # Unit tests
```

### Class Naming
- Controllers: `XyzController.java`
- Services: `XyzService.java`
- Repositories: `XyzRepository.java`
- Entities: `XyzEntity.java` or `Xyz.java`
- DTOs: `XyzRequest.java`, `XyzResponse.java`
- Exceptions: `XyzException.java`

### Lombok Annotations
All DTOs and entities use Lombok to reduce boilerplate:
```java
@Entity
@Table(name = "pb_documents")
@Getter              // Generate getters
@Setter              // Generate setters
@NoArgsConstructor   // Generate no-arg constructor
@AllArgsConstructor  // Generate all-args constructor
public class Document {
  private String fileName;
  // Fields only; no getters/setters needed
}
```
This eliminates manual getter/setter methods and constructors.

### API Response Format
```json
{
  "status": "success|error",
  "data": { /* response data */ },
  "message": "User-friendly message",
  "timestamp": "ISO-8601 timestamp"
}
```

### Exception Handling
- Use custom exceptions extending `RuntimeException`
- Implement `GlobalExceptionHandler` for consistent error responses
- Log all exceptions with appropriate level (WARN for business logic, ERROR for system failures)

### Testing Standards
- Unit tests: `XyzServiceTest.java` (test business logic)
- Integration tests: `XyzControllerTest.java` (test endpoints)
- Minimum 70% code coverage target
- Use `@MockBean` for dependencies
- Use test data builders for consistent test data

## Code Quality Standards

### Linting & Formatting
- Run ESLint before commit: `npm run lint`
- Fix issues: `npm run lint -- --fix`
- No syntax errors permitted
- Type checking: `tsc --noEmit`

### Comments & Documentation
```typescript
/**
 * Generates a tailored resume based on job description.
 * @param resumeId - The resume to tailor
 * @param jdAnalysisId - The analyzed job description
 * @returns Generated resume with AI-enhanced content
 */
async function generateSmartResume(
  resumeId: string,
  jdAnalysisId: string
): Promise<SmartGeneratedResume> {
  // Implementation
}
```

### Complexity Limits
- Function length: < 50 lines (for clarity)
- Component file size: < 200 lines (refactor into smaller components)
- Class method count: < 10 methods (use composition)
- Cyclomatic complexity: < 10 (simplify logic)

### DRY Principle
- Extract repeated code into utilities or components
- Create shared hooks for component logic
- Use composition over duplication

## Performance Standards

### Frontend
- Lazy load page components via React Router
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers in lists
- Code split with dynamic imports
- Optimize images (use modern formats)

### Backend
- Use database indexes for frequent queries
- Implement caching for AI responses
- Connection pooling for database
- Pagination for large result sets

## Security Standards

### Frontend
- Never store sensitive data in localStorage (only theme preference)
- Validate input before sending to API
- Sanitize rendered content with DOMPurify before using `dangerouslySetInnerHTML`
- Use HTTPS in production
- Implement CSRF protection if needed
- Use whitelist approach for allowed HTML tags and attributes

### Backend
- Validate all API inputs
- Use parameterized queries (JPA handles this)
- Hash/encrypt sensitive data at rest
- Implement rate limiting
- Log security events
- Don't expose stack traces in error responses

## Git & Commit Standards

**Commit Message Format:**
```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Example:**
```
feat(resume): add PDF export functionality

Implement html2pdf.js integration for client-side PDF generation.
Add download button to both resume review and smart resume pages.

Closes #123
```

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] TypeScript types are explicit
- [ ] No `any` types
- [ ] Error handling is implemented
- [ ] User feedback (toast/feedback) is provided
- [ ] Tests pass (if applicable)
- [ ] ESLint passes
- [ ] No console.log left in code
- [ ] Comments are clear and helpful
- [ ] No hardcoded API URLs (use config.ts)
