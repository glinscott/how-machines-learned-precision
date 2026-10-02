import{a as D,b as _,c as A}from"./origins-YQ0uDDfK.js";let b=1;const h=new Map,P=()=>b,I=o=>new D((o&255)/255,(o>>8)/255);function T(o,a){const F=h.get(o.uuid);if(F)return F;const f=o.attributes.position,p=o.index.array,c=p.length/3,s=new Map,l=new Int32Array(f.count);for(let e=0;e<f.count;e++){const i=`${f.getX(e)},${f.getY(e)},${f.getZ(e)}`;let n=s.get(i);n===void 0&&(n=s.size,s.set(i,n)),l[e]=n}const v=(e,i)=>{const n=l[e],d=l[i];return n<d?n*s.size+d:d*s.size+n},r=new Set;for(let e=0;e<a.length;e+=2)r.add(v(a[e],a[e+1]));const t=new Int32Array(c);for(let e=0;e<c;e++)t[e]=e;const u=e=>{for(;t[e]!==e;)e=t[e]=t[t[e]];return e},g=(e,i)=>{const n=u(e),d=u(i);n!==d&&(t[n]=d)},x=new Map;for(let e=0;e<c;e++)for(let i=0;i<3;i++){const n=p[e*3+i],d=p[e*3+(i+1)%3],y=v(n,d),w=x.get(y);w===void 0?x.set(y,[e]):w.push(e)}for(const[e,i]of x)if(!r.has(e))for(let n=1;n<i.length;n++)g(i[0],i[n]);const j=new Map,E=new Int32Array(c);for(let e=0;e<c;e++){const i=u(e);let n=j.get(i);n===void 0&&(n=b++,j.set(i,n)),E[e]=n}const C=new Int32Array(a.length);for(let e=0;e<a.length;e+=2){const i=x.get(v(a[e],a[e+1]))??[];let n=0,d=0;for(const y of i){const w=E[y];!n||w===n?n=w:(!d||w===d)&&(d=w)}C[e]=n,C[e+1]=d||n}const B={triFace:E,edgeFaces:C,faceCount:j.size};return h.set(o.uuid,B),B}const M=new Map;function z(o,a){const F=M.get(o.uuid);if(F)return F;const{triFace:f}=T(o,a),p=o.index.array,c=o.attributes.position,s=p.length,l=new Float32Array(s*3),v=new Float32Array(s*2);for(let t=0;t<s;t++){const u=p[t];l[t*3]=c.getX(u),l[t*3+1]=c.getY(u),l[t*3+2]=c.getZ(u);const g=I(f[t/3|0]);v[t*2]=g.x,v[t*2+1]=g.y}const r=new _;return r.setAttribute("position",new A(l,3)),r.setAttribute("aFace",new A(v,2)),r.boundingSphere=(o.boundingSphere??(o.computeBoundingSphere(),o.boundingSphere)).clone(),M.set(o.uuid,r),r}const S=new Map;function m(o,a){const F=S.get(o.uuid);if(F)return F;const{edgeFaces:f}=T(o,a),p=o.attributes.position,c=a.length,s=new Float32Array(c*3),l=new Float32Array(c*2),v=new Float32Array(c*2);for(let t=0;t<c;t++){const u=a[t];s[t*3]=p.getX(u),s[t*3+1]=p.getY(u),s[t*3+2]=p.getZ(u);const g=I(f[t&-2]),x=I(f[(t&-2)+1]);l[t*2]=g.x,l[t*2+1]=g.y,v[t*2]=x.x,v[t*2+1]=x.y}const r=new _;return r.setAttribute("position",new A(s,3)),r.setAttribute("aFA",new A(l,2)),r.setAttribute("aFB",new A(v,2)),r.boundingSphere=(o.boundingSphere??(o.computeBoundingSphere(),o.boundingSphere)).clone(),S.set(o.uuid,r),r}function W(o){let a=h.get(o.uuid);return a||(a={triFace:null,edgeFaces:null,faceCount:1,soleId:b++},h.set(o.uuid,a)),a.soleId??b++}const k=`
  uniform vec2 uTexel;
  attribute vec2 aFA;
  attribute vec2 aFB;
  varying vec2 vFA;
  varying vec2 vFB;
  varying float vEpsS;
  varying float vEpsO;
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vFA = aFA;
    vFB = aFB;
    gl_Position = projectionMatrix * viewMatrix * wp;
    // pixels' worth of window depth, as in the depth-mode line shader
    float pxd = (2.0 * uTexel.x / projectionMatrix[0][0]) * (-projectionMatrix[2][2] * 0.5);
    vEpsS = 1e-6 + 1.5 * pxd;
    vEpsO = 1e-6 + 12.0 * pxd;
  }
`,N=`
  uniform vec4 uClip;
  uniform sampler2D tId;
  uniform sampler2D tDepth;
  uniform vec2 uTexel;
  varying vec2 vFA;
  varying vec2 vFB;
  varying float vEpsS;
  varying float vEpsO;
  varying vec3 vWorldPos;
  void main() {
    if (dot(uClip.xyz, vWorldPos) + uClip.w < 0.0) discard;
    vec2 uv = gl_FragCoord.xy * uTexel;
    float d = gl_FragCoord.z;
    bool anyAdj = false;
    float adjNear = 1.0, adjFar = 0.0;
    for (int x = -1; x <= 1; x++)
      for (int y = -1; y <= 1; y++) {
        vec2 o = vec2(float(x), float(y)) * uTexel;
        vec2 pid = texture2D(tId, uv + o).rg;
        if (all(lessThan(abs(pid - vFA), vec2(0.002)))
          || all(lessThan(abs(pid - vFB), vec2(0.002)))) {
          anyAdj = true;
          float di = texture2D(tDepth, uv + o).r;
          adjNear = min(adjNear, di);
          adjFar = max(adjFar, di);
        }
      }
    vec2 cid = texture2D(tId, uv).rg;
    bool cAdj = all(lessThan(abs(cid - vFA), vec2(0.002)))
      || all(lessThan(abs(cid - vFB), vec2(0.002)));
    bool vis;
    if (cAdj) {
      vis = d <= adjNear + vEpsS + min(adjFar - adjNear, vEpsO);
    } else if (all(greaterThan(cid, vec2(0.93)))) {  // background clear
      vis = anyAdj;
    } else {
      float cd = texture2D(tDepth, uv).r;
      vis = anyAdj && d <= cd + vEpsS;
    }
    if (!vis) discard;
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`,O=`
  attribute vec2 aFace;
  varying vec2 vFace;
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vFace = aFace;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,R=`
  uniform vec4 uClip;
  varying vec2 vFace;
  varying vec3 vWorldPos;
  void main() {
    if (dot(uClip.xyz, vWorldPos) + uClip.w < 0.0) discard;
    gl_FragColor = vec4(vFace, 0.0, 1.0);
  }
`;export{R as FACE_ID_FRAG,O as FACE_ID_VERT,N as FACE_LINE_FRAG,k as FACE_LINE_VERT,T as deriveFaces,P as faceIdsAllocated,m as faceLineGeometry,W as opaqueFaceId,z as prepassFaceGeometry};
