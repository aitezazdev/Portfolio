"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Providers from "./providers";
import GlobalPreloader from "@/components/GlobalPreloader";
import CustomCursor from "@/components/CustomCursor";

export default function ClientLayout({ children }) {
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem("preloader-shown");

    if (alreadyLoaded) {
      setShowCursor(true);
      return;
    }

    const handlePreloaderComplete = () => {
      setShowCursor(true);
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
    };
  }, []);

  return (
    <>
      {showCursor && <CustomCursor />}
      <GlobalPreloader />
      <div className="page-overlay"></div>
      <Providers>
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
      </Providers>
    </>
  );
}
