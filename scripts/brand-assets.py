from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
import json
out=Path('public/brand');out.mkdir(exist_ok=True)
INK='#123D51';GREEN='#176B5B';SUN='#F2C94C';WHITE='#FFFFFF'
def text_path(text,x,y,size,weight,color):
 f=instantiateVariableFont(TTFont('public/fonts/Sora.ttf'),{'wght':weight});gs=f.getGlyphSet(); cmap=f.getBestCmap();units=f['head'].unitsPerEm;scale=size/units;result=[];cursor=0
 for ch in text:
  name=cmap[ord(ch)]; pen=SVGPathPen(gs);gs[name].draw(pen)
  result.append(f'<path d="{pen.getCommands()}" transform="translate({x+cursor*scale:.3f} {y}) scale({scale:.6f} {-scale:.6f})"/>');cursor+=gs[name].width
 return f'<g fill="{color}">'+''.join(result)+'</g>'
def symbol(main=INK,accent=SUN):
 return f'<path d="M78 18H40C22.3 18 8 32.3 8 50s14.3 32 32 32h38V66H40a16 16 0 0 1 0-32h38Z" fill="{main}"/><path d="M62 42h30v16H62Z" fill="{accent}"/>'
def svg(w,h,body,title='Campo Grande às Claras'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>'
for label,main,accent in [('principal',INK,SUN),('negativa',WHITE,SUN),('monocromatica',INK,INK),('branca',WHITE,WHITE)]:
 body=f'<g transform="translate(0 0)">{symbol(main,accent)}</g>'+text_path('Campo Grande',112,38,23,450,main)+text_path('às Claras',110,79,42,700,main)
 (out/f'logo-horizontal-{label}.svg').write_text(svg(322,100,body))
 body=f'<g transform="translate(110 0)">{symbol(main,accent)}</g>'+text_path('Campo Grande',51,130,28,450,main)+text_path('às Claras',40,182,52,700,main)
 (out/f'logo-vertical-{label}.svg').write_text(svg(320,202,body))
 (out/f'simbolo-{label}.svg').write_text(svg(100,100,symbol(main,accent)))
Path('public/favicon.svg').write_text(svg(100,100,'<rect width="100" height="100" rx="22" fill="'+INK+'"/><g transform="translate(7 7) scale(.86)">'+symbol(WHITE,SUN)+'</g>'))
(out/'avatar.svg').write_text(svg(512,512,'<rect width="512" height="512" rx="112" fill="'+INK+'"/><g transform="translate(66 66) scale(3.8)">'+symbol(WHITE,SUN)+'</g>'))
tokens={'azul-publico':INK,'verde-cerrado':GREEN,'amarelo-solar':SUN,'nevoa':'#EFF6F5','branco':WHITE,'texto-secundario':'#49616A','fontes':{'titulos':'Sora','texto':'Public Sans'}}
(out/'tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2))
