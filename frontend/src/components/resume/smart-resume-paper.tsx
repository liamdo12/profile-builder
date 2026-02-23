import DOMPurify from 'dompurify'
import type { SmartResumeSection, SmartResumeSectionEntry, SmartResumeContent } from '@/types/smart-resume'
import '@/styles/smart-resume-template.css'

const sectionLabels: Record<string, string> = {
  EDUCATION: 'Education',
  EXPERIENCE: 'Professional Work Experience',
  SKILLS: 'Technical Skills',
  PROJECTS: 'Projects',
}

function renderEntry(entry: SmartResumeSectionEntry, sectionName: string, idx: number) {
  const isSkills = sectionName === 'SKILLS'

  if (isSkills) {
    return (
      <div key={idx} className="smart-resume-skill-line">
        {entry.title && <span className="smart-resume-skill-category">{entry.title}: </span>}
        {entry.bullets.join(', ')}
      </div>
    )
  }

  const isEducation = sectionName === 'EDUCATION'

  return (
    <div key={idx} className="smart-resume-entry">
      {isEducation ? (
        <>
          <div className="smart-resume-entry-header-row">
            <span className="smart-resume-entry-title">{entry.title}</span>
            {entry.location && <span className="smart-resume-entry-location">{entry.location}</span>}
          </div>
          <div className="smart-resume-entry-header-row">
            <span className="smart-resume-entry-subtitle">{entry.subtitle}</span>
            {entry.dateRange && <span className="smart-resume-entry-date">{entry.dateRange}</span>}
          </div>
        </>
      ) : (
        <>
          <div className="smart-resume-entry-header">
            <span className="smart-resume-entry-title">{entry.title}</span>
            {entry.dateRange && <span className="smart-resume-entry-date">{entry.dateRange}</span>}
          </div>
          {entry.subtitle && <div className="smart-resume-entry-subtitle">{entry.subtitle}</div>}
        </>
      )}
      {entry.bullets.length > 0 && (
        <ul className="smart-resume-bullets">
          {entry.bullets.map((b, bi) => (
            <li
              key={bi}
              className="smart-resume-bullet"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(b) }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function renderSection(sec: SmartResumeSection) {
  return (
    <div key={sec.sectionName} className="smart-resume-section">
      <div className="smart-resume-section-title">
        {sectionLabels[sec.sectionName] || sec.sectionName}
      </div>
      {sec.entries.map((entry, i) => renderEntry(entry, sec.sectionName, i))}
    </div>
  )
}

interface SmartResumePaperProps {
  resumeContent: SmartResumeContent
}

// Renders the printable resume paper with all sections
export function SmartResumePaper({ resumeContent }: SmartResumePaperProps) {
  const { personalInfo, sections } = resumeContent
  return (
    <div className="smart-resume-layout">
      <div className="smart-resume-paper">
        <div className="smart-resume-header">
          <h1 className="smart-resume-header-name">{personalInfo?.fullName}</h1>
          {personalInfo && (
            <div className="smart-resume-header-contact">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
              {personalInfo.githubUrl && <span>{personalInfo.githubUrl}</span>}
            </div>
          )}
        </div>
        {sections.map(renderSection)}
      </div>
    </div>
  )
}
