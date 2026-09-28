"""
Generate the "Rounds of a Lifetime" Reading Group Discussion Guide PDF.
Uses ReportLab with the book's brand palette (sky #7EC1E0, violet #5B2A86,
navy #1E2A38, mist #EAF4FA) and an EKG/heartbeat motif on the cover.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Flowable,
    KeepTogether,
)
from reportlab.pdfgen import canvas

# ── Brand palette ────────────────────────────────────────────────
SKY = HexColor("#7EC1E0")
VIOLET = HexColor("#5B2A86")
NAVY = HexColor("#1E2A38")
WHITE = HexColor("#FFFFFF")

OUTPUT = os.path.join(os.path.dirname(__file__), "Rounds-of-a-Lifetime-Reading-Guide.pdf")

# Standard EKG path points (normalized 0..640 x, 0..120 y)
EKG_POINTS = [
    (0, 50), (120, 50), (145, 30), (170, 92), (195, 22),
    (220, 104), (245, 48), (270, 50), (380, 50), (405, 30),
    (430, 92), (455, 22), (480, 104), (505, 48), (530, 50), (640, 50),
]


class EkgLine(Flowable):
    """A horizontal heartbeat line drawn as a flowable, scaled to width."""

    def __init__(self, width=440, height=24, color=VIOLET, stroke=1.5):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color
        self.stroke = stroke

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.color)
        c.setLineWidth(self.stroke)
        c.setLineCap(1)
        c.setLineJoin(1)
        sx = self.width / 640
        sy = self.height / 120
        c.scale(sx, sy)
        p = c.beginPath()
        p.moveTo(*EKG_POINTS[0])
        for pt in EKG_POINTS[1:]:
            p.lineTo(*pt)
        c.drawPath(p, stroke=1, fill=0)
        c.restoreState()


# ── Cover page ───────────────────────────────────────────────────
def draw_cover(c: canvas.Canvas, doc):
    w, h = letter
    # sky gradient background (horizontal bands)
    bands = 90
    for i in range(bands):
        t = i / bands
        r = 0.49 + (0.62 - 0.49) * t
        g = 0.76 + (0.83 - 0.76) * t
        b = 0.88 + (0.94 - 0.88) * t
        c.setFillColorRGB(r, g, b)
        c.rect(0, h - (i + 1) * (h / bands), w, h / bands + 1, fill=1, stroke=0)

    # decorative EKG watermark across upper area
    c.saveState()
    c.setStrokeColor(WHITE)
    c.setLineWidth(2)
    c.setStrokeAlpha(0.30)
    p = c.beginPath()
    pts = [
        (0, h * 0.82), (w * 0.18, h * 0.82), (w * 0.20, h * 0.74),
        (w * 0.22, h * 0.90), (w * 0.24, h * 0.66), (w * 0.26, h * 0.92),
        (w * 0.28, h * 0.78), (w * 0.45, h * 0.82), (w * 0.47, h * 0.74),
        (w * 0.49, h * 0.90), (w * 0.51, h * 0.66), (w * 0.53, h * 0.92),
        (w * 0.55, h * 0.78), (w, h * 0.82),
    ]
    p.moveTo(*pts[0])
    for pt in pts[1:]:
        p.lineTo(*pt)
    c.drawPath(p, stroke=1, fill=0)
    c.restoreState()

    # white panel for title
    panel_x = w * 0.10
    panel_y = h * 0.28
    panel_w = w * 0.80
    panel_h = h * 0.36
    c.setFillColor(WHITE)
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 14, fill=1, stroke=0)
    # left violet accent bar
    c.setFillColor(VIOLET)
    c.roundRect(panel_x, panel_y, 10, panel_h, 4, fill=1, stroke=0)

    # eyebrow
    c.setFillColor(VIOLET)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(
        w / 2, panel_y + panel_h - 44,
        "R E A D I N G   G R O U P   D I S C U S S I O N   G U I D E",
    )

    # title
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(w / 2, panel_y + panel_h - 96, "Rounds of a")
    c.drawCentredString(w / 2, panel_y + panel_h - 142, "Lifetime")

    # divider
    c.setStrokeColor(VIOLET)
    c.setLineWidth(2)
    c.line(w / 2 - 44, panel_y + panel_h - 162, w / 2 + 44, panel_y + panel_h - 162)

    # subtitle
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Oblique", 13)
    c.drawCentredString(w / 2, panel_y + panel_h - 192, "A memoir by Dr. Victor Y. Wright")
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#5A6B7A"))
    c.drawCentredString(w / 2, panel_y + panel_h - 210, "Published as Robert Y. Wright, MD")

    # bottom ISBN / domain
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(w / 2, h * 0.13, "ISBN  978-929-167-7346")
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#5A6B7A"))
    c.drawCentredString(w / 2, h * 0.09, "roundsofalifetime.com")


# ── Body page header/footer ─────────────────────────────────────
def draw_body_page(c: canvas.Canvas, doc):
    w, h = letter
    # top thin violet rule
    c.setStrokeColor(VIOLET)
    c.setLineWidth(0.5)
    c.line(doc.leftMargin, h - doc.topMargin + 20, w - doc.rightMargin, h - doc.topMargin + 20)
    # book title top-right
    c.setFillColor(VIOLET)
    c.setFont("Helvetica-Bold", 8)
    c.drawRightString(w - doc.rightMargin, h - doc.topMargin + 28, "ROUNDS OF A LIFETIME")
    # footer mini EKG
    c.saveState()
    c.setStrokeColor(SKY)
    c.setLineWidth(1)
    c.setStrokeAlpha(0.5)
    fx = doc.leftMargin
    fy = doc.bottomMargin - 24
    p = c.beginPath()
    pts = [
        (fx, fy), (fx + 20, fy), (fx + 24, fy - 6), (fx + 28, fy + 8),
        (fx + 32, fy - 10), (fx + 36, fy + 10), (fx + 40, fy), (fx + 90, fy),
    ]
    p.moveTo(*pts[0])
    for pt in pts[1:]:
        p.lineTo(*pt)
    c.drawPath(p, stroke=1, fill=0)
    c.restoreState()
    # footer text
    c.setFillColor(HexColor("#5A6B7A"))
    c.setFont("Helvetica", 8)
    c.drawString(doc.leftMargin, doc.bottomMargin - 36, "Rounds of a Lifetime \u2014 Reading Group Guide")
    c.drawRightString(w - doc.rightMargin, doc.bottomMargin - 36, f"Page {doc.page}")


def on_first_page(c, doc):
    draw_cover(c, doc)


def on_later_pages(c, doc):
    draw_body_page(c, doc)


# ── Paragraph styles ───────────────────────────────────────────
body = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=11, leading=17,
    textColor=NAVY, alignment=TA_JUSTIFY, spaceAfter=10,
)
intro = ParagraphStyle(
    "intro", parent=body, fontSize=11.5, leading=18,
    textColor=HexColor("#3A4A5A"), spaceAfter=14,
)
h1 = ParagraphStyle(
    "h1", fontName="Helvetica-Bold", fontSize=20, leading=24,
    textColor=VIOLET, spaceBefore=8, spaceAfter=6,
)
h2 = ParagraphStyle(
    "h2", fontName="Helvetica-Bold", fontSize=15, leading=20,
    textColor=NAVY, spaceBefore=18, spaceAfter=8,
)
question = ParagraphStyle(
    "question", fontName="Helvetica", fontSize=11, leading=17,
    textColor=NAVY, leftIndent=24, bulletIndent=8, spaceAfter=10,
)
quote = ParagraphStyle(
    "quote", fontName="Helvetica-Oblique", fontSize=11.5, leading=18,
    textColor=HexColor("#3A4A5A"), leftIndent=20, rightIndent=20,
    spaceBefore=8, spaceAfter=8,
)
note = ParagraphStyle(
    "note", fontName="Helvetica-Oblique", fontSize=9.5, leading=14,
    textColor=HexColor("#5A6B7A"), alignment=TA_CENTER,
    spaceBefore=6, spaceAfter=6,
)


# ── Guide content ───────────────────────────────────────────────
guides = [
    {
        "category": "Opening the Conversation",
        "questions": [
            "The memoir opens with the line about \u201cthe first round.\u201d What does the word \u201cround\u201d come to mean across the book \u2014 in medicine, and in life?",
            "Before reading, what did you assume a doctor\u2019s memoir would be about? How did this one surprise or challenge that expectation?",
        ],
    },
    {
        "category": "Childhood & Identity",
        "questions": [
            "Dr. Wright writes that \u201ca body can be both a home and a battleground.\u201d Where do you see this tension play out most powerfully in his childhood?",
            "How did the experience of being bullied shape the physician he later became \u2014 for better and for worse?",
            "What role does silence play in his early life? Is it a refuge, a weapon, or both?",
        ],
    },
    {
        "category": "Medical School & Calling",
        "questions": [
            "Dr. Wright describes medicine as \u201ca call for survival, not a career choice.\u201d Do you agree that callings can be born from hardship? Have you experienced this?",
            "What does the book reveal about the hidden emotional cost of becoming a doctor that isn\u2019t taught in medical school?",
            "The night he nearly quit is a turning point. What do you think kept him walking forward instead of away?",
        ],
    },
    {
        "category": "Family & Healing",
        "questions": [
            "How does Dr. Wright\u2019s relationship with his family evolve across the memoir? Where do you see forgiveness, and where do you see unresolved weight?",
            "In what ways does healing others become a path to healing himself? Are there limits to that equation?",
            "What does the book suggest about the difference between being cured and being healed?",
        ],
    },
    {
        "category": "Themes & Takeaways",
        "questions": [
            "The heartbeat motif runs through the whole book. What does it symbolize to you by the final chapter?",
            "If you could ask Dr. Wright one question after reading, what would it be?",
            "Who in your life would you most want to read this memoir \u2014 and why?",
        ],
    },
]


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=letter,
        leftMargin=0.85 * inch, rightMargin=0.85 * inch,
        topMargin=0.95 * inch, bottomMargin=0.85 * inch,
        title="Rounds of a Lifetime \u2014 Reading Group Discussion Guide",
        author="Dr. Victor Y. Wright",
        subject="Reading group discussion guide for the memoir",
        creator="Rounds of a Lifetime",
    )
    story = []
    story.append(PageBreak())

    # Intro
    story.append(Paragraph("How to Use This Guide", h1))
    story.append(EkgLine(width=440, height=20, color=VIOLET, stroke=1.5))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "This discussion guide is designed for reading groups, book clubs, and classrooms "
        "exploring <i>Rounds of a Lifetime</i> by Dr. Victor Y. Wright. The questions are organized "
        "into five thematic sections that trace the memoir\u2019s arc from childhood through "
        "medical school and into a life devoted to medicine.",
        intro,
    ))
    story.append(Paragraph(
        "There is no right order \u2014 choose the questions that resonate most with your group, "
        "and feel free to spend more time on the themes that spark the richest conversation. "
        "A good round of discussion, like a good round of medicine, is less about answers "
        "than about attention.",
        intro,
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "&ldquo;A calling discovered not in triumph, but in survival &mdash; every round, "
        "every patient, every scar a verse in the poetry of a life in medicine.&rdquo;",
        quote,
    ))
    story.append(Paragraph("&mdash; from the Prologue", note))

    # Questions
    for idx, g in enumerate(guides, 1):
        story.append(KeepTogether([
            Paragraph(f"{idx:02d}.  {g['category']}", h2),
            EkgLine(width=120, height=12, color=SKY, stroke=1.5),
            Spacer(1, 6),
        ]))
        for qi, q in enumerate(g["questions"], 1):
            story.append(Paragraph(q, question, bulletText=f"{idx}.{qi}"))

    # Closing
    story.append(Spacer(1, 18))
    story.append(EkgLine(width=440, height=24, color=VIOLET, stroke=1.5))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "&ldquo;Every round, a verse in the poetry of a life in medicine.&rdquo;", note,
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Thank you for reading <i>Rounds of a Lifetime</i> with your group. "
        "Share your discussion with Dr. Wright\u2019s team via the contact form at "
        "roundsofalifetime.com.",
        note,
    ))

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {os.path.getsize(OUTPUT) / 1024:.1f} KB")


if __name__ == "__main__":
    build()
