#!/usr/bin/env python3
"""
DEV HANDOFF PDF — NP-style Current vs Recommended format.
"""
import re
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, Preformatted
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

BASE  = Path("/Users/elyas/Desktop/SEO Specialist/getdriversed-seo/pages/_in-progress/california-traffic-school")
ASSET = Path("/Users/elyas/Desktop/SEO Specialist/getdriversed-seo/assets")
OUT   = BASE / "California-Traffic-School-DEV-HANDOFF.pdf"

LOGO_PATH    = str(ASSET / "gde-logo.png")
SMILEY_PATH  = str(ASSET / "smiley-watermark.png")

# ── Palette ──────────────────────────────────────────────────────────────────
NAVY     = colors.HexColor("#1a1a2e")
NAVY2    = colors.HexColor("#2d2d5e")
GOLD     = colors.HexColor("#f5c518")
WHITE    = colors.white
BLACK    = colors.HexColor("#111111")
GRAY     = colors.HexColor("#555566")
GRAY_LT  = colors.HexColor("#f4f4f8")
SKY      = colors.HexColor("#eef0f8")

RED_ROW  = colors.HexColor("#fff0f0")
RED_HDR  = colors.HexColor("#c0392b")
GRN_ROW  = colors.HexColor("#f0fff4")
GRN_HDR  = colors.HexColor("#1b6b35")
AMBER    = colors.HexColor("#fff8e1")
AMBER_BD = colors.HexColor("#f0a500")

# ── Text cleanup ──────────────────────────────────────────────────────────────
SUBS = {
    "✅":"[YES]","❌":"[NO]","⚠️":"[!]","⚠":"[!]",
    "\u2019":"'","\u2018":"'","\u201c":'"',"\u201d":'"',
    "\u2013":"-","\u2014":"--","–":"-","—":"--","\u00a0":" ",
    "⭐":"","🔴":"","🟡":"","🟢":"",
}
def clean(t):
    for k,v in SUBS.items(): t=t.replace(k,v)
    return t

def escape_bt(text):
    def _esc(m):
        inner = m.group(1).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        return f"`{inner}`"
    return re.sub(r'`([^`\n]+)`', _esc, text)

def fmt(raw):
    t = clean(escape_bt(raw))
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'\*([^*\n]+?)\*',  r'<i>\1</i>', t)
    t = re.sub(r'`([^`\n]+)`', r'<font name="Courier" size="8">\1</font>', t)
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)
    return t

# ── Keyword auto-bold ─────────────────────────────────────────────────────────
# Longest first so "California Traffic Violator School Online" matches before
# the shorter "California Traffic School Online" fragment.
_TARGET_KWS = sorted([
    "California Traffic Violator School Online",
    "California Defensive Driving Course Online",
    "California DMV Traffic School Online",
    "California Traffic School Online",
    "Online California Traffic School",
    "CA Traffic School Online",
    "Certificate of Completion",
    "moving violation",
    "ticket masking",
    "insurance rate",
    "8-hour course",
    "DL 400 C",
], key=len, reverse=True)

def kw_bold(text):
    """Wrap target keyword phrases in ** so fmt() renders them bold."""
    for kw in _TARGET_KWS:
        # Skip if already inside bold markers
        pattern = re.compile(r'(?<!\*\*)(' + re.escape(kw) + r')(?!\*\*)', re.IGNORECASE)
        text = pattern.sub(r'**\1**', text)
    return text

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
        "body":   S("body",   fontSize=9.5, leading=14, textColor=BLACK, spaceAfter=5),
        "bullet": S("bullet", fontSize=9.5, leading=13, textColor=BLACK,
                    leftIndent=14, bulletIndent=5, spaceAfter=3),
        "mono":   S("mono","Code", fontSize=7.5, leading=10, fontName="Courier",
                    backColor=GRAY_LT, textColor=BLACK, leftIndent=6, rightIndent=6,
                    borderColor=colors.HexColor("#ccccdd"), borderWidth=0.5,
                    borderPad=6, spaceAfter=6, spaceBefore=4),
        "lbl_cur": S("lc", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER),
        "lbl_rec": S("lr", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER),
        "add_badge": S("ab", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER),
        "chg_badge": S("cb", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER),
        "new_body": S("nb", fontSize=9.5, leading=14, textColor=BLACK, spaceAfter=5,
                      backColor=colors.HexColor("#f6fff8"),
                      borderColor=colors.HexColor("#1b6b35"), borderWidth=0.5, borderPad=0),
        "new_bullet": S("nbul", fontSize=9.5, leading=13, textColor=BLACK,
                        leftIndent=14, bulletIndent=5, spaceAfter=3,
                        backColor=colors.HexColor("#f6fff8")),
        "cell":   S("cell", fontSize=9, leading=13, textColor=BLACK, spaceAfter=0),
        "note":   S("note", fontSize=9, leading=13,
                    textColor=colors.HexColor("#5a3a00"),
                    backColor=AMBER, borderColor=AMBER_BD,
                    borderWidth=1, borderPad=6, spaceAfter=6, spaceBefore=4),
        "footer": S("footer", fontSize=7.5, textColor=GRAY, alignment=TA_CENTER),
    }

# ── Page template ─────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    w, h = letter
    canvas.saveState()

    # Smiley watermark 30%
    try:
        canvas.saveState()
        canvas.setFillAlpha(0.30)
        canvas.drawImage(SMILEY_PATH, w/2-160, h/2-160, width=320, height=320,
                         mask="auto", preserveAspectRatio=True)
        canvas.restoreState()
    except Exception: pass

    # Navy header bar
    canvas.setFillColor(NAVY)
    canvas.rect(0, h-0.62*inch, w, 0.62*inch, fill=1, stroke=0)

    # Gold accent line under bar
    canvas.setFillColor(GOLD)
    canvas.rect(0, h-0.66*inch, w, 0.04*inch, fill=1, stroke=0)

    # Header text
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#aaaacc"))
    canvas.drawString(0.4*inch, h-0.42*inch,
                      "California Traffic School Online — Developer Implementation Guide")

    # Logo top right
    try:
        canvas.drawImage(LOGO_PATH, w-1.9*inch, h-0.60*inch,
                         width=1.65*inch, height=0.50*inch,
                         mask="auto", preserveAspectRatio=True)
    except Exception:
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(WHITE)
        canvas.drawRightString(w-0.35*inch, h-0.40*inch, "GET DRIVERS ED")

    # Page number
    canvas.setFillColor(GOLD)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawRightString(w-1.95*inch, h-0.42*inch, f"p. {doc.page}")

    # Footer
    canvas.setStrokeColor(NAVY2); canvas.setLineWidth(1)
    canvas.line(0.4*inch, 0.52*inch, w-0.4*inch, 0.52*inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(GRAY)
    canvas.drawString(0.4*inch, 0.32*inch, "Get Drivers Ed — SEO Operations | Confidential")
    canvas.drawRightString(w-0.4*inch, 0.32*inch, "getdriversed.com")
    canvas.restoreState()

# ── Helper: Current/Recommended two-row table ─────────────────────────────────
def before_after(current_text, recommended_text, styles, label_a="CURRENT", label_b="CHANGE TO", note=None):
    """Renders an NP-style two-row before/after table."""
    avail = 6.4 * inch
    lw = 0.78 * inch  # label column — "CHANGE TO" fits at font 7.5
    vw = avail - lw

    def cell(text, style):
        return Paragraph(fmt(text), style)

    rows = [
        # Current row
        [Paragraph(f"<b>{label_a}</b>", styles["lbl_cur"]),
         cell(current_text, styles["cell"])],
        # Recommended row
        [Paragraph(f"<b>{label_b}</b>", styles["lbl_rec"]),
         cell(recommended_text, styles["cell"])],
    ]

    t = Table(rows, colWidths=[lw, vw])
    t.setStyle(TableStyle([
        # Label cells
        ("BACKGROUND",    (0,0), (0,0), RED_HDR),
        ("BACKGROUND",    (0,1), (0,1), GRN_HDR),
        # Value cells
        ("BACKGROUND",    (1,0), (1,0), RED_ROW),
        ("BACKGROUND",    (1,1), (1,1), GRN_ROW),
        # Typography
        ("TEXTCOLOR",     (0,0), (0,-1), WHITE),
        ("FONTNAME",      (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (0,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
        # Borders
        ("BOX",           (0,0), (-1,-1), 1, colors.HexColor("#ccccdd")),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, colors.HexColor("#ddddee")),
        ("LINEBELOW",     (0,0), (-1,0), 0.5, colors.HexColor("#ccccdd")),
        # Padding
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))

    result = [t]
    if note:
        result.append(Spacer(1,3))
        result.append(Paragraph(note, styles["note"]))
    result.append(Spacer(1, 10))
    return result

# ── Helper: standard markdown-ish table ──────────────────────────────────────
def md_table(headers, rows, styles, col_ratios=None):
    avail = 6.4 * inch
    n = len(headers)
    if col_ratios:
        cws = [avail * r for r in col_ratios]
    else:
        cws = [avail / n] * n

    def p(text, bold=False, bg=None):
        color = WHITE if bold else BLACK
        style = ParagraphStyle("tc", parent=styles["cell"],
                               textColor=color, spaceAfter=0,
                               fontSize=8.5, leading=12)
        t = f"<b>{fmt(text)}</b>" if bold else fmt(text)
        return Paragraph(t, style)

    tdata = [[p(h, bold=True) for h in headers]]
    for row in rows:
        tdata.append([p(cell) for cell in row])

    t = Table(tdata, colWidths=cws, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY2),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [SKY, WHITE]),
        ("GRID",          (0,0), (-1,-1), 0.4, colors.HexColor("#ccccdd")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LINEABOVE",     (0,0), (-1,0), 1.5, NAVY2),
    ]))
    return [t, Spacer(1,8)]

# ── Helper: header structure side-by-side table ───────────────────────────────
def header_table(rows, styles):
    """Two-column Current | Recommended for header structure."""
    avail = 6.4 * inch
    half = avail / 2

    def tag_cell(text, is_missing=False):
        color = colors.HexColor("#999999") if is_missing else BLACK
        style = ParagraphStyle("htc", parent=styles["cell"], textColor=color,
                               fontSize=8, leading=11, spaceAfter=0,
                               fontName="Courier" if not is_missing else "Helvetica-Oblique")
        return Paragraph(fmt(text), style)

    tdata = [
        [Paragraph("<b>Current</b>", ParagraphStyle("hh", parent=styles["cell"],
                   textColor=WHITE, fontName="Helvetica-Bold", fontSize=9)),
         Paragraph("<b>Recommended</b>", ParagraphStyle("hh2", parent=styles["cell"],
                   textColor=WHITE, fontName="Helvetica-Bold", fontSize=9))]
    ]
    for cur, rec in rows:
        is_missing = cur.strip().startswith("*(missing")
        tdata.append([tag_cell(cur, is_missing=is_missing), tag_cell(rec)])

    t = Table(tdata, colWidths=[half, half], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY2),
        ("BACKGROUND",    (0,1), (0,-1), RED_ROW),
        ("BACKGROUND",    (1,1), (1,-1), GRN_ROW),
        ("GRID",          (0,0), (-1,-1), 0.4, colors.HexColor("#ccccdd")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LINEABOVE",     (0,0), (-1,0), 1.5, NAVY2),
    ]))
    return [t, Spacer(1,8)]

# ── Cover page ────────────────────────────────────────────────────────────────
def cover(styles):
    story = [Spacer(1, 0.5*inch)]

    # Navy cover block
    inner = [
        Paragraph("Developer Implementation Guide", ParagraphStyle(
            "cl", fontSize=13, textColor=GOLD, fontName="Helvetica-Bold", spaceAfter=8)),
        Paragraph("California Traffic School Online", ParagraphStyle(
            "ct", fontSize=26, leading=31, textColor=WHITE,
            fontName="Helvetica-Bold", spaceAfter=10)),
        Paragraph("getdriversed.com/courses-details/california-traffic-school/en", ParagraphStyle(
            "cu", fontSize=9.5, textColor=colors.HexColor("#9999bb"), spaceAfter=18)),
        Paragraph("Page Type: Product Page (State Course) &nbsp;·&nbsp; Audit Date: 2026-04-18", ParagraphStyle(
            "cd", fontSize=9, textColor=colors.HexColor("#888899"))),
    ]

    block = Table([[cell] for cell in inner], colWidths=[6.9*inch])
    block.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), NAVY),
        ("LEFTPADDING",   (0,0), (-1,-1), 30),
        ("RIGHTPADDING",  (0,0), (-1,-1), 30),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    outer = Table([[block]], colWidths=[7.5*inch])
    outer.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), NAVY),
        ("TOPPADDING",    (0,0), (-1,-1), 28),
        ("BOTTOMPADDING", (0,0), (-1,-1), 28),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    story.append(outer)

    # Gold stripe
    stripe = Table([[""]], colWidths=[7.5*inch], rowHeights=[0.12*inch])
    stripe.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GOLD)]))
    story.append(stripe)
    story.append(Spacer(1, 0.3*inch))

    # Quick-reference stats
    stats = [("Current Score","9/100"), ("Projected Score","93/100"),
             ("Score Delta","+84 pts"), ("Body Words Added","~1,590")]
    cells = []
    for label, val in stats:
        c = Table([
            [Paragraph(f"<b>{val}</b>", ParagraphStyle("sv", fontSize=17, leading=21,
                textColor=NAVY2, fontName="Helvetica-Bold", alignment=TA_CENTER))],
            [Paragraph(label, ParagraphStyle("sl", fontSize=7.5, textColor=GRAY,
                alignment=TA_CENTER))],
        ], colWidths=[1.65*inch])
        c.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,-1), SKY),
            ("TOPPADDING",    (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BOX",           (0,0), (-1,-1), 0.5, colors.HexColor("#ccccdd")),
            ("LINEBELOW",     (0,0), (-1,0), 2.5, GOLD),
        ]))
        cells.append(c)

    stat_row = Table([cells], colWidths=[1.72*inch]*4, hAlign="CENTER")
    stat_row.setStyle(TableStyle([
        ("LEFTPADDING",(0,0),(-1,-1),4), ("RIGHTPADDING",(0,0),(-1,-1),4)]))
    story.append(stat_row)
    story.append(Spacer(1, 0.22*inch))

    # What's inside
    story.append(Paragraph(
        "<b>Contents:</b> &nbsp; Keywords &nbsp;·&nbsp; Meta Data &nbsp;·&nbsp; Header Structure &nbsp;·&nbsp; "
        "Images &nbsp;·&nbsp; Schema &nbsp;·&nbsp; Web Copy",
        ParagraphStyle("guide", fontSize=9, textColor=GRAY, leading=14,
                       borderColor=colors.HexColor("#ccccdd"), borderWidth=0.5,
                       borderPad=8, backColor=SKY)
    ))
    story.append(PageBreak())
    return story

# ── Build PDF ──────────────────────────────────────────────────────────────────
def build():
    styles = make_styles()
    doc = SimpleDocTemplate(str(OUT), pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.88*inch, bottomMargin=0.78*inch,
        title="California Traffic School Online — Dev Implementation Guide",
        author="Get Drivers Ed SEO")

    story = []
    story.extend(cover(styles))

    # ── 1. KEYWORDS ───────────────────────────────────────────────────────────
    story.append(Paragraph("1. Keywords", styles["sec"]))

    # NP-style summary table: Main Target Keyword | value | Secondary Keywords | stacked list
    KW_ORANGE = colors.HexColor("#e07b00")
    KW_GRAY   = colors.HexColor("#3a3a3a")

    sec_kw_text = (
        "<b>Online California Traffic School</b><br/>"
        "<b>CA Traffic School Online</b><br/>"
        "<b>California DMV Traffic School Online</b><br/>"
        "<b>California Traffic Violator School Online</b><br/>"
        "<b>California Defensive Driving Course Online</b>"
    )
    kw_label_style = ParagraphStyle("kwl", fontSize=10, fontName="Helvetica-Bold",
                                    textColor=WHITE, alignment=TA_CENTER, leading=14)
    kw_val_style   = ParagraphStyle("kwv", fontSize=9.5, fontName="Helvetica-Bold",
                                    textColor=BLACK, alignment=TA_CENTER, leading=15)
    kw_sec_style   = ParagraphStyle("kws", fontSize=9, fontName="Helvetica-Bold",
                                    textColor=BLACK, alignment=TA_CENTER, leading=15)

    kw_hdr = Table(
        [[Paragraph("Keywords", ParagraphStyle("kwh", fontSize=11, fontName="Helvetica-Bold",
                                               textColor=WHITE, alignment=TA_CENTER))]],
        colWidths=[6.4 * inch]
    )
    kw_hdr.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), KW_GRAY),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
    ]))

    kw_row = Table([
        [Paragraph("Main Target Keyword", kw_label_style),
         Paragraph("California Traffic School Online", kw_val_style),
         Paragraph("Secondary Keywords", kw_label_style),
         Paragraph(sec_kw_text, kw_sec_style)]
    ], colWidths=[1.4*inch, 1.8*inch, 1.4*inch, 1.8*inch])
    kw_row.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,-1), KW_ORANGE),
        ("BACKGROUND",    (2,0), (2,-1), KW_ORANGE),
        ("BACKGROUND",    (1,0), (1,-1), WHITE),
        ("BACKGROUND",    (3,0), (3,-1), WHITE),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("BOX",           (0,0), (-1,-1), 0.75, colors.HexColor("#cccccc")),
        ("INNERGRID",     (0,0), (-1,-1), 0.4, colors.HexColor("#dddddd")),
    ]))

    kw_wrap = Table([[kw_hdr]], colWidths=[6.4*inch])
    kw_wrap.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 0),
        ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))

    story.append(kw_hdr)
    story.append(kw_row)
    story.append(Spacer(1, 14))

    # Original Keywords block
    story.append(Paragraph(
        "<b>Original Keywords:</b> Previously approved from our keyword research.",
        styles["body"]))
    orig_kws = [
        "California Traffic School Online",
        "Online California Traffic School",
        "CA Traffic School Online",
        "California DMV Traffic School Online",
        "California Traffic Violator School Online",
        "California Defensive Driving Course Online",
    ]
    for kw in orig_kws:
        story.append(Paragraph(f"&bull; &nbsp; {kw}",
                               ParagraphStyle("okw", parent=styles["bullet"],
                                              fontSize=9.5, leftIndent=20)))

    story.append(Spacer(1, 10))

    # Additional Keywords block
    story.append(Paragraph(
        "<b>Additional Keywords:</b> Recommendations from our content tools, if applicable.",
        styles["body"]))
    add_kws = [
        "ticket masking",
        "Certificate of Completion / DL 400 C",
        "moving violation",
        "once every 18 months",
        "8-hour course",
        "insurance rate",
    ]
    for kw in add_kws:
        story.append(Paragraph(f"&bull; &nbsp; {kw}",
                               ParagraphStyle("akw", parent=styles["bullet"],
                                              fontSize=9.5, leftIndent=20)))

    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>Note:</b> Keywords appear <b>bolded</b> in the recommended copy below so you can "
        "confirm placement at a glance. Do not rephrase or remove these terms when implementing.",
        styles["note"]))
    story.append(PageBreak())

    # ── 2. META DATA ──────────────────────────────────────────────────────────
    story.append(Paragraph("2. Meta Data", styles["sec"]))

    story.append(Paragraph("Title Tag", styles["h2"]))
    story.extend(before_after(
        current_text="California Traffic School Online | DMV Approved | Get Drivers Ed &nbsp;&nbsp;<i>(64 chars)</i>",
        recommended_text="California Traffic School Online | Get Drivers Ed &nbsp;&nbsp;<i>(51 chars)</i>",
        styles=styles,
        note='Remove "| DMV Approved" from the middle. Correct format is [Primary Keyword] | [Brand] — one pipe only, brand at the end.'
    ))

    story.append(Paragraph("Meta Description", styles["h2"]))
    story.extend(before_after(
        current_text="Complete your California Traffic School 100% online with Get Drivers Ed! DMV-approved and court-accepted, our course helps you dismiss traffic tickets, remove points, and avoid insurance increases. Study at your own pace with unlimited test attempts and instant certificate processing. &nbsp;&nbsp;<i>(285 chars — too long)</i>",
        recommended_text="Get Drivers Ed offers California traffic school online, designed for self-paced, mobile-friendly learning to meet DMV requirements. Enroll now! &nbsp;&nbsp;<i>(143 chars)</i>",
        styles=styles,
        note="Formula: Brand leads → primary keyword in first 12 words → two benefits → authority anchor → CTA."
    ))

    # ── 3. HEADER STRUCTURE ───────────────────────────────────────────────────
    story.append(Paragraph("3. Header Structure", styles["sec"]))
    story.append(Paragraph(
        "The page currently has no H1 and is missing 3 H2s and all H3/H4s. "
        "Red column = current state. Green column = required changes.",
        styles["body"]))
    story.append(Spacer(1, 6))

    header_rows = [
        ("*(missing)*",                              "`<H1>` California Traffic School Online"),
        ("`<H2>` See What Our Students Are Saying!", "`<p>` See What Our Students Are Saying!"),
        ("`<H2>` Bundle & Save: Enhance Your...",    "`<p>` Bundle & Save: Enhance Your Learning Experience!"),
        ("*(missing)*",                              "`<H3>` Overview"),
        ("*(missing)*",                              "`<H3>` Outcomes"),
        ("*(missing)*",                              "`<H4>` Complete the California Traffic School Online with Get Drivers Ed"),
        ("*(missing)*",                              "`<H4>` Practice Safe Driving Habits"),
        ("*(missing)*",                              "`<H4>` Submit Your Completion to the Court"),
        ("*(missing)*",                              "`<H4>` Confirm Your Citation Is Masked"),
        ("*(missing)*",                              "`<H4>` Check Your Insurance Eligibility"),
        ("*(missing)*",                              "`<H4>` Receive Your Certificate of Completion"),
        ("*(missing)*",                              "`<H3>` Eligibility"),
        ("*(missing)*",                              "`<H2>` Who Can Take the California DMV Traffic Violator School Online?"),
        ("*(missing)*",                              "`<H2>` Shedding More Light on This Course"),
        ("`<H2>` Recommended Courses to Enhance Your Learning", "`<H2>` Recommended Courses to Enhance Your Learning"),
        ("`<H2>` Your Step-By-Step Guide  to Getting Licensed", "`<H2>` Your Step-By-Step Guide to Getting Licensed  *(fix double space)*"),
        ("*(missing)*",                              "`<H3>` 1. Sign Up for the Course"),
        ("*(missing)*",                              "`<H3>` 2. Complete the 8-Hour Online Course"),
        ("*(missing)*",                              "`<H3>` 3. Pass the Final Exam"),
        ("*(missing)*",                              "`<H3>` 4. Receive Your California Certificate of Completion"),
        ("*(missing)*",                              "`<H2>` Why Should You Opt for This Course?"),
        ("`<H2>` Frequently Asked Questions",        "`<H2>` Frequently Asked Questions"),
        ("*(missing)*",                              "`<H3>` How long is California traffic school online?"),
        ("*(missing)*",                              "`<H3>` Does online traffic school mask a ticket in California?"),
        ("*(missing)*",                              "`<H3>` How often can you take traffic school in California?"),
        ("*(missing)*",                              "`<H3>` Is online traffic school accepted by all California courts?"),
        ("*(missing)*",                              "`<H3>` What is the California traffic school certificate?"),
        ("*(missing)*",                              "`<H3>` What happens if I fail the California traffic school final exam?"),
        ("*(missing)*",                              "`<H3>` Do I still have to pay my fine if I take traffic school?"),
    ]
    story.extend(header_table(header_rows, styles))
    story.append(Paragraph(
        "<b>Note:</b> \"See What Our Students Are Saying!\" and \"Bundle &amp; Save\" are currently "
        "rendered as &lt;H2&gt; tags — demote both to &lt;p&gt; tags. Headers are reserved for topical content only.",
        styles["note"]))
    story.append(Spacer(1,8))

    # ── 4. IMAGES ─────────────────────────────────────────────────────────────
    story.append(Paragraph("4. Images", styles["sec"]))
    story.extend(md_table(
        headers=["Image File", "Current Alt Text", "Recommended Alt Text"],
        rows=[
            ["course-registration.2ffa6e78.png",
             "Graphic of person pointing to board representing undefined",
             "Graphic of person pointing to board representing California Traffic School Online"],
            ["logo-light.1365aaf4.png",
             "Get Drivers Ed Logo",
             "Get Drivers Ed Logo — no change needed"],
        ],
        styles=styles,
        col_ratios=[0.28, 0.36, 0.36]
    ))
    story.append(Paragraph(
        "<b>Note:</b> \"undefined\" in the hero image alt is a broken CMS template variable. "
        "This is the only image change needed.",
        styles["note"]))
    story.append(Spacer(1,4))

    # ── 5. SCHEMA ─────────────────────────────────────────────────────────────
    story.append(Paragraph("5. Structured Data (Schema)", styles["sec"]))
    story.extend(md_table(
        headers=["", "Current", "Recommended"],
        rows=[
            ["Schema present", "None", "BreadcrumbList + Course + FAQPage"],
            ["Errors", "0", "0"],
        ],
        styles=styles,
        col_ratios=[0.22, 0.22, 0.56]
    ))
    story.append(Paragraph(
        "<b>Before pasting — fill in two fields:</b> (1) Replace "
        "<font name='Courier' size='8'>VALIDATE_PRICE_WITH_GDE</font> in "
        "<font name='Courier' size='8'>offers.price</font> with the real course price. "
        "(2) Replace <font name='Courier' size='8'>CA-TVS-ONLINE</font> in "
        "<font name='Courier' size='8'>courseCode</font> with GDE's actual CA DMV TVS license number.",
        styles["note"]))
    story.append(Spacer(1,6))

    schema_raw = (BASE / "schema.json").read_text()
    story.append(Preformatted(schema_raw, styles["mono"]))
    story.append(PageBreak())

    # ── 6. WEB COPY ───────────────────────────────────────────────────────────
    story.append(Paragraph("6. Web Copy", styles["sec"]))
    story.append(Paragraph(
        "The full page is shown below in order. "
        "<b><font color='#1b6b35'>Green = ADD (new content)</font></b> &nbsp;·&nbsp; "
        "<b><font color='#d35400'>Orange = CHANGE (exists, update it)</font></b> &nbsp;·&nbsp; "
        "<b>Gray = KEEP (no change needed)</b>",
        styles["body"]))
    story.append(Spacer(1, 8))

    # Colour constants for the three states
    C_ADD_BG   = colors.HexColor("#f0fff4")
    C_ADD_HDR  = colors.HexColor("#1b6b35")
    C_CHG_BG   = colors.HexColor("#fff4ee")
    C_CHG_HDR  = colors.HexColor("#d35400")
    C_KEEP_BG  = colors.HexColor("#f8f8f8")
    C_KEEP_HDR = colors.HexColor("#666677")
    BADGE_W    = 0.52 * inch
    CONTENT_W  = 5.88 * inch

    def badge_p(label, color):
        return Paragraph(f"<b>{label}</b>",
                         ParagraphStyle("bp", fontSize=7, fontName="Helvetica-Bold",
                                        textColor=WHITE, alignment=TA_CENTER))

    def content_p(text, bg, bold=False, indent=0, mono=False):
        fn = "Courier" if mono else ("Helvetica-Bold" if bold else "Helvetica")
        # Auto-bold target keywords in body text (not headings, not mono)
        if not bold and not mono:
            text = kw_bold(text)
        return Paragraph(fmt(text),
                         ParagraphStyle("cp", fontSize=8.5, leading=12.5,
                                        textColor=BLACK, fontName=fn,
                                        leftIndent=indent, spaceAfter=0,
                                        backColor=bg))

    def row_block(badge_label, badge_color, bg_color, rows_content, note=None):
        """
        Render a block: badge cell on left, stacked content rows on right.
        rows_content: list of Paragraph objects already built.
        """
        content_table = Table([[r] for r in rows_content], colWidths=[CONTENT_W])
        content_table.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,-1), bg_color),
            ("TOPPADDING",    (0,0), (-1,-1), 3),
            ("BOTTOMPADDING", (0,0), (-1,-1), 3),
            ("LEFTPADDING",   (0,0), (-1,-1), 8),
            ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ]))
        outer = Table(
            [[Paragraph(f"<b>{badge_label}</b>",
                        ParagraphStyle("ob", fontSize=7, fontName="Helvetica-Bold",
                                       textColor=WHITE, alignment=TA_CENTER)),
              content_table]],
            colWidths=[BADGE_W, CONTENT_W]
        )
        outer.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (0,-1), badge_color),
            ("BACKGROUND",    (1,0), (1,-1), bg_color),
            ("VALIGN",        (0,0), (-1,-1), "TOP"),
            ("TOPPADDING",    (0,0), (0,-1), 6),
            ("BOTTOMPADDING", (0,0), (0,-1), 6),
            ("LEFTPADDING",   (0,0), (0,-1), 4),
            ("RIGHTPADDING",  (0,0), (0,-1), 4),
            ("BOX",           (0,0), (-1,-1), 0.75, colors.HexColor("#ccccdd")),
            ("LINEBEFORE",    (1,0), (1,-1), 2, badge_color),
        ]))
        story.append(outer)
        if note:
            story.append(Paragraph(note, styles["note"]))
        story.append(Spacer(1, 4))

    def add_block(tag, heading, body_items):
        """Green ADD block. body_items = list of (type, text) — type 'p' or 'b' (bullet)."""
        rows = [content_p(f"{tag}: {heading}", C_ADD_BG, bold=True)]
        for typ, txt in body_items:
            if typ == "p":
                rows.append(content_p(txt, C_ADD_BG))
            elif typ == "b":
                rows.append(content_p(f"   • {txt}", C_ADD_BG, indent=8))
            elif typ == "note":
                rows.append(Paragraph(fmt(txt),
                                      ParagraphStyle("an", fontSize=8, leading=11,
                                                     textColor=colors.HexColor("#5a3a00"),
                                                     backColor=colors.HexColor("#fff8e1"),
                                                     borderColor=AMBER_BD, borderWidth=0.5,
                                                     borderPad=4, spaceAfter=0,
                                                     leftIndent=8)))
        row_block("ADD", C_ADD_HDR, C_ADD_BG, rows)

    def change_block(tag, current_text, new_text, sub_items=None, note_text=None):
        """Orange CHANGE block showing current → new."""
        rows = [
            content_p(f"Currently: {tag} {current_text}", C_CHG_BG),
            content_p(f"Change to: {tag} {new_text}", C_CHG_BG, bold=True),
        ]
        if sub_items:
            for typ, txt in sub_items:
                if typ == "p":
                    rows.append(content_p(txt, C_ADD_BG))
                elif typ == "b":
                    rows.append(content_p(f"   • {txt}", C_ADD_BG, indent=8))
                elif typ == "add_hdr":
                    rows.append(content_p(f"  + ADD: {txt}", C_ADD_BG, bold=True))
        row_block("CHANGE", C_CHG_HDR, C_CHG_BG, rows, note=note_text)

    def keep_block(tag, text, sub_note=None):
        """Gray KEEP block — existing content, no change needed."""
        rows = [content_p(f"{tag}: {text}", C_KEEP_BG)]
        if sub_note:
            rows.append(content_p(sub_note, C_KEEP_BG))
        row_block("KEEP", C_KEEP_HDR, C_KEEP_BG, rows)

    # ── Full page in order ────────────────────────────────────────────────────

    # H1
    add_block("H1", "California Traffic School Online", [])

    # UI strips — currently H2, demote to p
    change_block("<H2>", "See What Our Students Are Saying!",
                 "<p> See What Our Students Are Saying!",
                 note_text="Demote from H2 to a plain &lt;p&gt; tag. This is a UI strip, not a content header.")
    change_block("<H2>", "Bundle & Save: Enhance Your Learning Experience!",
                 "<p> Bundle & Save: Enhance Your Learning Experience!",
                 note_text="Demote from H2 to a plain &lt;p&gt; tag.")

    # Overview H3 (ADD)
    add_block("H3", "Overview", [
        ("p", "California Traffic School Online from Get Drivers Ed is an 8-hour, DMV-licensed course designed to help California drivers mask a moving violation, protect their driving record, and keep their insurance rates from climbing. Whether you searched for online California traffic school or the California Traffic Violator School Online, you're in the right place. Complete the entire course at your own pace — on any device, anytime — and your Certificate of Completion is submitted directly to the court and DMV electronically."),
        ("b", "8-hour course meets California DMV Traffic Violator School requirements"),
        ("b", "100% online — study on your phone, tablet, or computer"),
        ("b", "Self-paced — pause and resume anytime, no deadlines to hit mid-session"),
        ("b", "DMV-licensed and accepted by all California courts"),
        ("b", "Certificate of Completion (DL 400 C) submitted electronically — no mail delays"),
        ("b", "Masks your moving violation so it won't appear on your insurance record"),
        ("b", "Final exam included with unlimited chapter quiz retakes"),
        ("b", "Instant access after enrollment — start the same day you register"),
        ("b", "Affordable flat-rate pricing with no hidden fees [VALIDATE price with GDE team]"),
        ("b", "Trusted by thousands of California drivers [VALIDATE review count with GDE team]"),
    ])

    # Outcomes H3 (ADD)
    add_block("H3", "Outcomes", [
        ("p", "H4: Complete the California Traffic School Online with Get Drivers Ed"),
        ("p", "Register in minutes and begin the 8-hour California Traffic Violator School course immediately. Our structured curriculum covers traffic laws, defensive driving strategies, and California-specific road rules — everything required by the DMV to satisfy your court-ordered traffic school requirement."),
        ("p", "H4: Practice Safe Driving Habits"),
        ("p", "Each module reinforces safe driving behaviors through real-world scenarios and interactive lessons. You'll leave the course with sharper hazard awareness and a stronger understanding of California traffic laws — not just a certificate. Drivers looking for a California defensive driving course online will find that our curriculum covers the same foundational material required by the DMV, tailored specifically to the Traffic Violator School standard."),
        ("p", "H4: Submit Your Completion to the Court"),
        ("p", "Once you pass the final exam, Get Drivers Ed submits your Certificate of Completion electronically to both the court and the California DMV. No printing, no mailing, no follow-up needed."),
        ("p", "H4: Confirm Your Citation Is Masked"),
        ("p", "After your certificate is processed, the DMV marks your traffic citation as masked. The violation will no longer appear on the driving record your insurance company pulls — protecting you from premium increases."),
        ("p", "H4: Check Your Insurance Eligibility"),
        ("p", "Many California drivers are eligible for an insurance discount after completing a DMV-licensed traffic school course. Check with your insurer — carriers such as State Farm, USAA, Geico, and Nationwide may reduce rates for proactive completion."),
        ("p", "H4: Receive Your Certificate of Completion"),
        ("p", "Your DL 400 C Certificate of Completion is processed and delivered electronically upon passing the final exam. Keep a copy for your records — the court will also receive direct electronic confirmation from Get Drivers Ed."),
    ])

    # Eligibility H3 (ADD)
    add_block("H3", "Eligibility", [
        ("p", "To take our California Traffic School Online course, you must meet California DMV eligibility requirements. Review the key conditions below before enrolling."),
    ])

    # Who Can Take H2 (ADD)
    add_block("H2", "Who Can Take the California DMV Traffic Violator School Online?", [
        ("p", "California's Traffic Violator School (TVS) program is available to most drivers who receive an infraction-level moving violation. Here's who qualifies:"),
        ("b", "**Valid California driver's license** — you must hold a current, valid CA license at the time of the violation"),
        ("b", "**Moving violation infraction** — your ticket must be an infraction (not a misdemeanor or felony); common qualifying violations include speeding, running a red light, and unsafe lane changes"),
        ("b", "**Traffic school elected at court** — you must formally elect traffic school with the court before enrolling; the court sets a due date by which you must complete the course"),
        ("p", "Who is NOT eligible:"),
        ("b", "Drivers cited for alcohol or drug-related violations"),
        ("b", "Drivers with a commercial driver's license (CDL) using it at the time of the violation"),
        ("b", "Drivers who already took traffic school within the past 18 months for a prior ticket"),
    ])

    # Shedding More Light H2 (ADD)
    add_block("H2", "Shedding More Light on This Course", [
        ("p", "When a California court allows you to attend traffic school for a moving violation, completing the program has one powerful outcome: ticket masking. Once Get Drivers Ed submits your Certificate of Completion to the court, the DMV marks the violation as masked. That means the infraction is permanently hidden from the driving record your insurance company views — your premium stays protected."),
        ("p", "Our California DMV Traffic School Online meets every California DMV Traffic Violator School standard. The 8-hour curriculum is state-mandated and covers defensive driving techniques, traffic law review, DUI awareness, hazard identification, and distracted driving prevention. Every lesson is designed to make you a safer, more aware driver — not just to check a box."),
        ("p", "One of the most-asked questions we hear is whether CA traffic school online works the same as in-person. The answer is yes — California DMV-licensed online Traffic Violator Schools are accepted by every California Superior Court. After you finish the online course and pass the final exam, your completion is transmitted electronically to the DMV and the court. No physical certificate to mail. No waiting in line."),
        ("p", "Enrollment in our California DMV Traffic Violator School Online takes under five minutes. You can start immediately after registering and work through the 8-hour course on your own schedule — a few hours today, a few hours tomorrow. The only hard deadline is the date your court sets for completion. Most drivers finish within two or three days of casual study."),
    ])

    # Recommended Courses H2 (KEEP)
    keep_block("H2", "Recommended Courses to Enhance Your Learning",
               sub_note="This section already exists — no heading change needed. Update the linked course cards to point to California-specific sibling courses.")

    # Step-By-Step H2 (CHANGE — exists but add H3s and fix double space)
    change_block(
        "<H2>", "Your Step-By-Step Guide  to Getting Licensed (double space)",
        "<H2> Your Step-By-Step Guide to Getting Licensed",
        sub_items=[
            ("add_hdr", "ADD these H3s with body copy below this H2:"),
            ("p", "H3: 1. Sign Up for the Course"),
            ("p", "Visit the enrollment page, enter your ticket information and court details, and complete your registration. The process takes less than five minutes and gives you immediate access to the full 8-hour course."),
            ("p", "H3: 2. Complete the 8-Hour Online Course"),
            ("p", "Work through all required modules at your own pace. Each chapter includes interactive lessons and a short quiz. You can pause and resume anytime — the course saves your progress automatically. All 8 hours must be completed to unlock the final exam."),
            ("p", "H3: 3. Pass the Final Exam"),
            ("p", "The final exam tests your knowledge of California traffic laws and defensive driving principles. A passing score of 70% or higher is required. You have one opportunity to retake the final exam if needed — chapter quizzes have unlimited retakes to help you prepare."),
            ("p", "H3: 4. Receive Your California Certificate of Completion"),
            ("p", "Once you pass, Get Drivers Ed electronically submits your DL 400 C Certificate of Completion to the court and California DMV — usually within one business day. Your ticket is then processed for masking."),
            ("p", "[Review the California Traffic School Course] — add internal CTA link here"),
        ]
    )

    # Why Should You Opt H2 (ADD)
    add_block("H2", "Why Should You Opt for This Course?", [
        ("p", "Get Drivers Ed is a California DMV-licensed Traffic Violator School, which means our California Traffic School Online is legally recognized by the state and accepted at every California Superior Court. Unlike some providers, we handle the entire certificate submission process electronically — you never have to print, sign, or mail anything. Once you finish, we take care of the rest."),
        ("note", "[VALIDATE] Insert GDE's CA DMV TVS license number in the paragraph above — e.g., 'License #XXXXX issued by the California DMV'"),
        ("p", "Protecting your insurance rate is one of the most valuable things traffic school can do for you. A single moving violation — a speeding ticket, a rolling stop — can trigger a rate increase that costs hundreds of dollars over the following years. By completing our California Traffic School Online and having the ticket masked, you keep the violation off the record your insurer sees. Many drivers find that the cost of traffic school pays for itself many times over in saved premiums."),
    ])

    # FAQ H2 (CHANGE — exists but has no H3s)
    change_block(
        "<H2>", "Frequently Asked Questions (heading exists, no H3s present)",
        "<H2> Frequently Asked Questions",
        sub_items=[
            ("add_hdr", "ADD all 7 H3 questions with answers below this H2:"),
            ("p", "H3: How long is California traffic school online?"),
            ("p", "California traffic school is 8 hours — the state-mandated minimum set by the California DMV for Traffic Violator School (TVS). Our California Traffic School Online is entirely self-paced, so you can split the 8 hours across multiple sessions. Most students complete it within 1-3 days. You must finish by the due date set by your court."),
            ("p", "H3: Does online traffic school mask a ticket in California?"),
            ("p", "Yes. When you complete Get Drivers Ed's California Traffic School Online and pass the final exam, we submit your Certificate of Completion electronically to the court and the California DMV. The DMV then masks your citation, which means the moving violation will not appear on the driving record viewed by your insurance company. Only one citation can be masked every 18 months."),
            ("p", "H3: How often can you take traffic school in California?"),
            ("p", "California drivers are eligible to take traffic school once every 18 months. If you received a ticket within 18 months of a previous traffic school completion, you are not eligible to attend again for that new citation. Check with your court to confirm your eligibility before enrolling."),
            ("p", "H3: Is online traffic school accepted by all California courts?"),
            ("p", "Yes. Get Drivers Ed is a California DMV-licensed Traffic Violator School, and our online course is accepted by all California Superior Courts. After you complete the course and pass the final exam, we submit your DL 400 C Certificate of Completion directly to your court electronically."),
            ("p", "H3: What is the California traffic school certificate?"),
            ("p", "The California traffic school Certificate of Completion is officially called the DL 400 C. It is the document the court and DMV use to confirm you completed a DMV-licensed Traffic Violator School. Get Drivers Ed submits the DL 400 C to your court and the DMV electronically within one business day of you passing the final exam."),
            ("p", "H3: What happens if I fail the California traffic school final exam?"),
            ("p", "If you do not pass the final exam on your first attempt, you have one additional opportunity to retake it. Chapter-level quizzes throughout the course have unlimited retakes, so use them to review before attempting the final. A score of 70% or higher is required to pass and receive your Certificate of Completion."),
            ("p", "H3: Do I still have to pay my fine if I take traffic school?"),
            ("p", "Yes. Court fines and traffic school fees are separate. Paying the court's traffic fine (or bail) is a requirement before or alongside electing traffic school — it does not cover the cost of the course itself. The traffic school fee is paid directly to Get Drivers Ed when you enroll."),
        ]
    )

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"[OK] {OUT.name}  ({OUT.stat().st_size // 1024} KB)")

build()
