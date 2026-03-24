package com.profilebuilder.model.enums;

/**
 * Job source platforms supported by the crawler, with display metadata.
 */
public enum SourceSite {
    LINKEDIN("LinkedIn", "\uD83D\uDCBC"),   // briefcase
    INDEED("Indeed", "\uD83D\uDD0D"),       // magnifying glass
    GITHUB("GitHub", "\uD83D\uDCBB");       // laptop

    private final String displayName;
    private final String emoji;

    SourceSite(String displayName, String emoji) {
        this.displayName = displayName;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getEmoji() { return emoji; }
}
