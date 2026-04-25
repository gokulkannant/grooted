import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
  type SvgProps,
} from "react-native-svg";
import { colors } from "@/constants/colors";

type IconProps = SvgProps & {
  size?: number;
  color?: string;
  accentColor?: string;
};

const iconSize = (size: number) => ({ height: size, width: size });

export function SproutIcon({
  size = 24,
  color = colors.primary,
  accentColor = "#8B5E34",
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M12 20.5V11.8"
        stroke={accentColor}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M11.8 12.4C11 7.7 7.2 5.1 3.5 5.1c.1 4 3.2 7.3 8.3 7.3Z"
        fill={color}
      />
      <Path
        d="M12.2 14.5c.8-4.6 4.4-7.1 8.3-7.1-.2 4.4-3.3 7.1-8.3 7.1Z"
        fill={color}
        opacity={0.86}
      />
      <Path
        d="M5 21h14"
        stroke={accentColor}
        strokeLinecap="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export function LeafIcon({
  size = 24,
  color = colors.primary,
  accentColor = colors.primaryDark,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M20.5 3.5C12.1 3.8 5.1 8.5 4.5 16c5.9.7 12.7-2.5 16-12.5Z"
        fill={color}
      />
      <Path
        d="M5 19c4.2-6.4 8.5-9.7 13-12"
        stroke={accentColor}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

export function ScanGlyphIcon({
  size = 24,
  color = colors.onPrimary,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Circle cx={12} cy={12} r={3.2} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function CameraGlyphIcon({
  size = 24,
  color = colors.primary,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M7.8 7.2 9.1 5h5.8l1.3 2.2H19a2 2 0 0 1 2 2v8.3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.2a2 2 0 0 1 2-2h2.8Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <Circle cx={12} cy={13.4} r={3.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function GrainIcon({
  size = 24,
  color = colors.accent,
  accentColor = "#7A4B18",
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M12 21V4"
        stroke={accentColor}
        strokeLinecap="round"
        strokeWidth={2}
      />
      {[6, 10, 14].map((y) => (
        <G key={y}>
          <Path
            d={`M12 ${y + 1}c-3.1-.2-5-1.8-5.5-4.4C9.5 ${y - 3} 11.6 ${y - 1.8} 12 ${y + 1}Z`}
            fill={color}
          />
          <Path
            d={`M12 ${y + 2}c3.1-.2 5-1.8 5.5-4.4C14.5 ${y - 2} 12.4 ${y - 0.8} 12 ${y + 2}Z`}
            fill={color}
            opacity={0.84}
          />
        </G>
      ))}
    </Svg>
  );
}

export function DropletIcon({
  size = 24,
  color = "#42A5F5",
  accentColor = "#E3F2FD",
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M12 3.2c3.8 4.5 6 7.9 6 11.1A6 6 0 0 1 6 14.3c0-3.2 2.2-6.6 6-11.1Z"
        fill={color}
      />
      <Path
        d="M9.4 15.6c.4 1.3 1.4 2.1 2.8 2.3"
        stroke={accentColor}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

export function StarIcon({
  size = 24,
  color = colors.accent,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="m12 3 2.4 5.8 6.2.5-4.7 4.1 1.4 6.1-5.3-3.2-5.3 3.2 1.4-6.1-4.7-4.1 6.2-.5L12 3Z"
        fill={color}
      />
    </Svg>
  );
}

export function LockIcon({
  size = 24,
  color = colors.onSurfaceVariant,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Rect
        x={5}
        y={10}
        width={14}
        height={10}
        rx={2}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Circle cx={12} cy={15} r={1.4} fill={color} />
    </Svg>
  );
}

export function MedalIcon({
  size = 24,
  color = colors.accent,
  accentColor = colors.primary,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path d="M8 3h8l-2 6h-4L8 3Z" fill={accentColor} />
      <Circle cx={12} cy={14} r={5.5} fill={color} />
      <Path
        d="M12 11.5 13 13.6l2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3 1-2.1Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export function ChartIcon({
  size = 24,
  color = colors.primary,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Rect
        x={4}
        y={12}
        width={3.5}
        height={8}
        rx={1}
        fill={color}
        opacity={0.65}
      />
      <Rect x={10.25} y={8} width={3.5} height={12} rx={1} fill={color} />
      <Rect
        x={16.5}
        y={4}
        width={3.5}
        height={16}
        rx={1}
        fill={color}
        opacity={0.82}
      />
    </Svg>
  );
}

export function SettingsIcon({
  size = 24,
  color = colors.onSurfaceVariant,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path
        d="M12 3.5 14 5l2.5-.5 1.2 2.1-1.5 2 .3 1.4 2.2 1v2.4l-2.2 1-.3 1.4 1.5 2-1.2 2.1L14 19l-2 1.5L10 19l-2.5.5-1.2-2.1 1.5-2-.3-1.4-2.2-1v-2.4l2.2-1 .3-1.4-1.5-2 1.2-2.1L10 5l2-1.5Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function FarmerIcon({
  size = 24,
  color = colors.primary,
  accentColor = colors.accent,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...iconSize(size)} {...props}>
      <Path d="M6 9h12l-1.4-3.6H7.4L6 9Z" fill={accentColor} />
      <Path
        d="M5 9.2h14"
        stroke={colors.primaryDark}
        strokeLinecap="round"
        strokeWidth={1.7}
      />
      <Circle cx={12} cy={13} r={4.2} fill="#F1C27D" />
      <Path d="M7 21c.8-2.7 2.6-4 5-4s4.2 1.3 5 4" fill={color} />
      <Ellipse
        cx={10.4}
        cy={12.7}
        rx={0.6}
        ry={0.8}
        fill={colors.primaryDark}
      />
      <Ellipse
        cx={13.6}
        cy={12.7}
        rx={0.6}
        ry={0.8}
        fill={colors.primaryDark}
      />
    </Svg>
  );
}
