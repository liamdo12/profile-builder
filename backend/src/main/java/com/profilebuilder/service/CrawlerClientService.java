package com.profilebuilder.service;

import com.profilebuilder.model.dto.CrawlerRequest;
import com.profilebuilder.model.dto.CrawlerResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

/**
 * HTTP client for communicating with the Node.js Playwright crawler service.
 * Returns empty result on failure instead of throwing exceptions.
 */
@Service
public class CrawlerClientService {

    private static final Logger log = LoggerFactory.getLogger(CrawlerClientService.class);

    private final RestTemplate restTemplate;

    @Value("${app.crawler.base-url}")
    private String crawlerBaseUrl;

    public CrawlerClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Calls the crawler service to scrape jobs based on the given request.
     * @return crawler response or empty result on failure
     */
    public CrawlerResponse crawl(CrawlerRequest request) {
        String url = crawlerBaseUrl + "/crawl";
        log.info("Calling crawler service: {} for '{}'", url, request.getJobTitle());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<CrawlerRequest> entity = new HttpEntity<>(request, headers);

            CrawlerResponse response = restTemplate.postForObject(url, entity, CrawlerResponse.class);
            if (response != null) {
                log.info("Crawler returned {} jobs", response.getJobs() != null ? response.getJobs().size() : 0);
                return response;
            }
        } catch (Exception e) {
            log.error("Crawler service call failed: {}", e.getMessage());
        }

        // Return empty result on failure
        CrawlerResponse empty = new CrawlerResponse();
        empty.setSuccess(false);
        empty.setJobs(Collections.emptyList());
        empty.setErrors(Collections.emptyList());
        return empty;
    }
}
