import React from "react";
import { Textarea, TiptapRichTextEditor } from "@/app/Components/Form";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";

interface DescriptionsSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
}

export const DescriptionsSection: React.FC<DescriptionsSectionProps> = ({
  form,
}) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <i
            className="bi bi-file-text"
            style={{ color: "#fd7d02", fontSize: "1.2rem" }}
          />
          Tour Descriptions
        </h3>
        <p style={{ marginTop: "0.5rem", color: "#6c757d" }}>
          Provide detailed information about your tour
        </p>
      </div>
      <div className="form-group">
        <Textarea
          label="Short Description"
          description="Brief overview (2-3 sentences) that appears in tour listings"
          {...form.getFieldProps("shortDescription")}
          placeholder="e.g., Discover the rich cultural heritage of ancient temples and bustling markets in this immersive 3-day journey through historic landmarks and local traditions."
          rows={3}
          maxLength={200}
          showCharCount
          required
        />
      </div>
      <div className="form-group">
        <TiptapRichTextEditor
          label="Full Description"
          description="Detailed description that appears on the tour details page"
          {...form.getFieldProps("description")}
          placeholder="e.g., Embark on an unforgettable journey through centuries of history and culture. This comprehensive tour takes you through ancient temples, traditional villages, and modern cities, offering a perfect blend of historical exploration and contemporary experiences."
          rows={6}
          maxLength={2000}
          showCharCount
          required
        />
      </div>
    </div>
  );
};
