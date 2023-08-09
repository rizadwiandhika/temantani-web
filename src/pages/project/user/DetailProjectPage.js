import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { projectAPI } from "../../../api";
import { useFetch, useBanner } from "../../../hooks";
import { token } from "../../../util";
import {
  ArticleContent,
  SectionContent,
  Banner,
  ProjectCard,
  ExpenseCard,
} from "../../../components";

export function DetailProjectPage() {
  const { id: projectId } = useParams();

  const banner = useBanner();
  const projectQuery = useFetch();
  const profitDistributionQuery = useFetch();

  useEffect(() => {
    const jwt = token.get();
    projectQuery.trigger(() => projectAPI.getDetailProject(jwt, projectId));
    profitDistributionQuery.trigger(() =>
      projectAPI.getProfitDistributionsOf(jwt, projectId),
    );
  }, [projectId, projectQuery, profitDistributionQuery]);

  return (
    <>
      <Banner
        message={banner.message}
        onCloseClicked={banner.hide}
        visible={banner.visibility}
      />
      <ArticleContent>
        {projectQuery.success && (
          <ProjectCard
            description={projectQuery.data.description}
            harvest={projectQuery.data.harvest}
            projectId={projectQuery.data.id}
            startedAt={new Date(projectQuery.data.createdAt)}
            status={projectQuery.data.status}
            hideLink
          />
        )}

        <SectionContent title="Details" noBold>
          {projectQuery.success && (
            <div className="text-gray-600 text-sm flex flex-col gap-2">
              {["FUNDRAISING", "WAITING_FOR_FUNDS"].includes(
                projectQuery.data.status,
              ) ? (
                <p>
                  Fundraising target: Rp{" "}
                  {projectQuery.data.fundraisingTarget.toLocaleString()}
                </p>
              ) : (
                <p>
                  Collected funds / Fundraising target: Rp{" "}
                  {projectQuery.data.collectedFunds.toLocaleString()} /{" "}
                  {projectQuery.data.fundraisingTarget.toLocaleString()}
                </p>
              )}
              <p>
                Fundraising deadline:{" "}
                {new Date(projectQuery.data.fundraisingDeadline).toDateString()}
              </p>
              <p>
                Estimated finish:{" "}
                {new Date(projectQuery.data.estimatedFinished).toDateString()}
              </p>
              <p>Worker needs: {projectQuery.data.workerNeeds}</p>
              <p>
                Created at:{" "}
                {new Date(projectQuery.data.createdAt).toDateString()}
              </p>
              {["ONGOING", "FINISHED"].includes(projectQuery.data.status) && (
                <p>
                  Executed at:{" "}
                  {new Date(projectQuery.data.executedAt).toDateString()}
                </p>
              )}
            </div>
          )}
        </SectionContent>

        {projectQuery.success &&
          ["ONGOING", "FINISHED"].includes(projectQuery.data.status) && (
            <SectionContent title="Expenses" noBold>
              <div className="space-y-6">
                {projectQuery.data.expenses.map((e) => (
                  <ExpenseCard
                    key={e.id}
                    name={e.name}
                    description={e.description}
                    amount={e.amount}
                    date={new Date(e.createdAt)}
                    invoiceLink={e.invoiceUrl}
                  />
                ))}
              </div>
            </SectionContent>
          )}

        {projectQuery.success && projectQuery.data.status === "FINISHED" && (
          <SectionContent title="Profit Distribution" noBold>
            <div className="flex my-4">
              <div className="w-1/2 text-gray-600 text-sm flex flex-col gap-4">
                <p>Income: Rp{projectQuery.data.income.toLocaleString()}</p>
                <p>
                  Distributed income: Rp
                  {projectQuery.data.distributedIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-1/2 flex justify-end"></div>
            </div>

            {profitDistributionQuery.success &&
              profitDistributionQuery.data.length > 0 && (
                <div className="relative overflow-x-auto">
                  <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                          <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500">
                              <tr>
                                <th scope="col" className="px-6 py-4">
                                  ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-4">
                                  Distributed date
                                </th>
                                <th scope="col" className="px-6 py-4">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {profitDistributionQuery.data
                                .reverse()
                                .map((p) => (
                                  <tr
                                    key={p.id}
                                    className="border-b dark:border-neutral-500"
                                  >
                                    <td
                                      key={p.id + "td id"}
                                      className="whitespace-nowrap px-6 py-4 font-medium"
                                    >
                                      {p.id}
                                    </td>
                                    <td
                                      key={p.id + "td status"}
                                      className="whitespace-nowrap px-6 py-4"
                                    >
                                      {p.status}
                                    </td>
                                    <td
                                      key={p.id + "td date"}
                                      className="whitespace-nowrap px-6 py-4"
                                    >
                                      {p.distributedAt
                                        ? new Date(
                                            p.distributedAt,
                                          ).toDateString()
                                        : "-"}
                                    </td>
                                    <td
                                      key={p.id + "td link"}
                                      className="whitespace-nowrap px-6 py-4"
                                    >
                                      <Link
                                        to={`/projects/${projectId}/profit-distributions/${p.id}`}
                                        className="underline"
                                      >
                                        Detail
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </SectionContent>
        )}

        {projectQuery.success &&
          !["FUNDRAISING", "WAITING_FOR_FUNDS"].includes(
            projectQuery.data.status,
          ) && (
            <SectionContent title="Share holders" noBold>
              <div className="relative overflow-x-auto">
                <div className="flex flex-col">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                      <div className="overflow-hidden">
                        <table className="min-w-full text-left text-sm font-light">
                          <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                              <th scope="col" className="px-6 py-4">
                                User ID
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Devidend
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectQuery.data.shareHolders.map(
                              ({ userId, devidend, type }, i) => (
                                <tr
                                  key={i + userId + devidend + type}
                                  className="border-b dark:border-neutral-500"
                                >
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {userId}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {devidend * 100}%
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {type}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContent>
          )}
      </ArticleContent>
    </>
  );
}
