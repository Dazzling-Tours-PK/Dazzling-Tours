"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useNotification } from "@/lib/hooks";
import { Group, ActionIcon } from "../Common";

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
  }) => {
    const { showError } = useNotification();
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

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
        console.log(
          "handleFileSelect called with:",
          files?.length || 0,
          "files"
        );

        if (!files || disabled) {
          console.log("No files or disabled:", { files: !!files, disabled });
          return;
        }

        const fileArray = Array.from(files);
        console.log("Processing files:", fileArray.length);

        const validFiles: File[] = [];

        // Validate files
        for (const file of fileArray) {
          console.log("Validating file:", file.name, file.type, file.size);
          if (!acceptedTypes.includes(file.type)) {
            showError(`${file.name} is not a supported image type`);
            continue;
          }
          if (file.size > maxSize * 1024 * 1024) {
            showError(
              `${file.name} is too large. Maximum size is ${maxSize}MB`
            );
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          console.log("No valid files after validation");
          return;
        }

        // Check total file count
        if (value.length + validFiles.length > maxFiles) {
          showError(`Maximum ${maxFiles} images allowed`);
          return;
        }

        console.log("Starting file processing...");
        setIsUploading(true);

        try {
          // Convert files to data URLs for preview
          const newUrls: string[] = [];
          for (const file of validFiles) {
            console.log("Converting file to data URL:", file.name);
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                console.log("FileReader success for:", file.name);
                resolve(reader.result as string);
              };
              reader.onerror = () => {
                console.error("FileReader error for:", file.name);
                reject(new Error(`Failed to read ${file.name}`));
              };
              reader.readAsDataURL(file);
            });
            newUrls.push(dataUrl);
          }

          const updatedUrls = multiple ? [...value, ...newUrls] : newUrls;
          console.log("Adding images:", {
            current: value.length,
            new: newUrls.length,
            total: updatedUrls.length,
          });

          // Call onChange using ref to avoid dependency issues
          onChangeRef.current?.(updatedUrls);
          console.log("onChange called with", updatedUrls.length, "images");
        } catch (err) {
          console.error("Error processing files:", err);
          showError("Error processing images");
        } finally {
          setIsUploading(false);
          console.log("File processing completed");
        }
      },
      [value, multiple, maxFiles, maxSize, acceptedTypes, disabled, showError]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
      },
      [handleFileSelect]
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
        console.log("File input changed:", files?.length || 0, "files");

        if (files && files.length > 0) {
          console.log("Files selected, processing...");
          // Process files immediately
          handleFileSelect(files);
        } else {
          console.log("No files selected (user cancelled)");
        }

        // Don't clear the input value immediately - let it stay for re-selection
        // The input will be cleared when new files are selected
      },
      [handleFileSelect]
    );

    const removeImage = useCallback(
      (index: number) => {
        if (disabled) return;
        console.log("Removing image at index:", index);
        console.log("Current images:", value.length);
        const newUrls = value.filter((_, i) => i !== index);
        console.log("New images count:", newUrls.length);
        console.log("Calling onChange with:", newUrls);

        // Try both onChange methods to ensure state update
        if (onChangeRef.current) {
          onChangeRef.current(newUrls);
        } else if (onChange) {
          onChange(newUrls);
        }
      },
      [value, disabled, onChange]
    );

    const canAddMore = value.length < maxFiles;

    const handleUploadAreaClick = useCallback(() => {
      if (disabled || !canAddMore) return;
      fileInputRef.current?.click();
    }, [disabled, canAddMore]);

    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        {description && <p className="form-description">{description}</p>}

        {/* Upload Area */}
        <div
          className={`image-upload-area ${isDragOver ? "drag-over" : ""} ${
            disabled ? "disabled" : ""
          } ${canAddMore ? "clickable" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadAreaClick}
          style={{ cursor: disabled || !canAddMore ? "default" : "pointer" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="upload-content">
            <i className="bi bi-cloud-upload upload-icon"></i>
            <p className="upload-text">
              {isUploading
                ? "Uploading..."
                : value.length > 0
                ? `${value.length} image${
                    value.length === 1 ? "" : "s"
                  } selected • Click here to add more`
                : canAddMore
                ? "Drag images here or click to select"
                : `Maximum ${maxFiles} images reached`}
            </p>
            <p className="upload-hint">
              {acceptedTypes.join(", ")} • Max {maxSize}MB each
            </p>
          </div>
        </div>

        {/* Image Preview Grid */}
        {value.length > 0 && (
          <Group>
            {value.map((url, index) => (
              <div
                key={index}
                className="image-preview-item"
                style={{ position: "relative" }}
              >
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={120}
                  height={120}
                  className="preview-image"
                />
                {!disabled && (
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    title="Remove image"
                  >
                    <i className="bi bi-x"></i>
                  </ActionIcon>
                )}
              </div>
            ))}
          </Group>
        )}

        {error && (
          <p className="form-error">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {error}
          </p>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
