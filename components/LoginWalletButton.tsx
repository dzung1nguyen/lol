"use client";

import { useTranslations } from "next-intl";
import React, { useCallback } from "react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { SigninMessage } from "../utils/SigninMessage";
import bs58 from "bs58";
import { useEffect } from "react";
import IconWallet from "./icons/IconWallet";
import { useGlobalStore } from "@/providers/global-store-provider";

export default function LoginWalletButton() {
  const t = useTranslations("");
  const { status } = useSession();
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { authenticated, isHandelingLogin, setIsHandelingLogin } =
    useGlobalStore((state) => state);

  const handleSignIn = useCallback(async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
        return;
      }

      setIsHandelingLogin(true);

      const csrf = await getCsrfToken();

      if (!csrf) {
        setIsHandelingLogin(false);
        console.error("the csrf is not found");
        return;
      }

      if (!wallet.publicKey) {
        setIsHandelingLogin(false);
        console.error("Can not connect wallet publicKey");
        return;
      }

      if (!wallet.signMessage) {
        setIsHandelingLogin(false);
        console.error("Can not connect wallet signMessage");
        return;
      }

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn("Solana", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      setIsHandelingLogin(false);
      console.log(error);
    }
  }, [setIsHandelingLogin, wallet, walletModal]);

  useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [wallet.connected, status]);

  return (
    <>
      <button
        type="button"
        disabled={authenticated === undefined || isHandelingLogin}
        className="w-full btn btn-neutral"
        onClick={handleSignIn}
      >
        <IconWallet className="h-6 w-6 mr-4" />
        <span>{t("Connect Wallet")}</span>
      </button>
    </>
  );
}
