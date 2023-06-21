import { useMemo, useState } from "react";

export function useBanner(visible = false, initialMessage = "") {
  const [showingBanner, setShowingBanner] = useState(visible);
  const [message, setMessage] = useState(initialMessage);

  const banner = useMemo(
    () => ({
      show: (message) => {
        if (message && typeof message === "string" && message.length > 0) {
          setMessage(message);
        }
        setShowingBanner(true);
      },
      hide: () => {
        setShowingBanner(false);
      },
      visibility: false,
      message: "",
    }),
    [],
  );

  banner.visibility = showingBanner;
  banner.message = message;

  return banner;
}
