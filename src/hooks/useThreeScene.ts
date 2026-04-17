import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { TransformControls } from 'three-stdlib';
import { BrickInstance, Vector3 as Vec3 } from '../types';

export type TransformMode = 'translate' | 'rotate' | 'scale';

interface TransformSnapshot {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

interface Options {
  onSelect: (id: string | null) => void;
  onTransformEnd?: (id: string, transform: TransformSnapshot) => void;
  // Fired when the user clicks on empty canvas (no brick, no gizmo handle).
  // The point is in world coordinates, raycast against y = 0.5 so placement
  // lands on top of the ground plane regardless of camera angle.
  onPlace?: (worldPosition: Vec3) => void;
}

export const useThreeScene = (options: Options) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const transformRef = useRef<TransformControls>();
  const meshesRef = useRef<Record<string, THREE.Mesh>>({});

  // Keep callbacks fresh without re-running the mount effect. Mounting must
  // be stable (single canvas, single renderer) even when parents re-render
  // and pass new inline callback identities.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
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
      if (event.value === false) {
        const mesh = transform.object as THREE.Mesh | undefined;
        const cb = optionsRef.current.onTransformEnd;
        if (mesh && mesh.name && cb) {
          cb(mesh.name, {
            position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
            scale: { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z },
          });
        }
      }
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
    // Placement plane sits at the brick's resting Y (0.5) so single-click
    // placement lands on top of the floor at any camera angle.
    const placementPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);
    // Only treat a pointerdown/up pair as a click if the pointer barely
    // moved. This lets users orbit the camera without placing a brick on
    // mouseup (previous behaviour fired `click` after any drag).
    let downX = 0;
    let downY = 0;
    let downOnGizmo = false;
    const onPointerDown = (event: MouseEvent) => {
      downX = event.clientX;
      downY = event.clientY;
      // If the user is pressing a TransformControls handle, let the gizmo
      // drive the drag. Without this guard the raycast-miss branch below
      // would deselect the brick, detaching the gizmo before it can
      // process the drag.
      downOnGizmo = Boolean(transform.axis);
      if (downOnGizmo) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(meshesRef.current));
      if (intersects.length > 0) {
        const id =
          Object.entries(meshesRef.current).find(([, mesh]) => mesh === intersects[0].object)?.[0] ?? null;
        optionsRef.current.onSelect(id);
      } else {
        optionsRef.current.onSelect(null);
      }
    };
    const onPointerUp = (event: MouseEvent) => {
      if (downOnGizmo) return;
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy > 25) return; // dragged — treat as orbit, not click
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(meshesRef.current));
      if (intersects.length > 0) return; // click hit an existing brick — don't place
      const worldPoint = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(placementPlane, worldPoint)) return;
      optionsRef.current.onPlace?.({ x: worldPoint.x, y: worldPoint.y, z: worldPoint.z });
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      try {
        transform.detach();
        transform.dispose();
      } catch {
        /* TransformControls older builds may not implement dispose */
      }
      sceneRef.current.remove(transform);
      // IMPORTANT: remove the appended <canvas> element. Without this the
      // cleanup from a previous mount (StrictMode double-invoke or a parent
      // re-render passing a new callback identity) leaves an orphan canvas
      // in the container, stacking dead canvases that swallow clicks.
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // Run once. Callbacks are read through optionsRef so new inline arrow
    // identities don't tear down and re-create the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncBricks = useCallback((bricks: BrickInstance[]) => {
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
        // Geometry size now carries the brick's dimensions, so reset the
        // mesh's local scale to identity (it may have been left non-unit
        // by a previous TransformControls scale drag).
        mesh.scale.set(1, 1, 1);
      }

      mesh.name = brick.id;
      // Read primitives off the (possibly frozen) Redux brick. Never assign
      // brick.position / brick.rotation / brick.scale onto a Three.js
      // Vector3/Euler via `copy()` or direct assignment — Immer freezes the
      // payload and the shared reference makes THREE throw
      // "Cannot assign to read only property 'x'".
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
  }, []);

  const attachTransform = useCallback((brickId: string | null) => {
    if (!transformRef.current) return;
    if (!brickId) {
      transformRef.current.detach();
      return;
    }
    const mesh = meshesRef.current[brickId];
    if (mesh) transformRef.current.attach(mesh);
  }, []);

  const setTransformMode = useCallback((mode: TransformMode) => {
    transformRef.current?.setMode(mode);
  }, []);

  return {
    containerRef,
    rendererRef,
    sceneRef,
    cameraRef,
    transformRef,
    syncBricks,
    attachTransform,
    setTransformMode,
  };
};
