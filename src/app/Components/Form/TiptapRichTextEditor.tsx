"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";

export interface TiptapRichTextEditorProps {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  rows?: number;
}

const TiptapRichTextEditor: React.FC<TiptapRichTextEditorProps> = ({
  label,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  placeholder: _placeholder = "Enter your text here...",
  value = "",
  onChange,
  required = false,
  maxLength,
  showCharCount = false,
  className = "",
  rows = 6,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        style: `min-height: ${rows * 1.5}rem; padding: 1rem;`,
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const getTextContent = () => {
    return editor?.getText() || "";
  };

  const getCharCount = () => {
    return getTextContent().length;
  };

  const isOverLimit = maxLength && getCharCount() > maxLength;

  if (!editor) {
    return (
      <div className={`tiptap-rich-text-editor ${className}`}>
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        {description && (
          <p className="form-text text-muted mb-2">{description}</p>
        )}

        {/* Loading placeholder */}
        <div className="tiptap-editor border rounded p-3 bg-light">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: `${rows * 1.5}rem` }}
          >
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            >
              <span className="visually-hidden">Loading editor...</span>
            </div>
            <span className="text-muted">Loading rich text editor...</span>
          </div>
        </div>
      </div>
    );
  }

  const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-sm ${
        isActive ? "btn-primary" : "btn-outline-secondary"
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className={`tiptap-rich-text-editor ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {description && (
        <p className="form-text text-muted mb-2">{description}</p>
      )}

      {/* Toolbar */}
      <div className="tiptap-toolbar border border-bottom-0 rounded-top p-2 bg-light">
        <div className="d-flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="btn-group me-2" role="group">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <strong>B</strong>
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <em>I</em>
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <s>S</s>
            </MenuButton>
          </div>

          {/* Headings */}
          <div className="btn-group me-2" role="group">
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              H1
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              H2
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
              title="Paragraph"
            >
              P
            </MenuButton>
          </div>

          {/* Lists */}
          <div className="btn-group me-2" role="group">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              •
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              1.
            </MenuButton>
          </div>

          {/* Alignment */}
          <div className="btn-group me-2" role="group">
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              ⬅
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              ↔
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              ➡
            </MenuButton>
          </div>

          {/* Block Elements */}
          <div className="btn-group" role="group">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              &quot;
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              —
            </MenuButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        className={`tiptap-editor border rounded-bottom ${
          isOverLimit ? "border-danger" : ""
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      {showCharCount && (
        <div className="d-flex justify-content-between mt-2">
          <small className={`text-muted ${isOverLimit ? "text-danger" : ""}`}>
            {getCharCount()}
            {maxLength && ` / ${maxLength} characters`}
          </small>
          {isOverLimit && (
            <small className="text-danger">Character limit exceeded</small>
          )}
        </div>
      )}
    </div>
  );
};

export default TiptapRichTextEditor;
