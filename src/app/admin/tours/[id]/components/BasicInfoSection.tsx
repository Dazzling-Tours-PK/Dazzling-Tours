import React from "react";
import { TextInput, NumberInput, Select } from "@/app/Components/Form";
import {
  TourStatus,
  TOUR_STATUS_OPTIONS,
  TOUR_DIFFICULTY_OPTIONS,
  TourPriceType,
  TOUR_PRICE_TYPE_OPTIONS,
} from "@/lib/enums";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";

interface BasicInfoSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
  categoryOptions: { value: string; label: string }[];
  setCategorySearchTerm: (term: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  categoryOptions,
  setCategorySearchTerm,
}) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <i
            className="bi bi-info-circle"
            style={{ color: "#fd7d02", fontSize: "1.2rem" }}
          />
          Basic Information
        </h3>
        <p style={{ marginTop: "0.5rem", color: "#6c757d" }}>
          Essential details about your tour package
        </p>
      </div>
      <div className="form-grid">
        <TextInput
          label="Tour Title"
          placeholder="e.g., Amazing 3-Day Cultural Heritage Tour"
          {...form.getFieldProps("title")}
          maxLength={100}
          showCharCount
          required
        />

        <NumberInput
          label="Price (PKR)"
          placeholder="10,000"
          {...form.getFieldProps("price")}
          min={0}
          step={1}
          currency="₨"
          required
        />

        <Select
          label="Price Type"
          value={form.values.priceType}
          onChange={(value) =>
            form.setFieldValue("priceType", value as TourPriceType)
          }
          data={TOUR_PRICE_TYPE_OPTIONS}
          required
        />

        <TextInput
          label="Duration"
          placeholder="e.g., 3 days, 5 days, 1 week"
          {...form.getFieldProps("duration")}
          maxLength={50}
          showCharCount
          required
        />

        <TextInput
          label="Location/Destination"
          placeholder="e.g., Paris, France or Bali, Indonesia"
          {...form.getFieldProps("location")}
          maxLength={100}
          showCharCount
          required
        />

        <Select
          label="Category"
          {...form.getFieldProps("category")}
          placeholder="Select Category"
          data={categoryOptions}
          required
          searchable
          onSearchChange={setCategorySearchTerm}
        />

        <NumberInput
          label="Maximum Group Size"
          placeholder="15"
          {...form.getFieldProps("groupSize")}
          min={1}
          max={50}
        />

        <Select
          label="Difficulty Level"
          {...form.getFieldProps("difficulty")}
          data={TOUR_DIFFICULTY_OPTIONS}
        />

        <Select
          label="Status"
          value={form.values.status}
          onChange={(value) =>
            form.setFieldValue("status", value as TourStatus)
          }
          data={TOUR_STATUS_OPTIONS}
        />
      </div>
    </div>
  );
};
