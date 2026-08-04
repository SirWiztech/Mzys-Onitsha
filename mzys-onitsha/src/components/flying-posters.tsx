'use client';

import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl';

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function map(num: number, min1: number, max1: number, min2: number, max2: number) {
  const num1 = (num - min1) / (max1 - min1);
  return num1 * (max2 - min2) + min2;
}

interface Screen {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

class Media {
  extra = 0;
  gl: any;
  geometry: Plane;
  scene: Transform;
  screen: Screen;
  viewport: Viewport;
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  program!: Program;
  plane!: Mesh;
  height = 0;
  heightTotal = 0;
  y = 0;
  padding = 5;

  constructor({ gl, geometry, scene, screen, viewport, image, length, index, planeWidth, planeHeight, distortion }: {
    gl: any;
    geometry: Plane;
    scene: Transform;
    screen: Screen;
    viewport: Viewport;
    image: string;
    length: number;
    index: number;
    planeWidth: number;
    planeHeight: number;
    distortion: number;
  }) {
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.image = image;
    this.length = length;
    this.index = index;
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.distortion = distortion;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 },
      },
      cullFace: false,
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  setScale() {
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height;
    this.plane.position.x = 0;
    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  onResize({ screen, viewport }: { screen?: Screen; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height];
    }
    this.setScale();

    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
  }

  update(scroll: { current: number }) {
    this.plane.position.y = this.y - scroll.current - this.extra;

    const position = map(this.plane.position.y, -this.viewport.height, this.viewport.height, 5, 15);

    this.program.uniforms.uPosition.value = position;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current;

    const planeHeight = this.plane.scale.y;
    const viewportHeight = this.viewport.height;

    const topEdge = this.plane.position.y + planeHeight / 2;
    const bottomEdge = this.plane.position.y - planeHeight / 2;

    if (topEdge < -viewportHeight / 2) {
      this.extra -= this.heightTotal;
    } else if (bottomEdge > viewportHeight / 2) {
      this.extra += this.heightTotal;
    }
  }
}

interface CanvasInstance {
  destroy: () => void;
  onWheel: (e: WheelEvent) => void;
}

function createCanvas({ container, canvas, items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ, autoSpeed = 0.003 }: {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  items: string[];
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  scrollEase: number;
  cameraFov: number;
  cameraZ: number;
  autoSpeed?: number;
}): CanvasInstance {
  const scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
  let isDown = false;
  let scrollPosition = 0;
  let startY = 0;

  const renderer = new Renderer({
    canvas,
    alpha: true,
    antialias: true,
    dpr: Math.min(window.devicePixelRatio, 2),
  });
  const gl = renderer.gl;

  const camera = new Camera(gl);
  camera.fov = cameraFov;
  camera.position.z = cameraZ;

  const scene = new Transform();

  const planeGeometry = new Plane(gl, { heightSegments: 1, widthSegments: 100 });

  let screen: Screen = { width: container.getBoundingClientRect().width, height: container.getBoundingClientRect().height };
  let viewport: Viewport;

  const fov = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * (gl.canvas.width / gl.canvas.height);
  viewport = { height, width };

  renderer.setSize(screen.width, screen.height);
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });

  const medias = items.map((image, index) => {
    return new Media({
      gl,
      geometry: planeGeometry,
      scene,
      screen,
      viewport,
      image,
      length: items.length,
      index,
      planeWidth,
      planeHeight,
      distortion,
    });
  });

  const onResize = () => {
    const rect = container.getBoundingClientRect();
    screen = { width: rect.width, height: rect.height };
    renderer.setSize(screen.width, screen.height);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    const fovRad = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const w = h * camera.aspect;
    viewport = { height: h, width: w };
    medias.forEach(m => m.onResize({ screen, viewport }));
  };

  const onWheel = (e: WheelEvent) => {
    scroll.target += e.deltaY * 0.005;
  };

  const onTouchDown = (e: MouseEvent | TouchEvent) => {
    isDown = true;
    scrollPosition = scroll.current;
    startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const onTouchMove = (e: MouseEvent | TouchEvent) => {
    if (!isDown) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const distance = (startY - y) * 0.1;
    scroll.target = scrollPosition + distance;
  };

  const onTouchUp = () => { isDown = false; };

  const update = () => {
    scroll.target += autoSpeed;
    scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
    medias.forEach(m => m.update(scroll));
    renderer.render({ scene, camera });
    scroll.last = scroll.current;
    requestAnimationFrame(update);
  };

  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('mousedown', onTouchDown);
  window.addEventListener('mousemove', onTouchMove);
  window.addEventListener('mouseup', onTouchUp);
  window.addEventListener('touchstart', onTouchDown);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchUp);

  requestAnimationFrame(update);

  return {
    onWheel,
    destroy: () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);
      window.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
    },
  };
}

interface FlyingPostersProps {
  items?: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  autoSpeed?: number;
  className?: string;
}

export default function FlyingPosters({
  items = [],
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.1,
  cameraFov = 45,
  cameraZ = 20,
  autoSpeed = 0.003,
  className,
}: FlyingPostersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<CanvasInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    instanceRef.current = createCanvas({
      container: containerRef.current,
      canvas: canvasRef.current,
      items,
      planeWidth,
      planeHeight,
      distortion,
      scrollEase,
      cameraFov,
      cameraZ,
      autoSpeed,
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (instanceRef.current) {
        instanceRef.current.onWheel(e);
      }
    };

    canvasEl.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      canvasEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden relative z-2 ${className ?? ''}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
