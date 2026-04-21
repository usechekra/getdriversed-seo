# Neil Patel Source Documents

Drop the original PDFs, spreadsheets, and reports from NP|accel here. Claude Code references them when extracting patterns or answering "what did Neil Patel actually say about X?"

## Expected Files

Based on what you've shared so far, this folder should contain:

- `Get Drivers Ed.pdf` — master strategy deck
- `Get Drivers Ed_Feb 2026 Onsite Recommendations.pdf` — NY Pre-Licensing onsite spec
- `Get Drivers Ed_Feb 2026 Onsite Recommendations_NY Online PreLicensing.csv` — CSV export
- `Get Drivers Ed_Web Copy Refresh_New York.pdf` — NY content refresh
- `Get Drivers Ed_Web Copy Refresh_Ohio Drivers Ed Online Course.pdf` — Ohio content refresh
- `JAN 2026 SEO Monthly Performance Deck.pdf` — monthly KPI deck
- `November 2025 Onsite Recommendations.ods` — older onsite recs
- Screenshots from SEMRush content restructuring + PA teen drivers ed cluster

## Adding New Neil Patel Deliverables

As NP|accel continues to send you new docs:

1. Drop the file in this folder
2. Tell Claude: "Read the new file in `neil-patel-docs/` and update `references/np-accel-system.md` if the pattern changes"
3. Commit

This keeps the extracted system (`references/np-accel-system.md`) synced with whatever NP|accel is currently doing.

## Filename Conventions

Keep filenames descriptive and include dates where possible:

```
[YYYY_MM]_[Doc_Type]_[Scope].ext

Examples:
2026_02_Onsite_Recommendations_NY_Pre_Licensing.pdf
2026_01_Performance_Deck.pdf
2025_12_Web_Copy_Refresh_Ohio.pdf
```

Makes searching easier and helps Claude pick the most recent version when patterns conflict.
