"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** nút xác nhận màu đỏ (xóa…) */
  danger?: boolean;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Bọc ngoài app; dùng `const confirm = useConfirm(); if (await confirm({...}))`. */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(v: boolean) => void>(undefined);

  const confirm = useCallback<ConfirmFn>(
    (o) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpts(o);
      }),
    []
  );

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = undefined;
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!opts}
        onClose={() => close(false)}
        title={opts?.title}
        accent={opts?.danger ? "sunrise" : "brand"}
        maxWidth="max-w-[400px]"
      >
        {opts?.message && <p className="m-0 mb-6 text-muted text-[0.95rem]">{opts.message}</p>}
        <div className="flex gap-3">
          <Button variant="outline" size="full" onClick={() => close(false)}>
            {opts?.cancelText ?? "Cancel"}
          </Button>
          <Button
            variant={opts?.danger ? "danger" : "gradient"}
            size="full"
            onClick={() => close(true)}
            autoFocus
          >
            {opts?.confirmText ?? "Confirm"}
          </Button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
}
