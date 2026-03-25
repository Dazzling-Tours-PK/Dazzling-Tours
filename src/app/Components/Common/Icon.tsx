"use client";
import React from "react";

// Standard Bootstrap Icons names
export type IconName =
  | "search"
  | "plus-circle"
  | "trash"
  | "pencil"
  | "eye"
  | "check-circle"
  | "x-circle"
  | "exclamation-triangle"
  | "info-circle"
  | "arrow-left"
  | "arrow-right"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "house"
  | "person"
  | "calendar"
  | "clock"
  | "geo-alt"
  | "telephone"
  | "envelope"
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "star-fill"
  | "star-half"
  | "star"
  | "camera"
  | "image"
  | "images"
  | "cloud-upload"
  | "box-arrow-right"
  | "box-arrow-in-right"
  | "person-circle"
  | "grid"
  | "list"
  | "chat-left-text"
  | "reply"
  | "share"
  | "tag"
  | "bookmark"
  | "heart"
  | "heart-fill"
  | "gear"
  | "bell"
  | "shield-check"
  | "file-earmark-text"
  | "inbox"
  | "circle-fill"
  | "dash-circle"
  | "check-lg"
  | "x-lg";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /** Bootstrap icon name (without the bi- prefix) */
  name: IconName | (string & {});
  /** Icon size in pixels or CSS string */
  size?: number | string;
  /** Icon color */
  color?: string;
  /** Extra class names */
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size,
  color,
  className = "",
  style,
  ...rest
}) => {
  const iconSize = typeof size === "number" ? `${size}px` : size;

  const mergedStyle: React.CSSProperties = {
    fontSize: iconSize,
    color: color,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <i
      className={`bi bi-${name} ${className}`}
      style={mergedStyle}
      {...rest}
    />
  );
};

export default Icon;
