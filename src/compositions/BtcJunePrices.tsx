import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { TitleCard } from "../components/TitleCard";
import { SourceLine, DriftParticles } from "../components/FinalHold";
import { ChartAxes } from "./btc-june/ChartAxes";
import { PriceLine } from "./btc-june/PriceLine";
import { PriceCallout } from "./btc-june/PriceCallout";
import {
  BG,
  LINE_COLOR,
  TITLE_DURATION,
  AXES_START,
  CALLOUT_LOW_START,
  CALLOUT_TODAY_START,
  CARDS_START,
  FINAL_START,
} from "./btc-june/config";

const StatCard: React.FC<{ eyebrow: string; value: string; borderColor: string; index: number }> = ({
  eyebrow,
  value,
  borderColor,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - index * 12;
  const enter = spring({ frame: Math.max(local, 0), fps, config: { damping: 16 }, durationInFrames: 20 });
  const translateY = interpolate(enter, [0, 1], [30, 0]);
  const opacity = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: 780,
        background: "#111122",
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 6,
        padding: "22px 28px",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: 17, color: "#9ca3af" }}>{eyebrow}</div>
      <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 30, color: "#ffffff", marginTop: 8 }}>
        {value}
      </div>
    </div>
  );
};

export const BtcJunePrices: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard
          title="Bitcoin's June 30 Price"
          subtitle="Every year · 2021–2026"
          durationInFrames={TITLE_DURATION}
        />
      </Sequence>

      <Sequence from={AXES_START}>
        <ChartAxes />
        <PriceLine />

        <Sequence from={CALLOUT_LOW_START}>
          <PriceCallout index={1} label={"2022 crypto winter" + "\n" + "low: $18,917"} color="#ef4444" />
        </Sequence>
        <Sequence from={CALLOUT_TODAY_START}>
          <PriceCallout index={5} label={"Today: -45% from" + "\n" + "the 2025 peak"} color={LINE_COLOR} />
        </Sequence>
      </Sequence>

      <Sequence from={CARDS_START}>
        <div style={{ position: "absolute", left: 150, top: 1560, display: "flex", flexDirection: "column", gap: 20 }}>
          <StatCard eyebrow="5-year high" value="$107,289 · June 2025" borderColor={LINE_COLOR} index={0} />
        </div>
      </Sequence>

      <Sequence from={FINAL_START}>
        <DriftParticles colors={[LINE_COLOR, "#ffffff", "#ef4444"]} />
        <SourceLine text="StatMuse · daily close (2021-25) · Fortune intraday (Jun 30, 2026) · not financial advice" />
      </Sequence>
    </AbsoluteFill>
  );
};
