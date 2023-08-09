import React, { useEffect } from "react";
import { landAPI } from "../../../api";
import { ArticleContent, LandCard } from "../../../components";
import { useFetch } from "../../../hooks";
import { token as tokenStorage } from "../../../util";

export function ListRegisteredLandPage() {
  const landQuery = useFetch();

  useEffect(() => {
    landQuery.trigger(() => landAPI.getAllLandsAsAdmin(tokenStorage.get()));
  }, [landQuery]);

  return (
    <ArticleContent title="Registered Lands">
      <div className="flex flex-col gap-4">
        {landQuery.success &&
          landQuery.data
            .reverse()
            .map((land) => (
              <LandCard
                key={land.id}
                link={`/admin/lands/${land.id}`}
                areaInHectares={land.area.valueInHectare}
                city={land.address.city}
                postalCode={land.address.postalCode}
                street={land.address.street}
                status={land.landStatus}
                picture={land.photos[0]}
              />
            ))}
      </div>
    </ArticleContent>
  );
}
