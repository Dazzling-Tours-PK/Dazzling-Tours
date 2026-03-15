"use client";
import React, { useState } from "react";

export interface ListManagerProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  addButtonText?: string;
  emptyStateText?: string;
  emptyStateIcon?: React.ReactNode;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  maxWords?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  itemClassName?: string;
  addButtonClassName?: string;
  removeButtonClassName?: string;
}

const ListManager: React.FC<ListManagerProps> = ({
  label,
  description,
  error: propError,
  required = false,
  placeholder = "Add item...",
  addButtonText = "Add",
  emptyStateText = "No items added yet",
  emptyStateIcon,
  items,
  onAdd,
  onRemove,
  maxItems,
  maxWords,
  maxLength,
  showCharCount = false,
  className = "",
  itemClassName = "",
  addButtonClassName = "",
  removeButtonClassName = "",
}) => {
  const [newItem, setNewItem] = useState("");
  const [localError, setLocalError] = useState("");

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleAdd = () => {
    const wordCount = getWordCount(newItem);

    if (maxWords && wordCount > maxWords) {
      setLocalError(
        `Each item must be ${maxWords} words or less (currently ${wordCount} words)`,
      );
      return;
    }

    if (newItem.trim() && (!maxItems || items.length < maxItems)) {
      onAdd(newItem.trim());
      setNewItem("");
      setLocalError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const canAdd = newItem.trim() && (!maxItems || items.length < maxItems);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}

      {description && <p className="form-description">{description}</p>}

      <div className="list-manager">
        <div className="add-item">
          <input
            type="text"
            value={newItem}
            onChange={(e) => {
              setNewItem(e.target.value);
              if (localError) setLocalError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={maxItems ? items.length >= maxItems : false}
            maxLength={maxLength}
            className="form-flex-1"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`btn-add ${addButtonClassName}`}
          >
            <i className="bi bi-plus"></i> {addButtonText}
          </button>
        </div>

        <div className="form-flex form-items-center form-justify-between form-mt-1">
          <div className="form-flex form-gap-3">
            {maxWords && (
              <div
                className={`form-text-xs ${getWordCount(newItem) > maxWords ? "form-text-red-500" : "form-text-gray-500"}`}
              >
                {getWordCount(newItem)}/{maxWords} words
              </div>
            )}

            {(showCharCount || maxLength) && (
              <div
                className={`form-text-xs ${maxLength && newItem.length >= maxLength ? "form-text-red-500" : "form-text-gray-500"}`}
              >
                {newItem.length}
                {maxLength ? `/${maxLength}` : ""} characters
              </div>
            )}
          </div>
        </div>

        {localError && (
          <p className="form-error form-mt-1">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {localError}
          </p>
        )}

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className={`item ${itemClassName}`}>
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={`btn-remove ${removeButtonClassName}`}
                title="Remove item"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="empty-state">
              {emptyStateIcon || <i className="bi bi-list"></i>}
              <p>{emptyStateText}</p>
            </div>
          )}
        </div>

        {maxItems && (
          <div className="form-text-xs form-text-gray-500 form-mt-1">
            {items.length}/{maxItems} items
          </div>
        )}
      </div>

      {propError && (
        <p className="form-error">
          <i className="bi bi-exclamation-circle form-error-icon"></i>
          {propError}
        </p>
      )}
    </div>
  );
};

export default ListManager;
