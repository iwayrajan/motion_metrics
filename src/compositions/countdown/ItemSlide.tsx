import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CountdownItem } from "../../content/types";
import { Pillar } from "./Pillar";
import { HeroOdometer } from "../../components/HeroOdometer";
import {
  PER_ITEM_DURATION,
  FADE_OUT_START,
  WORDMARK_START,
  VALUE_START,
  TEXT_COLOR,
  MUTED_COLOR,
} from "./config";

export const ItemSlide: React.FC<{
  item: CountdownItem;
  rank: number;
  heightFrac: number;
  color: string;
  unitPrefix?: string;
}> = ({ item, rank, heightFrac, color, unitPrefix }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 10, FADE_OUT_START, PER_ITEM_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wordmarkFrame = Math.max(frame - WORDMARK_START, 0);
  const wordmarkBounce = spring({ frame: wordmarkFrame, fps, config: { damping: 11, stiffness: 140 } });
  const wordmarkScale = interpolate(wordmarkBounce, [0, 1], [0.6, 1]);
  const wordmarkOpacity = interpolate(wordmarkFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const rankOpacity = interpolate(frame, [0, 20], [0, 0.14], { extrapolateRight: "clamp" });

  const displayValue = `${unitPrefix ?? ""}${item.value}${item.unitSuffix ?? ""}`;

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 120 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 340, color, opacity: rankOpacity, lineHeight: 1 }}>
          #{rank}
        </div>
      </AbsoluteFill>

      <Pillar heightFrac={heightFrac} color={color} />

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 560 }}>
        <div
          style={{
            transform: `scale(${wordmarkScale})`,
            opacity: wordmarkOpacity,
            fontFamily: "'Inter'",
            fontWeight: 800,
            fontSize: 54,
            color,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {item.name}
        </div>
      </AbsoluteFill>

      <Sequence from={VALUE_START}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 340 }}>
          <HeroOdometer text={displayValue} color={TEXT_COLOR} />
          {item.note ? (
            <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: 24, color: MUTED_COLOR, marginTop: 10 }}>
              {item.note}
            </div>
          ) : null}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
