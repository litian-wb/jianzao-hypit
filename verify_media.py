import sys,subprocess,json,math,struct
from pathlib import Path
video,wav,offset,out=sys.argv[1:];offset=float(offset);out=Path(out)
def ff(*a):return subprocess.check_output(['ffmpeg','-v','error',*map(str,a)])
def pcm(file,ss=0,duration=12):return ff('-ss',ss,'-i',file,'-t',duration,'-vn','-ac','1','-ar','8000','-f','f32le','-')
# Include nontrivial foley, not silence. 0-12 or smoke34-46 has multiple events.
a=pcm(video);b=pcm(wav,offset)
a=list(struct.unpack('<'+'f'*(len(a)//4),a));b=list(struct.unpack('<'+'f'*(len(b)//4),b))
n=min(len(a),len(b));a=a[:n];b=b[:n]
def corr(lag):
 aa=a[max(0,lag):n+min(0,lag)];bb=b[max(0,-lag):n-min(max(lag,0),n)]
 z=min(len(aa),len(bb));aa=aa[:z];bb=bb[:z]
 ab=sum(x*y for x,y in zip(aa,bb));energy=math.sqrt(sum(x*x for x in aa)*sum(y*y for y in bb));return ab/energy if energy else 0
lags=list(range(-80,81,4));values=[corr(k) for k in lags];j=max(range(len(values)),key=values.__getitem__)
report={'sourceWav':Path(wav).name,'sourceOffsetSeconds':offset,'audioCorrelation':values[j],'bestOffsetMs':lags[j]/8,'matchedSamples':n,'videoSamples':[]}
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',video]));dur=float(probe['format']['duration'])
points=[1.2,8.5,20,29,42.5,53,65,72,89,94.2,96,113] if dur>100 else [1,5,9,13]
for i,t in enumerate(points):
 rgb=ff('-ss',t,'-i',video,'-frames:v','1','-vf','scale=96:54','-pix_fmt','rgb24','-f','rawvideo','-');vals=list(rgb)
 mean=sum(vals)/len(vals);variance=sum((x-mean)**2 for x in vals)/len(vals)
 assert variance>120 and mean>18,(t,mean,variance)
 report['videoSamples'].append({'at':t,'meanRGB':round(mean,2),'variance':round(variance,2)})
 ff('-y','-ss',t,'-i',video,'-frames:v','1','-vf','scale=960:540','-q:v','3',out/f'review-encoded-{i:02}.jpg')
(out/'media-check.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
