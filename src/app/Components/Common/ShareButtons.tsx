"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

export interface ShareButtonsProps {
  /** Optional custom URL to share. Defaults to canonical site URL + pathname */
  url?: string;
  /** Title of the item being shared */
  title?: string;
  /** Custom heading text. Defaults to "Share This Post" or "Share This Tour" */
  heading?: string;
  /** Custom CSS classes for container */
  className?: string;
  /** Layout mode */
  layout?: "horizontal" | "vertical" | "inline";
  /** Optional subtitle or description */
  description?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = "Dazzling Tours",
  heading = "Share This",
  className = "",
  layout = "horizontal",
}) => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Compute canonical URL (reliable on server and client)
  const canonicalOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const fallbackOrigin = typeof window !== "undefined" ? window.location.origin : "https://dazzlingtours.pk";
  const resolvedOrigin = canonicalOrigin || fallbackOrigin;
  const currentPath = pathname || "";
  const resolvedUrl = url || `${resolvedOrigin}${currentPath}`;

  const encodedUrl = encodeURIComponent(resolvedUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = resolvedUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const isInline = layout === "inline";

  return (
    <div
      className={
        isInline
          ? `flex flex-wrap items-center gap-3 ${className}`
          : `bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${className}`
      }
    >
      {heading && !isInline && (
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-[#EF7C00] rounded-full inline-block"></span>
            {heading}
          </h4>
        </div>
      )}

      <div className={`flex flex-wrap items-center gap-3 ${layout === "vertical" ? "flex-col !items-stretch" : ""}`}>
        {/* WhatsApp — Main highlight */}
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 h-12 rounded-xl bg-[#25D366] text-white hover:bg-[#20b858] transition-all shadow-sm hover:shadow-md font-medium text-sm group"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <Icon name="whatsapp" size={22} className="text-white group-hover:scale-110 transition-transform" />
          <span className="font-semibold">WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors border border-gray-200 hover:border-transparent group"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Icon name="facebook" size={20} className="group-hover:scale-110 transition-transform" />
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-colors border border-gray-200 hover:border-transparent group"
          title="Share on X (Twitter)"
          aria-label="Share on X (Twitter)"
        >
          <Icon name="twitter-x" size={18} className="group-hover:scale-110 transition-transform" />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors border border-gray-200 hover:border-transparent group"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Icon name="linkedin" size={20} className="group-hover:scale-110 transition-transform" />
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`flex items-center justify-center gap-2 px-4 h-12 rounded-xl border transition-all text-sm font-medium cursor-pointer ${
            copied
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-gray-200"
          }`}
          title={copied ? "Link Copied!" : "Copy Link to Clipboard"}
          aria-label={copied ? "Link Copied" : "Copy Link"}
        >
          <Icon
            name={copied ? "check" : "copy"}
            size={18}
            className={copied ? "text-emerald-600" : "text-gray-600"}
          />
          <span className="font-semibold">{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
