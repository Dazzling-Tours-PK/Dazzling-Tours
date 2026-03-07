"use client";
import React from "react";

type Spacing = number | string;

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: Spacing; // gap between children
  align?: React.CSSProperties["alignItems"]; // cross-axis alignment
  justify?: React.CSSProperties["justifyContent"]; // main-axis alignment
  wrap?: boolean; // allow wrapping
  grow?: boolean; // children grow equally
  position?: "left" | "center" | "right" | "apart"; // convenience
  fullWidth?: boolean;
}

const toGap = (spacing?: Spacing) => {
  if (spacing === undefined) return undefined;
  return typeof spacing === "number" ? `${spacing}px` : spacing;
};

const mapPosition = (
  position?: GroupProps["position"],
): React.CSSProperties["justifyContent"] | undefined => {
  switch (position) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
    case "apart":
      return "space-between";
    default:
      return undefined;
  }
};

const Group: React.FC<GroupProps> = ({
  spacing = 12,
  align = "center",
  justify,
  position,
  wrap = false,
  grow = false,
  fullWidth = false,
  style,
  className = "",
  children,
  ...rest
}) => {
  const mergedStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: align,
    justifyContent: justify || mapPosition(position),
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: toGap(spacing),
    width: fullWidth ? "100%" : undefined,
    ...style,
  };

  const processedChildren = React.Children.map(children, (child) => {
    if (!grow || !React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{
      style?: React.CSSProperties;
    }>;
    const prevStyle = element.props.style;
    return React.cloneElement(element, {
      style: { ...prevStyle, flex: 1, minWidth: 0 },
    });
  });

  return (
    <div
      className={`ui-group ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {processedChildren}
    </div>
  );
};

export default Group;
