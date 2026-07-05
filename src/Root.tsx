import React from "react";
import { Composition } from "remotion";
import { TipsCarousel, getTipsCarouselDuration } from "./compositions/TipsCarousel";
import { ShowcaseCard, getShowcaseCardDuration } from "./compositions/ShowcaseCard";
import { PopulationChart } from "./compositions/PopulationChart";
import { BtcJunePrices } from "./compositions/BtcJunePrices";
import { tipsMistakes } from "./content/tips-mistakes";
import { DURATION as POPULATION_DURATION } from "./compositions/population/config";
import { DURATION as BTC_DURATION } from "./compositions/btc-june/config";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* One <Composition> per video you want to render.
          To add a new video: create a new content file in src/content,
          import it here, and add a Composition block below.
          The "id" is what you pass to `npx remotion render <id>`. */}

      <Composition
        id="tips-mistakes"
        component={TipsCarousel}
        durationInFrames={getTipsCarouselDuration(tipsMistakes.bullets.length)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ content: tipsMistakes }}
      />

      {/* Landscape data-viz explainer — separate project/dimensions from the biodata shorts above */}
      <Composition
        id="population-countries"
        component={PopulationChart}
        durationInFrames={POPULATION_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Vertical short for YouTube Shorts / Instagram Reels */}
      <Composition
        id="btc-june-prices"
        component={BtcJunePrices}
        durationInFrames={BTC_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
