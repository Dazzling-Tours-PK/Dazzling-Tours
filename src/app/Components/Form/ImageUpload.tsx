"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useNotification, useUploadImages, useDeleteImage } from "@/lib/hooks";
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
    const { showError, showSuccess } = useNotification();
    const [isDragOver, setIsDragOver] = useState(false);
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
        console.log(
          "handleFileSelect called with:",
          files?.length || 0,
          "files",
        );

        if (!files || disabled || uploadMutation.isPending) {
          console.log("No files, disabled, or already uploading:", { 
            files: !!files, 
            disabled, 
            uploading: uploadMutation.isPending 
          });
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
              `${file.name} is too large. Maximum size is ${maxSize}MB`,
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

        console.log("Starting file upload to Cloudinary...");

        try {
          // Upload files to Cloudinary via mutation
          const formData = new FormData();
          validFiles.forEach((file) => {
            formData.append("files", file);
          });

          const result = await uploadMutation.mutateAsync(formData);

          // Extract URLs from Cloudinary response
          const newUrls = result.data.map((item) => item.url);

          const updatedUrls = multiple ? [...value, ...newUrls] : newUrls;
          console.log("Images uploaded successfully:", {
            current: value.length,
            new: newUrls.length,
            total: updatedUrls.length,
          });

          // Call onChange using ref to avoid dependency issues
          onChangeRef.current?.(updatedUrls);
          showSuccess("Images uploaded successfully");
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (err) {
          console.error("Error uploading files:", err);
          showError(
            err instanceof Error
              ? err.message
              : "Error uploading images. Please try again.",
          );
        }
      },
      [value, multiple, maxFiles, maxSize, acceptedTypes, disabled, showError, showSuccess, uploadMutation],
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
      [handleFileSelect],
    );

    const removeImage = useCallback(
      async (index: number) => {
        if (disabled || deleteMutation.isPending) return;
        
        const imageUrl = value[index];
        console.log("Removing image at index:", index, "URL:", imageUrl);
        
        // Optimistically update UI
        const newUrls = value.filter((_, i) => i !== index);
        
        if (onChangeRef.current) {
          onChangeRef.current(newUrls);
        } else if (onChange) {
          onChange(newUrls);
        }

        // Call API to delete from Cloudinary via mutation
        try {
          await deleteMutation.mutateAsync({ url: imageUrl });
          console.log("Image deleted from Cloudinary successfully");
        } catch (err) {
          console.error("Error calling delete API:", err);
          // Optional: handle error notification
        }
      },
      [value, disabled, onChange, deleteMutation],
    );

    const canAddMore = value.length < maxFiles;

    const handleUploadAreaClick = useCallback(() => {
      if (disabled || !canAddMore || uploadMutation.isPending) return;
      fileInputRef.current?.click();
    }, [disabled, canAddMore, uploadMutation.isPending]);

    const isUploading = uploadMutation.isPending;

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
            disabled || isUploading ? "disabled" : ""
          } ${canAddMore && !isUploading ? "clickable" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadAreaClick}
          style={{ cursor: disabled || !canAddMore || isUploading ? "default" : "pointer" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <div className="upload-content">
            <i className={`bi ${isUploading ? "bi-arrow-repeat spin" : "bi-cloud-upload"} upload-icon`}></i>
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
                    disabled={deleteMutation.isPending}
                  >
                    <i className={`bi ${deleteMutation.isPending ? "bi-arrow-repeat spin" : "bi-x"}`}></i>
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
  },
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
