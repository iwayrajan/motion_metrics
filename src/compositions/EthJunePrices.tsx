import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "./eth-june/AmbientBackground";
import { MobileTitleCard } from "./eth-june/MobileTitleCard";
import { ChartAxes } from "./eth-june/ChartAxes";
import { PriceLine } from "./eth-june/PriceLine";
import { PriceCallout } from "./eth-june/PriceCallout";
import { HeroOdometer } from "./eth-june/HeroOdometer";
import { SourceLine } from "../components/FinalHold";
import {
  DURATION,
  TITLE_DURATION,
  AXES_START,
  CALLOUT_LOW_START,
  CALLOUT_TODAY_START,
  CARDS_START,
  FINAL_START,
  LINE_COLOR,
  ACCENT_PINK,
  TEXT_COLOR,
} from "./eth-june/config";

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, DURATION - 30, DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio src={staticFile("audio/synthwave-laser-drift-251660.mp3")} volume={0.4 * fade} />;
};

export const EthJunePrices: React.FC = () => {
  return (
    <AbsoluteFill>
      <MusicBed />
      <AmbientBackground />

      <Sequence durationInFrames={TITLE_DURATION}>
        <MobileTitleCard
          title="ETH's June 30 Price"
          subtitle="Every year · 2021–2026"
          durationInFrames={TITLE_DURATION}
        />
      </Sequence>

      {/* Chart stays mounted all the way to the video's end — per references/pitfalls.md,
          the closing hold overlays on top of the finished chart, it doesn't replace it. */}
      <Sequence from={AXES_START}>
        <ChartAxes />
        <PriceLine />

        <Sequence from={CALLOUT_LOW_START}>
          <PriceCallout index={1} label={"2022 bear market" + "\n" + "low: ~$1,067"} color="#ef4444" />
        </Sequence>
        <Sequence from={CALLOUT_TODAY_START}>
          <PriceCallout index={5} label={"Today: down ~54%" + "\n" + "from 2024's high"} color={ACCENT_PINK} />
        </Sequence>
      </Sequence>

      <Sequence from={CARDS_START}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 340 }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 24, color: "#8a7fae", marginBottom: 6 }}>
            ETH today
          </div>
          <HeroOdometer text="$1,569" color={LINE_COLOR} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={FINAL_START}>
        <SourceLine text="CoinCodex (2026 close, exact) · calculated (2025) · approximate (2021-24) · not financial advice" />
      </Sequence>
    </AbsoluteFill>
  );
};
