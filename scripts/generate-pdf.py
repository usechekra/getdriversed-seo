#!/usr/bin/env python3
"""
generate-pdf.py — Generic PDF generator for Get Drivers Ed SEO deliverables.

Usage:
  python3 scripts/generate-pdf.py --slug michigan-online-defensive-driving-course
  python3 scripts/generate-pdf.py --slug california-traffic-school --stage completed

Produces two PDFs in the page folder:
  1. [Slug]-SEO-REFERENCE.pdf  — score + keywords + competitor gap + optimization (your copy)
  2. [Slug]-DEV-HANDOFF.pdf    — dev-handoff.md + schema.json (send to devs)
"""
import argparse
import re
import json
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, Preformatted
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# ── Config ────────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
ASSET_DIR = REPO_ROOT / "assets"
LOGO_PATH = str(ASSET_DIR / "gde-logo.png")
SMILEY_PATH = str(ASSET_DIR / "smiley-watermark.png")

# ── Palette ───────────────────────────────────────────────────────────────────
NAVY    = colors.HexColor("#1a1a2e")
NAVY2   = colors.HexColor("#2d2d5e")
GOLD    = colors.HexColor("#f5c518")
WHITE   = colors.white
BLACK   = colors.HexColor("#111111")
GRAY    = colors.HexColor("#555566")
GRAY_LT = colors.HexColor("#f4f4f8")
SKY     = colors.HexColor("#eef0f8")
RED_ROW = colors.HexColor("#fff0f0")
RED_HDR = colors.HexColor("#c0392b")
GRN_ROW = colors.HexColor("#f0fff4")
GRN_HDR = colors.HexColor("#1b6b35")
AMBER   = colors.HexColor("#fff8e1")
AMBER_BD= colors.HexColor("#f0a500")

# ── Text helpers ──────────────────────────────────────────────────────────────
SUBS = {
    "✅":"[YES]","❌":"[NO]","⚠️":"[!]","⚠":"[!]","\u2019":"'","\u2018":"'",
    "\u201c":'"',"\u201d":'"',"\u2013":"-","\u2014":"--","–":"-","—":"--",
    "\u00a0":" ","⭐":"[*]","🔴":"[!]","🟡":"[~]","🟢":"[ok]","·":".",
}
def clean(t):
    for k,v in SUBS.items(): t = t.replace(k, v)
    return t

def fmt(raw):
    t = clean(raw)
    t = re.sub(r'`([^`\n]+)`', lambda m: f'<font name="Courier" size="8">{m.group(1).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")}</font>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t, flags=re.DOTALL)
    t = re.sub(r'\*([^*\n]+?)\*',  r'<i>\1</i>', t)
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)
    return t

# ── Styles ────────────────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()
    def S(name, parent="Normal", **kw):
        return ParagraphStyle(name, parent=base[parent], **kw)
    return {
        "sec":    S("sec", fontSize=12, leading=16, textColor=WHITE, backColor=NAVY2,
                    fontName="Helvetica-Bold", spaceBefore=18, spaceAfter=10,
                    leftIndent=-4, borderPad=7),
        "h2":     S("h2","Heading2", fontSize=11, leading=15, textColor=NAVY2,
                    spaceBefore=14, spaceAfter=5, backColor=SKY, borderPad=4),
        "h3":     S("h3","Heading3", fontSize=10, leading=14, textColor=NAVY2,
                    spaceBefore=10, spaceAfter=3, fontName="Helvetica-Bold"),
        "h4":     S("h4","Heading4", fontSize=9.5, leading=13, textColor=GRAY,
                    spaceBefore=8, spaceAfter=2, fontName="Helvetica-BoldOblique"),
        "body":   S("body", fontSize=9.5, leading=14, textColor=BLACK, spaceAfter=5),
        "bullet": S("bullet", fontSize=9.5, leading=13, textColor=BLACK,
                    leftIndent=14, bulletIndent=5, spaceAfter=3),
        "mono":   S("mono", "Code", fontSize=7.5, leading=10, fontName="Courier",
                    backColor=GRAY_LT, textColor=BLACK, leftIndent=6, rightIndent=6,
                    borderColor=colors.HexColor("#ccccdd"), borderWidth=0.5,
                    borderPad=6, spaceAfter=6, spaceBefore=4),
        "cell":   S("cell", fontSize=9, leading=13, textColor=BLACK, spaceAfter=0),
        "note":   S("note", fontSize=9, leading=13, textColor=colors.HexColor("#5a3a00"),
                    backColor=AMBER, borderColor=AMBER_BD, borderWidth=1,
                    borderPad=6, spaceAfter=6, spaceBefore=4),
        "footer": S("footer", fontSize=7.5, textColor=GRAY, alignment=TA_CENTER),
        "title":  S("title", fontSize=26, leading=31, textColor=WHITE,
                    fontName="Helvetica-Bold", spaceAfter=10),
        "subtitle":S("subtitle", fontSize=13, textColor=GOLD, fontName="Helvetica-Bold",
                    spaceAfter=8),
        "stat_val":S("sv", fontSize=17, leading=21, textColor=NAVY2,
                    fontName="Helvetica-Bold", alignment=TA_CENTER),
        "stat_lbl":S("sl", fontSize=7.5, textColor=GRAY, alignment=TA_CENTER),
    }

# ── Page template ─────────────────────────────────────────────────────────────
def make_on_page(header_text):
    def on_page(canvas, doc):
        w, h = letter
        canvas.saveState()
        try:
            canvas.saveState()
            canvas.setFillAlpha(0.25)
            canvas.drawImage(SMILEY_PATH, w/2-150, h/2-150, width=300, height=300,
                             mask="auto", preserveAspectRatio=True)
            canvas.restoreState()
        except Exception: pass
        canvas.setFillColor(NAVY)
        canvas.rect(0, h-0.62*inch, w, 0.62*inch, fill=1, stroke=0)
        canvas.setFillColor(GOLD)
        canvas.rect(0, h-0.66*inch, w, 0.04*inch, fill=1, stroke=0)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#aaaacc"))
        canvas.drawString(0.4*inch, h-0.42*inch, header_text)
        try:
            canvas.drawImage(LOGO_PATH, w-1.9*inch, h-0.60*inch,
                             width=1.65*inch, height=0.50*inch,
                             mask="auto", preserveAspectRatio=True)
        except Exception:
            canvas.setFont("Helvetica-Bold", 8)
            canvas.setFillColor(WHITE)
            canvas.drawRightString(w-0.35*inch, h-0.40*inch, "GET DRIVERS ED")
        canvas.setFillColor(GOLD)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawRightString(w-1.95*inch, h-0.42*inch, f"p. {doc.page}")
        canvas.setStrokeColor(NAVY2); canvas.setLineWidth(1)
        canvas.line(0.4*inch, 0.52*inch, w-0.4*inch, 0.52*inch)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(GRAY)
        canvas.drawString(0.4*inch, 0.32*inch, "Get Drivers Ed — SEO Operations | Confidential")
        canvas.drawRightString(w-0.4*inch, 0.32*inch, "getdriversed.com")
        canvas.restoreState()
    return on_page

# ── Cover page ────────────────────────────────────────────────────────────────
def make_cover(styles, title_line, subtitle_line, url_line, date_line, stats):
    story = [Spacer(1, 0.5*inch)]
    inner = [
        Paragraph(subtitle_line, styles["subtitle"]),
        Paragraph(title_line, styles["title"]),
        Paragraph(url_line, ParagraphStyle("cu", fontSize=9.5,
                  textColor=colors.HexColor("#9999bb"), spaceAfter=18)),
        Paragraph(date_line, ParagraphStyle("cd", fontSize=9,
                  textColor=colors.HexColor("#888899"))),
    ]
    block = Table([[cell] for cell in inner], colWidths=[6.9*inch])
    block.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("LEFTPADDING", (0,0), (-1,-1), 30),
        ("RIGHTPADDING", (0,0), (-1,-1), 30),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    outer = Table([[block]], colWidths=[7.5*inch])
    outer.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TOPPADDING", (0,0), (-1,-1), 28),
        ("BOTTOMPADDING", (0,0), (-1,-1), 28),
        ("LEFTPADDING", (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
    ]))
    story.append(outer)
    stripe = Table([[""]], colWidths=[7.5*inch], rowHeights=[0.12*inch])
    stripe.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GOLD)]))
    story.append(stripe)
    story.append(Spacer(1, 0.3*inch))
    cells = []
    for label, val in stats:
        c = Table([
            [Paragraph(f"<b>{val}</b>", styles["stat_val"])],
            [Paragraph(label, styles["stat_lbl"])],
        ], colWidths=[1.65*inch])
        c.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), SKY),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BOX", (0,0), (-1,-1), 0.5, colors.HexColor("#ccccdd")),
            ("LINEBELOW", (0,0), (-1,0), 2.5, GOLD),
        ]))
        cells.append(c)
    stat_row = Table([cells], colWidths=[1.72*inch]*len(cells), hAlign="CENTER")
    stat_row.setStyle(TableStyle([
        ("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4)]))
    story.append(stat_row)
    story.append(PageBreak())
    return story

# ── Markdown-to-story renderer ─────────────────────────────────────────────────
def md_to_story(text, styles):
    """Parse a markdown file into a reportlab story."""
    story = []
    lines = text.split('\n')
    i = 0
    in_code = False
    code_buf = []

    while i < len(lines):
        line = lines[i]

        # Code block
        if line.strip().startswith('```'):
            if in_code:
                # Close code block
                code_text = '\n'.join(code_buf)
                if len(code_text) > 2000:
                    code_text = code_text[:2000] + '\n... [truncated for PDF]'
                story.append(Preformatted(clean(code_text), styles["mono"]))
                code_buf = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        stripped = line.strip()

        # Headings
        if stripped.startswith('#### '):
            story.append(Paragraph(fmt(stripped[5:]), styles["h4"]))
        elif stripped.startswith('### '):
            story.append(Paragraph(fmt(stripped[4:]), styles["h3"]))
        elif stripped.startswith('## '):
            story.append(Paragraph(fmt(stripped[3:]), styles["h2"]))
        elif stripped.startswith('# '):
            story.append(Paragraph(fmt(stripped[2:]), styles["sec"]))

        # Horizontal rule
        elif stripped.startswith('---'):
            story.append(HRFlowable(width="100%", thickness=0.5,
                                    color=colors.HexColor("#ccccdd"), spaceAfter=4))

        # Table row (skip — tables are complex; render header row only with note)
        elif stripped.startswith('|'):
            cells = [c.strip() for c in stripped.split('|') if c.strip()]
            if cells and not all(c.startswith('-') for c in cells):
                row_text = '  |  '.join(fmt(c) for c in cells)
                story.append(Paragraph(row_text,
                    ParagraphStyle("tr", parent=styles["cell"],
                                   fontSize=8.5, backColor=GRAY_LT, spaceAfter=1)))

        # Bullet points
        elif stripped.startswith(('- ', '* ', '+ ')):
            story.append(Paragraph(f'&bull; &nbsp; {fmt(stripped[2:])}', styles["bullet"]))
        elif re.match(r'^\d+\. ', stripped):
            story.append(Paragraph(f'&bull; &nbsp; {fmt(stripped)}', styles["bullet"]))

        # Blank line
        elif not stripped:
            story.append(Spacer(1, 4))

        # Regular paragraph
        else:
            story.append(Paragraph(fmt(stripped), styles["body"]))

        i += 1

    return story

# ── Build SEO Reference PDF ───────────────────────────────────────────────────
def build_reference_pdf(folder, slug, meta, styles):
    kw = meta.get('primary_kw', slug.replace('-', ' ').title())
    score_before = meta.get('score_before', '?')
    score_after = meta.get('score_projected', '?')
    url = meta.get('url', f'https://getdriversed.com/...')
    date = meta.get('date', '2026')

    out = folder / f"{slug}-SEO-REFERENCE.pdf"
    header = f"{kw} — SEO Reference"
    doc = SimpleDocTemplate(str(out), pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.88*inch, bottomMargin=0.78*inch,
        title=f"{kw} — SEO Reference",
        author="Get Drivers Ed SEO")

    story = make_cover(styles,
        title_line=kw,
        subtitle_line="SEO Reference — Strategy & Research",
        url_line=url,
        date_line=f"Page Type: State Course Page  ·  Date: {date}",
        stats=[
            ("Current Score", f"{score_before}/100"),
            ("Projected Score", f"{score_after}/100"),
            ("Delta", f"+{int(score_after)-int(score_before) if str(score_before).isdigit() and str(score_after).isdigit() else '?'} pts"),
            ("Status", "In Progress"),
        ]
    )

    sections = [
        ("score.md",          "Score & Priorities"),
        ("keyword-cluster.md","Keyword Cluster"),
        ("competitor-gap.md", "Competitor Gap Analysis"),
        ("optimization.md",   "Full Optimization Brief"),
    ]
    for fname, section_title in sections:
        fpath = folder / fname
        if not fpath.exists():
            continue
        text = fpath.read_text(encoding='utf-8')
        story.append(Paragraph(section_title, styles["sec"]))
        story.extend(md_to_story(text, styles))
        story.append(PageBreak())

    doc.build(story, onFirstPage=make_on_page(header), onLaterPages=make_on_page(header))
    print(f"[OK] {out.name}  ({out.stat().st_size // 1024} KB)")
    return out

# ── Build Dev Handoff PDF ─────────────────────────────────────────────────────
def build_dev_pdf(folder, slug, meta, styles):
    kw = meta.get('primary_kw', slug.replace('-', ' ').title())
    score_before = meta.get('score_before', '?')
    score_after = meta.get('score_projected', '?')
    url = meta.get('url', f'https://getdriversed.com/...')
    date = meta.get('date', '2026')

    out = folder / f"{slug}-DEV-HANDOFF.pdf"
    header = f"{kw} — Developer Implementation Guide"
    doc = SimpleDocTemplate(str(out), pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.88*inch, bottomMargin=0.78*inch,
        title=f"{kw} — Developer Implementation Guide",
        author="Get Drivers Ed SEO")

    story = make_cover(styles,
        title_line=kw,
        subtitle_line="Developer Implementation Guide",
        url_line=url,
        date_line=f"Page Type: State Course Page  ·  Audit Date: {date}",
        stats=[
            ("Current Score", f"{score_before}/100"),
            ("Projected Score", f"{score_after}/100"),
            ("Delta", f"+{int(score_after)-int(score_before) if str(score_before).isdigit() and str(score_after).isdigit() else '?'} pts"),
            ("Words Added", "~1,400"),
        ]
    )

    # Dev handoff markdown
    dev_path = folder / "dev-handoff.md"
    if dev_path.exists():
        story.append(Paragraph("Implementation Instructions", styles["sec"]))
        story.extend(md_to_story(dev_path.read_text(encoding='utf-8'), styles))
        story.append(PageBreak())

    # Schema JSON
    schema_path = folder / "schema.json"
    if schema_path.exists():
        story.append(Paragraph("JSON-LD Schema (paste into <head>)", styles["sec"]))
        story.append(Paragraph(
            "Paste the block below into a single "
            "<font name='Courier' size='9'>&lt;script type=\"application/ld+json\"&gt;</font> "
            "tag in the page <font name='Courier' size='9'>&lt;head&gt;</font>. "
            "Validate at search.google.com/test/rich-results before deploying.",
            styles["note"]))
        story.append(Spacer(1, 6))
        schema_text = schema_path.read_text(encoding='utf-8')
        # Truncate if enormous
        if len(schema_text) > 8000:
            schema_text = schema_text[:8000] + '\n... [see schema.json for full block]'
        story.append(Preformatted(schema_text, styles["mono"]))

    doc.build(story, onFirstPage=make_on_page(header), onLaterPages=make_on_page(header))
    print(f"[OK] {out.name}  ({out.stat().st_size // 1024} KB)")
    return out

# ── Extract meta from score.md ─────────────────────────────────────────────────
def parse_meta(folder):
    meta = {}
    score_path = folder / "score.md"
    if score_path.exists():
        text = score_path.read_text(encoding='utf-8')
        m = re.search(r'\*\*URL:\*\*\s*(https?://\S+)', text)
        if m: meta['url'] = m.group(1)
        m = re.search(r'\*\*Primary KW:\*\*\s*(.+)', text)
        if m: meta['primary_kw'] = m.group(1).strip()
        m = re.search(r'Current Score.*?(\d+)/100', text)
        if m: meta['score_before'] = m.group(1)
        m = re.search(r'Projected Score.*?(\d+)/100', text)
        if m: meta['score_projected'] = m.group(1)
        m = re.search(r'\*\*Date:\*\*\s*(\S+)', text)
        if m: meta['date'] = m.group(1)
    brief_path = folder / "brief.md"
    if brief_path.exists():
        text = brief_path.read_text(encoding='utf-8')
        m = re.search(r'\*\*Date:\*\*\s*(\S+)', text)
        if m and 'date' not in meta: meta['date'] = m.group(1)
        m = re.search(r'\*\*Source URL:\*\*\s*(https?://\S+)', text)
        if m and 'url' not in meta: meta['url'] = m.group(1)
    return meta

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Generate SEO PDFs for a GDE page")
    parser.add_argument('--slug', required=True, help='Page slug, e.g. michigan-online-defensive-driving-course')
    parser.add_argument('--stage', default='_in-progress', choices=['_in-progress', '_completed'],
                        help='Folder stage (default: _in-progress)')
    args = parser.parse_args()

    folder = REPO_ROOT / "pages" / args.stage / args.slug
    if not folder.exists():
        # Try the other stage
        alt = REPO_ROOT / "pages" / ("_completed" if args.stage == "_in-progress" else "_in-progress") / args.slug
        if alt.exists():
            folder = alt
            print(f"[INFO] Using {folder}")
        else:
            print(f"[ERROR] Folder not found: {folder}")
            return

    meta = parse_meta(folder)
    if not meta.get('primary_kw'):
        meta['primary_kw'] = args.slug.replace('-', ' ').title()
    if not meta.get('date'):
        meta['date'] = '2026-04-21'
    if not meta.get('score_before'):
        meta['score_before'] = '?'
    if not meta.get('score_projected'):
        meta['score_projected'] = '?'

    print(f"[INFO] Generating PDFs for: {meta.get('primary_kw')}")
    print(f"[INFO] Folder: {folder}")

    styles = make_styles()
    ref_pdf = build_reference_pdf(folder, args.slug, meta, styles)
    dev_pdf = build_dev_pdf(folder, args.slug, meta, styles)
    print(f"\n[DONE] 2 PDFs written to {folder}/")

if __name__ == "__main__":
    main()
