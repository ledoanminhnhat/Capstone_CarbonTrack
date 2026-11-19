"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Input, { type InputProps } from "./Input";

/** Ô mật khẩu có nút hiện / ẩn. */
export default function PasswordInput(props: Omit<InputProps, "type" | "icon" | "iconPosition">) {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      iconPosition="right"
      icon={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted hover:text-ink flex items-center"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      }
    />
  );
}
