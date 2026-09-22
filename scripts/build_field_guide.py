"""Generate the public field guide from one editorial source. Requires reportlab."""
import json
from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = json.loads((ROOT / 'content/delegating-work-to-ai.json').read_text())
OUT = ROOT / 'public/downloads/delegating-work-to-ai.pdf'
NAVY, INK, MUTED = '#0B1C2C', '#25384A', '#4E6374'
fontroot = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Body', str(fontroot/'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('BodyBold', str(fontroot/'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Editorial', str(fontroot/'DejaVuSerif.ttf')))
styles = {
    'p': ParagraphStyle('p', fontName='Body', fontSize=9.4, leading=12.8, textColor=HexColor(INK), spaceAfter=7),
    'small': ParagraphStyle('small', fontName='Body', fontSize=7.8, leading=10.8, textColor=HexColor(MUTED), spaceAfter=9),
    'h': ParagraphStyle('h', fontName='BodyBold', fontSize=10.5, leading=14, textColor=HexColor(NAVY), spaceBefore=4, spaceAfter=6),
    'title': ParagraphStyle('title', fontName='Editorial', fontSize=24, leading=28, textColor=HexColor(NAVY), spaceAfter=13),
    'eyebrow': ParagraphStyle('eyebrow', fontName='BodyBold', fontSize=8, leading=12, textColor=HexColor(MUTED), spaceAfter=13),
    'callout': ParagraphStyle('callout', fontName='BodyBold', fontSize=9.6, leading=13.5, textColor=HexColor(NAVY), borderPadding=10, backColor=HexColor('#E8F0F4'), spaceBefore=5, spaceAfter=14),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=8.4, leading=11.5, textColor=HexColor(INK)),
    'th': ParagraphStyle('th', fontName='BodyBold', fontSize=8.5, leading=12, textColor=white),
}

def page(c, doc):
    c.saveState()
    c.setFillColor(HexColor(NAVY)); c.rect(0, 780, 612, 12, fill=1, stroke=0)
    c.setFont('BodyBold', 8); c.drawString(48, 751, 'JUAN MARTINEZ / RESEARCH & PRACTICE')
    c.setStrokeColor(HexColor('#CAD5DC')); c.line(48, 44, 564, 44)
    c.setFillColor(HexColor(MUTED)); c.setFont('Body', 7.6)
    c.drawString(48, 29, 'Delegating Work to AI · Public edition 1.0 · September 2026')
    c.drawRightString(564, 29, f'{doc.page} / 6')
    c.restoreState()

def P(text, style='p'):
    return Paragraph(escape(text), styles[style])

story = []
html_sections = []
for i, sec in enumerate(SECTIONS):
    if i: story.append(PageBreak())
    story += [P(sec['eyebrow'].upper(), 'eyebrow'), P(sec['title'], 'title')]
    tag = 'h1' if i == 0 else 'h2'
    h = f'<section id="{sec["id"]}"><p class="eyebrow">{escape(sec["eyebrow"])}</p><{tag}>{escape(sec["title"])}</{tag}>'
    if sec.get('subtitle'):
        story += [P(sec['subtitle'], 'h'), Spacer(1, 10)]
        h += f'<p class="subtitle">{escape(sec["subtitle"])}</p><p class="byline">Juan A. Martinez Diaz, MBA · September 22, 2026</p><div class="actions"><a class="button" href="/downloads/delegating-work-to-ai.pdf">Download the six-page guide (PDF)</a><a href="#worked-example">Go to the worked example →</a></div>'
    for block in sec['blocks']:
        kind = block[0]
        if kind == 'table':
            rows = [[P(x, 'th') for x in block[1]]] + [[P(x, 'cell') for x in row] for row in block[2]]
            table = Table(rows, colWidths=[137, 379], repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND',(0,0),(-1,0),HexColor(NAVY)),
                ('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#F0F4F6'),white]),
                ('VALIGN',(0,0),(-1,-1),'TOP'),
                ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),
                ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
                ('LINEBELOW',(0,1),(-1,-1),0.5,HexColor('#D7E0E6')),
            ]))
            story += [table, Spacer(1,12)]
            h += '<div class="table-wrap"><table><thead><tr>'+''.join(f'<th scope="col">{escape(x)}</th>' for x in block[1])+'</tr></thead><tbody>'
            h += ''.join('<tr>'+''.join(f'<td>{escape(x)}</td>' for x in row)+'</tr>' for row in block[2])+'</tbody></table></div>'
        elif kind == 'source':
            story += [Paragraph(f'{escape(block[1])} <a href="{escape(block[2])}" color="#216A86">Open source ↗</a>',styles['small'])]
            h += f'<p class="source"><a href="{escape(block[2])}">{escape(block[1])}</a></p>'
        else:
            if kind == 'callout': story.append(Spacer(1,12))
            story.append(P(block[1],kind))
            if kind == 'callout': story.append(Spacer(1,8))
            tag = 'h3' if kind == 'h' else 'p'
            h += f'<{tag} class="{kind}">{escape(block[1])}</{tag}>'
    html_sections.append(h+'</section>')
OUT.parent.mkdir(parents=True,exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=(612,792), rightMargin=48, leftMargin=48, topMargin=66, bottomMargin=57,
                        title='Delegating Work to AI: Authority, Evidence, and Oversight', author='Juan A. Martinez Diaz, MBA')
doc.build(story,onFirstPage=page,onLaterPages=page)

css = '''*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:28px}body{margin:0;background:#f6f7f5;color:#25384a;font:18px/1.8 system-ui,sans-serif}a{color:#17617c;text-underline-offset:4px}a:hover{color:#12394c}a:focus-visible{outline:3px solid #2c82a2;outline-offset:5px}header{background:#071018;padding:23px max(24px,calc((100vw - 1000px)/2));display:flex;justify-content:space-between;gap:20px;font-size:14px}header a{color:#dcebf4;text-decoration:none}header a:hover{color:white}.wordmark{letter-spacing:2px}main{max-width:900px;margin:auto;padding:55px 34px 80px}section{padding:38px 0;border-bottom:1px solid #c9d4db}section:first-child{padding-top:0}h1,h2{font-family:Georgia,serif;font-weight:400;line-height:1.14;color:#0b1c2c}h1{font-size:clamp(42px,6vw,64px);margin:20px 0 14px}h2{font-size:clamp(32px,5vw,44px);margin:18px 0 28px}h3{font-size:21px;line-height:1.4;margin:32px 0 10px}.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#566c7c}.subtitle{font-size:26px;margin:12px 0}.byline,.small,.source{font-size:14px;line-height:1.8;color:#536775}.actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin:28px 0 38px;font-size:15px}.button{background:#0b1c2c;color:white;padding:13px 20px;text-decoration:none}.button:hover{background:#204a60;color:white}.callout{border-left:3px solid #3e8da5;background:#e5eef1;padding:22px 26px;font-size:19px}.table-wrap{overflow-x:auto;margin:25px 0}table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.7}th{text-align:left;background:#0b1c2c;color:#fff;padding:13px 16px}td{vertical-align:top;padding:15px 16px;border-bottom:1px solid #ccd7de}td:first-child{width:28%;font-weight:600}tr:nth-child(even){background:#eaf0f2}footer{padding:35px 24px;text-align:center;background:#071018;color:#b7cbd9;font-size:14px}footer a{color:#c6e3ee}.toc{padding:18px 0 30px;border-bottom:1px solid #c9d4db;font-size:14px}.toc ol{padding-left:24px;margin:0;columns:2;column-gap:30px}.toc li{break-inside:avoid;padding:4px 0}.skip{position:absolute;top:-100px;left:20px;background:white;padding:8px}.skip:focus{top:12px}@media(max-width:600px){main{padding:35px 22px 50px}body{font-size:17px}header{font-size:12px}.toc ol{columns:1}td,th{padding:11px;font-size:13px}td:first-child{width:32%}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{header,.actions,.toc,footer{display:none}body{font-size:11pt;background:white}main{max-width:none;padding:0}section{break-before:page;border:0}section:first-child{break-before:auto}a{color:inherit}}'''
toc='<nav class="toc" aria-label="Guide contents"><ol>'+''.join(f'<li><a href="#{s["id"]}">{escape(s["title"])}</a></li>' for s in SECTIONS)+'</ol></nav>'
schema={'@context':'https://schema.org','@type':'Article','headline':'Delegating Work to AI: Authority, Evidence, and Oversight','author':{'@type':'Person','name':'Juan A. Martinez Diaz, MBA'},'datePublished':'2026-09-22','dateModified':'2026-09-22','mainEntityOfPage':'https://www.juanmartinez.ai/delegating-work-to-ai/','image':'https://www.juanmartinez.ai/assets/sentinel-hero.webp'}
html='''<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Delegating Work to AI | Juan Martinez</title><meta name="description" content="An executive field guide to AI authority, evidence, and oversight, with a worked synthetic Sentinel example and a downloadable PDF."><link rel="canonical" href="https://www.juanmartinez.ai/delegating-work-to-ai/"><link rel="icon" href="/favicon.svg"><meta name="robots" content="index,follow"><meta property="og:type" content="article"><meta property="og:title" content="Delegating Work to AI: Authority, Evidence, and Oversight"><meta property="og:description" content="A practical executive field guide by Juan A. Martinez Diaz, MBA, with a worked Sentinel example."><meta property="og:url" content="https://www.juanmartinez.ai/delegating-work-to-ai/"><meta property="og:image" content="https://www.juanmartinez.ai/assets/sentinel-hero.webp"><meta name="twitter:card" content="summary_large_image">'''+f'<style>{css}</style><script type="application/ld+json">{json.dumps(schema)}</script></head><body><a class="skip" href="#main">Skip to content</a><header><a class="wordmark" href="/">JUAN MARTINEZ</a><a href="/#research">Research &amp; practice</a></header><main id="main">'+html_sections[0]+toc+''.join(html_sections[1:])+'''</main><footer>Juan A. Martinez Diaz, MBA · Independent work; views are my own.<br><a href="mailto:sgmmartinez@gmail.com">Contact Juan</a> · <a href="/#research">More research</a></footer><script defer src="/_vercel/insights/script.js"></script></body></html>'''
(ROOT/'public/delegating-work-to-ai/index.html').write_text(html)
print(f'Generated {OUT}')
