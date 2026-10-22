import * as THREE from 'three';

// A stylised mountain landscape, intentionally not a geographic map.
export function mountTerrain(host,reduced){
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:innerWidth>700,powerPreference:'low-power'});}catch{host.classList.add('terrain-fallback');return ()=>{};}
 const small=innerWidth<700;
 renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.25:1.6));host.append(renderer.domElement);
 renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,5.7,9.8);camera.lookAt(0,.25,0);
 const group=new THREE.Group();scene.add(group);group.rotation.y=-.42;
 const n=small?48:76;const geo=new THREE.PlaneGeometry(10,7,n,n);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let y=0;const peaks=[[-2,-.7,2.5,1.1],[.15,-1.1,3.9,1.2],[2.2,-.5,2.7,.95],[1.1,1.4,1.5,1.3],[-2.3,1.5,1.2,1.2]];for(const [px,pz,h,w] of peaks){const d=Math.hypot(x-px,(z-pz)*1.18);y=Math.max(y,Math.max(0,h-d*w));}y+=Math.sin(x*5.1+z*3.2)*.10+Math.sin(z*8.2-x*2.1)*.08;y*=Math.min(1,Math.max(0,(5-Math.abs(x))*.8),Math.max(0,(3.5-Math.abs(z))*.9));pos.setY(i,y-.8);}
 geo.computeVertexNormals();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x31190e,metalness:.35,roughness:.85,flatShading:true,transparent:true,opacity:.94}));group.add(mesh);
 const wire=new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:0xff732b,transparent:true,opacity:.29}));wire.position.y=.008;group.add(wire);
 const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,22),new THREE.LineBasicMaterial({color:0xff8a45,transparent:true,opacity:.45}));edges.position.y=.012;group.add(edges);
 scene.add(new THREE.AmbientLight(0xffbd92,1.3));const key=new THREE.DirectionalLight(0xff822f,5);key.position.set(-3,7,3);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,1.5);rim.position.set(4,4,-4);scene.add(rim);
 const points=[];for(let i=0;i<60;i++){const t=i*2.39996,r=2+Math.sqrt(i)*.34;points.push(Math.cos(t)*r,Math.sin(i*7)*1.2+1.5,Math.sin(t)*r);}
 const particlesGeo=new THREE.BufferGeometry();particlesGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));const particles=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xff9452,size:.022,transparent:true,opacity:.6}));group.add(particles);
 const target={x:0,y:0};const move=e=>{target.x=(e.clientX/innerWidth-.5)*.3;target.y=(e.clientY/innerHeight-.5)*.1;};window.addEventListener('pointermove',move,{passive:true});
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
 let visible=true;const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});visibility.observe(host);
 const start=performance.now();const draw=time=>{if(!visible||document.hidden)return;const t=(time-start)*.001;const scroll=Math.min(window.scrollY/innerHeight,1);if(!reduced){group.rotation.y+=(-.42+target.x+Math.sin(t*.16)*.08-group.rotation.y)*.035;group.rotation.x+=(target.y+scroll*.12-group.rotation.x)*.035;particles.rotation.y=t*.025;}renderer.render(scene,camera);};
 if(reduced){draw(start);}else renderer.setAnimationLoop(draw);
 const lost=e=>{e.preventDefault();renderer.setAnimationLoop(null);host.classList.add('terrain-fallback');};renderer.domElement.addEventListener('webglcontextlost',lost);
 return()=>{renderer.setAnimationLoop(null);resizeObserver.disconnect();visibility.disconnect();window.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});renderer.dispose();renderer.domElement.remove();};
}
