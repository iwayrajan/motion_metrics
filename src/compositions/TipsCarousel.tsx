import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Audio,
  staticFile,
} from "remotion";
import { theme } from "../theme";
import { TipsCarouselContent } from "../content/types";
import { Bokeh, RadialGlowBackground } from "../components/Bokeh";
import { CornerOrnament } from "../components/CornerOrnament";
import { DrawnDivider, ProgressBar } from "../components/DrawnDivider";

const HOOK_DURATION = 90; // 3s
const BULLET_GAP = 46; // ~1.53s between each bullet appearing
const OUTRO_DURATION = 100; // ~3.3s CTA hold

export const getTipsCarouselDuration = (bulletCount: number) =>
  HOOK_DURATION + bulletCount * BULLET_GAP + OUTRO_DURATION;

const Eyebrow: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, 15], [10, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: theme.fonts.accent,
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: 3,
        color: theme.colors.ivoryMuted,
        textTransform: "uppercase",
        marginBottom: 18,
      }}
    >
      {text}
    </div>
  );
};

const Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blur-to-focus + mask reveal for a cinematic entrance
  const reveal = interpolate(frame, [8, 42], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [8, 34], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
      <CornerOrnament corner="top-left" opacity={0.55} />
      <CornerOrnament corner="bottom-right" opacity={0.55} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Eyebrow text="Before You Hit Send" />
        <div
          style={{
            opacity,
            filter: `blur(${blur}px)`,
            clipPath: `inset(0 ${100 - reveal}% 0 0)`,
            fontFamily: theme.fonts.display,
            fontSize: 72,
            fontWeight: 700,
            color: theme.colors.ivory,
            textAlign: "center",
            lineHeight: 1.25,
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </div>
        <div style={{ marginTop: 26 }}>
          <DrawnDivider delay={45} duration={18} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BulletRow: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.6 }, durationInFrames: 22 });
  const translateY = interpolate(enter, [0, 1], [26, 0]);
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const blur = interpolate(frame, [0, 14], [6, 0], { extrapolateRight: "clamp" });
  const lineHeight = interpolate(frame, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        transform: `translateY(${translateY}px)`,
        opacity,
        filter: `blur(${blur}px)`,
        width: "100%",
        padding: "14px 0",
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 40,
          fontWeight: 600,
          color: theme.colors.gold,
          minWidth: 64,
          textAlign: "right",
        }}
      >
        {num}
      </div>
      <div
        style={{
          width: 1.5,
          height: 48 * lineHeight,
          background: theme.colors.line,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 32,
          fontWeight: 400,
          color: theme.colors.ivory,
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 }, durationInFrames: 24 });
  const opacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // shimmer sweep across the CTA text
  const shimmerX = interpolate(frame % 70, [0, 70], [-150, 250]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: `1.5px solid ${theme.colors.gold}`,
          borderRadius: 4,
          padding: "50px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 6,
            border: `1px solid ${theme.colors.line}`,
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: theme.fonts.display,
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.ivory,
            textAlign: "center",
            lineHeight: 1.3,
            backgroundImage: `linear-gradient(100deg, transparent 0%, ${theme.colors.goldLight} 50%, transparent 100%)`,
            backgroundSize: "60% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: `${shimmerX}%`,
            backgroundBlendMode: "overlay",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BulletsList: React.FC<{ bullets: string[]; bulletsDuration: number }> = ({ bullets, bulletsDuration }) => {
  const frame = useCurrentFrame();
  // fade out over the last 15 frames before this Sequence unmounts, so the CTA doesn't
  // pop in on top of still-visible bullets (previously this had no duration cap at all —
  // bullets stayed mounted for the rest of the video, overlapping the CTA underneath it)
  const opacity = interpolate(frame, [bulletsDuration - 15, bulletsDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 100px", opacity }}>
      {bullets.map((bullet, i) => (
        <Sequence key={i} from={i * BULLET_GAP} layout="none">
          <BulletRow text={bullet} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const TipsCarousel: React.FC<{ content: TipsCarouselContent }> = ({ content }) => {
  const bulletsStart = HOOK_DURATION;
  const bulletsDuration = content.bullets.length * BULLET_GAP;

  return (
    <AbsoluteFill>
      <RadialGlowBackground />
      <Bokeh />
      <ProgressBar />

      {content.musicFile ? (
        <Audio src={staticFile(`audio/${content.musicFile}`)} volume={0.4} />
      ) : null}

      <Sequence durationInFrames={HOOK_DURATION}>
        <Hook text={content.hook} />
      </Sequence>

      <Sequence from={bulletsStart} durationInFrames={bulletsDuration}>
        <BulletsList bullets={content.bullets} bulletsDuration={bulletsDuration} />
      </Sequence>

      <Sequence from={bulletsStart + bulletsDuration}>
        <Outro text={content.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
