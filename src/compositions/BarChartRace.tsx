import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";
import { BarChartRaceContent } from "../content/types";
import { AmbientBackground } from "./bar-race/AmbientBackground";
import { TitleCard } from "./bar-race/TitleCard";
import { EraWatermark } from "./bar-race/EraWatermark";
import { BarsScene } from "./bar-race/BarsScene";
import { SourceLine } from "../components/FinalHold";
import { TITLE_DURATION, RACE_START, getDuration } from "./bar-race/config";

const MusicBed: React.FC<{ file: string; duration: number }> = ({ file, duration }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, duration - 30, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio src={staticFile(`audio/${file}`)} volume={0.4 * fade} />;
};

export const BarChartRace: React.FC<{ content: BarChartRaceContent }> = ({ content }) => {
  const duration = getDuration(content);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05040a" }}>
      {content.musicFile ? <MusicBed file={content.musicFile} duration={duration} /> : null}
      <AmbientBackground />

      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard title={content.title} subtitle={content.subtitle} durationInFrames={TITLE_DURATION} />
      </Sequence>

      {/* Race stays mounted all the way to the end — per pitfalls.md #2, the closing
          hold overlays the final standings, doesn't replace them. */}
      <Sequence from={RACE_START}>
        <EraWatermark content={content} />
        <BarsScene content={content} />
      </Sequence>

      <Sequence from={duration - 45}>
        <SourceLine text={content.sourceText || ""} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { getDuration as getBarChartRaceDuration } from "./bar-race/config";
