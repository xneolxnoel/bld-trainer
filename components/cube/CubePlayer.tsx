"use client";

import { useEffect, useRef, useState } from "react";
import { TwistyPlayer, type TwistyPlayerConfig } from "cubing/twisty";

interface CubePlayerProps {
  alg?: string;
  scramble?: string;
  experimentalStickering?: TwistyPlayerConfig["experimentalStickering"];
  hintFacelets?: TwistyPlayerConfig["hintFacelets"];
  controlPanel?: TwistyPlayerConfig["controlPanel"];
  backView?: TwistyPlayerConfig["backView"];
  background?: TwistyPlayerConfig["background"];
  className?: string;
}

export default function CubePlayer({
  alg,
  scramble,
  experimentalStickering = "full",
  hintFacelets = "none",
  controlPanel = "bottom-row",
  backView = "none",
  background = "none",
  className = "",
}: CubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [ready, setReady] = useState(false);

  const currentAlg = alg || scramble || "";

  // Wait for the custom element to be defined.
  useEffect(() => {
    let cancelled = false;
    customElements.whenDefined("twisty-player").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Create the player once, remove it on unmount. Initial prop values are
  // intentionally captured only on first mount — later prop changes are
  // mirrored via the sync effect below using TwistyPlayer's setters.
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      alg: currentAlg,
      experimentalStickering,
      hintFacelets,
      controlPanel,
      backView,
      background,
    });

    player.style.width = "100%";
    player.style.height = "100%";
    containerRef.current.appendChild(player);
    playerRef.current = player;

    return () => {
      if (player.parentNode) {
        player.parentNode.removeChild(player);
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Mirror prop changes onto the live player. TwistyPlayer exposes each of
  // these as a setter that triggers its own re-render.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (currentAlg) player.alg = currentAlg;
    if (experimentalStickering) player.experimentalStickering = experimentalStickering;
    if (hintFacelets) player.hintFacelets = hintFacelets;
    if (controlPanel) player.controlPanel = controlPanel;
    if (backView) player.backView = backView;
    if (background) player.background = background;
  }, [currentAlg, experimentalStickering, hintFacelets, controlPanel, backView, background]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[16rem] flex items-center justify-center ${className}`}
    >
      {!ready && (
        <div className="text-muted-foreground text-sm animate-pulse">Loading cube...</div>
      )}
    </div>
  );
}
