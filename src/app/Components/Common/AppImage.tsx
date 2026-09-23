import React from "react";
import Image, { ImageProps } from "next/image";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import { cn } from "@/lib/utils";

export interface AppImageProps extends Omit<ImageProps, "fill" | "width" | "height"> {
  variant: ImageVariant;
  containerClassName?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

/**
 * Default `sizes` per variant.
 *
 * next/image needs `sizes` alongside `fill` to build a useful srcset. Without
 * it the browser assumes the image is 100vw and downloads a full-viewport file
 * even for a 64px thumbnail. These are sensible defaults for how each variant
 * is laid out; any caller with a different layout can pass its own `sizes`.
 */
const getVariantSizes = (variant: ImageVariant) => {
  switch (variant) {
    case ImageVariant.HERO:
      // Main content columns (e.g. 8-col of max-6xl): ~768px on desktop, 100vw on mobile.
      return "(min-width: 1280px) 768px, (min-width: 1024px) 66vw, 100vw";
    case ImageVariant.CARD:
      // Grid cards: roughly a third on desktop, half on tablet, full on mobile.
      return "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";
    case ImageVariant.THUMBNAIL:
      return "96px";
    case ImageVariant.AVATAR:
      return "64px";
    default:
      return "(min-width: 768px) 50vw, 100vw";
  }
};

const getVariantClasses = (variant: ImageVariant) => {
  switch (variant) {
    case ImageVariant.HERO:
      return "aspect-video md:aspect-[21/9]"; // Flexible hero, defaults to 16:9 on mobile, wider on desktop
    case ImageVariant.CARD:
      return "aspect-[4/3]";
    case ImageVariant.THUMBNAIL:
      return "aspect-square";
    case ImageVariant.AVATAR:
      return "aspect-square rounded-full";
    default:
      return "aspect-square";
  }
};

export const AppImage: React.FC<AppImageProps> = ({
  variant,
  containerClassName,
  imageClassName,
  children,
  alt,
  sizes,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden w-full",
        getVariantClasses(variant),
        containerClassName
      )}
    >
      <Image
        fill
        sizes={sizes ?? getVariantSizes(variant)}
        className={cn("object-cover", imageClassName)}
        alt={alt || "Image"}
        {...props}
      />
      {children}
    </div>
  );
};
