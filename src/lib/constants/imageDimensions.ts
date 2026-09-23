export enum ImageVariant {
  HERO = "hero",
  CARD = "card",
  THUMBNAIL = "thumbnail",
  AVATAR = "avatar",
}

export interface ImageDimensionConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  aspectRatio: number; // width / height
  ratioLabel: string;
  label: string;
}

export const IMAGE_DIMENSIONS: Record<ImageVariant, ImageDimensionConfig> = {
  [ImageVariant.HERO]: {
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    maxWidth: 2560,
    maxHeight: 1440,
    aspectRatio: 16 / 9, // 1.777...
    ratioLabel: "16:9",
    label: "16:9 (Min 1280x720, Max 2560x1440, Rec 1920x1080)",
  },
  [ImageVariant.CARD]: {
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 450,
    maxWidth: 1200,
    maxHeight: 900,
    aspectRatio: 4 / 3, // 1.333...
    ratioLabel: "4:3",
    label: "4:3 (Min 600x450, Max 1200x900, Rec 800x600)",
  },
  [ImageVariant.THUMBNAIL]: {
    width: 400,
    height: 400,
    minWidth: 300,
    minHeight: 300,
    maxWidth: 800,
    maxHeight: 800,
    aspectRatio: 1 / 1, // 1.0
    ratioLabel: "1:1",
    label: "1:1 (Min 300x300, Max 800x800, Rec 400x400)",
  },
  [ImageVariant.AVATAR]: {
    width: 400,
    height: 400,
    minWidth: 200,
    minHeight: 200,
    maxWidth: 800,
    maxHeight: 800,
    aspectRatio: 1 / 1, // 1.0
    ratioLabel: "1:1",
    label: "1:1 (Min 200x200, Max 800x800, Rec 400x400)",
  },
};
