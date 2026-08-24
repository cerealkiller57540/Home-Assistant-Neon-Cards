/* GLITCH — widget flottant WebGL CRT pour Open WebUI
   Auto-injecté par custom.css/loader.js (mécanisme officiel Open WebUI, /app/build/static/).
   Moteur porté de glitch-webgl-crt-v2.html, sans HUD/sliders (widget muet en prod, piloté par API). */
(function(){
"use strict";
if(window.__GLITCH_LOADED__) return; // évite double-injection si loader.js est ré-exécuté
window.__GLITCH_LOADED__ = true;

function boot(){
  const host = document.createElement('div');
  host.id = 'glitch-widget';
  Object.assign(host.style, {
    position:'fixed', right:'22px', bottom:'22px', width:'132px', height:'132px',
    zIndex:'2147483000', pointerEvents:'none', borderRadius:'50%', overflow:'hidden',
    background:'radial-gradient(120% 120% at 50% 45%, rgba(10,16,24,.55), rgba(4,6,11,.35) 70%, transparent 100%)',
    backdropFilter:'blur(2px)'
  });
  document.body.appendChild(host);

  const cv = document.createElement('canvas');
  cv.id = 'glitch-gl';
  cv.style.width='100%'; cv.style.height='100%'; cv.style.display='block';
  host.appendChild(cv);

  const gl = cv.getContext('webgl', {premultipliedAlpha:false, antialias:true, alpha:true});
  if(!gl){ host.style.display='none'; return; }

  /* ---------- 1) canvas 2D = texture source ---------- */
  const SRC = 512;
  const tex2d = document.createElement('canvas'); tex2d.width=tex2d.height=SRC;
  const c = tex2d.getContext('2d');

  const PATH_HEAD = new Path2D('M10.268 4.752H15.724V7.479H10.268ZM32.090 4.752H37.546V7.479H32.090ZM10.268 7.479H15.724V10.207H10.268ZM32.090 7.479H37.546V10.207H32.090ZM10.268 10.207H21.179V12.935H10.268ZM26.635 10.207H37.546V12.935H26.635ZM10.268 12.935H21.179V15.663H10.268ZM26.635 12.935H37.546V15.663H26.635ZM10.268 15.663H37.546V18.390H10.268ZM10.268 18.390H37.546V21.118H10.268ZM10.268 21.118H15.724V23.846H10.268ZM21.179 21.118H26.635V23.846H21.179ZM32.090 21.118H37.546V23.846H32.090ZM10.268 23.846H15.724V26.573H10.268ZM21.179 23.846H26.635V26.573H21.179ZM32.090 23.846H37.546V26.573H32.090Z');
  const PATH_PAWS = new Path2D('M4.813 26.573H21.179V29.301H4.813ZM26.635 26.573H43.002V29.301H26.635ZM4.813 29.301H21.179V32.029H4.813ZM26.635 29.301H43.002V32.029H26.635Z');
  const VB_W=47.81, VB_H=36.78;

  const EYE_L = {x:15.724, y:21.118, w:5.455, h:5.456};
  const EYE_R = {x:26.635, y:21.118, w:5.456, h:5.456};

  const MOODS = {
    idle:      {col:[74,242,161], core:[120,255,190], breathePeriod:9000, breatheAmp:0.32, bloom:0.85, ab:0.004, scan:0.5, jitter:1.0, pulseRate:0},
    listening: {col:[60,200,255], core:[90,205,255],  breathePeriod:2600, breatheAmp:0.18, bloom:0.75, ab:0.006, scan:0.5, jitter:1.8, pulseRate:0},
    thinking:  {col:[100,230,175],core:[130,255,195], breathePeriod:1400, breatheAmp:0.5,  bloom:0.95, ab:0.010, scan:0.7, jitter:1.3, pulseRate:0.35},
    talking:   {col:[70,250,170], core:[130,255,200], breathePeriod:420,  breatheAmp:0.6,  bloom:1.05, ab:0.005, scan:0.5, jitter:0.8, pulseRate:0},
    happy:     {col:[160,255,90], core:[195,255,120], breathePeriod:1100, breatheAmp:0.55, bloom:1.15, ab:0.003, scan:0.3, jitter:1.4, pulseRate:0},
    alert:     {col:[255,90,40],  core:[255,120,60],  breathePeriod:520,  breatheAmp:0.7,  bloom:1.30, ab:0.014, scan:0.9, jitter:3.2, pulseRate:0},
  };
  let moodName = 'idle';
  let moodFrom = {...MOODS.idle};
  let moodTo   = {...MOODS.idle};
  let moodT0 = 0, moodDur = 700;
  function setMood(name){
    if(!MOODS[name] || name===moodName) return;
    moodFrom = currentMood(performance.now());
    moodTo   = MOODS[name];
    moodT0   = performance.now();
    moodName = name;
  }
  function lerp(a,b,x){ return a+(b-a)*x; }
  function easeInOut(x){ return x<0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2; }
  function currentMood(t){
    const x = moodDur>0 ? Math.min(1,(t-moodT0)/moodDur) : 1;
    const e = easeInOut(x);
    const out = {};
    for(const k in moodTo){
      if(Array.isArray(moodTo[k])) out[k]=moodTo[k].map((v,i)=>lerp(moodFrom[k][i],v,e));
      else out[k]=lerp(moodFrom[k], moodTo[k], e);
    }
    return out;
  }

  let burstAt = -Infinity, burstDur = 850;
  function glitchBurst(){ burstAt = performance.now(); }
  function burstAmount(t){
    const el = t - burstAt;
    if(el < 0 || el > burstDur) return 0;
    return 1 - Math.pow(el/burstDur, 2);
  }
  function stepJitter(t, stepMs, seed){
    const i = Math.floor(t/stepMs);
    const r = Math.sin(i*12.9898 + seed*78.233) * 43758.5453;
    return (r - Math.floor(r)) * 2 - 1;
  }

  const HEAD_FX = ["nod2","vibrate","shake","shakerot"];
  let headFxAt = performance.now() + 2000 + Math.random()*4000;
  let headFxKind = HEAD_FX[0];
  const HEAD_FX_DUR = {nod2:900, vibrate:480, shake:700, shakerot:750};
  function headOffset(t){
    const el = t - headFxAt;
    if(el < 0 || el > HEAD_FX_DUR[headFxKind]){
      if(el > HEAD_FX_DUR[headFxKind]){
        headFxKind = HEAD_FX[Math.floor(Math.random()*HEAD_FX.length)];
        headFxAt = t + 2500 + Math.random()*5000;
      }
      return {x:0,y:0,rot:0};
    }
    const x = el / HEAD_FX_DUR[headFxKind];
    const wobble = Math.sin(x*Math.PI);
    switch(headFxKind){
      case 'nod2': { const y = Math.sin(x*Math.PI) * 1.9; return {x:0, y, rot:0}; }
      case 'vibrate': { const f = t*0.09; return {x:Math.sin(f)*0.35*wobble, y:Math.cos(f*1.3)*0.3*wobble, rot:0}; }
      case 'shake': { const f = t*0.045; return {x:Math.sin(f)*1.4*wobble, y:0, rot:0}; }
      case 'shakerot': { const f = t*0.04; return {x:Math.sin(f)*1.1*wobble, y:0, rot:Math.sin(f*0.9)*5*wobble}; }
    }
    return {x:0,y:0,rot:0};
  }

  let blinkAt = performance.now() + 1500 + Math.random()*2500;
  function blinkAmount(t){
    if(t < blinkAt) return 0;
    const dur = 140;
    const el = t - blinkAt;
    if(el > dur){
      blinkAt = t + 3000 + Math.random()*4000;
      return 0;
    }
    const x = el/dur;
    const tri = x<0.5 ? x*2 : (1-x)*2;
    return tri<0.5 ? 2*tri*tri : 1-Math.pow(-2*tri+2,2)/2;
  }

  function drawSource(t){
    c.clearRect(0,0,SRC,SRC);
    const bg = c.createRadialGradient(SRC/2,SRC*0.46,SRC*0.1, SRC/2,SRC/2,SRC*0.62);
    bg.addColorStop(0,'#07131a'); bg.addColorStop(0.6,'#04090f'); bg.addColorStop(1,'#02050b');
    c.fillStyle=bg; c.fillRect(0,0,SRC,SRC);

    const mood = currentMood(t);
    const breathe = 0.5 + 0.5*Math.sin(t*2*Math.PI/mood.breathePeriod);
    const flicker = 1 + (Math.sin(t*0.031)*Math.sin(t*0.017))*0.05;
    let glowMul = (1 - mood.breatheAmp*0.5 + breathe*mood.breatheAmp) * flicker;
    if(mood.pulseRate>0){
      const pulse = Math.pow(0.5+0.5*Math.sin(t*0.02), 6);
      glowMul *= 1 + pulse*mood.pulseRate;
    }
    const [cr,cg,cb] = mood.col;
    const [hr,hg,hb] = mood.core;

    const vbW=VB_W, vbH=VB_H, target=SRC*0.60, s=target/vbW;
    const gw=vbW*s, gh=vbH*s;
    c.save();
    c.translate((SRC-gw)/2, (SRC-gh)/2 + SRC*0.02);
    c.scale(s,s);

    const jx = Math.sin(t*0.0011)*0.4*mood.jitter, jy=Math.cos(t*0.0013)*0.3*mood.jitter;
    c.translate(jx,jy);

    function paintPart(path, burst){
      c.globalCompositeOperation='lighter';
      const glows=[
        [30,`rgba(${cr|0},${cg|0},${cb|0},${0.16*glowMul})`],
        [16,`rgba(${cr|0},${cg|0},${cb|0},${0.28*glowMul})`],
        [7, `rgba(${hr|0},${hg|0},${hb|0},${0.5*glowMul})`],
      ];
      for(const [b,col] of glows){ c.shadowColor=col; c.shadowBlur=b; c.fillStyle=col; c.fill(path); }
      c.shadowBlur=0;
      c.globalCompositeOperation='source-over';
      c.fillStyle=`rgb(${hr|0},${hg|0},${hb|0})`; c.fill(path);

      if(burst > 0.01){
        c.globalCompositeOperation='screen';
        const amp = 2.2 * burst;
        const rdx = stepJitter(t,70,1)*amp, rdy = stepJitter(t,70,2)*amp*0.4;
        const cyx = stepJitter(t,70,3)*amp, cyy = stepJitter(t,70,4)*amp*0.4;
        c.save(); c.translate(rdx,rdy);
        c.fillStyle=`rgba(255,45,107,${0.85*burst})`; c.fill(path);
        c.restore();
        c.save(); c.translate(cyx,cyy);
        c.fillStyle=`rgba(0,229,255,${0.85*burst})`; c.fill(path);
        c.restore();
        c.globalCompositeOperation='source-over';
        if(burst>0.5 && stepJitter(t,120,7)>0.3){
          const bandY = (stepJitter(t,120,8)*0.5+0.5)*VB_H;
          c.save();
          c.beginPath(); c.rect(0,bandY,VB_W,VB_H*0.12); c.clip();
          c.translate(stepJitter(t,60,9)*amp*1.5, 0);
          c.fillStyle=`rgb(${hr|0},${hg|0},${hb|0})`; c.fill(path);
          c.restore();
        }
      }
    }

    const burst = burstAmount(t);
    paintPart(PATH_PAWS, burst);

    const hOff = headOffset(t);
    c.save();
    c.translate(23.9, 15.7);
    c.rotate(hOff.rot * Math.PI/180);
    c.translate(-23.9 + hOff.x, -15.7 + hOff.y);
    paintPart(PATH_HEAD, burst);

    const blink = blinkAmount(t);
    if(blink > 0.001){
      c.globalCompositeOperation='source-over';
      c.fillStyle='#04090f';
      for(const eye of [EYE_L, EYE_R]){
        c.fillRect(eye.x, eye.y, eye.w, eye.h*blink);
      }
    }
    c.restore();
    c.restore();
    return tex2d;
  }

  /* ---------- 2) WebGL : quad plein écran + shader CRT ---------- */
  const vs = `
  attribute vec2 p; varying vec2 uv;
  void main(){ uv=(p+1.0)*0.5; gl_Position=vec4(p,0.0,1.0); }`;

  const fs = `
  precision highp float;
  varying vec2 uv;
  uniform sampler2D tex;
  uniform vec2 res;
  uniform float uCurve, uScan, uBloom, uAb, uTime;

  vec2 barrel(vec2 p, float k){
    vec2 cc = p - 0.5;
    float r2 = dot(cc,cc);
    p = 0.5 + cc*(1.0 + k*r2*2.4);
    return p;
  }
  float mask(vec2 p){
    vec2 b = step(vec2(0.0),p)*step(p,vec2(1.0));
    return b.x*b.y;
  }
  vec3 sampleBloomAt(vec2 p, float radius){
    vec3 s=vec3(0.0); float tot=0.0;
    for(int i=-2;i<=2;i++){ for(int j=-2;j<=2;j++){
      vec2 o=vec2(float(i),float(j))/res*radius;
      float w=1.0/(1.0+float(i*i+j*j)*0.8);
      s+=texture2D(tex,p+o).rgb*w; tot+=w;
    }}
    return s/tot;
  }
  void main(){
    vec2 p = barrel(uv, uCurve);
    p.y = 1.0 - p.y;

    float aspect = res.x / res.y;
    if(aspect > 1.0){ p.x = (p.x - 0.5)*aspect + 0.5; }
    else           { p.y = (p.y - 0.5)/aspect + 0.5; }

    float m = mask(p);

    vec2 dir = normalize(p-0.5+1e-5);
    float d = length(p-0.5);
    vec3 col;
    col.r = texture2D(tex, p + dir*uAb*d).r;
    col.g = texture2D(tex, p).g;
    col.b = texture2D(tex, p - dir*uAb*d).b;

    vec3 bloomTight = sampleBloomAt(p, 3.5);
    vec3 bloomWide  = sampleBloomAt(p, 9.0);
    col += bloomTight * uBloom * 0.45;
    col += bloomWide  * uBloom * 0.35;

    float shimmer = 0.94 + 0.06*sin(uTime*0.7 + p.y*6.0);
    float sl = 0.5 + 0.5*sin(p.y*res.y*1.15);
    col *= 1.0 - uScan*0.6*shimmer*(1.0-sl);
    float ap = 0.5+0.5*sin(p.x*res.x*1.05);
    col *= 1.0 - uScan*0.18*(1.0-ap);

    float vig = smoothstep(0.95,0.30,d);
    vec3 edgeGlow = vec3(0.10,0.45,0.32) * smoothstep(0.55,1.0,d) * 0.35;
    col = col*vig + edgeGlow*m;

    float n = fract(sin(dot(p*res+uTime, vec2(12.9898,78.233)))*43758.5453);
    col += (n-0.5)*0.03;

    col = col / (1.0 + col*0.65);

    col *= m;
    gl_FragColor = vec4(col, m);
  }`;

  function sh(type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ throw gl.getShaderInfoLog(s); } return s; }
  let prog;
  try{
    prog=gl.createProgram();
    gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));
    gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw gl.getProgramInfoLog(prog);
  }catch(e){ console.error('GLITCH shader error:', e); host.style.display='none'; return; }

  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');

  const tex=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);

  const U={};
  ['res','uCurve','uScan','uBloom','uAb','uTime','tex'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));
  const params={curve:0.28};

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const rect = host.getBoundingClientRect();
    cv.width=Math.floor(rect.width*dpr); cv.height=Math.floor(rect.height*dpr);
  }
  addEventListener('resize',resize);
  new ResizeObserver(resize).observe(host);
  resize();

  let running = true;
  function frame(t){
    if(!running) return;
    drawSource(t);
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tex2d);

    const mood = currentMood(t);

    gl.viewport(0,0,cv.width,cv.height);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    gl.uniform2f(U.res,cv.width,cv.height);
    gl.uniform1f(U.uCurve,params.curve);
    gl.uniform1f(U.uScan, mood.scan);
    gl.uniform1f(U.uBloom,mood.bloom);
    gl.uniform1f(U.uAb,   mood.ab);
    gl.uniform1f(U.uTime,t*0.001);
    gl.uniform1i(U.tex,0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- API publique ---------- */
  window.GLITCH = {
    setMood, glitchBurst,
    moods: Object.keys(MOODS),
    getMood: () => moodName,
    show: () => { host.style.display=''; },
    hide: () => { host.style.display='none'; },
    destroy: () => { running=false; host.remove(); window.__GLITCH_LOADED__=false; },
  };

  watchOpenWebUI();
}

function watchOpenWebUI(){
  let wasGenerating = false;
  let talkingTimer = null;

  function tick(){
    const generating = !!document.querySelector('.animate-pulse.rounded-full');
    if(generating && !wasGenerating){
      window.GLITCH.setMood('thinking');
      clearTimeout(talkingTimer);
      talkingTimer = setTimeout(() => window.GLITCH.setMood('talking'), 900);
    } else if(!generating && wasGenerating){
      clearTimeout(talkingTimer);
      window.GLITCH.setMood('idle');
    }
    wasGenerating = generating;
  }

  const obs = new MutationObserver(tick);
  obs.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
  setInterval(tick, 1200);
}

boot();
})();
