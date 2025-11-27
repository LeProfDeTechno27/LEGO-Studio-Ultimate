import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { TransformControls } from 'three-stdlib';
import { BrickInstance } from '../types';

interface Options {
  onSelect: (id: string | null) => void;
}

export const useThreeScene = ({ onSelect }: Options) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const transformRef = useRef<TransformControls>();
  const meshesRef = useRef<Record<string, THREE.Mesh>>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const transform = new TransformControls(camera, renderer.domElement);
    transform.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    sceneRef.current.add(transform);
    transformRef.current = transform;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(10, 10, 10);
    sceneRef.current.add(ambient);
    sceneRef.current.add(directional);
    const grid = new THREE.GridHelper(100, 100);
    sceneRef.current.add(grid);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onPointerDown = (event: MouseEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(meshesRef.current));
      if (intersects.length > 0) {
        const id = Object.entries(meshesRef.current).find(([, mesh]) => mesh === intersects[0].object)?.[0] ?? null;
        onSelect(id);
      } else {
        onSelect(null);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onSelect]);

  const syncBricks = (bricks: BrickInstance[]) => {
    const scene = sceneRef.current;
    bricks.forEach((brick) => {
      let mesh = meshesRef.current[brick.id];
      const needsGeometryUpdate = (geometry: THREE.BoxGeometry) => {
        const { width, height, depth } = geometry.parameters;
        return width !== brick.scale.x || height !== brick.scale.y || depth !== brick.scale.z;
      };

      if (!mesh) {
        const geometry = new THREE.BoxGeometry(brick.scale.x, brick.scale.y, brick.scale.z);
        const material = new THREE.MeshStandardMaterial({ color: brick.color });
        mesh = new THREE.Mesh(geometry, material);
        meshesRef.current[brick.id] = mesh;
        scene.add(mesh);
      } else if (mesh.geometry instanceof THREE.BoxGeometry && needsGeometryUpdate(mesh.geometry)) {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(brick.scale.x, brick.scale.y, brick.scale.z);
      }

      mesh.name = brick.id;
      mesh.position.set(brick.position.x, brick.position.y, brick.position.z);
      mesh.rotation.set(brick.rotation.x, brick.rotation.y, brick.rotation.z);
      mesh.visible = brick.visible;

      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.set(brick.color);
    });
    Object.keys(meshesRef.current).forEach((id) => {
      if (!bricks.find((b) => b.id === id)) {
        scene.remove(meshesRef.current[id]);
        delete meshesRef.current[id];
      }
    });
  };

  const attachTransform = (brickId: string | null) => {
    if (!transformRef.current) return;
    if (!brickId) {
      transformRef.current.detach();
      return;
    }
    const mesh = meshesRef.current[brickId];
    if (mesh) transformRef.current.attach(mesh);
  };

  return { containerRef, rendererRef, sceneRef, cameraRef, transformRef, syncBricks, attachTransform };
};
