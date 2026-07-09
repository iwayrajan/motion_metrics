import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";
import { PriceChartContent } from "../content/types";
import { AmbientBackground } from "./price-chart/AmbientBackground";
import { TitleCard } from "./price-chart/TitleCard";
import { ChartAxes } from "./price-chart/ChartAxes";
import { PriceLine } from "./price-chart/PriceLine";
import { PriceCallout } from "./price-chart/PriceCallout";
import { HeroOdometer } from "../components/HeroOdometer";
import { SourceLine } from "../components/FinalHold";
import {
  TITLE_DURATION,
  AXES_START,
  CALLOUTS_START,
  CALLOUT_GAP,
  POST_CALLOUTS_GAP,
  OUTRO_DURATION,
  getDuration,
  TEXT_COLOR,
  MUTED_COLOR,
  DEFAULT_ACCENT,
} from "./price-chart/config";

export const PriceChart: React.FC<{ content: PriceChartContent }> = ({ content }) => {
  const duration = getDuration(content);
  const maxValue = Math.max(...content.points.map((p) => p.value)) * 1.15;
  const accentColor = content.accentColor || DEFAULT_ACCENT;
  const callouts = content.callouts ?? [];
  const lastPoint = content.points[content.points.length - 1];
  const heroStart = CALLOUTS_START + callouts.length * CALLOUT_GAP + POST_CALLOUTS_GAP;

  const MusicBed: React.FC = () => {
    const frame = useCurrentFrame();
    const fade = interpolate(frame, [0, 20, duration - 30, duration], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return content.musicFile ? (
      <Audio src={staticFile(`audio/${content.musicFile}`)} volume={0.4 * fade} />
    ) : null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#05040a" }}>
      <MusicBed />
      <AmbientBackground accentColor={accentColor} />

      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard title={content.title} subtitle={content.subtitle} accentColor={accentColor} durationInFrames={TITLE_DURATION} />
      </Sequence>

      {/* Chart stays mounted all the way to the video's end — per pitfalls.md #2,
          the closing hold overlays the finished chart, it doesn't replace it. */}
      <Sequence from={AXES_START}>
        <ChartAxes content={content} maxValue={maxValue} />
        <PriceLine content={content} maxValue={maxValue} />

        {callouts.map((c, i) => (
          <Sequence key={i} from={CALLOUTS_START + i * CALLOUT_GAP}>
            <PriceCallout
              content={content}
              maxValue={maxValue}
              pointIndex={c.pointIndex}
              label={c.label}
              color={c.color || accentColor}
            />
          </Sequence>
        ))}

        <Sequence from={heroStart}>
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 340 }}>
            {content.heroLabel ? (
              <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 24, color: MUTED_COLOR, marginBottom: 6 }}>
                {content.heroLabel}
              </div>
            ) : null}
            {lastPoint ? (
              <HeroOdometer
                text={`${content.unitPrefix ?? ""}${Math.round(lastPoint.value).toLocaleString("en-US")}`}
                color={TEXT_COLOR}
              />
            ) : null}
          </AbsoluteFill>
        </Sequence>
      </Sequence>

      <Sequence from={duration - OUTRO_DURATION}>
        <SourceLine text={content.sourceText || "Not financial advice"} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { getDuration as getPriceChartDuration } from "./price-chart/config";
