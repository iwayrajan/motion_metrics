import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
  Img,
  staticFile,
} from "remotion";
import { theme } from "../theme";
import { ShowcaseCardContent } from "../content/types";

const FPS = 30;
const HOOK_DURATION = 60; // 2s
const CALLOUT_GAP = 36;
const OUTRO_DURATION = 75; // 2.5s

export const getShowcaseCardDuration = (calloutCount: number) =>
  HOOK_DURATION + calloutCount * CALLOUT_GAP + OUTRO_DURATION + 30;

const Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 }, durationInFrames: 20 });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontFamily: theme.fonts.heading,
          fontSize: 64,
          fontWeight: 700,
          color: theme.colors.primary,
          textAlign: "center",
          lineHeight: 1.25,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Callout: React.FC<{ text: string; top: number }> = ({ text, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 }, durationInFrames: 18 });
  const translateX = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        right: 40,
        transform: `translateX(${translateX}px)`,
        opacity,
        background: theme.colors.primary,
        color: "#fff",
        borderRadius: 20,
        padding: "16px 22px",
        fontFamily: theme.fonts.body,
        fontSize: 28,
        fontWeight: 600,
        maxWidth: 380,
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
    >
      {text}
    </div>
  );
};

const Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 }, durationInFrames: 20 });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontFamily: theme.fonts.heading,
          fontSize: 48,
          fontWeight: 700,
          color: "#fff",
          textAlign: "center",
          background: theme.colors.primary,
          padding: "36px 44px",
          borderRadius: 28,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const ShowcaseCard: React.FC<{ content: ShowcaseCardContent }> = ({ content }) => {
  const calloutsStart = HOOK_DURATION;
  const imageStart = HOOK_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.backgroundAlt }}>
      {content.musicFile ? (
        <Audio src={staticFile(`audio/${content.musicFile}`)} volume={0.4} />
      ) : null}

      <Sequence durationInFrames={HOOK_DURATION}>
        <Hook text={content.hook} />
      </Sequence>

      <Sequence from={imageStart}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
          <Img
            src={staticFile(`images/${content.imageFile}`)}
            style={{ maxWidth: "80%", maxHeight: "70%", borderRadius: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
          />
        </AbsoluteFill>
        {content.callouts.map((c, i) => (
          <Sequence key={i} from={i * CALLOUT_GAP}>
            <Callout text={c.text} top={c.top} />
          </Sequence>
        ))}
      </Sequence>

      <Sequence from={calloutsStart + content.callouts.length * CALLOUT_GAP + 30}>
        <Outro text={content.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
