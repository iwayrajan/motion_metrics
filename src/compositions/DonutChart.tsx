import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";
import { DonutChartContent } from "../content/types";
import { AmbientBackground } from "./donut/AmbientBackground";
import { TitleCard } from "./donut/TitleCard";
import { DonutRing } from "./donut/DonutRing";
import { Legend } from "./donut/Legend";
import { SourceLine } from "../components/FinalHold";
import { TITLE_DURATION, DONUT_START, getDuration } from "./donut/config";

const MusicBed: React.FC<{ file: string; duration: number }> = ({ file, duration }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, duration - 30, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio src={staticFile(`audio/${file}`)} volume={0.4 * fade} />;
};

export const DonutChart: React.FC<{ content: DonutChartContent }> = ({ content }) => {
  const duration = getDuration(content);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05040a" }}>
      {content.musicFile ? <MusicBed file={content.musicFile} duration={duration} /> : null}
      <AmbientBackground />

      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard title={content.title} subtitle={content.subtitle} durationInFrames={TITLE_DURATION} />
      </Sequence>

      {/* Ring + legend stay mounted all the way to the end — per pitfalls.md #2, the
          closing beat (rotation + closing stat) overlays the finished donut, doesn't
          replace it. */}
      <Sequence from={DONUT_START}>
        <DonutRing content={content} />
        <Legend content={content} />
      </Sequence>

      <Sequence from={duration - 45}>
        <SourceLine text={content.sourceText || ""} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { getDuration as getDonutChartDuration } from "./donut/config";
