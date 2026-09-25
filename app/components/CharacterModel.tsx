"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function CharacterModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Key front-right light
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Fill soft-blue/cyan light from left (matching night/day ethereal tone)
    const fillLight = new THREE.DirectionalLight(0x88b5e5, 1.8);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Luminous rim/hair light from top-rear
    const rimLight = new THREE.DirectionalLight(0xffe8c0, 3.2);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Subtle bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0x4a6984, 1.0);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 3. Pivot hierarchy for natural head/eye tracking
    const pivot = new THREE.Group();
    scene.add(pivot);

    // Target rotations for cursor tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let targetRotZ = 0;

    // 4. Load the GLB Model
    const loader = new GLTFLoader();
    const modelUrl = "/3d-model/stylized+character+3d+model.glb";

    let characterModel: THREE.Group | null = null;

    loader.load(
      modelUrl,
      (gltf) => {
        characterModel = gltf.scene;

        // Compute bounding box to center the model perfectly at eye/chest level
        const box = new THREE.Box3().setFromObject(characterModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Normalize scale to fit harmoniously in the viewport - reduced by 40%
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 1.35 / maxDim; // 40% smaller (2.25 * 0.6 = 1.35)
        characterModel.scale.setScalar(targetScale);

        // Center on pivot so rotation happens naturally around the head & upper torso
        // The head is in the upper half of the mesh, so we offset slightly lower to make the head the focal turn
        characterModel.position.set(
          -center.x * targetScale,
          (-center.y - size.y * 0.12) * targetScale,
          -center.z * targetScale
        );

        // Enhance material quality
        characterModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.4);
              mat.metalness = Math.min(mat.metalness, 0.2);
              mat.needsUpdate = true;
            }
          }
        });

        pivot.add(characterModel);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB character model:", error);
      }
    );

    // 5. Track cursor relative to character position on screen
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      // Normalized offset from character's center
      const dx = (e.clientX - charCenterX) / (window.innerWidth * 0.7);
      const dy = (e.clientY - charCenterY) / (window.innerHeight * 0.7);

      // Natural gaze angles clamped within ergonomic human range
      targetRotY = Math.max(-0.65, Math.min(0.85, dx * 0.75));
      targetRotX = Math.max(-0.38, Math.min(0.35, -dy * 0.48));
      targetRotZ = -targetRotY * 0.08;
    };

    const handleMouseLeave = () => {
      // Smoothly return to gentle idle gaze looking slightly inward toward hero content
      targetRotX = 0;
      targetRotY = 0.12;
      targetRotZ = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop with Organic Easing & Idle Breathing
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Subtle organic breathing motion
      const breathOffsetY = Math.sin(elapsedTime * 1.8) * 0.025;
      const breathRotX = Math.sin(elapsedTime * 1.8) * 0.015;

      // Smooth lerp easing toward target cursor orientation
      const lerpSpeed = 0.08;
      pivot.rotation.y += (targetRotY - pivot.rotation.y) * lerpSpeed;
      pivot.rotation.x += (targetRotX + breathRotX - pivot.rotation.x) * lerpSpeed;
      pivot.rotation.z += (targetRotZ - pivot.rotation.z) * lerpSpeed;
      pivot.position.y += (breathOffsetY - pivot.position.y) * lerpSpeed;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none flex items-center justify-center transition-opacity duration-700 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    />
  );
}
