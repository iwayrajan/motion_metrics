import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";
import { CountdownContent } from "../content/types";
import { AmbientBackground } from "./countdown/AmbientBackground";
import { TitleCard } from "./countdown/TitleCard";
import { ItemSlide } from "./countdown/ItemSlide";
import { SourceLine } from "../components/FinalHold";
import { colorForIndex, heightFracForItems, getDuration, TITLE_DURATION, PER_ITEM_DURATION, OUTRO_DURATION, TEXT_COLOR } from "./countdown/config";

export const Countdown: React.FC<{ content: CountdownContent }> = ({ content }) => {
  const duration = getDuration(content);

  // Items are entered #1-first (natural top-10-list order) — reversed here so the
  // countdown builds up to the biggest reveal last, per the original AI-countdown pattern.
  const countdownOrder = [...content.items].reverse();
  const heightFracs = heightFracForItems(content.items.map((i) => i.value)).reverse();

  return (
    <AbsoluteFill style={{ backgroundColor: "#05040a" }}>
      {content.musicFile ? <MusicBed file={content.musicFile} duration={duration} /> : null}
      <AmbientBackground />

      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard title={content.title} subtitle={content.subtitle} durationInFrames={TITLE_DURATION} />
      </Sequence>

      {countdownOrder.map((item, i) => {
        const originalIndex = content.items.length - 1 - i; // index in the original #1-first array
        const rank = originalIndex + 1;
        return (
          <Sequence
            key={`${item.name}-${i}`}
            from={TITLE_DURATION + i * PER_ITEM_DURATION}
            durationInFrames={PER_ITEM_DURATION}
          >
            <ItemSlide
              item={item}
              rank={rank}
              heightFrac={heightFracs[i]}
              color={item.color || colorForIndex(originalIndex)}
              unitPrefix={content.unitPrefix}
            />
          </Sequence>
        );
      })}

      {/* closing hold — starts exactly when the last item's Sequence ends, no dead gap.
          Last item already ends with its own fade-out per ItemSlide's opacity envelope,
          so no separate "unmount" risk here (see references/pitfalls.md #2). */}
      <Sequence from={TITLE_DURATION + countdownOrder.length * PER_ITEM_DURATION} durationInFrames={OUTRO_DURATION}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {content.closingText ? (
            <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 34, color: TEXT_COLOR, textAlign: "center", padding: "0 60px" }}>
              {content.closingText}
            </div>
          ) : null}
        </AbsoluteFill>
        <SourceLine text={content.sourceText || ""} />
      </Sequence>
    </AbsoluteFill>
  );
};

const MusicBed: React.FC<{ file: string; duration: number }> = ({ file, duration }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, duration - 30, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio src={staticFile(`audio/${file}`)} volume={0.4 * fade} />;
};

export { getDuration as getCountdownDuration } from "./countdown/config";
