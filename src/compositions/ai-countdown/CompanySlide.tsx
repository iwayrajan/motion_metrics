import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CompanyData } from "../../content/ai-companies-data";
import { Pillar } from "./Pillar";
import { HeroOdometer } from "../../components/HeroOdometer";
import {
  PER_COMPANY_DURATION,
  FADE_OUT_START,
  WORDMARK_START,
  ODOMETER_START,
  TEXT_COLOR,
  MUTED_COLOR,
} from "./config";

export const CompanySlide: React.FC<{ company: CompanyData }> = ({ company }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // fade envelope: in fast (mobile profile — motion within first ~15 frames), hold, fade out
  const opacity = interpolate(
    frame,
    [0, 10, FADE_OUT_START, PER_COMPANY_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wordmarkFrame = Math.max(frame - WORDMARK_START, 0);
  const wordmarkBounce = spring({ frame: wordmarkFrame, fps, config: { damping: 11, stiffness: 140 } });
  const wordmarkScale = interpolate(wordmarkBounce, [0, 1], [0.6, 1]);
  const wordmarkOpacity = interpolate(wordmarkFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const rankOpacity = interpolate(frame, [0, 20], [0, 0.14], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* giant rank watermark, behind everything */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 120 }}>
        <div
          style={{
            fontFamily: "'Inter'",
            fontWeight: 800,
            fontSize: 340,
            color: company.accentColor,
            opacity: rankOpacity,
            lineHeight: 1,
          }}
        >
          #{company.rank}
        </div>
      </AbsoluteFill>

      <Pillar heightFrac={company.heightFrac} color={company.accentColor} />

      {/* wordmark */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 560 }}>
        <div
          style={{
            transform: `scale(${wordmarkScale})`,
            opacity: wordmarkOpacity,
            fontFamily: "'Inter'",
            fontWeight: 800,
            fontSize: 58,
            color: company.accentColor,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {company.name}
        </div>
      </AbsoluteFill>

      {/* valuation odometer + note */}
      <Sequence from={ODOMETER_START}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 340 }}>
          <HeroOdometer text={company.valuation} color={TEXT_COLOR} />
          <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: 24, color: MUTED_COLOR, marginTop: 10 }}>
            {company.note}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
