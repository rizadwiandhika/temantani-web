import React, { useEffect } from "react";
import {
  LandCard,
  ArticleContent,
  Button,
  Banner,
  ButtonLink,
} from "../../../components";
import { useFetch, useBanner } from "../../../hooks";
import { landAPI } from "../../../api";
import { token } from "../../../util";

export function ListLandPage() {
  const landQuery = useFetch();
  const banner = useBanner();

  useEffect(() => {
    landQuery.trigger(() => landAPI.getAllOwnedLands(token.get()));
  }, [landQuery]);

  useEffect(() => {
    if (landQuery.error.happened) {
      banner.show(landQuery.error.message);
    }
  }, [banner, landQuery.error.happened, landQuery.error.message]);

  return (
    <>
      <Banner
        message={banner.message}
        visible={banner.visibility}
        onCloseClicked={banner.hide}
      />
      <ArticleContent title="My Registered Lands">
        <div className="my-6 flex justify-end">
          <ButtonLink text="Register new land" to="/lands/register" />
        </div>
        <div className="space-y-6">
          {landQuery.success &&
            landQuery.data
              .reverse()
              .map((land) => (
                <LandCard
                  key={land.id}
                  status={land.landStatus}
                  areaInHectares={land.area.valueInHectare}
                  link={`/lands/${land.id}`}
                  postalCode={land.address.postalCode}
                  street={land.address.street}
                  city={land.address.city}
                  picture={land.photos[0]}
                />
              ))}
          {landQuery.success && landQuery.data.length === 0 && (
            <p className="text-gray-600 text-sm text-center my-12">
              You don't have any registered lands.
            </p>
          )}
        </div>
      </ArticleContent>
    </>
  );
}
