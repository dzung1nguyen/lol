"use client";

import React, { useEffect } from "react";
import { useGlobalStore } from "@/providers/global-store-provider";
import LoginForm from "../LoginForm";

export default function ModalLogin() {
  const { authenticated } = useGlobalStore((state) => state);

  useEffect(() => {
    if (authenticated === true) {
      const loginModal = document.getElementById("loginModal");
      // @ts-ignore
      if (loginModal && loginModal.close) {
        // @ts-ignore
        loginModal.close();
      }
    }
  }, [authenticated]);

  return (
    <>
      <dialog id="loginModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <LoginForm />
        </div>
      </dialog>
    </>
  );
}
