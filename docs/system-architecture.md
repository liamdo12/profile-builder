# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React 19)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pages: Upload, Analysis, Resume Review, Smart Resume   │   │
│  │  Components: shadcn/ui, Resume Renderers, Sidebars      │   │
│  │  State: React Hooks + Context (Theme, User Data)        │   │
│  │  Styling: Tailwind CSS v4 + CSS Variables               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   HTTP (Axios)     │
                    │   REST API Client  │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Spring Boot 3)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  REST Controllers                                         │   │
│  │  ├── DocumentController                                  │   │
│  │  ├── SmartResumeController                               │   │
│  │  └── CoverLetterController                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Logic (Services)                               │   │
│  │  ├── DocumentService                                     │   │
│  │  ├── JdExtractionService                                 │   │
│  │  ├── SmartResumeOrchestrationService                     │   │
│  │  ├── SmartResumeGenerationService                        │   │
│  │  ├── CoverLetterOrchestrationService                     │   │
│  │  └── CoverLetterGenerationService                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Data Access (Repositories)                              │   │
│  │  ├── DocumentRepository                                  │   │
│  │  ├── SmartGeneratedResumeRepository                      │   │
│  │  ├── SmartHrValidationRepository                         │   │
│  │  ├── GeneratedCoverLetterRepository                      │   │
│  │  └── CoverLetterEvaluationRepository                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AI Integration Layer                                    │   │
│  │  ├── Claude API Client                                   │   │
│  │  ├── OpenAI GPT-4 Client                                 │   │
│  │  ├── Google Gemini Client                                │   │
│  │  └── Multi-LLM Orchestration Engine                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables:                                                 │   │
│  │  ├── documents (uploaded files)                          │   │
│  │  ├── smart_generated_resumes (AI-generated resumes)      │   │
│  │  ├── smart_hr_validations (HR validation results)        │   │
│  │  ├── pb_generated_cover_letters (generated letters)      │   │
│  │  └── pb_cover_letter_evaluations (evaluation results)    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architectures

### 1. Document Upload & Smart Resume Generation Flow

```
User Upload
    │
    ▼
Frontend: UploadPage
    │
    ├─ File validation (type, size)
    ├─ FormData with file
    │
    ▼
Backend: DocumentController.uploadDocument()
    │
    ├─ DocumentService stores file
    ├─ Save metadata to documents table
    │
    ▼
Frontend: SmartResumeSetupPage
    │
    ├─ User configures smart resume
    ├─ Select document, tone, style
    │
    ▼
Backend: SmartResumeController.generateSmartResume()
    │
    ├─ SmartResumeOrchestrationService.orchestrate()
    │   │
    │   ├─ Fetch document content
    │   │
    │   ├─ SmartResumeGenerationService.generate()
    │   │   ├─ Chunk resume by entry
    │   │   ├─ For each chunk:
    │   │   │   ├─ Generate AI-enhanced content
    │   │   │   ├─ Call Claude (primary) or fallback to GPT-4/Gemini
    │   │   │   └─ Save individual results
    │   │   │
    │   │   ├─ Aggregate results
    │   │   └─ Save to smart_generated_resumes table
    │   │
    │   └─ HrValidatorAgent.validate()
    │       ├─ Check ATS compliance
    │       ├─ Verify formatting
    │       ├─ Suggest improvements
    │       └─ Save validation results
    │
    ▼
Frontend: SmartResumeResultPage (Two-Column Layout)
    │
    ├─ Left: SmartResumePaper (sticky)
    │   ├─ Contact info
    │   ├─ Professional summary
    │   ├─ Experience entries (with <b> highlighted bullets)
    │   ├─ Education
    │   ├─ Skills
    │   └─ Additional sections
    │   └─ Export to PDF (html2pdf.js)
    │
    └─ Right: HrValidationPanel (scrollable)
        │
        ├─ Recommendation Cards (structured items)
        │   ├─ Section badge (e.g., "Experience")
        │   ├─ Type badge (e.g., "enhancement")
        │   ├─ Original text
        │   ├─ Suggested improvement
        │   ├─ Reason explanation
        │   └─ Copy-to-clipboard button
        │
        └─ Overall scores & compliance status
```

### 2. Cover Letter Generation & Evaluation Flow

```
User Setup (CoverLetterSetupPage)
    │
    ├─ Upload JD file (PDF/PNG)
    ├─ Select resume document
    ├─ Select/upload master cover letter
    │
    ▼
Backend: CoverLetterController.generate()
    │
    ├─ Extract JD text from file
    │
    ├─ CoverLetterOrchestrationService.orchestrate()
    │   │
    │   ├─ CompanyResearchAgent.research()
    │   │   ├─ Tavily web search: extract company info
    │   │   ├─ Parse: company domain, products, services, tech stack
    │   │   ├─ Aggregate: blogs, videos, summary
    │   │   └─ Return: CompanyResearchOutput
    │   │
    │   ├─ CoverLetterGeneratorAgent.generate()
    │   │   ├─ Input: JD text, master letter, company research, resume
    │   │   ├─ Generate tailored paragraphs (greeting, body, closing, signoff)
    │   │   ├─ Personalize with company insights
    │   │   └─ Return: CoverLetterOutput
    │   │
    │   └─ CoverLetterGenerationService.save()
    │       ├─ Persist to pb_generated_cover_letters table
    │       ├─ Store: coverLetterContent, companyResearch
    │       └─ Return: CoverLetterResponse
    │
    ▼
Frontend: CoverLetterResultPage (Two-Column Layout)
    │
    ├─ Left: CoverLetterDisplay (sticky)
    │   ├─ Greeting
    │   ├─ Paragraphs (formatted body text)
    │   ├─ Closing
    │   ├─ Sign-off
    │   └─ Export to PDF
    │
    └─ Right: CoverLetterEvaluationPanel (on-demand)
        │
        ├─ User triggers: POST /api/cover-letter/{id}/evaluate
        │
        └─ CoverLetterEvaluatorAgent.evaluate()
            ├─ Input: generated letter, JD, company research
            ├─ Analyze: match percentage, verdict, specific suggestions
            ├─ Save to pb_cover_letter_evaluations
            └─ Display: Evaluation feedback with match score
```

## Component Architecture

### Frontend Component Hierarchy

```
App
├── ThemeProvider
│   ├── BrowserRouter
│   │   └── AppLayout
│   │       ├── AppSidebar (Navigation)
│   │       └── Routes
│   │           ├── DocumentListPage
│   │           ├── UploadPage
│   │           ├── SmartResumeSetupPage
│   │           └── SmartResumeResultPage
│   │               └── SmartResumePaper
│   │
│   └── Toaster (Notifications)
│       └── Sonner toast notifications
```

### UI Component Library (shadcn/ui)

Located in `src/components/ui/`:
- Button, Input, Select, Checkbox
- Card, Sheet, Dialog, Tooltip
- Badge, Progress, Accordion
- Table, Separator

### Layout Components

Located in `src/components/layout/`:
- **AppLayout:** Main page wrapper with sidebar
- **AppSidebar:** Navigation sidebar with theme toggle
- **ThemeProvider:** React Context for light/dark theme
- **ThemeToggle:** Button to switch themes

### Resume-Specific Components

Located in `src/components/resume/`:
- **SmartResumePaper:** AI-generated resume display with sticky positioning
- **HrValidationPanel:** Scrollable HR validation feedback with section badges
- **RecommendationCard:** Individual recommendation display with copy-to-clipboard action

### Shared Components

Located in `src/components/shared/`:
- Common UI patterns used across pages
- Loading states, error boundaries
- Form wrappers, modals

## Database Schema

### Core Tables

**documents**
- id (PK)
- user_id (FK)
- type (RESUME, JOB_DESCRIPTION)
- file_path, file_name
- created_at, updated_at

**smart_generated_resumes**
- id (PK)
- user_id (FK)
- document_id (FK)
- generated_content (JSON)
- tone, style
- created_at, updated_at

**smart_hr_validations**
- id (PK)
- smart_resume_id (FK)
- validation_results (JSON)
- ats_score, compliance_score
- recommendations (JSON array of RecommendationItem objects)
  - section, entryIndex, bulletIndex
  - type (enhancement, warning, info)
  - original, suggested, reason

**pb_generated_cover_letters**
- id (PK)
- user_id (FK)
- resume_doc_id (FK)
- master_cover_letter_doc_id (FK)
- cover_letter_content (JSON: greeting, paragraphs[], closing, signOff)
- company_research (JSON: name, domain, products, services, techStack, summary)
- created_at, updated_at

**pb_cover_letter_evaluations**
- id (PK)
- cover_letter_id (FK)
- match_percentage (decimal)
- verdict (text)
- suggestions (JSON array of strings)
- created_at, updated_at

## AI Integration Architecture

### Multi-LLM Orchestration

```
SmartResumeGenerationService
    │
    ├─ Primary: Claude API
    │   ├─ Models: claude-3.5-sonnet, claude-3-opus
    │   ├─ Use case: Main resume generation
    │   └─ Fallback on failure
    │
    ├─ Secondary: OpenAI GPT-4
    │   ├─ Use case: Alternative if Claude unavailable
    │   └─ Fallback on failure
    │
    └─ Tertiary: Google Gemini
        └─ Use case: Final fallback option
```

### Available Agents

**Resume Agents**
- **ResumeGeneratorAgent** - Multi-mode resume generation (from scratch or apply recommendations)
- **HrValidatorAgent** - ATS compliance validation with score-based recommendations

**Cover Letter Agents**
- **CompanyResearchAgent** - Tavily web search to research target company (domain, products, tech stack, blogs, videos)
- **CoverLetterGeneratorAgent** - Generates personalized cover letter leveraging company research
- **CoverLetterEvaluatorAgent** - Evaluates cover letter quality, match percentage, and relevance

### Prompt Management

- Prompts stored in `backend/src/main/resources/prompts/`
- Organized by function (generation, validation, analysis)
- Versioned for consistency
- Parameterized for flexibility
- Files: resume-generator-system.txt, hr-validator-system.txt, company-research-system.txt, cover-letter-generator-system.txt, cover-letter-evaluator-system.txt

#### Resume Generator Modes

**Mode A: Generate From Scratch**
- Input: resumeTexts (array), jdText
- Creates a complete, ATS-optimized resume from raw resume text
- Applies STAR method, quantity formatting, bold technical term highlighting

**Mode B: Apply Recommendations**
- Input: currentResume (JSON), jdText, recommendationsToApply (array)
- Takes an existing resume and applies targeted modifications
- Preserves non-targeted content exactly
- Supported operations: modify, add, remove (with entry/bullet indices)

#### HR Validator Score-Based Recommendations

- **Score >= 9.0:** 0 recommendations (resume excellent as-is)
- **Score 8.0-8.9:** 1-3 high-impact recommendations only
- **Score < 8.0:** 3-5 recommendations

Each recommendation includes: section, entry/bullet indices, type, original text, suggested text, reason

### AI Response Processing

```
Raw AI Output
    │
    ├─ Parse JSON/structured response
    ├─ Validate format
    ├─ Extract key fields
    │
    ▼
Business Logic Processing
    │
    ├─ Apply constraints
    ├─ Enhance with company research
    ├─ Validate ATS compliance
    │
    ▼
Structured Response Object
    │
    └─ Save to database
```

## State Management

### Theme State (React Context)

```
ThemeProvider
    │
    └─ Context: { theme, setTheme }
        │
        ├─ Storage: localStorage ('profile-builder-theme')
        ├─ Values: 'light' | 'dark'
        └─ Persistence: Auto-restore from storage
```

### Page State (React Hooks)

Each page manages its own state:
- Form inputs (useState)
- Loading states (useState)
- Error states (useState)
- Side effects (useEffect for API calls)

### API State Pattern

```typescript
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(result => setData(result))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, [dependencies]);
```

## Error Handling Strategy

### Frontend Error Handling

1. **API Errors:** Caught in try-catch, displayed via toast
2. **Form Validation:** Inline validation with error messages
3. **Component Errors:** Error boundary catches React errors
4. **User Feedback:** Sonner toast notifications

### Backend Error Handling

1. **Input Validation:** Spring validation annotations
2. **Business Logic:** Custom exception throwing
3. **Global Handler:** GlobalExceptionHandler converts to standardized responses
4. **Logging:** All errors logged with context

## Performance Optimization

### Frontend Optimizations
- Lazy-loaded page components (React Router)
- Memoized expensive computations
- Optimized re-renders with proper dependency arrays
- Code splitting via Vite

### Backend Optimizations
- Database indexes on foreign keys and frequently queried fields
- AI response caching (time-limited)
- Connection pooling
- Pagination for large datasets

## Security Architecture

### Frontend Security
- No sensitive data in localStorage (theme only)
- HTTPS enforced in production
- Input validation before API calls
- XSS protection via React's built-in escaping

### Backend Security
- Input validation at API boundaries
- Parameterized queries (JPA prevents SQL injection)
- Error messages don't expose stack traces
- Rate limiting on API endpoints
- Secure file upload handling
- No hardcoded credentials (env vars)

## Deployment Architecture

### Local Development
```
docker-compose.yml
├── PostgreSQL container
├── Backend service
└── Frontend dev server (Vite)
```

### Production (Planned)
```
Cloud Infrastructure
├── Frontend: Static hosting (CDN)
├── Backend: Container orchestration (K8s/Docker)
├── Database: Managed PostgreSQL
└── Storage: Cloud file storage
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend services
- Database connection pooling
- Distributed caching layer (Redis, optional)

### Vertical Scaling
- Optimize queries with proper indexing
- Implement caching strategies
- Monitor resource usage

### Future Optimizations
- Event-driven architecture for async tasks
- Message queues (RabbitMQ) for long-running processes
- Microservices split by domain (if needed)
