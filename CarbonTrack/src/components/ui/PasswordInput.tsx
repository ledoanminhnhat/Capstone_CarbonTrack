"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
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
          {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      }
    />
  );
}
