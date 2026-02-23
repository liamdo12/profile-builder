package com.profilebuilder.service;

import com.profilebuilder.ai.dto.SmartResumeOutput;
import com.profilebuilder.ai.dto.SmartResumeOutput.PersonalInfo;
import com.profilebuilder.ai.dto.SmartResumeOutput.ResumeSection;
import com.profilebuilder.ai.dto.SmartResumeOutput.SectionEntry;
import org.apache.poi.xwpf.usermodel.*;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Generates a DOCX byte array from a SmartResumeOutput using Apache POI.
 * Font: Calibri, margins: 1 inch (1440 twips), tab stops for right-aligned dates.
 */
@Service
public class SmartResumeDocxService {

    private static final String FONT = "Calibri";
    private static final int MARGIN_TWIPS = 1440;
    private static final int PAGE_WIDTH_TWIPS = 12240; // Letter: 8.5 in
    private static final int CONTENT_WIDTH_TWIPS = PAGE_WIDTH_TWIPS - 2 * MARGIN_TWIPS;
    private static final Pattern BOLD_SPLIT = Pattern.compile("(<b>|</b>)");

    public byte[] generateDocx(SmartResumeOutput resumeOutput) {
        try (XWPFDocument doc = new XWPFDocument()) {
            configurePageMargins(doc);
            renderPersonalInfo(doc, resumeOutput.getPersonalInfo());
            if (resumeOutput.getSections() != null) {
                for (ResumeSection section : resumeOutput.getSections()) {
                    renderSection(doc, section);
                }
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate DOCX: " + e.getMessage(), e);
        }
    }

    // ── Page Setup ────────────────────────────────────────────

    private void configurePageMargins(XWPFDocument doc) {
        CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
        CTPageMar pageMar = sectPr.addNewPgMar();
        BigInteger m = BigInteger.valueOf(MARGIN_TWIPS);
        pageMar.setTop(m);
        pageMar.setBottom(m);
        pageMar.setLeft(m);
        pageMar.setRight(m);
    }

    // ── Personal Info Header ──────────────────────────────────

    private void renderPersonalInfo(XWPFDocument doc, PersonalInfo info) {
        if (info == null) return;

        // Name — 16pt bold centered
        XWPFParagraph namePara = doc.createParagraph();
        namePara.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun nameRun = namePara.createRun();
        nameRun.setFontFamily(FONT);
        nameRun.setFontSize(16);
        nameRun.setBold(true);
        nameRun.setText(info.getFullName() != null ? info.getFullName() : "");

        // Contact line — pipe-separated 10pt centered
        List<String> contactParts = new ArrayList<>();
        if (notEmpty(info.getLocation())) contactParts.add(info.getLocation());
        if (notEmpty(info.getPhone())) contactParts.add(info.getPhone());
        if (notEmpty(info.getEmail())) contactParts.add(info.getEmail());
        if (notEmpty(info.getLinkedinUrl())) contactParts.add(info.getLinkedinUrl());
        if (notEmpty(info.getGithubUrl())) contactParts.add(info.getGithubUrl());

        XWPFParagraph contactPara = doc.createParagraph();
        contactPara.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun contactRun = contactPara.createRun();
        contactRun.setFontFamily(FONT);
        contactRun.setFontSize(10);
        contactRun.setText(String.join(" | ", contactParts));
    }

    // ── Section Rendering ─────────────────────────────────────

    private void renderSection(XWPFDocument doc, ResumeSection section) {
        renderSectionTitle(doc, section.getSectionName());
        if (section.getEntries() == null) return;
        String type = section.getSectionName() != null ? section.getSectionName().toUpperCase() : "";
        for (SectionEntry entry : section.getEntries()) {
            switch (type) {
                case "EDUCATION" -> renderEducationEntry(doc, entry);
                case "EXPERIENCE" -> renderExperienceEntry(doc, entry);
                case "PROJECTS" -> renderProjectEntry(doc, entry);
                case "SKILLS" -> renderSkillsEntry(doc, entry);
                default -> renderExperienceEntry(doc, entry);
            }
        }
    }

    private void renderSectionTitle(XWPFDocument doc, String title) {
        XWPFParagraph para = doc.createParagraph();
        para.setSpacingAfter(160); // 8pt in twips (1pt = 20 twips)
        // Bottom border
        CTPPr pPr = para.getCTP().isSetPPr() ? para.getCTP().getPPr() : para.getCTP().addNewPPr();
        CTPBdr pBdr = pPr.isSetPBdr() ? pPr.getPBdr() : pPr.addNewPBdr();
        CTBorder bottom = pBdr.addNewBottom();
        bottom.setVal(STBorder.SINGLE);
        bottom.setSz(BigInteger.valueOf(6));
        bottom.setSpace(BigInteger.valueOf(1));
        bottom.setColor("000000");

        XWPFRun run = para.createRun();
        run.setFontFamily(FONT);
        run.setFontSize(12);
        run.setBold(true);
        run.setText(title != null ? title.toUpperCase() : "");
    }

    // ── Entry Layouts ─────────────────────────────────────────

    private void renderEducationEntry(XWPFDocument doc, SectionEntry entry) {
        // Line 1: Title (bold 11pt left) + Location (10pt right)
        addTwoColumnLine(doc, entry.getTitle(), true, 11, entry.getLocation(), false, 10);
        // Line 2: Subtitle (10pt italic left) + DateRange (10pt right)
        addTwoColumnLine(doc, entry.getSubtitle(), false, 10, entry.getDateRange(), false, 10, true, false);
        renderBullets(doc, entry.getBullets());
    }

    private void renderExperienceEntry(XWPFDocument doc, SectionEntry entry) {
        // Line 1: Title (bold 11pt left) + DateRange (10pt right)
        addTwoColumnLine(doc, entry.getTitle(), true, 11, entry.getDateRange(), false, 10);
        // Line 2: Subtitle (10pt italic)
        if (notEmpty(entry.getSubtitle())) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun r = p.createRun();
            r.setFontFamily(FONT);
            r.setFontSize(10);
            r.setItalic(true);
            r.setText(entry.getSubtitle());
        }
        renderBullets(doc, entry.getBullets());
    }

    private void renderProjectEntry(XWPFDocument doc, SectionEntry entry) {
        addTwoColumnLine(doc, entry.getTitle(), true, 11, entry.getDateRange(), false, 10);
        renderBullets(doc, entry.getBullets());
    }

    private void renderSkillsEntry(XWPFDocument doc, SectionEntry entry) {
        // "Category: skill1, skill2, ..." — no bullet points
        XWPFParagraph p = doc.createParagraph();
        setSpacing(p, 0, 80);
        // Bold category label
        XWPFRun labelRun = p.createRun();
        labelRun.setFontFamily(FONT);
        labelRun.setFontSize(10);
        labelRun.setBold(true);
        labelRun.setText((entry.getTitle() != null ? entry.getTitle() : "") + ": ");
        // Plain skills list
        if (entry.getBullets() != null && !entry.getBullets().isEmpty()) {
            XWPFRun valRun = p.createRun();
            valRun.setFontFamily(FONT);
            valRun.setFontSize(10);
            valRun.setText(String.join(", ", entry.getBullets()));
        }
    }

    // ── Shared Helpers ────────────────────────────────────────

    /** Creates a paragraph with left text and right-aligned text via tab stop. */
    private void addTwoColumnLine(XWPFDocument doc, String leftText, boolean leftBold, int leftSize,
                                   String rightText, boolean rightBold, int rightSize) {
        addTwoColumnLine(doc, leftText, leftBold, leftSize, rightText, rightBold, rightSize, false, false);
    }

    private void addTwoColumnLine(XWPFDocument doc, String leftText, boolean leftBold, int leftSize,
                                   String rightText, boolean rightBold, int rightSize,
                                   boolean leftItalic, boolean rightItalic) {
        XWPFParagraph p = doc.createParagraph();
        // Right-aligned tab stop at content width
        CTPPr pPr = p.getCTP().isSetPPr() ? p.getCTP().getPPr() : p.getCTP().addNewPPr();
        CTTabs tabs = pPr.isSetTabs() ? pPr.getTabs() : pPr.addNewTabs();
        CTTabStop tab = tabs.addNewTab();
        tab.setVal(STTabJc.RIGHT);
        tab.setPos(BigInteger.valueOf(CONTENT_WIDTH_TWIPS));

        XWPFRun leftRun = p.createRun();
        leftRun.setFontFamily(FONT);
        leftRun.setFontSize(leftSize);
        leftRun.setBold(leftBold);
        leftRun.setItalic(leftItalic);
        leftRun.setText(leftText != null ? leftText : "");

        if (notEmpty(rightText)) {
            XWPFRun tabRun = p.createRun();
            tabRun.addTab();
            XWPFRun rightRun = p.createRun();
            rightRun.setFontFamily(FONT);
            rightRun.setFontSize(rightSize);
            rightRun.setBold(rightBold);
            rightRun.setItalic(rightItalic);
            rightRun.setText(rightText);
        }
    }

    /** Renders bullet points, parsing inline <b> tags into bold runs. */
    private void renderBullets(XWPFDocument doc, List<String> bullets) {
        if (bullets == null) return;
        for (String bullet : bullets) {
            XWPFParagraph p = doc.createParagraph();
            setSpacing(p, 0, 80); // 0pt before, 4pt after (4*20=80 twips)
            // Indent for bullet
            CTPPr pPr = p.getCTP().isSetPPr() ? p.getCTP().getPPr() : p.getCTP().addNewPPr();
            CTInd ind = pPr.isSetInd() ? pPr.getInd() : pPr.addNewInd();
            ind.setLeft(BigInteger.valueOf(360));
            ind.setHanging(BigInteger.valueOf(360));

            // Bullet prefix run
            XWPFRun bulletRun = p.createRun();
            bulletRun.setFontFamily(FONT);
            bulletRun.setFontSize(10);
            bulletRun.setText("\u2022\t");

            // Parse inline bold tags
            String[] parts = BOLD_SPLIT.split(bullet != null ? bullet : "", -1);
            boolean bold = false;
            for (String part : parts) {
                if (part.equals("<b>")) { bold = true; continue; }
                if (part.equals("</b>")) { bold = false; continue; }
                if (part.isEmpty()) continue;
                XWPFRun run = p.createRun();
                run.setFontFamily(FONT);
                run.setFontSize(10);
                run.setBold(bold);
                run.setText(part);
            }
        }
    }

    private void setSpacing(XWPFParagraph p, int beforeTwips, int afterTwips) {
        CTPPr pPr = p.getCTP().isSetPPr() ? p.getCTP().getPPr() : p.getCTP().addNewPPr();
        CTSpacing spacing = pPr.isSetSpacing() ? pPr.getSpacing() : pPr.addNewSpacing();
        spacing.setBefore(BigInteger.valueOf(beforeTwips));
        spacing.setAfter(BigInteger.valueOf(afterTwips));
    }

    private boolean notEmpty(String s) {
        return s != null && !s.isBlank();
    }
}
