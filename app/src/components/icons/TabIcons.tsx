import React from "react";
import Svg, { Path, Circle, Rect, Line, Polyline, G } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Sprout / Home icon — a seedling growing from soil
 */
export function FarmIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M12 12C12 8 8 6 4 6C4 10 8 12 12 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C12 11 16 9 20 9C20 13 16 15 12 15Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 22H20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Map / Territory icon — a map with pin
 */
export function MapIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="9"
        y1="3"
        x2="9"
        y2="18"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Line
        x1="15"
        y1="6"
        x2="15"
        y2="21"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

/**
 * Scan icon — a clean viewfinder / QR-style scanner
 */
export function ScanIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Viewfinder corners */}
      <Path
        d="M3 8V5C3 3.9 3.9 3 5 3H8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 3H19C20.1 3 21 3.9 21 5V8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 16V19C21 20.1 20.1 21 19 21H16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 21H5C3.9 21 3 20.1 3 19V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center crosshair */}
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

/**
 * Garden icon — a potted plant
 */
export function GardenIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Pot */}
      <Path
        d="M7 17L8 21H16L17 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="6"
        y="15"
        width="12"
        height="2"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Plant stem */}
      <Path
        d="M12 15V9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Leaves */}
      <Path
        d="M12 11C12 8 9 6 6 6C6 9 9 11 12 11Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 9C12 6 15 4 18 4C18 7 15 9 12 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Profile icon — a person silhouette with leaf badge
 */
export function ProfileIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
