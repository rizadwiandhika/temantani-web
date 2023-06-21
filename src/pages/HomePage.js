import { useEffect } from "react";

import { Navbar, Banner } from "../components";
import { useBanner } from "../hooks";

export function HomePage() {
  const banner = useBanner();

  useEffect(() => {
    setTimeout(() => {
      banner.show("Welcome!");
    }, 1500);
  }, [banner]);

  return (
    <>
      <Navbar />

      <Banner
        message={banner.message}
        visible={banner.visibility}
        onCloseClicked={banner.hide}
      />
      <div className="max-w-3xl mx-auto mt-8">Home Page</div>
    </>
  );
}
