package com.profilebuilder.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO sent to the Node.js crawler service POST /crawl endpoint.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrawlerRequest {
    private String jobTitle;
    private String location;
    private Integer datePostedWithinDays;
    private List<String> sources;
    private Integer maxResultsPerSource;
}
