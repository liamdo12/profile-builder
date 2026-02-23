# Frontend Development Guide

## Overview

The Profile Builder frontend is a modern React 19 + TypeScript application using Vite for fast development and building. It features a responsive UI built with shadcn/ui components and Tailwind CSS v4, with a sidebar navigation layout and dark/light theme support.

**Tech Stack:** React 19.2 | TypeScript 5.9 | Vite 7.3 | Tailwind CSS 4.2 | shadcn/ui | React Router 7.13

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Backend API running on localhost:8080

### Initial Setup
```bash
cd frontend
npm install
npm run dev
```

The application starts on `http://localhost:5173` with HMR (Hot Module Replacement) enabled.

## Project Structure

### Root Level Files
```
src/
├── main.tsx              # Entry point - renders App to #root
├── App.tsx               # Root component with routing
├── config.ts             # API_BASE_URL and app configuration
├── globals.css           # Tailwind imports & theme variables
└── vite-env.d.ts         # Vite type definitions
```

### Components Directory (`src/components/`)

#### UI Components (`components/ui/`)
Shadcn/ui Radix-based primitives:
```
button.tsx               # Reusable button component
input.tsx                # Form input field
card.tsx                 # Card container (Header, Content, Footer)
select.tsx               # Dropdown select
checkbox.tsx             # Checkbox input
badge.tsx                # Status badge
table.tsx                # Data table with header/body/cell
progress.tsx             # Progress bar
accordion.tsx            # Expandable accordion
sheet.tsx                # Side panel / drawer
dialog.tsx               # Modal dialog
tooltip.tsx              # Hover tooltip
separator.tsx            # Visual divider
```

**Usage Pattern:**
```typescript
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button onClick={handleClick}>Click me</Button>;
}
```

#### Layout Components (`components/layout/`)
```
app-layout.tsx           # Main page wrapper (sidebar + content area)
app-sidebar.tsx          # Navigation sidebar with logo, menu, theme toggle
theme-provider.tsx       # React Context for theme management
theme-toggle.tsx         # Light/dark mode switch button
```

**AppLayout Structure:**
```typescript
<AppLayout>
  <SidebarNav />
  <main className="flex-1">
    <Routes>{/* Page components */}</Routes>
  </main>
</AppLayout>
```

#### Resume Components (`components/resume/`)
```
smart-resume-paper.tsx          # AI-generated resume display (sticky column)
hr-validation-panel.tsx         # HR validation feedback (scrollable column)
recommendation-card.tsx         # Individual recommendation with actions
resume-utils.tsx                # Utility functions for resume rendering
smart-resume-template.css       # Resume-specific styling
```

**Core Resume Rendering:**
```typescript
// Two-column layout with sticky resume
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <SmartResumePaper
    resumeData={data}
    className="sticky top-4"
  />
  <HrValidationPanel
    recommendations={validationFeedback.recommendations}
    scores={validationFeedback.scores}
  />
</div>

// Recommendation card shows individual items with copy action
<RecommendationCard
  item={{
    section: 'Experience',
    type: 'enhancement',
    original: 'Managed team projects',
    suggested: 'Led cross-functional team of 5, delivered 3 projects...',
    reason: 'More impact-focused and quantified'
  }}
/>
```

**DOMPurify Usage for HTML Rendering:**
```typescript
import DOMPurify from 'dompurify';

// Sanitize HTML content (e.g., <b> tags in resume bullets)
const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  ALLOWED_ATTR: []
});

<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

#### Shared Components (`components/shared/`)
Common UI patterns used across multiple pages:
- Loading spinners
- Error boundaries
- Form wrappers
- Common modals

### Pages Directory (`src/pages/`)

Each page component represents a route in the application:

1. **DocumentListPage.tsx**
   - Route: `/`
   - Display list of uploaded documents
   - Quick actions (view, delete)

2. **UploadPage.tsx**
   - Route: `/upload`
   - File upload form with drag-and-drop
   - File validation and progress

3. **SmartResumeSetupPage.tsx**
   - Route: `/smart-resume`
   - Configuration form for AI generation
   - Select tone, style, target role
   - Start AI generation

4. **SmartResumeResultPage.tsx**
   - Route: `/smart-resume/:smartResumeId`
   - Display AI-generated resume
   - Show HR validation feedback
   - PDF export via html2pdf.js

### API Directory (`src/api/`)

API client helper functions:

```
resumeApi.ts              # Resume and document API calls
smart-resume-api.ts       # Smart resume generation API calls
```

**API Client Pattern:**
```typescript
// resumeApi.ts
export const api = {
  // Documents
  uploadDocument: (file: File, type: string) =>
    axios.post('/api/documents/upload', formData),
  getDocuments: () =>
    axios.get('/api/documents'),
};

// smart-resume-api.ts
export const smartResumeApi = {
  // Smart Resume generation
  generateSmartResume: (request: GenerateSmartResumeRequest) =>
    axios.post('/api/smart-resumes/generate', request),
  getSmartResume: (id: string) =>
    axios.get(`/api/smart-resumes/${id}`),
};
```

### Types Directory (`src/types/`)

TypeScript type definitions:

```
smart-resume.ts           # SmartGeneratedResume, HrValidation types
document.ts               # Document, DocumentType types
html2pdf.d.ts             # Type definitions for html2pdf.js library
```

**Type Examples:**
```typescript
// smart-resume.ts
interface SmartGeneratedResume {
  id: string;
  userId: string;
  documentId: string;
  generatedContent: ResumeContent;
  tone: string;
  style: string;
  createdAt: string;
}

interface HrValidation {
  id: string;
  smartResumeId: string;
  validationResults: ValidationResult[];
  atsScore: number;
  suggestions: string[];
}
```

### Styles Directory (`src/styles/`)

CSS files for specific features:

```
ResumeTemplate.css           # Manual resume styling
smart-resume-template.css    # AI resume styling
globals.css                  # Global Tailwind setup (root level)
```

**Global CSS Setup (globals.css):**
- Tailwind CSS v4 import
- `@theme` block with CSS custom properties
- Dark mode overrides using `.dark` class
- Base layer styles
- Media queries for touch devices

## Theming System

### Theme Architecture

**Provider Setup (App.tsx):**
```typescript
<ThemeProvider defaultTheme="dark" storageKey="profile-builder-theme">
  <BrowserRouter>
    <AppLayout>
      {/* Routes */}
    </AppLayout>
  </BrowserRouter>
  <Toaster />
</ThemeProvider>
```

**CSS Variables (globals.css):**
```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(217 91% 60%);
  /* ... more colors ... */
}

.dark {
  --color-background: hsl(222.2 84% 4.9%);
  --color-foreground: hsl(210 40% 98%);
  /* ... dark overrides ... */
}
```

**Usage in Components:**
```typescript
// Option 1: Tailwind classes (auto-switches with theme)
<div className="bg-background text-foreground">Content</div>

// Option 2: CSS variables
<div className="bg-[var(--color-background)]">Content</div>

// Option 3: Using clsx for conditionals
<div className={clsx(
  'bg-background',
  isDark && 'dark:bg-slate-950'
)}>
  Content
</div>
```

### Theme Toggle
Located in `components/layout/theme-toggle.tsx`:
- Toggle button in sidebar header
- Reads from `useTheme()` hook
- Persists to localStorage
- Automatically applies `.dark` class to document root

## Styling Approach

### Tailwind CSS v4 (CSS-First)

**Configuration Style:**
```css
@import "tailwindcss";

@theme {
  --color-*: value;
  --radius: 0.5rem;
}

@layer base { /* Global base styles */ }
@layer components { /* Component utilities */ }
@layer utilities { /* Custom utilities */ }
```

### Responsive Design (Mobile-First)

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage:**
```typescript
// Stack on mobile, 2 columns on tablet, 3 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <div key={item.id}>{item}</div>)}
</div>
```

### Utility Classes

**Common Patterns:**
```typescript
// Flexbox layouts
<div className="flex items-center justify-between">

// Grid layouts
<div className="grid grid-cols-3 gap-4">

// Spacing
<div className="p-4 m-2">

// Colors & dark mode
<div className="bg-background text-foreground dark:bg-slate-950">

// Borders & shadows
<div className="border rounded-lg shadow-md">

// Responsive text sizing
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
```

### Class Merging (tailwind-merge)

When combining classes dynamically:
```typescript
import { cn } from '@/lib/utils'; // Uses tailwind-merge internally

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium',
        className  // User-provided classes override defaults
      )}
      {...props}
    />
  );
}
```

## Component Patterns

### Functional Component Template

```typescript
import { FC, ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children: ReactNode;
  isActive?: boolean;
}

export const MyComponent: FC<MyComponentProps> = ({
  title,
  children,
  isActive = false,
}) => {
  return (
    <div className={isActive ? 'border-primary' : 'border-muted'}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
};
```

### Hook-Based State Management

```typescript
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/api/resumeApi';

export function ResumeEditor({ resumeId }: { resumeId: string }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await api.getResume(resumeId);
        setResume(response.data);
      } catch (err) {
        const message = err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : 'Failed to load resume';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!resume) return <div>Resume not found</div>;

  return <ResumePaperView {...resume} />;
}
```

### Form Component Pattern

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FormData {
  title: string;
  description: string;
}

export function ResumeForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [data, setData] = useState<FormData>({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(data);
      toast.success('Resume updated successfully');
      setData({ title: '', description: '' });
    } catch (error) {
      toast.error('Failed to update resume');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Resume title"
        disabled={submitting}
      />
      <Input
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        placeholder="Description"
        disabled={submitting}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

## Routing

### Route Configuration (App.tsx)

```typescript
<Routes>
  <Route path="/" element={<DocumentListPage />} />
  <Route path="/upload" element={<UploadPage />} />
  <Route path="/smart-resume" element={<SmartResumeSetupPage />} />
  <Route path="/smart-resume/:smartResumeId" element={<SmartResumeResultPage />} />
</Routes>
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

export function MyComponent() {
  const navigate = useNavigate();

  const handleSmartResumeGenerated = (resumeId: string) => {
    navigate(`/smart-resume/${resumeId}`);
  };

  return <button onClick={() => handleSmartResumeGenerated('123')}>Next</button>;
}
```

## API Integration

### Making API Calls

```typescript
import axios from 'axios';
import { api } from '@/api/resumeApi';

// Using helper functions
const resume = await api.getResume(id);

// Direct axios calls (less common)
const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/resumes`,
  data
);
```

### API Configuration (config.ts)

```typescript
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios instance can be configured here if needed
```

### Error Handling Pattern

```typescript
import { AxiosError } from 'axios';
import { toast } from 'sonner';

try {
  const result = await api.generateResume(request);
  toast.success('Resume generated successfully');
} catch (error) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## Notifications (Sonner)

### Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Resume saved successfully');

// Error
toast.error('Failed to save resume');

// Info (default)
toast('Processing...');

// Loading (promise-based)
toast.promise(
  uploadFile(),
  {
    loading: 'Uploading...',
    success: 'Upload complete!',
    error: 'Upload failed',
  }
);

// Custom
toast.custom((t) => (
  <div className="flex gap-2">
    <span>Custom message</span>
    <button onClick={() => toast.dismiss(t)}>Dismiss</button>
  </div>
));
```

**Toaster Configuration (App.tsx):**
```typescript
<Toaster richColors position="top-right" />
```

## PDF Export

### Using html2pdf.js

```typescript
import html2pdf from 'html2pdf.js';

export function exportResumeToPdf(resumeElement: HTMLElement, filename: string) {
  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  html2pdf().set(options).from(resumeElement).save();
}

// In component:
<button onClick={() => {
  const element = document.getElementById('resume-to-export');
  if (element) exportResumeToPdf(element, 'resume.pdf');
}}>
  Download PDF
</button>
```

## Build & Deployment

### Development
```bash
npm run dev      # Start dev server with HMR
npm run lint     # Check code style
npm run type-check # TypeScript type checking (if configured)
```

### Production Build
```bash
npm run build    # Creates dist/ with optimized output
npm run preview  # Preview production build locally
```

**Build Output:**
- Optimized JavaScript bundles
- Code splitting per route
- CSS minification
- Asset optimization
- Source maps (optional)

### Environment Variables
Create `.env` file in frontend root:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Testing Best Practices

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SmartResumeResultPage } from '@/pages/SmartResumeResultPage';

describe('SmartResumeResultPage', () => {
  it('should display smart resume content', () => {
    render(<SmartResumeResultPage />);
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });

  it('should handle download action', async () => {
    render(<SmartResumeResultPage />);
    const downloadButton = screen.getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);
    // Assert results
  });
});
```

## Performance Optimization

### Code Splitting
Routes are automatically code-split by Vite. Large pages should be lazy-loaded:

```typescript
import { lazy, Suspense } from 'react';

const SmartResumeResultPage = lazy(() =>
  import('./pages/SmartResumeResultPage')
);

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SmartResumeResultPage />
    </Suspense>
  );
}
```

### Memoization
For expensive components:

```typescript
import { useMemo } from 'react';

const expensiveData = useMemo(() => {
  return resumeData.filter(item => item.isRelevant).map(transformItem);
}, [resumeData]);
```

### useCallback for Event Handlers

```typescript
import { useCallback } from 'react';

const handleEdit = useCallback((itemId: string) => {
  // Edit logic
}, [dependencies]);
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Module Not Found
- Clear `node_modules` and `package-lock.json`
- Run `npm install` again

### Type Errors
```bash
npm run type-check  # Full TypeScript check
```

### Styling Issues
- Check Tailwind class names
- Verify dark mode class is applied to HTML element
- Check CSS variable names in globals.css

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
