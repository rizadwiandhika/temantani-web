import { useEffect } from "react";

import {
  Navbar,
  Banner,
  FundraisingCard,
  ArticleContent,
} from "../../components";
import { useBanner, useFetch } from "../../hooks";
import { investmentAPI } from "../../api";

export function ListFundraisingPage() {
  const banner = useBanner();
  const fundraisingsQuery = useFetch();

  useEffect(() => {
    fundraisingsQuery.trigger(investmentAPI.getFundarisings);
  }, [fundraisingsQuery]);

  return (
    <>
      <Navbar />
      <Banner
        message={banner.message}
        visible={banner.visibility}
        onCloseClicked={banner.hide}
      />
      <ArticleContent title="Open for Fundraisings">
        <div className="flex flex-col gap-4">
          {fundraisingsQuery.loading ? (
            <h3>Retreiving fundraising...</h3>
          ) : fundraisingsQuery.error.happened ? (
            <h3>{fundraisingsQuery.error.message}</h3>
          ) : fundraisingsQuery.success ? (
            fundraisingsQuery.data.map((f) => (
              <FundraisingCard
                key={f.id}
                fundraisingId={f.id}
                description={f.description}
                collectedFunds={f.bookedFunds}
                targetFunds={f.fundraisingTarget}
                deadline={new Date(f.tenorDeadline)}
              />
            ))
          ) : null}
        </div>
      </ArticleContent>
    </>
  );
}
