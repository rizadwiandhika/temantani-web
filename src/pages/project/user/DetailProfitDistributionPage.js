import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { projectAPI } from "../../../api";
import { useFetch, useBanner } from "../../../hooks";
import { token as tokenStorage } from "../../../util";
import {
  ArticleContent,
  SectionContent,
  ProjectCard,
  Banner,
} from "../../../components";

export function DetailProfitDistributionPage() {
  const { projectId, profitDistributionId } = useParams();
  const banner = useBanner();

  const profitDistributionQuery = useFetch();
  const projectQuery = useFetch();

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
            link={`/projects/${projectId}`}
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
            </SectionContent>
          ))}
        </div>
      </ArticleContent>
    </>
  );
}
