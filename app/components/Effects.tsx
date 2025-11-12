/**
 * はたんゲーム 12 - Post-processing Effects
 * 
 * Dynamic visual effects driven by game state
 */

'use client';

import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

export function Effects() {
  // Local state for animations - avoid Zustand to prevent cyclic references
  const [bloomIntensity, setBloomIntensity] = useState(2.0);
  const [vignetteOffset, setVignetteOffset] = useState(0.3);
  
  // Pulse animation for bloom
  useEffect(() => {
    const interval = setInterval(() => {
      setBloomIntensity((prev) => {
        const time = Date.now() / 1000;
        return 1.5 + Math.sin(time * 2) * 0.5; // Pulse between 1.0 and 2.0
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <EffectComposer multisampling={8}>
      {/* Multiple Bloom passes for intense glow */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur={true}
        kernelSize={KernelSize.HUGE}
        blendFunction={BlendFunction.ADD}
      />
      
      {/* Second bloom layer for extra glow */}
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.5}
        mipmapBlur={true}
        kernelSize={KernelSize.LARGE}
        blendFunction={BlendFunction.SCREEN}
      />
      
      {/* Vignette for focus */}
      <Vignette
        offset={vignetteOffset}
        darkness={0.6}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
      
      {/* Noise for texture */}
      <Noise
        opacity={0.2}
        blendFunction={BlendFunction.OVERLAY}
      />
      
      {/* Chromatic aberration for glitch effect */}
      <ChromaticAberration
        offset={[0.002, 0.002] as any}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
