"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import Button from "./Button";
import Text from "./Text";
import Title from "./Title";
import Group from "./Group";

export interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  color?: "primary" | "error" | "warning" | "success";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  color = "primary",
}) => {
  return (
    <Modal
      show={opened}
      onHide={onClose}
      centered
      className="confirm-modal"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body style={{ padding: "1.5rem" }}>
        <Title order={4} style={{ marginBottom: "0.75rem" }}>
          {title}
        </Title>
        <Text size="sm" color="dimmed" style={{ marginBottom: "1.5rem" }}>
          {children}
        </Text>
        <Group position="right" spacing={12}>
          <Button
            variant="outline"
            color="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button color={color} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
