package com.profilebuilder.ai.dto;

import java.util.List;

/**
 * AI output DTO for the resume generator agent.
 * Represents a complete, structured resume tailored to a job description.
 */
public class SmartResumeOutput {

    private PersonalInfo personalInfo;
    private List<ResumeSection> sections;

    public SmartResumeOutput() {
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public List<ResumeSection> getSections() {
        return sections;
    }

    public void setSections(List<ResumeSection> sections) {
        this.sections = sections;
    }

    public static class PersonalInfo {
        private String fullName;
        private String location;
        private String phone;
        private String email;
        private String linkedinUrl;
        private String githubUrl;

        public PersonalInfo() {
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getLinkedinUrl() {
            return linkedinUrl;
        }

        public void setLinkedinUrl(String linkedinUrl) {
            this.linkedinUrl = linkedinUrl;
        }

        public String getGithubUrl() {
            return githubUrl;
        }

        public void setGithubUrl(String githubUrl) {
            this.githubUrl = githubUrl;
        }
    }

    public static class ResumeSection {
        private String sectionName; // EDUCATION, EXPERIENCE, PROJECTS, SKILLS
        private List<SectionEntry> entries;

        public ResumeSection() {
        }

        public String getSectionName() {
            return sectionName;
        }

        public void setSectionName(String sectionName) {
            this.sectionName = sectionName;
        }

        public List<SectionEntry> getEntries() {
            return entries;
        }

        public void setEntries(List<SectionEntry> entries) {
            this.entries = entries;
        }
    }

    public static class SectionEntry {
        private String title;       // Job title / Institution / Project name / Skill category
        private String subtitle;    // Company / Degree / (empty for projects and skills)
        private String location;    // Location (education only)
        private String dateRange;   // Date range
        private List<String> bullets; // Bullet points

        public SectionEntry() {
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getSubtitle() {
            return subtitle;
        }

        public void setSubtitle(String subtitle) {
            this.subtitle = subtitle;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getDateRange() {
            return dateRange;
        }

        public void setDateRange(String dateRange) {
            this.dateRange = dateRange;
        }

        public List<String> getBullets() {
            return bullets;
        }

        public void setBullets(List<String> bullets) {
            this.bullets = bullets;
        }
    }
}
