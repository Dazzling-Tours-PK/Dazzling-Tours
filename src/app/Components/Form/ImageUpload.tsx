"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useNotification, useUploadImages, useDeleteImage } from "@/lib/hooks";
import { Group, ActionIcon } from "../Common";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, UploadCloud, X } from "lucide-react";
import { ImageVariant, IMAGE_DIMENSIONS } from "@/lib/constants/imageDimensions";

export interface ImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  value?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
  disabled?: boolean;
  variant?: ImageVariant;
}

const ImageUpload: React.FC<ImageUploadProps> = React.memo(
  ({
    label,
    description,
    error,
    required = false,
    multiple = true,
    maxFiles = 3,
    maxSize = 5, // 5MB default
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
    value = [],
    onChange,
    className = "",
    disabled = false,
    variant,
  }) => {
    const { showError, showSuccess } = useNotification();
    const [isDragOver, setIsDragOver] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

    const uploadMutation = useUploadImages();
    const deleteMutation = useDeleteImage();

    // Update ref when onChange changes
    React.useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Clear input value when component unmounts
    React.useEffect(() => {
      const input = fileInputRef.current;
      return () => {
        if (input) {
          input.value = "";
        }
      };
    }, []);

    const handleFileSelect = useCallback(
      async (files: FileList | null) => {
        if (!files || files.length === 0 || disabled || uploadMutation.isPending) {
          return;
        }

        setInlineError(null);
        setIsValidating(true);

        const fileArray = Array.from(files);
        const validFiles: File[] = [];

        try {
          for (const file of fileArray) {
            if (!acceptedTypes.includes(file.type)) {
              const msg = `"${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`;
              setInlineError(msg);
              showError(msg);
              continue;
            }
            if (file.size > maxSize * 1024 * 1024) {
              const msg = `"${file.name}" exceeds the ${maxSize}MB size limit.`;
              setInlineError(msg);
              showError(msg);
              continue;
            }

            if (variant) {
              const expected = IMAGE_DIMENSIONS[variant];
              const isValidDimensions = await new Promise<boolean>((resolve) => {
                const img = new window.Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                  URL.revokeObjectURL(img.src);
                  // Strict or aspect ratio match: width and height match exact expected dimensions
                  resolve(img.width === expected.width && img.height === expected.height);
                };
                img.onerror = () => {
                  URL.revokeObjectURL(img.src);
                  resolve(false);
                };
              });

              if (!isValidDimensions) {
                const msg = `"${file.name}" does not match required dimensions of ${expected.width}x${expected.height}px.`;
                setInlineError(msg);
                showError(msg);
                continue;
              }
            }

            validFiles.push(file);
          }

          if (validFiles.length === 0) {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          // Check total file count
          if (value.length + validFiles.length > maxFiles) {
            const msg = `Maximum ${maxFiles} image${maxFiles === 1 ? "" : "s"} allowed.`;
            setInlineError(msg);
            showError(msg);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          // Upload files via mutation
          const formData = new FormData();
          validFiles.forEach((file) => {
            formData.append("files", file);
          });

          const result = await uploadMutation.mutateAsync(formData);
          const newUrls = result.data.map((item) => item.url);
          const updatedUrls = multiple ? [...value, ...newUrls] : newUrls;

          onChangeRef.current?.(updatedUrls);
          setInlineError(null);
          showSuccess("Image uploaded successfully");
        } catch (err) {
          console.error("Error uploading files:", err);
          const msg =
            err instanceof Error
              ? err.message
              : "Error uploading image. Please try again.";
          setInlineError(msg);
          showError(msg);
        } finally {
          setIsValidating(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      },
      [value, multiple, maxFiles, maxSize, acceptedTypes, disabled, showError, showSuccess, uploadMutation, variant],
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
      },
      [handleFileSelect],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleFileSelect(files);
        }
      },
      [handleFileSelect],
    );

    const removeImage = useCallback(
      async (index: number) => {
        if (disabled || deleteMutation.isPending) return;

        const imageUrl = value[index];

        // Optimistically update UI
        const newUrls = value.filter((_, i) => i !== index);

        if (onChangeRef.current) {
          onChangeRef.current(newUrls);
        } else if (onChange) {
          onChange(newUrls);
        }

        // Call API to delete image
        try {
          await deleteMutation.mutateAsync({ url: imageUrl });
        } catch (err) {
          console.error("Error calling delete API:", err);
        }
      },
      [value, disabled, onChange, deleteMutation],
    );

    const canAddMore = value.length < maxFiles;
    const isUploading = uploadMutation.isPending || isValidating;

    const handleUploadAreaClick = useCallback(() => {
      if (disabled || !canAddMore || isUploading) return;
      fileInputRef.current?.click();
    }, [disabled, canAddMore, isUploading]);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}

        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all min-h-[160px] text-center select-none",
            isDragOver && "border-[var(--theme)] bg-[var(--theme)]/5",
            (disabled || isUploading || !canAddMore)
              ? "bg-gray-50 cursor-not-allowed opacity-75"
              : "hover:border-[var(--theme)] hover:bg-gray-50/50 cursor-pointer active:scale-[0.99]"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadAreaClick}
          role="button"
          tabIndex={canAddMore && !isUploading && !disabled ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleUploadAreaClick();
            }
          }}
          aria-label={label || "Upload image"}
        >
          {/* Native file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="sr-only"
            disabled={disabled || isUploading || !canAddMore}
            tabIndex={-1}
          />

          <div className="flex flex-col items-center text-center gap-2">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <Loader2 className="h-9 w-9 text-[var(--theme)] animate-spin" />
                <p className="text-sm font-semibold text-gray-700">
                  {isValidating ? "Validating image..." : "Uploading image..."}
                </p>
                <p className="text-xs text-gray-400">Please wait a moment</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full text-gray-500 group-hover:text-[var(--theme)]">
                  <UploadCloud className="h-7 w-7 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {value.length > 0
                      ? `${value.length} image${value.length === 1 ? "" : "s"} selected`
                      : canAddMore
                        ? "Tap to choose photo or drag & drop"
                        : `Maximum ${maxFiles} images reached`}
                  </p>
                  {canAddMore && value.length > 0 && (
                    <p className="text-xs text-[var(--theme)] font-medium mt-0.5">
                      + Tap here to add more ({maxFiles - value.length} remaining)
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {acceptedTypes.map((t) => t.replace("image/", "").toUpperCase()).join(", ")} • Max {maxSize}MB
                  </p>
                </div>
              </>
            )}

            {variant && (
              <span className="inline-block text-[11px] font-semibold bg-amber-50 text-[#EF7C00] border border-amber-200 px-2.5 py-0.5 rounded-full">
                Required Dimensions: {IMAGE_DIMENSIONS[variant].label}
              </span>
            )}
          </div>
        </div>

        {/* Image Preview Grid */}
        {value.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 mb-1.5">
              Uploaded Images ({value.length}/{maxFiles})
            </p>
            <Group className="flex-wrap gap-2.5">
              {value.map((url, index) => (
                <div
                  key={index}
                  className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {!disabled && (
                    <div className="absolute inset-0 bg-black/30 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ActionIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        title="Remove image"
                        disabled={deleteMutation.isPending}
                        variant="subtle"
                        color="error"
                        size="sm"
                        className="text-white hover:text-red-500 bg-black/60 hover:bg-white rounded-full p-1 shadow transition-transform active:scale-95"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </ActionIcon>
                    </div>
                  )}
                </div>
              ))}
            </Group>
          </div>
        )}

        {/* Inline Error Display */}
        {(inlineError || error) && (
          <div className="p-2.5 mt-1 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-tight">{inlineError || error}</span>
          </div>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
