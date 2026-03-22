#!/usr/bin/env python3
"""
Generate polished, printable Spanish learning PDF worksheets.
Uses canvas-level drawing for visual elements + Platypus for flow.
Accepts JSON via stdin, outputs PDF to stdout.
"""

import json, sys, random, math
from datetime import datetime
from typing import Any, List, Dict, Tuple, Optional
from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak,
    KeepTogether, HRFlowable, Flowable
)
from reportlab.lib import colors
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.graphics.shapes import Drawing, Circle, String, Rect, Line
from reportlab.graphics import renderPDF


# ── Color Palette (matches site theme) ──────────────────────────────────
# Primary: warm terracotta/coral  Secondary: golden yellow  Accent: dark teal

BRAND_PRIMARY  = colors.HexColor('#E85D4C')   # terracotta coral (site primary)
BRAND_ACCENT   = colors.HexColor('#1A535C')   # dark teal (site accent)
BRAND_SECONDARY= colors.HexColor('#F4C430')   # golden yellow (site secondary)
BRAND_DARK     = colors.HexColor('#1C1C1E')   # charcoal (site foreground)
BRAND_CREAM    = colors.HexColor('#FFF8F0')   # warm cream (site background)

HEADER_BG      = colors.HexColor('#1A535C')   # dark teal header
HEADER_STRIPE  = colors.HexColor('#E85D4C')   # terracotta accent stripe

# Section palette — each section type gets a warm, site-harmonious color
SECTION_ACCENT = colors.HexColor('#1A535C')   # teal — vocab matching
SECTION_BG     = colors.HexColor('#f0f9f9')   # light teal bg
GREEN_ACCENT   = colors.HexColor('#2d8659')   # green — fill blank
GREEN_BG       = colors.HexColor('#f0f9f3')
GOLD_ACCENT    = colors.HexColor('#b8860b')   # dark gold — multiple choice
GOLD_BG        = colors.HexColor('#fdf8ec')
CORAL_ACCENT   = colors.HexColor('#E85D4C')   # coral — true/false
CORAL_BG       = colors.HexColor('#fef5f3')
PLUM_ACCENT    = colors.HexColor('#7c4d8a')   # plum — conjugation
PLUM_BG        = colors.HexColor('#faf5fc')
WARM_ACCENT    = colors.HexColor('#c87137')   # warm orange — translation
WARM_BG        = colors.HexColor('#fdf6ef')

GRAY_50        = colors.HexColor('#fafaf9')
GRAY_100       = colors.HexColor('#f0efed')
GRAY_200       = colors.HexColor('#e5e7eb')
GRAY_300       = colors.HexColor('#cbd5d8')
GRAY_500       = colors.HexColor('#6b7280')
GRAY_700       = colors.HexColor('#4a5568')
GRAY_900       = colors.HexColor('#1C1C1E')
WHITE          = colors.white


# ── Paragraph helper ────────────────────────────────────────────────────

def _ps(name, **kw):
    defaults = dict(fontName='Helvetica', fontSize=10.5, leading=14)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

S = {
    'body':       _ps('body'),
    'body_b':     _ps('body_b', fontName='Helvetica-Bold'),
    'body_i':     _ps('body_i', fontName='Helvetica-Oblique'),
    'cell':       _ps('cell', fontSize=10, leading=13),
    'cell_c':     _ps('cell_c', fontSize=10, leading=13, alignment=TA_CENTER),
    'cell_b':     _ps('cell_b', fontSize=10, leading=13, fontName='Helvetica-Bold'),
    'cell_bc':    _ps('cell_bc', fontSize=10, leading=13, fontName='Helvetica-Bold', alignment=TA_CENTER),
    'small':      _ps('small', fontSize=9, leading=11, textColor=GRAY_500),
    'small_i':    _ps('small_i', fontSize=9, leading=11, textColor=GRAY_500, fontName='Helvetica-Oblique'),
    'answer':     _ps('answer', fontSize=9, leading=12, textColor=GRAY_700),
    'answer_b':   _ps('answer_b', fontSize=9.5, leading=13, textColor=BRAND_ACCENT, fontName='Helvetica-Bold'),
    'footer':     _ps('footer', fontSize=7.5, textColor=GRAY_300, alignment=TA_CENTER),
}

def P(text, style_key='cell'):
    return Paragraph(str(text), S[style_key])


# ── Custom Flowables ────────────────────────────────────────────────────

PAGE_W, PAGE_H = letter
MARGIN = 0.6 * inch
CONTENT_W = PAGE_W - 2 * MARGIN


class HeaderBlock(Flowable):
    """Branded header with logo area, title, meta info."""
    def __init__(self, seed, date_str):
        Flowable.__init__(self)
        self.width = CONTENT_W
        self.height = 1.15 * inch
        self.seed = seed
        self.date_str = date_str

    def draw(self):
        c = self.canv
        # Background bar — dark teal
        c.setFillColor(HEADER_BG)
        c.roundRect(0, 0, self.width, self.height, 8, fill=1, stroke=0)

        # Accent stripe at bottom — terracotta coral
        c.setFillColor(HEADER_STRIPE)
        c.rect(0, 0, self.width, 4, fill=1, stroke=0)

        # Logo circle — golden yellow ring with white fill
        cx, cy = 0.55*inch, self.height/2
        c.setFillColor(BRAND_SECONDARY)
        c.circle(cx, cy, 0.32*inch, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.circle(cx, cy, 0.28*inch, fill=1, stroke=0)
        # "AE" monogram in teal
        c.setFillColor(HEADER_BG)
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(cx, cy - 6, 'AE')

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(1.1*inch, self.height - 0.42*inch, 'Spanish Practice Worksheet')

        # Subtitle line — warm muted tone
        c.setFont('Helvetica', 9.5)
        c.setFillColor(colors.HexColor('#9dc5c9'))
        c.drawString(1.1*inch, self.height - 0.62*inch,
                     'Aprende Espanol  |  Printable Study Sheet')

        # Right side: date + seed
        c.setFillColor(colors.HexColor('#9dc5c9'))
        c.setFont('Helvetica', 8.5)
        c.drawRightString(self.width - 0.3*inch, self.height - 0.38*inch,
                          self.date_str)
        c.drawRightString(self.width - 0.3*inch, self.height - 0.55*inch,
                          f'Seed: {self.seed}')

        # Name / Date fields
        y = 0.18 * inch
        c.setFillColor(WHITE)
        c.setFont('Helvetica', 9)
        c.drawString(1.1*inch, y, 'Name: ______________________________')
        c.drawString(4.5*inch, y, 'Date: _____________________')


class SectionHeader(Flowable):
    """Colored section header bar with number badge and title."""
    def __init__(self, num, title, accent_color, bg_color, icon_char=''):
        Flowable.__init__(self)
        self.width = CONTENT_W
        self.height = 0.48 * inch
        self.num = num
        self.title = title
        self.accent = accent_color
        self.bg = bg_color
        self.icon = icon_char

    def draw(self):
        c = self.canv
        # Background
        c.setFillColor(self.bg)
        c.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        # Left accent bar
        c.setFillColor(self.accent)
        c.roundRect(0, 0, 5, self.height, 2, fill=1, stroke=0)

        # Number badge
        badge_x, badge_y = 0.35*inch, self.height/2
        c.setFillColor(self.accent)
        c.circle(badge_x, badge_y, 0.17*inch, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(badge_x, badge_y - 4, str(self.num))

        # Title
        c.setFillColor(self.accent)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(0.65*inch, self.height/2 - 5, self.title)


class InstructionBox(Flowable):
    """Subtle instruction text with left icon."""
    def __init__(self, text):
        Flowable.__init__(self)
        self.width = CONTENT_W
        self.height = 0.32 * inch
        self.text = text

    def draw(self):
        c = self.canv
        c.setFillColor(GRAY_50)
        c.roundRect(0, 0, self.width, self.height, 4, fill=1, stroke=0)
        c.setStrokeColor(GRAY_200)
        c.roundRect(0, 0, self.width, self.height, 4, fill=0, stroke=1)
        # Pencil icon area
        c.setFillColor(GRAY_500)
        c.setFont('Helvetica', 8)
        c.drawString(0.15*inch, self.height/2 - 3, chr(9998))  # pencil
        # Text
        c.setFont('Helvetica-Oblique', 9)
        c.setFillColor(GRAY_700)
        c.drawString(0.4*inch, self.height/2 - 3, self.text)


class MCBubble(Flowable):
    """A single multiple-choice option with a bubble."""
    def __init__(self, label, text, width=3.2*inch):
        Flowable.__init__(self)
        self.width = width
        self.height = 0.26 * inch
        self.label = label
        self.text = text

    def draw(self):
        c = self.canv
        # Bubble circle
        r = 0.09 * inch
        cx = 0.12 * inch
        cy = self.height / 2
        c.setStrokeColor(GRAY_300)
        c.setLineWidth(1)
        c.circle(cx, cy, r, fill=0, stroke=1)
        # Label inside bubble
        c.setFont('Helvetica-Bold', 7.5)
        c.setFillColor(GRAY_500)
        c.drawCentredString(cx, cy - 2.5, self.label)
        # Option text
        c.setFont('Helvetica', 10)
        c.setFillColor(GRAY_900)
        c.drawString(0.3 * inch, cy - 3.5, self.text)


class TFBubbles(Flowable):
    """True / False bubble pair."""
    def __init__(self):
        Flowable.__init__(self)
        self.width = 1.8 * inch
        self.height = 0.26 * inch

    def draw(self):
        c = self.canv
        r = 0.09 * inch
        cy = self.height / 2
        for label, x in [('V', 0.12*inch), ('F', 0.95*inch)]:
            c.setStrokeColor(GRAY_300)
            c.setLineWidth(1)
            c.circle(x, cy, r, fill=0, stroke=1)
            c.setFont('Helvetica-Bold', 7.5)
            c.setFillColor(GRAY_500)
            c.drawCentredString(x, cy - 2.5, label)
            c.setFont('Helvetica', 8.5)
            c.setFillColor(GRAY_700)
            txt = 'Verdadero' if label == 'V' else 'Falso'
            c.drawString(x + 0.13*inch, cy - 3, txt)


class WriteLines(Flowable):
    """Dotted write-on lines."""
    def __init__(self, count=2, line_width=None):
        Flowable.__init__(self)
        self.line_width = line_width or CONTENT_W - 0.6*inch
        self.count = count
        self.height = count * 0.28 * inch
        self.width = self.line_width + 0.3*inch

    def draw(self):
        c = self.canv
        c.setStrokeColor(GRAY_200)
        c.setLineWidth(0.5)
        c.setDash(2, 2)
        for i in range(self.count):
            y = self.height - (i + 1) * 0.28 * inch + 0.04 * inch
            c.line(0.3*inch, y, self.line_width, y)
        c.setDash()


# ── Section Builders ────────────────────────────────────────────────────

def build_vocab_matching(words, num, count):
    selected = random.sample(words, min(count, len(words)))
    spanish_list = [(w['spanish'], w.get('gender')) for w in selected]
    english_list = [w['english'] for w in selected]

    letters = [chr(65 + i) for i in range(len(selected))]
    shuffled = list(zip(letters, english_list[:]))
    random.shuffle(shuffled)

    story = []
    story.append(SectionHeader(num, 'Vocabulary Matching', SECTION_ACCENT, SECTION_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Write the letter of the correct English translation next to each Spanish word.'))
    story.append(Spacer(1, 8))

    # Build table with alternating row colors
    header = ['', P('<b>Spanish</b>', 'cell_bc'), '', P('<b>English</b>', 'cell_bc')]
    rows = [header]
    for i in range(len(selected)):
        g = spanish_list[i][1]
        gh = f'  <i>({g[0]})</i>' if g and g != 'neutral' else ''
        sp = P(f'{i+1}.&nbsp; {spanish_list[i][0]}{gh} &nbsp; ______', 'cell')
        en = P(f'{shuffled[i][0]}.&nbsp; {shuffled[i][1]}', 'cell')
        rows.append(['', sp, '', en])

    t = Table(rows, colWidths=[0.05*inch, 3.1*inch, 0.3*inch, 3.1*inch])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (1, 0), (1, 0), 1.5, SECTION_ACCENT),
        ('LINEBELOW', (3, 0), (3, 0), 1.5, SECTION_ACCENT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, GRAY_50]),
    ]))
    story.append(t)

    letter_map = {e: l for l, e in shuffled}
    answers = [f"{i+1}. {spanish_list[i][0]} = {letter_map[english_list[i]]} ({english_list[i]})"
               for i in range(len(selected))]

    return story, ('Vocabulary Matching', answers)


def build_fill_blank(words, num, count):
    with_ex = [w for w in words if w.get('example')]
    pool = with_ex + [w for w in words if not w.get('example')]
    selected = random.sample(pool, min(count, len(pool)))

    story = []
    story.append(SectionHeader(num, 'Fill in the Blank', GREEN_ACCENT, GREEN_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Write the correct Spanish word in each blank. The English hint is in parentheses.'))
    story.append(Spacer(1, 8))

    answers = []
    items = []
    for i, w in enumerate(selected, 1):
        if w.get('example'):
            sent = w['example'].replace(w['spanish'], '<b>__________</b>')
            sent = sent.replace(w['spanish'].capitalize(), '<b>__________</b>')
            hint = w['english']
            items.append([
                P(f'<b>{i}.</b>', 'cell'),
                P(f'{sent}&nbsp; <i>({hint})</i>', 'cell'),
            ])
        else:
            items.append([
                P(f'<b>{i}.</b>', 'cell'),
                P(f'<b>__________</b> = <i>{w["english"]}</i>', 'cell'),
            ])
        answers.append(f"{i}. {w['spanish']}")

    t = Table(items, colWidths=[0.35*inch, CONTENT_W - 0.45*inch])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (1, 0), (1, -1), 0.5, GRAY_200),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [WHITE, GRAY_50]),
    ]))
    story.append(t)
    return story, ('Fill in the Blank', answers)


def build_multiple_choice(words, num, count):
    selected = random.sample(words, min(count, len(words)))
    remaining_words = [w for w in words if w not in selected]

    story = []
    story.append(SectionHeader(num, 'Multiple Choice', GOLD_ACCENT, GOLD_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Choose the correct translation by filling in the bubble.'))
    story.append(Spacer(1, 8))

    answers = []
    for i, w in enumerate(selected, 1):
        correct = w['english']
        # Generate 3 distractors
        distractors = random.sample(
            [x['english'] for x in remaining_words if x['english'] != correct],
            min(3, len(remaining_words))
        )
        options = [correct] + distractors
        random.shuffle(options)
        correct_letter = chr(65 + options.index(correct))
        answers.append(f"{i}. {correct_letter}) {correct}")

        # Question row
        gender = w.get('gender')
        g_hint = f' <i>({gender[0]})</i>' if gender and gender != 'neutral' else ''
        story.append(P(f'<b>{i}.</b>&nbsp; What does "<b>{w["spanish"]}</b>"{g_hint} mean?', 'body'))
        story.append(Spacer(1, 3))

        # Options as 2x2 grid
        option_cells = []
        row = []
        for j, opt in enumerate(options):
            row.append(MCBubble(chr(65 + j), opt))
            if len(row) == 2:
                option_cells.append(row)
                row = []
        if row:
            while len(row) < 2:
                row.append(Spacer(1, 1))
            option_cells.append(row)

        ot = Table(option_cells, colWidths=[3.3*inch, 3.3*inch])
        ot.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ]))
        story.append(ot)
        story.append(Spacer(1, 8))

    return story, ('Multiple Choice', answers)


def build_true_false(words, verbs, num, count):
    story = []
    story.append(SectionHeader(num, 'True or False (Verdadero o Falso)', CORAL_ACCENT, CORAL_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Read each statement and mark V (Verdadero) for true or F (Falso) for false.'))
    story.append(Spacer(1, 8))

    statements = []
    answers = []

    # Generate true statements from real data
    word_pool = [w for w in words if w.get('english')]
    verb_pool = [v for v in verbs if v.get('english')]
    random.shuffle(word_pool)
    random.shuffle(verb_pool)

    used_count = 0
    for w in word_pool[:count]:
        if used_count >= count:
            break
        is_true = random.random() > 0.45  # slightly more true than false
        if is_true:
            statements.append((f'"{w["spanish"]}" means "{w["english"]}"', True))
        else:
            # Pick a wrong translation
            wrong_pool = [x['english'] for x in words if x['english'] != w['english']]
            if wrong_pool:
                wrong = random.choice(wrong_pool)
                statements.append((f'"{w["spanish"]}" means "{wrong}"', False))
            else:
                statements.append((f'"{w["spanish"]}" means "{w["english"]}"', True))
        used_count += 1

    # Add verb-based statements
    for v in verb_pool[:max(0, count - used_count)]:
        is_true = random.random() > 0.45
        if is_true:
            statements.append((f'"{v["infinitive"]}" means "{v["english"]}"', True))
        else:
            wrong_pool = [x['english'] for x in verbs if x['english'] != v['english']]
            if wrong_pool:
                wrong = random.choice(wrong_pool)
                statements.append((f'"{v["infinitive"]}" means "{wrong}"', False))
            else:
                statements.append((f'"{v["infinitive"]}" means "{v["english"]}"', True))

    statements = statements[:count]
    random.shuffle(statements)

    for i, (stmt, is_correct) in enumerate(statements, 1):
        row_data = [
            [P(f'<b>{i}.</b>', 'cell'), P(stmt, 'cell'), TFBubbles()]
        ]
        rt = Table(row_data, colWidths=[0.35*inch, CONTENT_W - 1.7*inch, 1.25*inch])
        rt.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('BACKGROUND', (0, 0), (-1, -1), GRAY_50 if i % 2 == 0 else WHITE),
            ('LINEBELOW', (0, 0), (-1, -1), 0.25, GRAY_200),
        ]))
        story.append(rt)
        answers.append(f"{i}. {'Verdadero (V)' if is_correct else 'Falso (F)'} — {stmt}")

    return story, ('True or False', answers)


def build_conjugation(verbs_data, num, count):
    selected = random.sample(verbs_data, min(count, len(verbs_data)))
    pronouns = ['yo', 'tu', 'el', 'nosotros', 'ellos']
    pronoun_labels = ['yo', 'tú', 'él/ella', 'nosotros', 'ellos/ellas']

    story = []
    story.append(SectionHeader(num, 'Verb Conjugation', PLUM_ACCENT, PLUM_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Fill in the missing conjugations for each verb.'))
    story.append(Spacer(1, 8))

    all_answers = []

    for v in selected:
        conj = v.get('conjugation', {})
        inf = v.get('infinitive', '?')
        eng = v.get('english', '?')
        vtype = v.get('type', '')

        story.append(P(f'<b>{inf}</b> &mdash; {eng} &nbsp;<i>({vtype})</i>', 'body_b'))
        story.append(Spacer(1, 4))

        header = [P('', 'cell_bc'), P('<b>Presente</b>', 'cell_bc'), P('<b>Pretérito</b>', 'cell_bc')]
        rows = [header]
        verb_ans = [f"{inf} ({eng}):"]

        for pi, pk in zip(pronoun_labels, pronouns):
            pres = conj.get('present', {}).get(pk, '—')
            pret = conj.get('preterite', {}).get(pk, '—')
            show_pres = pres if random.random() > 0.5 else ''
            show_pret = pret if random.random() > 0.5 else ''
            if not show_pres and not show_pret:
                if random.random() > 0.5: show_pres = pres
                else: show_pret = pret

            # Style blanks differently
            pres_cell = P(show_pres if show_pres else '___________', 'cell_c')
            pret_cell = P(show_pret if show_pret else '___________', 'cell_c')
            rows.append([P(pi, 'cell_b'), pres_cell, pret_cell])
            verb_ans.append(f"  {pi}: {pres} / {pret}")

        t = Table(rows, colWidths=[1.3*inch, 2.5*inch, 2.5*inch])
        t.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, GRAY_300),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f0e6f4')),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#faf5fc')),
            ('ROWBACKGROUNDS', (1, 1), (-1, -1), [WHITE, GRAY_50]),
        ]))
        story.append(t)
        story.append(Spacer(1, 14))
        all_answers.extend(verb_ans)

    return story, ('Verb Conjugation', all_answers)


def build_translation(words, verbs_data, num, count):
    story = []
    story.append(SectionHeader(num, 'Translation', WARM_ACCENT, WARM_BG))
    story.append(Spacer(1, 6))
    story.append(InstructionBox(
        'Translate each English phrase into Spanish. Write your answer on the dotted lines.'))
    story.append(Spacer(1, 8))

    # Gather prompts
    prompts = []
    pool = [w for w in words if w.get('exampleTranslation')] + \
           [v for v in verbs_data if v.get('exampleTranslation')]
    random.shuffle(pool)

    for item in pool[:count]:
        eng = item.get('exampleTranslation', item.get('english', ''))
        spa = item.get('example', item.get('spanish', item.get('infinitive', '')))
        prompts.append((eng, spa))

    remaining = count - len(prompts)
    if remaining > 0:
        extra = random.sample(words, min(remaining, len(words)))
        for w in extra:
            prompts.append((w['english'], w['spanish']))

    prompts = prompts[:count]
    answers = []

    for i, (eng, spa) in enumerate(prompts, 1):
        story.append(P(f'<b>{i}.</b>&nbsp; {eng}', 'body'))
        story.append(Spacer(1, 2))
        story.append(WriteLines(1))
        story.append(Spacer(1, 4))
        answers.append(f"{i}. {spa}")

    return story, ('Translation', answers)


# ── Answer Key ──────────────────────────────────────────────────────────

def build_answer_key(answer_sections, seed, date_str):
    story = []
    story.append(PageBreak())

    # Mini header
    story.append(Spacer(1, 6))
    ak_title = _ps('ak_title', fontSize=16, fontName='Helvetica-Bold',
                    textColor=BRAND_ACCENT, leading=20)
    ak_meta = _ps('ak_meta', fontSize=8, textColor=GRAY_500, alignment=TA_RIGHT)
    hdr_data = [[
        Paragraph('<b>Answer Key</b>', ak_title),
        Paragraph(f'Seed: {seed}  |  {date_str}', ak_meta),
    ]]
    ht = Table(hdr_data, colWidths=[4*inch, CONTENT_W - 4*inch])
    ht.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('LINEBELOW', (0, 0), (-1, -1), 1.5, BRAND_ACCENT),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(ht)
    story.append(Spacer(1, 12))

    for section_title, answers in answer_sections:
        story.append(P(f'<b>{section_title}</b>', 'answer_b'))
        story.append(Spacer(1, 3))
        # Two-column answer layout for compactness
        if len(answers) > 6:
            mid = math.ceil(len(answers) / 2)
            col1 = answers[:mid]
            col2 = answers[mid:]
            rows = []
            for j in range(max(len(col1), len(col2))):
                c1 = P(col1[j], 'answer') if j < len(col1) else ''
                c2 = P(col2[j], 'answer') if j < len(col2) else ''
                rows.append([c1, c2])
            at = Table(rows, colWidths=[CONTENT_W/2, CONTENT_W/2])
            at.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ]))
            story.append(at)
        else:
            for ans in answers:
                story.append(P(ans, 'answer'))
        story.append(Spacer(1, 10))

    story.append(Spacer(1, 20))
    story.append(P('<i>Generated by Aprende Espanol  |  aprendeespanol.com</i>', 'footer'))
    return story


# ── Footer on every page ────────────────────────────────────────────────

class FooterCanvas(pdfcanvas.Canvas):
    """Adds page numbers and seed to footer."""
    def __init__(self, *args, seed=None, **kwargs):
        self._seed = seed
        pdfcanvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_pages = []

    def showPage(self):
        self._saved_pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_pages)
        for i, state in enumerate(self._saved_pages):
            self.__dict__.update(state)
            self._draw_footer(i + 1, num_pages)
            pdfcanvas.Canvas.showPage(self)
        pdfcanvas.Canvas.save(self)

    def _draw_footer(self, page_num, total):
        self.saveState()
        self.setFont('Helvetica', 7.5)
        self.setFillColor(GRAY_300)
        # Left: seed
        self.drawString(MARGIN, 0.35*inch, f'Seed: {self._seed}')
        # Center: page
        self.drawCentredString(PAGE_W/2, 0.35*inch, f'Page {page_num} of {total}')
        # Right: brand
        self.drawRightString(PAGE_W - MARGIN, 0.35*inch, 'Aprende Espanol')
        # Top line
        self.setStrokeColor(GRAY_200)
        self.setLineWidth(0.5)
        self.line(MARGIN, 0.5*inch, PAGE_W - MARGIN, 0.5*inch)
        self.restoreState()


# ── Main generator ──────────────────────────────────────────────────────

SECTION_COLORS = {
    'vocab_matching':  (SECTION_ACCENT, SECTION_BG),
    'fill_blank':      (GREEN_ACCENT, GREEN_BG),
    'multiple_choice': (GOLD_ACCENT, GOLD_BG),
    'true_false':      (CORAL_ACCENT, CORAL_BG),
    'conjugation':     (PLUM_ACCENT, PLUM_BG),
    'translation':     (WARM_ACCENT, WARM_BG),
}

def generate_pdf(config):
    words = config.get('words', [])
    verbs_data = config.get('verbs', [])
    sections = config.get('sections', [])
    items = config.get('itemsPerSection', 10)
    seed = config.get('seed', random.randint(1000, 9999))
    random.seed(seed)

    date_str = datetime.now().strftime('%B %d, %Y')

    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=0.5*inch, bottomMargin=0.6*inch
    )

    story = []
    answer_sections = []

    # Header
    story.append(HeaderBlock(seed, date_str))
    story.append(Spacer(1, 14))

    # Sections
    sec_num = 1
    for sec_type in sections:
        sec_story, sec_answer = [], None

        if sec_type == 'vocab_matching' and words:
            sec_story, sec_answer = build_vocab_matching(words, sec_num, items)
        elif sec_type == 'fill_blank' and words:
            sec_story, sec_answer = build_fill_blank(words, sec_num, items)
        elif sec_type == 'multiple_choice' and words:
            sec_story, sec_answer = build_multiple_choice(words, sec_num, items)
        elif sec_type == 'true_false' and (words or verbs_data):
            sec_story, sec_answer = build_true_false(words, verbs_data, sec_num, items)
        elif sec_type == 'conjugation' and verbs_data:
            sec_story, sec_answer = build_conjugation(verbs_data, sec_num, items)
        elif sec_type == 'translation' and (words or verbs_data):
            sec_story, sec_answer = build_translation(words, verbs_data, sec_num, items)
        else:
            continue

        if sec_story:
            story.extend(sec_story)
            story.append(Spacer(1, 16))
            if sec_answer:
                answer_sections.append(sec_answer)
            sec_num += 1

    # Answer key
    story.extend(build_answer_key(answer_sections, seed, date_str))

    # Build with custom canvas for footer
    doc.build(story, canvasmaker=lambda *a, **kw: FooterCanvas(*a, seed=seed, **kw))
    buf.seek(0)
    return buf.read()


# ── Entry ───────────────────────────────────────────────────────────────

def main():
    try:
        config = json.loads(sys.stdin.read())
    except json.JSONDecodeError as e:
        sys.stderr.write(f"JSON parse error: {e}\n")
        sys.exit(1)
    try:
        sys.stdout.buffer.write(generate_pdf(config))
    except Exception as e:
        sys.stderr.write(f"PDF error: {e}\n")
        import traceback; traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
