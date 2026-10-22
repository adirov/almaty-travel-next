import * as THREE from 'three';
import canyonPhoto from './assets/charyn.jpg';

export function mountHeroPhoto(host, reduced) {
  if (reduced) return () => {};
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); }
  catch { return () => {}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.2 : 1.5));
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const uniforms = {
    photo: { value: null },
    cover: { value: new THREE.Vector2(1, 1) },
    focus: { value: new THREE.Vector2(.58, .52) },
    offset: { value: new THREE.Vector2(0, 0) },
  };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 photoUv;
      void main(){photoUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`,
    fragmentShader: `uniform sampler2D photo;
      uniform vec2 cover; uniform vec2 focus; uniform vec2 offset;
      varying vec2 photoUv;
      void main(){
        vec2 uv=(photoUv-.5)*cover/1.065+focus;
        float nearPlane=smoothstep(.1,.95,1.0-photoUv.y);
        uv+=offset*cover*(.3+.7*nearPlane);
        gl_FragColor=vec4(texture2D(photo,uv).rgb,1.0);
        #include <colorspace_fragment>
      }`,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(geometry, material));
  let texture, ready = false, alive = true, visible = true, lastFrame = 0;
  let imageAspect = 1760 / 985;
  const pointer = { x: 0, y: 0 };
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const move = event => {
    if (!hover.matches) return;
    pointer.x = (event.clientX / innerWidth - .5) * .012;
    pointer.y = (.5 - event.clientY / innerHeight) * .008;
  };
  const reset = () => { pointer.x = 0; pointer.y = 0; };
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    const aspect = w / h;
    uniforms.cover.value.set(Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
    // Keep the canyon walls in the portrait crop without changing the photograph.
    uniforms.focus.value.set(w < 760 ? .63 : .5, .5);
  };
  const start = performance.now();
  const draw = time => {
    if (!ready || time - lastFrame < 32) return;
    lastFrame = time;
    const t = (time - start) * .001;
    uniforms.offset.value.x += (pointer.x + Math.sin(t * .13) * .0015 - uniforms.offset.value.x) * .035;
    uniforms.offset.value.y += (pointer.y + Math.sin(t * .1) * .0007 - uniforms.offset.value.y) * .035;
    renderer.render(scene, camera);
  };
  const sync = () => renderer.setAnimationLoop(alive && ready && visible && !document.hidden ? draw : null);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  intersection.observe(host);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', sync);
  const lost = event => { event.preventDefault(); ready = false; host.classList.remove('photo-ready'); sync(); };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  resize();
  new THREE.TextureLoader().load(canyonPhoto, loaded => {
    if (!alive) { loaded.dispose(); return; }
    texture = loaded;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    uniforms.photo.value = texture;
    imageAspect = texture.image.width / texture.image.height;
    resize();
    ready = true;
    renderer.render(scene, camera);
    host.classList.add('photo-ready');
    sync();
  }, undefined, () => { ready = false; sync(); });
  return () => {
    alive = false;
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect(); intersection.disconnect();
    window.removeEventListener('pointermove', move); window.removeEventListener('blur', reset);
    document.removeEventListener('visibilitychange', sync);
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    geometry.dispose(); material.dispose(); texture?.dispose(); renderer.dispose();
    renderer.domElement.remove(); host.classList.remove('photo-ready');
  };
}
