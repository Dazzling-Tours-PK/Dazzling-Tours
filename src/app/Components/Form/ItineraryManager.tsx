"use client";
import React, { useState } from "react";
import { Badge, Button, Card, Group, Stack } from "../Common";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import Textarea from "./Textarea";

export interface ItineraryManagerProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  items: Array<{ day: number; title: string; description: string }>;
  onAdd: (item: { day: number; title: string; description: string }) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  className?: string;
}

const ItineraryManager: React.FC<ItineraryManagerProps> = ({
  label,
  description,
  error,
  required = false,
  items,
  onAdd,
  onRemove,
  maxItems,
  className = "",
}) => {
  const [newDay, setNewDay] = useState<number | undefined>(undefined);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();

    if (
      newDay !== undefined &&
      newDay > 0 &&
      trimmedTitle.length >= 3 &&
      trimmedDescription.length >= 10 &&
      (!maxItems || items.length < maxItems)
    ) {
      onAdd({
        day: newDay,
        title: trimmedTitle,
        description: trimmedDescription,
      });
      setNewDay(undefined);
      setNewTitle("");
      setNewDescription("");
    }
  };

  const canAdd =
    newDay !== undefined &&
    newDay > 0 &&
    newTitle.trim().length >= 3 &&
    newDescription.trim().length >= 10 &&
    (!maxItems || items.length < maxItems);

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
        <div className="add-item itinerary-form">
          <Stack>
            <Group grow fullWidth>
              <NumberInput
                label="Day"
                value={newDay}
                onChange={(value) => setNewDay(value)}
                placeholder="1"
                min={1}
              />
              <TextInput
                label="Location"
                value={newTitle}
                onChange={(value) => setNewTitle(value)}
                placeholder="e.g., Sakardu, Arrival & City Tour"
              />
            </Group>
            <Textarea
              label="Activity Description"
              value={newDescription}
              onChange={(value) => setNewDescription(value)}
              placeholder="e.g., Arrive at the airport, transfer to hotel, city tour including historical sites, lunch at local restaurant, evening free time"
              rows={2}
            />
          </Stack>
          <Button
            color="primary"
            onClick={handleAdd}
            disabled={!canAdd}
            leftIcon={<i className="bi bi-plus"></i>}
          >
            Add
          </Button>
        </div>

        <Stack spacing={12}>
          {items.map((item, index) => (
            <Card key={index} padding="md" variant="bordered">
              <Group justify="space-between" align="flex-start" fullWidth>
                <Stack spacing={4} className="form-flex-1">
                  <Group spacing={12} align="center">
                    <Badge color="blue" size="sm" radius="xl">
                      DAY {item.day}
                    </Badge>
                    <h4 className="day-title">{item.title}</h4>
                  </Group>
                  <p className="day-description">{item.description}</p>
                  {maxItems && (
                    <p className="form-text-xs form-text-gray-400">
                      {index + 1}/{maxItems} days
                    </p>
                  )}
                </Stack>
                <Button
                  color="error"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="form-flex-shrink-0"
                  title="Remove day"
                >
                  <i className="bi bi-x"></i>
                </Button>
              </Group>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-calendar-check"></i>
              <p>No itinerary days added yet</p>
            </div>
          )}
        </Stack>

        {maxItems && (
          <div className="form-text-xs form-text-gray-500 form-mt-2">
            {items.length}/{maxItems} days
          </div>
        )}
      </div>

      {error && (
        <p className="form-error">
          <i className="bi bi-exclamation-circle form-error-icon"></i>
          {error}
        </p>
      )}
    </div>
  );
};

export default ItineraryManager;
