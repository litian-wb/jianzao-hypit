from pathlib import Path
import os,sys,json,shutil,subprocess,hashlib,urllib.request,re,time
ROOT=Path.cwd();ENGINE=ROOT/'engine';PROJECT=ROOT/'project';OUT=PROJECT/'output';OUT.mkdir(exist_ok=True)
SCENE=ENGINE/'examples/semantic-composition';MODE=os.environ.get('RENDER_MODE','smoke')
START,END=(2040,2940) if MODE=='smoke' else (0,7080)
DURATION=(END-START)/60

def run(args,**kw):
 print('+',' '.join(map(str,args)),flush=True)
 return subprocess.run(list(map(str,args)),cwd=ENGINE,check=True,**kw)
def cli(*args,**kw):
 a=list(args)
 if '--project' not in a:a+=['--project',str(SCENE)]
 return run(['node','bin/hypit.mjs',*a],**kw)
def github(path,method='GET',body=None,content_type='application/json'):
 headers={'Authorization':'Bearer '+os.environ['GITHUB_TOKEN'],'Accept':'application/vnd.github+json','Content-Type':content_type,'User-Agent':'Jianzao-render'}
 payload=body if isinstance(body,bytes) else None if body is None else json.dumps(body).encode()
 req=urllib.request.Request(path if path.startswith('https:') else 'https://api.github.com/'+path,data=payload,headers=headers,method=method)
 with urllib.request.urlopen(req,timeout=90) as f:return json.load(f)
def draft_upload(files):
 repo=os.environ['GITHUB_REPOSITORY'];tag='render-'+os.environ['GITHUB_RUN_ID']
 rel=github(f'repos/{repo}/releases','POST',{'tag_name':tag,'name':'Review '+MODE+' '+tag,'draft':True,'prerelease':True,'body':'Private draft render output. Original WAV source, no voice. Not a published release.'})
 base=rel['upload_url'].split('{')[0]
 for f in files:
  if f.stat().st_size>70000000:raise RuntimeError('Draft output exceeds 70MB cap')
  github(base+'?name='+f.name,'POST',f.read_bytes(),'application/octet-stream')
 print('DRAFT_RELEASE_ID',rel['id'],flush=True)

try:
 # Source manifests establish that we actually use the approved WAV, not the web preview.
 manifest=json.loads((PROJECT/'source-manifest.json').read_text())
 for name,digest in manifest.items():
  assert hashlib.sha256((PROJECT/name).read_bytes()).hexdigest()==digest,name
 for name in ['main.svml','main.svrun','main.svs']:
  shutil.copyfile(PROJECT/'hypit'/name,SCENE/name)
 src=(SCENE/'main.svml').read_text()
 if MODE=='smoke':src=src.replace('timeline={animation.timeline}/>','timeline={animation.timeline} start-frame="2040" end-frame-exclusive="2940"/>')
 (SCENE/'main.svml').write_text(src)
 cfg=json.loads((PROJECT/'hypit/hypit.runtime.json').read_text());cfg['endpoints']['html.local']['config']={'chromePath':shutil.which('google-chrome'),'workers':1,'maxWorkers':1,'defaultConcurrency':1}
 (SCENE/'hypit.runtime.json').write_text(json.dumps(cfg))
 rt=['--runtime',str(SCENE/'hypit.runtime.json')]
 cli('check',str(SCENE/'main.svrun'))
 cli('plan',str(SCENE/'main.svrun'),*rt)
 # Static image/animation execution checks happen in real Chromium before a long render.
 run(['node',str(PROJECT/'cloud_audit.mjs')])
 cli('programs','prepare',*rt,'--endpoint','html.local','--endpoint','media.local')
 p=cli('build',str(SCENE/'main.svrun'),*rt,'--follow','--json',capture_output=True,text=True)
 (OUT/'build.json').write_text(p.stdout);(OUT/'build.log').write_text(p.stderr)
 print(p.stdout,flush=True)
 build=json.loads(p.stdout)['build'];bid=build['id']
 cli('get',bid,'--output','final.video','--to',str(OUT/'silent.mp4'))
 final=OUT/('jianzao-smoke.mp4' if MODE=='smoke' else 'jianzao-final.mp4')
 # No frame interpolation, no retiming. Source WAV starts on the exact requested frame time.
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',OUT/'silent.mp4','-ss',str(START/60),'-i',PROJECT/'audio/sfx-mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t',str(DURATION),'-movflags','+faststart',final])
 probe=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',final],capture_output=True,text=True).stdout)
 (OUT/'probe.json').write_text(json.dumps(probe,indent=2))
 v=next(x for x in probe['streams'] if x['codec_type']=='video');a=next(x for x in probe['streams'] if x['codec_type']=='audio')
 assert v['width']==1920 and v['height']==1080 and v['avg_frame_rate']=='60/1'
 assert int(v['nb_read_frames'])==END-START and abs(float(v['duration'])-DURATION)<.025
 assert a['channels']==2 and a['sample_rate']=='48000'
 p=run(['ffmpeg','-v','error','-i',final,'-f','null','-'],capture_output=True,text=True);assert not p.stderr.strip(),p.stderr
 (OUT/'decode-errors.log').write_text(p.stderr)
 run(['python3',str(PROJECT/'verify_media.py'),str(final),str(PROJECT/'audio/sfx-mix.wav'),str(START/60),str(OUT)])
 check=json.loads((OUT/'media-check.json').read_text());assert check['audioCorrelation']>.97,check
 # Release assets are not Actions artifacts; draft remains unpublished and owner-accessible.
 total=sum(f.stat().st_size for f in OUT.iterdir() if f.is_file() and f.name!='silent.mp4')
 assert total<100000000,total
 files=[final,OUT/'probe.json',OUT/'build.json',OUT/'build.log',OUT/'media-check.json',OUT/'cloud-audit.json']
 for f in sorted(OUT.glob('review-*.jpg')):files.append(f)
 draft_upload(files)
 print('RENDER_SUCCESS',MODE,'BUILD',bid,'BYTES',final.stat().st_size,flush=True)
except subprocess.CalledProcessError as e:
 if e.stdout:print(str(e.stdout)[-14000:],flush=True)
 if e.stderr:print(str(e.stderr)[-14000:],flush=True)
 raise
finally:
 try:cli('runtime','down','--runtime',str(SCENE/'hypit.runtime.json'))
 except Exception:pass
