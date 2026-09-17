"use client";
import React from "react";
import {
  Search, PlusCircle, Trash2, Pencil, Eye, CheckCircle, XCircle, AlertTriangle, Info,
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Home, User, Calendar, Clock, MapPin, Phone, Mail, Star, StarHalf, Camera, Image as ImageIcon,
  Images, CloudUpload, LogOut, LogIn, UserCircle, Grid, List, MessageSquare, Reply, Share,
  Tag, Bookmark, Heart, Settings, Bell, ShieldCheck, FileText, Inbox, Circle, MinusCircle,
  Check, X, HelpCircle, LayoutDashboard, Folder, Map, MessageSquareQuote, BookOpen, MessageCircle, Loader2,
  Activity, Users, Minus, Plus, Shield, Maximize, CornerUpLeft, CornerDownRight, Send,
  RefreshCw, AlertOctagon, ShieldAlert, PlayCircle, Link as LinkIcon, Copy,
  type LucideIcon
} from "lucide-react";

// Custom SVG definitions for brand icons that are no longer in lucide-react
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customIcons: Record<string, React.FC<any>> = {
  facebook: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  ),
  twitter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
  ),
  instagram: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
  ),
  linkedin: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
  ),
  youtube: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6 3.9 3.6 5 3.6 5.5 3.5 9.1 3.2 12 3.2 12 3.2s2.9 0 6.5.3c.5.1 1.6.1 2.5 1.1.7.8.9 2.5.9 2.5s.3 2 .3 4v2.4c0 2-.3 4-.3 4s-.2 1.7-.9 2.5c-.9 1-2 1-2.5 1.1-3.6.3-6.5.3-6.5.3s-2.9 0-6.5-.3c-.5-.1-1.6-.1-2.5-1.1-.7-.8-.9-2.5-.9-2.5s-.3-2-.3-4V11c0-2 .3-4 .3-4z" /><path d="m9.8 14.8 5.7-3.2-5.7-3.2z" /></svg>
  ),
  "twitter-x": (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4l11.733 16h4.267l-11.733-16z" /><path d="M4 20l6.768-6.768m2.46-2.46L20 4" /></svg>
  ),
  whatsapp: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.003 2C6.48 2 2 6.48 2 12c0 1.774.476 3.5 1.38 5.008L2 22l5.136-1.348A9.967 9.967 0 0 0 12.003 22c5.523 0 10-4.48 10-10S17.526 2 12.003 2zm0 18.25c-1.588 0-3.148-.427-4.51-1.238l-.323-.191-3.047.8 0.813-2.966-.21-.34A8.216 8.216 0 0 1 3.75 12c0-4.558 3.708-8.25 8.253-8.25 4.545 0 8.247 3.692 8.247 8.25s-3.702 8.25-8.247 8.25zm4.524-6.184c-.247-.124-1.464-.723-1.69-.805-.227-.083-.392-.124-.557.124-.165.247-.64.805-.784.97-.144.165-.288.185-.536.062-.247-.124-1.042-.385-1.986-1.226-.734-.656-1.23-1.465-1.374-1.713-.144-.247-.015-.38.108-.503.112-.111.247-.288.371-.432.123-.144.164-.247.247-.412.082-.165.041-.309-.021-.432-.062-.124-.556-1.34-.762-1.836-.2-.482-.404-.417-.556-.425-.144-.006-.309-.008-.474-.008-.165 0-.433.062-.659.309-.226.247-.864.846-.864 2.063s.885 2.394 1.009 2.559c.123.165 1.741 2.66 4.221 3.73.59.255 1.05.407 1.409.52.592.188 1.131.162 1.557.098.474-.071 1.463-.599 1.669-1.177.206-.579.206-1.074.144-1.177-.062-.103-.226-.165-.474-.288z" />
    </svg>
  ),
  tiktok: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
  )
};

export type IconName = string;

const iconMap: Record<string, LucideIcon> = {
  "search": Search,
  "plus-circle": PlusCircle,
  "trash": Trash2,
  "pencil": Pencil,
  "eye": Eye,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "exclamation-triangle": AlertTriangle,
  "info-circle": Info,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "house": Home,
  "person": User,
  "calendar": Calendar,
  "clock": Clock,
  "geo-alt": MapPin,
  "telephone": Phone,
  "envelope": Mail,
  "star-fill": Star,
  "star-half": StarHalf,
  "star": Star,
  "camera": Camera,
  "image": ImageIcon,
  "images": Images,
  "cloud-upload": CloudUpload,
  "box-arrow-right": LogOut,
  "box-arrow-in-right": LogIn,
  "person-circle": UserCircle,
  "grid": Grid,
  "list": List,
  "chat-left-text": MessageSquare,
  "reply": Reply,
  "share": Share,
  "tag": Tag,
  "bookmark": Bookmark,
  "heart": Heart,
  "heart-fill": Heart,
  "gear": Settings,
  "bell": Bell,
  "shield-check": ShieldCheck,
  "file-earmark-text": FileText,
  "inbox": Inbox,
  "circle-fill": Circle,
  "dash-circle": MinusCircle,
  "check-lg": Check,
  "x-lg": X,
  "speedometer2": LayoutDashboard,
  "folder": Folder,
  "map": Map,
  "chat-quote": MessageSquareQuote,
  "journal-text": BookOpen,
  "chat-dots": MessageCircle,
  "caret-down-fill": ChevronDown,
  "loader-2": Loader2,
  // Direct Lucide name mappings
  "activity": Activity,
  "users": Users,
  "minus": Minus,
  "plus": Plus,
  "shield": Shield,
  "maximize": Maximize,
  "corner-up-left": CornerUpLeft,
  "corner-down-right": CornerDownRight,
  "send": Send,
  "user": User,
  "mail": Mail,
  "phone": Phone,
  "message-square": MessageSquare,
  "x": X,
  "map-pin": MapPin,
  "expand": Maximize,
  "shield-lock": ShieldAlert,
  "play-circle": PlayCircle,
  "refresh-cw": RefreshCw,
  "link": LinkIcon,
  "copy": Copy,
  "check": Check,
  // Bootstrap-fill to Lucide mappings
  "envelope-fill": Mail,
  "telephone-fill": Phone,
  "check-circle-fill": CheckCircle,
  "exclamation-triangle-fill": AlertTriangle,
  "exclamation-circle-fill": AlertTriangle,
  "info-circle-fill": Info,
  "exclamation-octagon": AlertOctagon,
  "arrow-clockwise": RefreshCw,
};

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /** Icon name (Bootstrap name mapped to Lucide) */
  name: IconName | (string & {});
  /** Icon size */
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
  // Remove "bi-" or "bi bi-" prefix if present
  let cleanName = name;
  if (name.startsWith("bi bi-")) cleanName = name.replace("bi bi-", "");
  else if (name.startsWith("bi-")) cleanName = name.replace("bi-", "");

  // Check if it's a custom icon (like social media)
  const CustomIcon = customIcons[cleanName];
  if (CustomIcon) {
    return (
      <CustomIcon
        width={size}
        height={size}
        color={color}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  const LucideComponent = iconMap[cleanName] || HelpCircle;

  const isFilled = name.includes("fill");
  const iconSize = typeof size === "number" ? size : (size ? parseInt(size as string, 10) : 16);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }} className={className} {...rest}>
      <LucideComponent
        size={iconSize}
        color={color || "currentColor"}
        fill={isFilled ? "currentColor" : "none"}
      />
    </span>
  );
};

export default Icon;
