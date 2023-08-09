import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { landAPI, projectAPI } from "../../../api";
import { useDisableButton, useFetch, useBanner } from "../../../hooks";
import {
  token as tokenStorage,
  getValueThen,
  isOnProposed,
  alreadyApproved,
  flatened,
  camelCaseToCapitalized,
} from "../../../util";
import {
  ArticleContent,
  SectionContent,
  LabelStatus,
  Form,
  Button,
  Banner,
} from "../../../components";

const picture =
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80";

const approvalStatusOp = [
  { value: "APPROVED", display: "APPROVED" },
  { value: "REQUIRES_CLEANING", display: "REQUIRES CLEANING" },
];
const waterAvailabilityStatusOp = [
  { value: "ABUNDANT", display: "ABUNDANT" },
  { value: "LIMITED", display: "LIMITED" },
  { value: "SEASONAL", display: "SEASONAL" },
  { value: "SCARCITY", display: "SCARCITY" },
];
const statusColorMap = {
  AVAILABLE: "green",
  REQUIRES_CLEANING: "green",
  REJECTED: "red",
  CANCELED: "red",
};

function reducer(state, [key = "", value = ""]) {
  return { ...state, [key]: value };
}

export function DetailLandPage() {
  const { id: landId } = useParams();
  const [role] = useMemo(() => tokenStorage.getRoles(), []);
  const navigate = useNavigate();

  const landQuery = useFetch();
  const projectMutation = useFetch();
  const reviseMutation = useFetch();
  const rejectMutation = useFetch();
  const approveMutation = useFetch();

  const banner = useBanner();

  const rejectButton = useDisableButton("Reject");
  const reviseButton = useDisableButton("Ask revise");
  const approveButton = useDisableButton("Approve button", "Approving...");
  const projectButton = useDisableButton("Create project", "Creating...");

  const [messages, setMessages] = useState("");
  const [assesment, setAssesment] = useReducer(reducer, {
    approvalStatus: "AVAILABLE",
    harvestSuitabilities: "",
    groundHeightValue: "",
    groundHeightUnit: "METER",
    soilPh: 0,
    waterAvailabilityStatus: "ABUNDANT",
    landUsageHistory: "",
  });
  const [project, setProject] = useReducer(reducer, {
    landId: landId,
    description: "",
    harvest: "",
    workerNeeds: 0,
    fundaisingTarget: 0,
    fundaisingDeadline: "",
    estimatedFinished: "",
  });

  const enableButtons = useCallback(() => {
    rejectButton.enable();
    approveButton.enable();
    reviseButton.enable();
  }, [approveButton, rejectButton, reviseButton]);

  const getLand = useCallback(
    () => landAPI.getDetailLandAsAdmin(tokenStorage.get(), landId),
    [landId],
  );

  const revise = () => {
    rejectButton.disableWithoutChangeText();
    approveButton.disableWithoutChangeText();
    reviseButton.disable();

    reviseMutation.trigger(() =>
      landAPI.markAsRevision(
        tokenStorage.get(),
        landId,
        messages.split(",").map((s) => s.trim()),
      ),
    );
  };

  const reject = () => {
    approveButton.disableWithoutChangeText();
    reviseButton.disableWithoutChangeText();
    rejectButton.disable();

    rejectMutation.trigger(() =>
      landAPI.rejectLand(
        tokenStorage.get(),
        landId,
        messages.split(",").map((s) => s.trim()),
      ),
    );
  };

  const approve = () => {
    approveButton.disable();
    reviseButton.disableWithoutChangeText();
    rejectButton.disableWithoutChangeText();

    const token = tokenStorage.get();
    assesment.harvestSuitabilities = assesment.harvestSuitabilities
      .split(",")
      .map((s) => s.trim())
      .map((s) => s.toUpperCase());

    assesment.groundHeightValue = +assesment.groundHeightValue;
    assesment.soilPh = +assesment.soilPh;
    approveMutation.trigger(() => landAPI.approve(token, landId, assesment));
  };

  const createNewProject = () => {
    projectButton.disable();
    project.harvest = project.harvest.toUpperCase();
    projectMutation.trigger(() =>
      projectAPI.createProject(tokenStorage.get(), project),
    );
  };

  useEffect(() => {
    landQuery.trigger(getLand);
  }, [getLand, landId, landQuery]);

  useEffect(() => {
    if (approveMutation.loading) {
      return;
    }
    enableButtons();
    if (approveMutation.error.happened) {
      banner.show(approveMutation.error.message);
      return;
    }
    if (approveMutation.success) {
      banner.show("Land was successfully approved");
      landQuery.triggerSilently(getLand);
    }
  }, [
    approveMutation.error.happened,
    approveMutation.error.message,
    approveMutation.loading,
    approveMutation.success,
    banner,
    enableButtons,
    getLand,
    landQuery,
  ]);

  useEffect(() => {
    if (reviseMutation.loading) {
      return;
    }
    enableButtons();

    if (reviseMutation.error.happened) {
      banner.show(reviseMutation.error.message);
      return;
    }

    if (reviseMutation.success) {
      banner.show("Land was marked as requires revisions");
      landQuery.triggerSilently(getLand);
      return;
    }
  }, [
    banner,
    enableButtons,
    getLand,
    landQuery,
    reviseMutation.error.happened,
    reviseMutation.error.message,
    reviseMutation.loading,
    reviseMutation.success,
  ]);

  useEffect(() => {
    if (rejectMutation.loading) {
      return;
    }
    enableButtons();

    if (rejectMutation.error.happened) {
      banner.show(rejectMutation.error.message);
      return;
    }

    if (rejectMutation.success) {
      banner.show("Land was marked as requires revisions");
      landQuery.triggerSilently(getLand);
      return;
    }
  }, [
    banner,
    enableButtons,
    getLand,
    landQuery,
    rejectMutation.error.happened,
    rejectMutation.error.message,
    rejectMutation.loading,
    rejectMutation.success,
  ]);

  useEffect(() => {
    if (projectMutation.loading) {
      return;
    }
    projectButton.enable();
    if (projectMutation.error.happened) {
      banner.show(projectMutation.error.message);
      return;
    }
    if (projectMutation.success) {
      navigate("/admin/projects/" + projectMutation.data.projectId);
    }
  }, [
    banner,
    navigate,
    projectButton,
    projectMutation.data?.projectId,
    projectMutation.error.happened,
    projectMutation.error.message,
    projectMutation.loading,
    projectMutation.success,
  ]);

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
    console.log(landQuery.data);
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
              <p>{landQuery.data.area.valueInHectares} Hectare(s)</p>
              <p>
                Proposed at:{" "}
                {new Date(landQuery.data.proposal.proposedAt).toDateString()}
              </p>
            </div>
          </SectionContent>
        )}

        {landQuery.success && alreadyApproved(landQuery.data.landStatus) && (
          <SectionContent title="Assesment" noBold>
            <div className="leading-relaxed my-4 text-gray-600">
              <table className="border-separate border-spacing-x-1">
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
                    <td>
                      {landQuery.data.assesment.landUsageHistory || "None."}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionContent>
        )}

        {landQuery.success &&
          ["ADMIN_LANDOWNER", "ADMIN_SUPER"].includes(role) && (
            <>
              {!alreadyApproved(landQuery.data.landStatus) && (
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

                  {isOnProposed(landQuery.data.landStatus) && (
                    <div className="flex gap-4">
                      <p className="w-1/2 text-gray-600">
                        Here you can decide whether to request a revision to the
                        submitter or reject this land proposal by leaving a
                        messages separated by coma(s).
                      </p>
                      <div className="w-1/2 ">
                        <Form.InputLabel
                          placeholder="Enter message 1, message 2, ..."
                          value={messages}
                          onChange={getValueThen(setMessages)}
                        />
                        <div className="my-4 flex gap-4">
                          <Button
                            text={rejectButton.text}
                            disabled={rejectButton.status}
                            className="w-1/2"
                            type="secondary"
                            onClick={reject}
                          />
                          <Button
                            text={reviseButton.text}
                            disabled={reviseButton.status}
                            className="w-1/2"
                            onClick={revise}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </SectionContent>
              )}

              {isOnProposed(landQuery.data.landStatus) && (
                <SectionContent title="Approval" noBold>
                  <div className="flex gap-4">
                    <p className="w-1/2 text-gray-600">
                      Here you can approve this land proposal by filling up the
                      land asessment on the side.
                    </p>
                    <div className="w-1/2 space-y-4">
                      <Form.InputDropDown
                        label="Approval status"
                        options={approvalStatusOp}
                        value={assesment.approvalStatus}
                        onChange={getValueThen((val) =>
                          setAssesment(["approvalStatus", val]),
                        )}
                      />

                      <Form.InputDropDown
                        label="Water availability status"
                        options={waterAvailabilityStatusOp}
                        value={assesment.waterAvailabilityStatus}
                        onChange={getValueThen((val) =>
                          setAssesment(["waterAvailabilityStatus", val]),
                        )}
                      />
                      <Form.InputLabel
                        label="Ground height (in meters)"
                        placeholder="Ground height (in meters)"
                        value={
                          assesment.groundHeightValue > 0
                            ? assesment.groundHeightValue
                            : undefined
                        }
                        onChange={getValueThen((val) =>
                          setAssesment([
                            "groundHeightValue",
                            val.replace(/[^0-9.]/g, ""),
                          ]),
                        )}
                      />
                      <Form.InputLabel
                        label="Soil pH"
                        placeholder="Soil pH"
                        value={
                          assesment.soilPh > 0 ? assesment.soilPh : undefined
                        }
                        onChange={getValueThen((val) =>
                          setAssesment(["soilPh", val.replace(/[^0-9.]/g, "")]),
                        )}
                      />
                      <Form.InputLabel
                        label="Harvest suitabilities"
                        placeholder="Harvest suitabilities"
                        value={assesment.harvestSuitabilities}
                        onChange={getValueThen((val) =>
                          setAssesment(["harvestSuitabilities", val]),
                        )}
                      />
                      <Form.InputLabel
                        label="Land usage histories"
                        placeholder="Land usage histories"
                        value={assesment.landUsageHistory}
                        onChange={getValueThen((val) =>
                          setAssesment(["landUsageHistory", val]),
                        )}
                      />

                      <Button
                        text={approveButton.text}
                        disabled={approveButton.status}
                        className="w-full"
                        onClick={approve}
                      />
                    </div>
                  </div>
                </SectionContent>
              )}
            </>
          )}

        {landQuery.success &&
          alreadyApproved(landQuery.data.landStatus) &&
          ["ADMIN_PROJECT", "ADMIN_SUPER"].includes(role) && (
            <SectionContent title="Project creation" noBold>
              <div className="flex gap-4">
                <p className="w-1/2 text-gray-600">
                  Here you can start a new project using this available lands by
                  completing the project plan on the side. Project that is
                  started will automatically registered as an active
                  fundarising.
                </p>
                <div className="w-1/2 space-y-4">
                  <Form.InputLabel
                    label="Description"
                    placeholder="Enter project description..."
                    value={project.description}
                    onChange={getValueThen((val) =>
                      setProject(["description", val]),
                    )}
                  />
                  <Form.InputLabel
                    label="Harvest"
                    placeholder="Enter harvest..."
                    value={project.harvest}
                    onChange={getValueThen((val) =>
                      setProject(["harvest", val]),
                    )}
                  />
                  <Form.InputLabel
                    label="Worker needs"
                    placeholder="Enter number of worker needs..."
                    value={project.workerNeeds > 0 ? project.workerNeeds : ""}
                    onChange={getValueThen((val) =>
                      setProject(["workerNeeds", +val]),
                    )}
                  />
                  <Form.InputLabel
                    label="Fundraising target"
                    placeholder="Rp1.000.0000"
                    value={
                      project.fundaisingTarget === 0
                        ? ""
                        : `Rp${project.fundaisingTarget.toLocaleString()}`
                    }
                    onChange={getValueThen((val) =>
                      setProject(["fundaisingTarget", +val.replace(/\D/g, "")]),
                    )}
                  />
                  <Form.InputLabel
                    label="Fundraising deadline"
                    placeholder="YYYY-MM-DD"
                    value={project.fundaisingDeadline}
                    onChange={getValueThen((val) =>
                      setProject(["fundaisingDeadline", val]),
                    )}
                  />
                  <Form.InputLabel
                    label="Estimated project finish"
                    placeholder="YYYY-MM-DD"
                    value={project.estimatedFinished}
                    onChange={getValueThen((val) =>
                      setProject(["estimatedFinished", val]),
                    )}
                  />
                  <Button
                    text={projectButton.text}
                    disabled={projectButton.status}
                    className="w-full"
                    onClick={createNewProject}
                  />
                </div>
              </div>
            </SectionContent>
          )}
      </ArticleContent>
    </>
  );
}
