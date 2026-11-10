import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeJsSpec, ThreeJsNode } from '../types/curriculum';
import { RotateCw, ZoomIn, ZoomOut, Info, Sliders, Play } from 'lucide-react';

interface ThreeJsVisualizerProps {
  spec: ThreeJsSpec;
}

export const ThreeJsVisualizer: React.FC<ThreeJsVisualizerProps> = ({ spec }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ThreeJsNode | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    spec.interactiveControls.forEach((ctrl) => {
      initial[ctrl.name] = ctrl.default ?? (ctrl.type === 'toggle' ? false : 0);
    });
    return initial;
  });

  // Re-sync controls if spec changes
  useEffect(() => {
    const initial: Record<string, any> = {};
    spec.interactiveControls.forEach((ctrl) => {
      initial[ctrl.name] = ctrl.default ?? (ctrl.type === 'toggle' ? false : 0);
    });
    setControlValues(initial);
    setSelectedNode(null);
  }, [spec]);

  const handleControlChange = (name: string, value: any) => {
    setControlValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.02);

    const camera = new THREE.PerspectiveCamera(
      spec.camera.fov || 45,
      width / height,
      0.1,
      1000
    );
    camera.position.set(...spec.camera.position);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.replaceChildren(renderer.domElement);

    // 3. Grid & Lights
    const gridHelper = new THREE.GridHelper(40, 40, 0x1E293B, 0x0F172A);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 1.2);
    dirLight1.position.set(20, 25, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818CF8, 0.9);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // 4. Build Nodes
    const nodeGroup = new THREE.Group();
    const meshMap = new Map<string, THREE.Mesh>();

    spec.nodes.forEach((node) => {
      const geometry = new THREE.SphereGeometry(node.radius || 1, 32, 32);
      const color = new THREE.Color(node.color || '#38BDF8');
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.25,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = { nodeData: node };

      // Outer glow wireframe halo
      const haloGeo = new THREE.SphereGeometry((node.radius || 1) * 1.35, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      nodeGroup.add(mesh);
      meshMap.set(node.id, mesh);
    });
    scene.add(nodeGroup);

    // 5. Build Edges & Animated Pulses
    const edgeGroup = new THREE.Group();
    const pulseObjects: { mesh: THREE.Mesh; p1: THREE.Vector3; p2: THREE.Vector3; progress: number; speed: number }[] = [];

    spec.edges.forEach((edge) => {
      const srcMesh = meshMap.get(edge.source);
      const tgtMesh = meshMap.get(edge.target);
      if (!srcMesh || !tgtMesh) return;

      const p1 = srcMesh.position;
      const p2 = tgtMesh.position;

      // Connecting line
      const points = [p1, p2];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: edge.animated ? 0x38BDF8 : 0x475569,
        transparent: true,
        opacity: edge.animated ? 0.65 : 0.25,
        linewidth: edge.animated ? 2 : 1,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      edgeGroup.add(line);

      // Traveling pulse particle
      if (edge.animated) {
        const pulseGeo = new THREE.SphereGeometry(0.22, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0x34D399 });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        edgeGroup.add(pulseMesh);
        pulseObjects.push({
          mesh: pulseMesh,
          p1,
          p2,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.004,
        });
      }
    });
    scene.add(edgeGroup);

    // 6. Camera Orbit Controls (Pointer-based)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical().setFromVector3(camera.position);

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.007;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.007));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(10, Math.min(80, spherical.radius + e.deltaY * 0.04));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
    };

    // 7. Raycasting for Clicking Nodes
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(nodeGroup.children, true);
      if (intersects.length > 0) {
        let hit: any = intersects[0].object;
        while (hit && !hit.userData?.nodeData && hit.parent) {
          hit = hit.parent;
        }
        if (hit?.userData?.nodeData) {
          setSelectedNode(hit.userData.nodeData);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle auto-rotation
      if (!isDragging) {
        nodeGroup.rotation.y += 0.0015;
        edgeGroup.rotation.y += 0.0015;
      }

      // Update pulse particles
      pulseObjects.forEach((item) => {
        item.progress += item.speed;
        if (item.progress > 1) item.progress = 0;
        item.mesh.position.lerpVectors(item.p1, item.p2, item.progress);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [spec]);

  return (
    <div className="flex flex-col h-full bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      {/* 3D Scene Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur z-10">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <h3 className="text-sm font-semibold text-white tracking-wide">{spec.sceneTitle}</h3>
            <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">
              WebGL 3D
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{spec.description}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="hidden sm:inline">Drag to Orbit • Scroll to Zoom</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 min-h-[460px] w-full" ref={mountRef}>
        {/* Clicked Node Detail Card Overlay */}
        {selectedNode && (
          <div className="absolute top-4 left-4 z-20 w-80 bg-slate-900/95 border border-sky-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
                <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-300 font-mono">
              <div className="text-slate-400">Type: <span className="text-sky-300">{selectedNode.type}</span></div>
              <div className="text-slate-400">Position: [{selectedNode.position.join(', ')}]</div>
              {selectedNode.metrics && (
                <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Telemetry Metrics</div>
                  {Object.entries(selectedNode.metrics).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-slate-300">
                      <span>{k}:</span>
                      <span className="text-emerald-400 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar at Bottom */}
      {spec.interactiveControls.length > 0 && (
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 z-10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 mb-3 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Hyper-Parameter & Topology Controls</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spec.interactiveControls.map((ctrl) => (
              <div key={ctrl.name} className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-slate-300 font-medium">{ctrl.label}</span>
                  <span className="text-xs font-mono text-sky-400 font-bold">
                    {ctrl.type === 'toggle' ? (controlValues[ctrl.name] ? 'ACTIVE' : 'OFF') : controlValues[ctrl.name]}
                  </span>
                </div>
                {ctrl.type === 'slider' && (
                  <input
                    type="range"
                    min={ctrl.min ?? 0}
                    max={ctrl.max ?? 100}
                    step={ctrl.step ?? 1}
                    value={controlValues[ctrl.name] ?? ctrl.default ?? 0}
                    onChange={(e) => handleControlChange(ctrl.name, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                )}
                {ctrl.type === 'toggle' && (
                  <button
                    onClick={() => handleControlChange(ctrl.name, !controlValues[ctrl.name])}
                    className={`w-full py-1 px-3 text-xs font-mono rounded transition-colors ${
                      controlValues[ctrl.name]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {controlValues[ctrl.name] ? '✓ Enabled' : '○ Disabled'}
                  </button>
                )}
                {ctrl.type === 'button' && (
                  <button
                    onClick={() => alert(`Triggered event: ${ctrl.label}`)}
                    className="w-full py-1 px-3 text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded hover:bg-sky-500/30 transition-colors"
                  >
                    ▶ Fire Event
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
