/**
 * はたんゲーム 12 - Post-processing Effects
 * 
 * Dynamic visual effects driven by game state
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { EffectComposer, Vignette, Bloom, Noise, ChromaticAberration, DepthOfField, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Vector2 } from 'three';
import { useGameStore } from '@/app/stores/gameStore';

export function Effects() {
  const gamePhase = useGameStore((state: any) => state.gamePhase);
  const activeItemsCount = useGameStore((state: any) => state.activeItems.length);
  const fallSpeed = useGameStore((state: any) => state.fallSpeed);
  const score = useGameStore((state: any) => state.score);
  
  // Refs for animated values
  const chromaAberrationRef = useRef<any>(null);
  const bloomRef = useRef<any>(null);
  
  // State for dynamic effect triggers
  const [glitchActive, setGlitchActive] = useState(false);
  const [chromaSpike, setChromaSpike] = useState(0);
  const [bloomPulse, setBloomPulse] = useState(0);
  
  // Previous values for change detection
  const prevScoreRef = useRef(score);
  const prevPhaseRef = useRef(gamePhase);
  
  // Calculate vignette intensity based on stack count
  // More items = darker vignette = more visual stress
  const vignetteIntensity = 0.3 + (activeItemsCount / 10) * 0.4; // 0.3 to 0.7
  const vignetteDarkness = 0.5 + (activeItemsCount / 10) * 0.3; // 0.5 to 0.8
  
  // Calculate noise intensity based on fall speed
  // Higher speed = more chaos = more noise
  const noiseIntensity = 0.15 + ((fallSpeed - 1.0) / 2.0) * 0.25; // 0.15 to 0.4
  
  // Base chromatic aberration from fall speed
  const baseChromaOffset = 0.0005 + ((fallSpeed - 1.0) / 2.0) * 0.0015; // 0.0005 to 0.002
  
  // Bloom intensity with subtle pulse
  const baseBloomIntensity = 0.4;
  const bloomIntensity = baseBloomIntensity + bloomPulse;
  
  // Detect score changes (successful classification) -> bloom pulse
  useEffect(() => {
    if (score > prevScoreRef.current && gamePhase === 'playing') {
      // Trigger bloom pulse
      setBloomPulse(0.3);
      
      // Trigger chromatic aberration spike (rule change happens on classification)
      setChromaSpike(0.003);
      
      // Fade out over time
      const timeout = setTimeout(() => {
        setBloomPulse(0);
        setChromaSpike(0);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
    prevScoreRef.current = score;
  }, [score, gamePhase]);
  
  // Detect game over -> glitch effect
  useEffect(() => {
    if (gamePhase === 'gameover' && prevPhaseRef.current === 'playing') {
      setGlitchActive(true);
      
      // Disable glitch after animation
      const timeout = setTimeout(() => {
        setGlitchActive(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
    prevPhaseRef.current = gamePhase;
  }, [gamePhase]);
  
  // Animate chromatic aberration spike decay
  useEffect(() => {
    if (chromaSpike > 0) {
      const interval = setInterval(() => {
        setChromaSpike((prev: number) => Math.max(0, prev - 0.0002));
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
  }, [chromaSpike]);
  
  // Animate bloom pulse decay
  useEffect(() => {
    if (bloomPulse > 0) {
      const interval = setInterval(() => {
        setBloomPulse((prev: number) => Math.max(0, prev - 0.02));
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
  }, [bloomPulse]);
  
  return (
    <EffectComposer multisampling={4}>
      <>
        {/* Vignette - Focus attention on center, increases with stack count */}
        <Vignette
          offset={vignetteIntensity}
          darkness={vignetteDarkness}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
        
        {/* Bloom - Glow on white text, pulses on successful classification */}
        <Bloom
          ref={bloomRef}
          intensity={bloomIntensity}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur={true}
          blendFunction={BlendFunction.ADD}
        />
        
        {/* Noise/Grain - Film grain increases with fall speed */}
        <Noise
          opacity={noiseIntensity}
          blendFunction={BlendFunction.OVERLAY}
        />
        
        {/* Chromatic Aberration - RGB separation for "breakdown" feel */}
        {/* Increases with fall speed, spikes on rule changes */}
        <ChromaticAberration
          ref={chromaAberrationRef}
          offset={new Vector2(baseChromaOffset + chromaSpike, baseChromaOffset + chromaSpike)}
          blendFunction={BlendFunction.NORMAL}
        />
        
        {/* Depth of Field - Blur background items, focus on bottom */}
        {/* Only active when multiple items are stacked */}
        {activeItemsCount > 3 ? (
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.05}
            bokehScale={2}
            height={480}
          />
        ) : null}
        
        {/* Glitch - Digital corruption on game over */}
        {glitchActive ? (
          <Glitch
            delay={new Vector2(0.5, 1.0)}
            duration={new Vector2(0.1, 0.3)}
            strength={new Vector2(0.3, 0.5)}
            mode={GlitchMode.SPORADIC}
            active={true}
            ratio={0.85}
          />
        ) : null}
      </>
    </EffectComposer>
  );
}
