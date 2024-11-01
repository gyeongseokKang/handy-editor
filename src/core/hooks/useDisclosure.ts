"use client";

import { useCallback, useState } from "react";

import { useCallbackRef } from "./useCallbackRef";

export interface UseDisclosureProps {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?(): void;
  onOpen?(): void;
  onChange?(open: boolean): void;
}

/**
 * `useDisclosure` is a custom hook used to help handle common open, close, or toggle scenarios.
 */
export function useDisclosure(props: UseDisclosureProps = {}) {
  const {
    onClose: onCloseProp,
    onOpen: onOpenProp,
    onChange: onChangeProp,
    open: openProp,
  } = props;

  const handleOpen = useCallbackRef(onOpenProp);
  const handleClose = useCallbackRef(onCloseProp);
  const handleChange = useCallbackRef(onChangeProp);

  const [openState, setOpen] = useState(props.defaultOpen || false);

  const open = openProp !== undefined ? openProp : openState;

  const isControlled = openProp !== undefined;

  const onClose = useCallback(() => {
    if (!isControlled) {
      setOpen(false);
    }
    handleClose?.();
    handleChange?.(false); // 상태 변경 시 onChange 호출 (닫힐 때)
  }, [isControlled, handleClose, handleChange]);

  const onOpen = useCallback(() => {
    if (!isControlled) {
      setOpen(true);
    }
    handleOpen?.();
    handleChange?.(true);
  }, [isControlled, handleOpen, handleChange]);

  const onToggle = useCallback(() => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  }, [open, onOpen, onClose]);

  const onChange = useCallback(
    (value: boolean) => {
      if (value) {
        onOpen();
      } else {
        onClose();
      }
    },
    [onOpen, onClose]
  );

  return {
    open,
    onOpen,
    onClose,
    onToggle,
    onChange,
  };
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;
