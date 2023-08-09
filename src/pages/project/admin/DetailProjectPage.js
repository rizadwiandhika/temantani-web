import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { projectAPI } from "../../../api";
import { useDisableButton, useFetch, useBanner } from "../../../hooks";
import { classNames, getValueThen, token } from "../../../util";
import {
  ArticleContent,
  SectionContent,
  Banner,
  ProjectCard,
  Form,
  ExpenseCard,
  LabelStatus,
} from "../../../components";

const actionButtonMap = {
  FUNDRAISING: {
    text: "Go to hiring",
    disabledText: "Collecting funds...",
    disabled: false,
    action: projectAPI.gotoHiring,
  },
  HIRING: {
    text: "Execute project",
    disabledText: "Executing project...",
    disabled: false,
    action: projectAPI.execute,
  },
  ONGOING: {
    text: "Finish project",
    disabledText: "Finishing project...",
    disabled: false,
    action: projectAPI.finish,
  },
  WAITING_FOR_FUNDS: {
    text: "",
    disabledText: "Collecting funds...",
    disabled: true,
    action: null,
  },
  FINISHED: {
    text: "",
    disabledText: "Project has been finished",
    disabled: true,
    action: null,
  },
};
const expenseInitialState = {
  name: "",
  description: "",
  amount: 0,
  invoice: null,
};

export function DetailProjectPage() {
  const { id: projectId } = useParams();

  const banner = useBanner();
  const projectQuery = useFetch();
  const profitDistributionQuery = useFetch();
  const profitDistributionMutation = useFetch();
  const expenseMutation = useFetch();

  const expenseButton = useDisableButton("Add expense", "Adding...");
  const profitButton = useDisableButton("Generate new", "Generating...");
  const projectActionButton = useDisableButton("Action", "Action", true);

  const [expense, setExpense] = useState(expenseInitialState);

  useEffect(() => {
    const jwt = token.get();
    projectQuery.trigger(() => projectAPI.getDetailProject(jwt, projectId));
    profitDistributionQuery.trigger(() =>
      projectAPI.getProfitDistributionsOf(jwt, projectId),
    );
  }, [projectId, projectQuery, profitDistributionQuery]);

  useEffect(() => {
    if (projectQuery.loading) {
      return;
    }

    if (projectQuery.error.happened) {
      banner.show(projectQuery.error.message);
      return;
    }

    if (projectQuery.success) {
      const {
        text: enableText,
        disabledText,
        disabled,
      } = actionButtonMap[projectQuery.data.status];
      projectActionButton.update({ enableText, disabledText, disabled });
    }
  }, [
    banner,
    projectActionButton,
    projectQuery.data?.status,
    projectQuery.error.happened,
    projectQuery.error.message,
    projectQuery.loading,
    projectQuery.success,
  ]);

  useEffect(() => {
    if (expenseMutation.loading) {
      return;
    }

    projectActionButton.enable();
    expenseButton.enable();
    if (expenseMutation.error.happened) {
      banner.show(expenseMutation.error.message);
      return;
    }
    if (expenseMutation.success) {
      setExpense(expenseInitialState);
      banner.show("Expense was added");
      projectQuery.triggerSilently(() =>
        projectAPI.getDetailProject(token.get(), projectId),
      );
    }
  }, [
    banner,
    expenseButton,
    expenseMutation.error.happened,
    expenseMutation.error.message,
    expenseMutation.loading,
    expenseMutation.success,
    projectActionButton,
    projectId,
    projectQuery,
  ]);

  useEffect(() => {
    if (profitDistributionMutation.loading) {
      return;
    }
    profitButton.enable();
    if (profitDistributionMutation.error.happened) {
      banner.show(profitDistributionMutation.error.message);
      return;
    }
    if (profitDistributionMutation.success) {
      banner.show("Profit distribution was successfully added");
      const jwt = token.get();
      projectQuery.triggerSilently(() =>
        projectAPI.getDetailProject(jwt, projectId),
      );
      profitDistributionQuery.triggerSilently(() =>
        projectAPI.getProfitDistributionsOf(jwt, projectId),
      );
    }
  }, [
    banner,
    profitButton,
    profitDistributionMutation.error.happened,
    profitDistributionMutation.error.message,
    profitDistributionMutation.loading,
    profitDistributionMutation.success,
    profitDistributionQuery,
    projectId,
    projectQuery,
  ]);

  const updateExpenseField = (name, value) => {
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const addExpense = (e) => {
    e.preventDefault();
    projectActionButton.disable();
    expenseButton.disable();

    expenseMutation.trigger(() =>
      projectAPI.addExpense(token.get(), projectId, expense),
    );
  };

  const generateProfitDistribution = () => {
    profitButton.disable();
    profitDistributionMutation.trigger(() =>
      projectAPI.generateNewProfitDistribution(token.get(), projectId),
    );
  };

  const handleProjectAction = async () => {
    if (!projectQuery.success) {
      banner.show("Unable to process since projectQuery data is not available");
      return;
    }

    projectActionButton.disable();
    const status = projectQuery.data.status || "UNKNOWN";
    const { action } = actionButtonMap[status];
    if (action === null) {
      banner.show("Unable to process since action is null");
      return;
    }

    const jwt = token.get();
    try {
      await action(jwt, projectId);
      banner.show("Action completed");
    } catch (error) {
      banner.show(error.message);
    }
    projectActionButton.enable();
    projectQuery.triggerSilently(() =>
      projectAPI.getDetailProject(jwt, projectId),
    );
  };

  const sumTransferedAmount = (prev, distribution) => {
    return (
      prev + distribution.details.reduce((acc, { amount }) => acc + amount, 0)
    );
  };

  // let distributedIncome = 0;
  // if (profitDistributionQuery.success) {
  //   distributedIncome = profitDistributionQuery.data.reduce(
  //     sumTransferedAmount,
  //     0,
  //   );
  //   console.log(distributedIncome.toLocaleString());
  // }

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
            showFundraisingLink
          />
        )}
        <div className="my-4 flex justify-end">
          <button
            className={classNames(
              "flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
              projectActionButton.status && "opacity-50 cursor-not-allowed",
            )}
            disabled={projectActionButton.status}
            onClick={handleProjectAction}
          >
            {projectActionButton.text}
          </button>
        </div>

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
              {projectQuery.data.status === "ONGOING" && (
                <div className="flex gap-6">
                  <p className="w-1/2 text-gray-600 text-sm">
                    Add new expense for this project by filling up the details
                    on the side.
                  </p>
                  <div className="w-1/2">
                    <form>
                      <Form.InputLabel
                        label="Name"
                        placeholder="Enter expense name..."
                        value={expense.name}
                        onChange={getValueThen((val) =>
                          updateExpenseField("name", val),
                        )}
                      />
                      <Form.InputLabel
                        label="Description"
                        placeholder="Enter description..."
                        value={expense.description}
                        onChange={getValueThen((val) =>
                          updateExpenseField("description", val),
                        )}
                      />
                      <Form.InputLabel
                        label="Amount (Rp)"
                        placeholder="Enter amount..."
                        value={
                          expense.amount === 0
                            ? ""
                            : `Rp${expense.amount.toLocaleString()}`
                        }
                        onChange={getValueThen((value) =>
                          updateExpenseField(
                            "amount",
                            +value.replace(/\D/g, ""),
                          ),
                        )}
                      />

                      <Form.InputFileButton
                        label="Invoice"
                        onChange={(e) =>
                          updateExpenseField("invoice", e.target.files[0])
                        }
                      />
                      <button
                        className={classNames(
                          "my-8 block w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                          expenseButton.status &&
                            "opacity-50 cursor-not-allowed",
                        )}
                        disabled={expenseButton.status}
                        onClick={addExpense}
                      >
                        {expenseButton.text}
                      </button>
                    </form>
                  </div>
                </div>
              )}
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
              <div className="w-1/2 text-gray-600 text-sm flex flex-col gap-4 self-center">
                <p>
                  Distributed profit / Income: Rp{" "}
                  {projectQuery.data.distributedIncome.toLocaleString()} /{" "}
                  {projectQuery.data.income.toLocaleString()}
                </p>
              </div>
              <div className="w-1/2 flex justify-end">
                <button
                  className={classNames(
                    "flex w-fit h-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    profitButton.status && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={profitButton.status}
                  onClick={generateProfitDistribution}
                >
                  {profitButton.text}
                </button>
              </div>
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
                                      className="whitespace-nowrap px-6 py-4 font-bold"
                                    >
                                      <LabelStatus
                                        spaceX="nospace"
                                        status={p.status}
                                        color={
                                          p.status === "WAITING"
                                            ? "yellow"
                                            : "green"
                                        }
                                      />
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
                                        to={`/admin/projects/${projectId}/profit-distributions/${p.id}`}
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
