import React from "react";
import { ListManager } from "@/app/Components/Form";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";

interface ListsSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
}

export const ListsSection: React.FC<ListsSectionProps> = ({ form }) => {
  return (
    <>
      <div className="form-section">
        <div className="section-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <i
              className="bi bi-star"
              style={{ color: "#fd7d02", fontSize: "1.2rem" }}
            />
            Highlights
          </h3>
          <p style={{ marginTop: "0.5rem", color: "#6c757d" }}>
            Add key features and attractions that make this tour special
          </p>
        </div>
        <ListManager
          label="Highlights"
          description="Add key features and attractions that make this tour special"
          placeholder="e.g., Visit ancient temples, Scenic mountain views, Local cultural experience"
          addButtonText="Add Highlight"
          emptyStateText="No highlights added yet"
          emptyStateIcon={<i className="bi bi-star"></i>}
          items={form.values.highlights || []}
          onAdd={(item) =>
            form.setFieldValue("highlights", [
              ...(form.values.highlights || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "highlights",
              (form.values.highlights || []).filter((_, i) => i !== index),
            )
          }
          maxItems={10}
          maxWords={15}
          maxLength={100}
          showCharCount
        />
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <i
              className="bi bi-check-circle"
              style={{ color: "#fd7d02", fontSize: "1.2rem" }}
            />
            Includes
          </h3>
          <p style={{ marginTop: "0.5rem", color: "#6c757d" }}>
            List what&apos;s included in the tour price (meals, transportation,
            accommodation, etc.)
          </p>
        </div>
        <ListManager
          label="Includes"
          description="List what's included in the tour price (meals, transportation, accommodation, etc.)"
          placeholder="e.g., All meals included, Professional guide, Hotel accommodation, Airport transfers"
          addButtonText="Add Include"
          emptyStateText="No includes added yet"
          emptyStateIcon={<i className="bi bi-check-circle"></i>}
          items={form.values.includes || []}
          onAdd={(item) =>
            form.setFieldValue("includes", [
              ...(form.values.includes || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "includes",
              (form.values.includes || []).filter((_, i) => i !== index),
            )
          }
          maxWords={20}
          maxLength={150}
          showCharCount
          maxItems={10}
        />
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <i
              className="bi bi-x-circle"
              style={{ color: "#fd7d02", fontSize: "1.2rem" }}
            />
            Excludes
          </h3>
          <p style={{ marginTop: "0.5rem", color: "#6c757d" }}>
            List what&apos;s NOT included in the tour price (optional
            activities, personal expenses, etc.)
          </p>
        </div>
        <ListManager
          label="Excludes"
          description="List what's NOT included in the tour price (optional activities, personal expenses, etc.)"
          placeholder="e.g., International flights, Travel insurance, Personal expenses, Optional activities"
          addButtonText="Add Exclude"
          emptyStateText="No excludes added yet"
          emptyStateIcon={<i className="bi bi-x-circle"></i>}
          items={form.values.excludes || []}
          onAdd={(item) =>
            form.setFieldValue("excludes", [
              ...(form.values.excludes || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "excludes",
              (form.values.excludes || []).filter((_, i) => i !== index),
            )
          }
          maxWords={20}
          maxLength={150}
          showCharCount
          maxItems={10}
        />
      </div>
    </>
  );
};
