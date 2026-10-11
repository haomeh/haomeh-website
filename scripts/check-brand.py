from pathlib import Path
import json
import xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent.parent
results=[]
for p in sorted((root/'dist/brand').rglob('*.svg')):
 tree=ET.parse(p).getroot()
 assert tree.tag=='{http://www.w3.org/2000/svg}svg'
 assert tree.get('viewBox')
 assert len(tree.findall('.//{http://www.w3.org/2000/svg}path'))>0
 assert not tree.findall('.//{http://www.w3.org/2000/svg}text'), 'No font-dependent SVG text'
 for el in tree.iter():
  assert el.tag.split('}')[-1] not in ['script','image','foreignObject']
  assert not any(k.lower().startswith('on') or 'href' in k for k in el.attrib)
 results.append(p.name)
def lum(h):
 rgb=[int(h[i:i+2],16)/255 for i in [1,3,5]]
 c=[v/12.92 if v<=0.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
 return sum(v*w for v,w in zip(c,[.2126,.7152,.0722]))
a,b=sorted([lum('#29392f'),lum('#f8f7f2')]);ratio=(b+.05)/(a+.05)
assert ratio>=7
report={'svgAssets':results,'noEmbeddedScriptsOrFonts':True,'brandForeground':'#29392f','brandBackground':'#f8f7f2','brandContrastRatio':round(ratio,2),'minimumContrast':7,'note':'Brand ink/background only; not a complete WCAG audit.'}
(root/'artifacts/brand-tests.json').write_text(json.dumps(report,indent=2))
print(f'PASS: {len(results)} SVGs parsed, no external assets/scripts/text; brand contrast {ratio:.2f}:1.')
