export type TipsCarouselContent = {
  type: "TipsCarousel";
  id: string;
  hook: string; // big opening line, first 2-3s
  bullets: string[]; // 3-5 short points, one revealed at a time
  cta: string; // closing call-to-action line
  musicFile?: string; // filename inside public/audio, optional
};

export type ShowcaseCardContent = {
  type: "ShowcaseCard";
  id: string;
  hook: string;
  imageFile: string; // filename inside public/images
  callouts: { text: string; top: number }[]; // top = % from top of image, 0-100
  cta: string;
  musicFile?: string;
};

export type VideoContent = TipsCarouselContent | ShowcaseCardContent;
