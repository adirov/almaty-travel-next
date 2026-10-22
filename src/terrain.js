import * as THREE from 'three';

export function mountTerrain(host, reduced) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:innerWidth>760,powerPreference:'low-power'});}
  catch {host.classList.add('terrain-fallback');return()=>{};}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.25:1.6));
  renderer.setClearColor(0x090909,1);
  host.append(renderer.domElement);
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x090909,.038);
  const camera=new THREE.PerspectiveCamera(52,1,.1,90);
  const landscape=new THREE.Group();scene.add(landscape);
  const segments=innerWidth<760?90:146;
  const geometry=new THREE.PlaneGeometry(48,44,segments,segments);
  geometry.rotateX(-Math.PI/2);
  const positions=geometry.attributes.position;
  const peaks=[[-11,-10,6.7,1.25],[-5,-11,8.2,1.35],[3,-10,9,1.25],[10,-9,7,1.2],[17,-13,7.6,1.1],[-16,-4,5,1.3],[-7,-1,4.8,1.1],[3,-1,5.3,1.1],[11,2,5.5,1.2],[-12,8,3.6,1.3],[1,8,3.5,1.1],[15,12,4.5,1.25]];
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i);
    let height=.1;
    for(const [px,pz,h,falloff] of peaks)height=Math.max(height,h-Math.hypot(x-px,(z-pz)*1.12)*falloff);
    const ridges=Math.sin(x*2.4+z*1.2)*.16+Math.sin(z*4-x*1.7)*.1+Math.cos(x*6.3+z*2.8)*.07;
    positions.setY(i,height+ridges-1.1);
  }
  geometry.computeVertexNormals();
  landscape.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0x22130c,metalness:.3,roughness:.92,flatShading:true})));
  const wire=new THREE.LineSegments(new THREE.WireframeGeometry(geometry),new THREE.LineBasicMaterial({color:0xe77032,transparent:true,opacity:.28}));wire.position.y=.012;landscape.add(wire);
  scene.add(new THREE.AmbientLight(0xffad77,1.15));
  const light=new THREE.DirectionalLight(0xff8138,4);light.position.set(0,13,5);scene.add(light);
  const rim=new THREE.DirectionalLight(0xffceae,1.3);rim.position.set(-10,8,-15);scene.add(rim);
  let narrow=false;
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;narrow=w<760;camera.aspect=w/h;camera.fov=narrow?63:52;camera.position.set(narrow?4:1.5,narrow?4.6:4.1,narrow?12:10);camera.lookAt(narrow?3:0,1.8,-7);camera.updateProjectionMatrix();renderer.setSize(w,h);if(reduced)renderer.render(scene,camera);};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  const pointer={x:0,y:0};
  const move=e=>{pointer.x=(e.clientX/innerWidth-.5)*.25;pointer.y=(e.clientY/innerHeight-.5)*.1;};
  window.addEventListener('pointermove',move,{passive:true});
  let visible=true,lastFrame=0;
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});visibility.observe(host);
  const start=performance.now();
  const draw=time=>{
    if(!visible||document.hidden||time-lastFrame<(narrow?32:16))return;
    lastFrame=time;
    const t=(time-start)/1000;
    if(!reduced){landscape.rotation.y+=(pointer.x*.12+Math.sin(t*.1)*.014-landscape.rotation.y)*.035;landscape.rotation.x+=(pointer.y*.09+Math.min(scrollY/host.clientHeight,1)*.035-landscape.rotation.x)*.025;}
    renderer.render(scene,camera);
  };
  renderer.render(scene,camera);
  if(!reduced)renderer.setAnimationLoop(draw);
  const lost=e=>{e.preventDefault();renderer.setAnimationLoop(null);host.classList.add('terrain-fallback');renderer.domElement.style.visibility='hidden';};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{renderer.setAnimationLoop(null);resizeObserver.disconnect();visibility.disconnect();window.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();renderer.domElement.remove();};
}
