import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectAPI } from "../../../api";
import { useFetch, useDisableButton, useBanner } from "../../../hooks";
import { token as tokenStorage, flatened } from "../../../util";
import {
  ArticleContent,
  SectionContent,
  ProjectCard,
  Button,
  Form,
  Banner,
} from "../../../components";

export function DetailProfitDistributionPage() {
  const { projectId, profitDistributionId } = useParams();
  const navigate = useNavigate();
  const banner = useBanner();
  const uploadButton = useDisableButton("Upload", "Uploading...");

  const profitDistributionQuery = useFetch();
  const projectQuery = useFetch();
  const uploadMutation = useFetch();

  const [proofs, setProofs] = useState({});

  const updateProofs = (id, file) => {
    setProofs((prev) => ({ ...prev, [id]: file }));
  };

  const upload = () => {
    const token = tokenStorage.get();
    const data = { profitDistributionDetailIds: [], proofs: [] };

    for (const id in proofs) {
      const proof = proofs[id];
      data.profitDistributionDetailIds.push(id);
      data.proofs.push(proof);
    }

    uploadButton.disable();
    uploadMutation.trigger(() =>
      projectAPI.uploadTransferProofs(token, profitDistributionId, data),
    );
  };

  useEffect(() => {
    if (uploadMutation.loading) {
      return;
    }
    uploadButton.enable();
    if (uploadMutation.error.happened) {
      banner.show(uploadMutation.error.message);
      return;
    }
    if (uploadMutation.success) {
      navigate(`/admin/projects/${projectId}`);
    }
  }, [
    banner,
    navigate,
    projectId,
    uploadButton,
    uploadMutation.error.happened,
    uploadMutation.error.message,
    uploadMutation.loading,
    uploadMutation.success,
  ]);

  useEffect(() => {
    projectQuery.trigger(() =>
      projectAPI.getDetailProject(tokenStorage.get(), projectId),
    );
    profitDistributionQuery.trigger(() =>
      projectAPI.getProfitDistributionsOf(tokenStorage.get(), projectId),
    );
  }, [profitDistributionQuery, projectId, projectQuery]);

  let detailProfit = {};
  let distributions = [];
  if (profitDistributionQuery.success) {
    detailProfit = profitDistributionQuery.data.find(
      (p) => p.id === profitDistributionId,
    );
    distributions = detailProfit.details;
  }

  return (
    <>
      <Banner
        message={banner.message}
        visible={banner.visibility}
        onCloseClicked={banner.hide}
      />
      <ArticleContent title="Profit Distribution Detail">
        {projectQuery.success && (
          <ProjectCard
            description={projectQuery.data.description}
            harvest={projectQuery.data.harvest}
            projectId={projectQuery.data.id}
            startedAt={new Date(projectQuery.data.createdAt)}
            status={projectQuery.data.status}
            link={`/admin/projects/${projectId}`}
          />
        )}

        <div className="text-sm">
          {distributions.map((dist) => (
            <SectionContent key={dist.id} title={`${dist.id}`} noBold>
              <div className="flex justify-between">
                <table className="h-fit border-separate border-spacing-x-1 border-spacing-y-2 text-gray-900">
                  <tbody>
                    <tr className="space-x-10">
                      <td>Bank</td>
                      <td>:</td>
                      <td>{dist.bankAccount.bank}</td>
                    </tr>
                    <tr>
                      <td>Account number</td>
                      <td>:</td>
                      <td>{dist.bankAccount.accountNumber}</td>
                    </tr>
                    <tr>
                      <td>Card holder</td>
                      <td>:</td>
                      <td>{dist.bankAccount.accountHolderName}</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td>:</td>
                      <td>Rp{dist.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {detailProfit.status === "COMPLETED" && (
                  <img
                    src={dist.transferProof}
                    alt="transfer proof"
                    className="max-h-96"
                  />
                )}
              </div>
              <div className="mt-6">
                {detailProfit.status === "WAITING" && (
                  <Form.InputFileButton
                    onChange={(e) => updateProofs(dist.id, e.target.files[0])}
                  />
                )}
              </div>
            </SectionContent>
          ))}
        </div>

        {detailProfit.status !== "COMPLETED" && (
          <div className="my-8 flex gap-4 justify-end">
            <p className="w-3/5 text-right ali text-gray-600 text-sm self-center">
              By uploading transfer proofs, you're completing this profit
              distribution
            </p>
            <Button
              text={uploadButton.text}
              disabled={uploadButton.status}
              onClick={upload}
              className="w-1/5 h-fit"
            />
          </div>
        )}
      </ArticleContent>
    </>
  );
}
