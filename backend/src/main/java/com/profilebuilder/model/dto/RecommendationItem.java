package com.profilebuilder.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Structured recommendation item produced by the HR validator agent.
 * Pinpoints exactly which section/entry/bullet to change and how.
 */
@Data
@NoArgsConstructor
public class RecommendationItem {

    private String section;      // EXPERIENCE, SKILLS, PROJECTS, EDUCATION
    private Integer entryIndex;  // null for section-level recommendations
    private Integer bulletIndex; // null for entry-level recommendations
    private String type;         // "modify" | "add" | "remove"
    private String original;     // null for "add" type
    private String suggested;    // the suggested replacement or addition
    private String reason;       // why this change is recommended
}
