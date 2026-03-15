"use client";
import React, { useState } from "react";

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  id?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = "",
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : [],
  );

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`accordion-container ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={item.id || index}
            className={`accordion-item mb-3 ${isOpen ? "active" : ""}`}
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "white",
              transition: "all 0.3s ease",
              boxShadow: isOpen ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-100 border-0 d-flex justify-content-between align-items-center p-3 text-start"
              style={{
                backgroundColor: isOpen ? "#f8f9fa" : "white",
                color: "#2c3e50",
                fontWeight: 600,
                fontSize: "1rem",
                transition: "background-color 0.2s ease",
              }}
            >
              <span>{item.title}</span>
              <i
                className={`bi bi-chevron-down transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                style={{
                  transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              ></i>
            </button>
            <div
              style={{
                maxHeight: isOpen ? "2000px" : "0",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="p-4" style={{ backgroundColor: "white" }}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
