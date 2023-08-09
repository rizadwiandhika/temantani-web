import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ArticleContent,
  SectionContent,
  LabelStatus,
  ProjectCard,
  Button,
  ButtonLink,
  Banner,
} from "../../../components";
import { landAPI, projectAPI } from "../../../api";
import {
  token as tokenStorage,
  isOnProposed,
  alreadyApproved,
} from "../../../util";
import { useDisableButton, useFetch, useBanner } from "../../../hooks";

const picture =
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80";

const statusColorMap = {
  AVAILABLE: "green",
  REQUIRES_CLEANING: "green",
  REJECTED: "red",
  CANCELED: "red",
};

export function DetailLandPage() {
  const { id: landId } = useParams();
  const landQuery = useFetch();
  const projectQuery = useFetch();
  const cancelMutation = useFetch();
  const cancelButton = useDisableButton("Cancel proposal", "Cancelling...");
  const reviseButton = useDisableButton("Revise");
  const banner = useBanner();

  const cancelProposal = () => {
    cancelButton.disable();
    reviseButton.disable();
    cancelMutation.trigger(() =>
      landAPI.cancelProposal(tokenStorage.get(), landId),
    );
  };

  useEffect(() => {
    if (cancelMutation.loading) {
      return;
    }
    cancelButton.enable();
    reviseButton.enable();

    if (cancelMutation.success) {
      landQuery.triggerSilently(() =>
        landAPI.getDetailLand(tokenStorage.get(), landId),
      );
      banner.show("Land proposal has been cancelled!");
    }
  }, [
    banner,
    cancelButton,
    cancelMutation.loading,
    cancelMutation.success,
    landId,
    landQuery,
    reviseButton,
  ]);

  useEffect(() => {
    const token = tokenStorage.get();
    landQuery.trigger(() => landAPI.getDetailLand(token, landId));
    projectQuery.trigger(() => projectAPI.getProjectsOfLand(token, landId));
  }, [landId, landQuery, projectQuery]);

  let revisionOrRejectionMessages = [];
  if (landQuery.success) {
    revisionOrRejectionMessages = [
      ...landQuery.data.proposal.reivisionMessages
        .filter((m) => m !== "")
        .map((m) => <li key={m}>{m}</li>),
      ...landQuery.data.proposal.failureMessages
        .filter((m) => m !== "")
        .map((m) => <li key={m}>{m}</li>),
    ];
  }

  return (
    <>
      <Banner
        message={banner.message}
        visible={banner.visibility}
        onCloseClicked={banner.hide}
      />
      <ArticleContent>
        {landQuery.success && (
          <img
            src={landQuery.data.photos[0]}
            alt="fundraising img"
            className="block object-cover max-h-72 w-full rounded shadow-xl"
          />
        )}

        {landQuery.success && isOnProposed(landQuery.data.landStatus) && (
          <div className="my-4 text-right space-x-2">
            <Button
              text={cancelButton.text}
              disabled={cancelButton.status}
              className="w-36"
              type="secondary"
              onClick={cancelProposal}
            />
            <ButtonLink
              to={`/lands/register?id=${landQuery.data.id}`}
              text={reviseButton.text}
              disabled={reviseButton.status}
              className="w-36"
            />
          </div>
        )}

        {landQuery.success && (
          <SectionContent>
            <h3 className="font-bold text-xl">
              {landQuery.data.address.city}{" "}
              <LabelStatus
                color={statusColorMap[landQuery.data.landStatus] || "yellow"}
                status={landQuery.data.landStatus}
              />
            </h3>
            <div className="leading-relaxed my-4 text-gray-600">
              <p>
                {landQuery.data.address.street}, {landQuery.data.address.city} (
                {landQuery.data.address.postalCode})
              </p>
              <p>{landQuery.data.area.valueInHectare} Hectare(s)</p>
              <p>
                Proposed at:{" "}
                {new Date(landQuery.data.proposal.proposedAt).toDateString()}
              </p>
            </div>
          </SectionContent>
        )}

        {landQuery.success && !alreadyApproved(landQuery.data.landStatus) && (
          <SectionContent title="Revision / rejection" noBold>
            {revisionOrRejectionMessages.length > 0 ? (
              <ul className="list-disc ml-4 text-gray-600 space-y-2">
                {revisionOrRejectionMessages.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No messages.</p>
            )}
          </SectionContent>
        )}

        {landQuery.success && alreadyApproved(landQuery.data.landStatus) && (
          <SectionContent title="Assesment" noBold>
            <table className="border-separate border-spacing-x-1 text-gray-600">
              <tbody>
                <tr className="space-x-10">
                  <td>• Harvest suitabilities</td>
                  <td>:</td>
                  <td>
                    {landQuery.data.assesment.harvestSuitabilities.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td>• Water availability</td>
                  <td>:</td>
                  <td>{landQuery.data.assesment.waterAvailabilityStatus}</td>
                </tr>
                <tr>
                  <td>• Height</td>
                  <td>:</td>
                  <td>{landQuery.data.assesment.groundHeight.value}</td>
                </tr>
                <tr>
                  <td>• Soil pH</td>
                  <td>:</td>
                  <td>{landQuery.data.assesment.soilPh}</td>
                </tr>
                <tr>
                  <td>• Usage history</td>
                  <td>:</td>
                  <td>{landQuery.data.landUsageHistory || "None."}</td>
                </tr>
              </tbody>
            </table>
          </SectionContent>
        )}

        {projectQuery.success &&
          landQuery.success &&
          alreadyApproved(landQuery.data.landStatus) && (
            <SectionContent title="Projects" noBold>
              <p className="text-gray-600 mb-8">
                Agriculture projects that using this land:
              </p>
              <div className="space-y-6">
                {projectQuery.data.reverse().map((project) => (
                  <ProjectCard
                    key={project.id}
                    harvest={project.harvest}
                    description={project.description}
                    link={`/projects/${project.id}`}
                    projectId={project.id}
                    status={project.status}
                    startedAt={new Date(project.createdAt)}
                  />
                ))}
              </div>
            </SectionContent>
          )}
      </ArticleContent>
    </>
  );
}
