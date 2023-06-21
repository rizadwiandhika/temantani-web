import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar, SectionContent, Banner } from "../../components";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import { classNames, token, getValueThen } from "../../util";
import { investmentAPI, projectAPI } from "../../api";

export function DetailFundraisingPage({
  picture = "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
}) {
  const { id: fundraisingId } = useParams();
  const navigate = useNavigate();
  const banner = useBanner();
  const investmentButton = useDisableButton("Make investment", "Creating...");

  const fundraisingQuery = useFetch();
  const projectQuery = useFetch();
  const investmentMutation = useFetch();

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fundraisingQuery.trigger(() =>
      investmentAPI.getFundarisingDetail(fundraisingId),
    );
    projectQuery.trigger(() =>
      projectAPI.getDetailProject(token.get(), fundraisingId),
    );
  }, [fundraisingQuery, projectQuery, fundraisingId]);

  useEffect(() => {
    investmentMutation.loading
      ? investmentButton.disable()
      : investmentButton.enable();
  }, [investmentMutation.loading, investmentButton]);

  useEffect(() => {
    if (investmentMutation.loading) {
      return;
    }

    if (investmentMutation.error.happened) {
      banner.show("Make investment failed :(");
      return;
    }

    if (investmentMutation.success) {
      navigate(`/investments/${investmentMutation.data.investmentId}`);
      return;
    }

    console.log(
      "Normally, this should only be executed for the first time: useEffect for [investmentMutation.loading, investmentMutation.error.happened, investmentMutation.success, banner, navigate]",
    );
  }, [
    investmentMutation.loading,
    investmentMutation.error.happened,
    investmentMutation.success,
    investmentMutation.data?.investmentId,
    banner,
    navigate,
  ]);

  const makeInvestment = () => {
    const jwt = token.get();
    investmentMutation.trigger(() =>
      investmentAPI.makeInvestment(jwt, fundraisingId, amount),
    );
  };

  return (
    <>
      <Navbar />
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
      />
      <div className="w-11/12 md:max-w-3xl mt-8 mx-auto">
        <img
          src={picture}
          alt="fundraising img"
          className="block object-cover max-h-72 w-full "
        />
        <h3 className="font-bold my-4">
          {projectQuery.success ? projectQuery.data.harvest : null} •
          <span className="font-light text-gray-500">
            {" "}
            (ends at:{" "}
            {fundraisingQuery.success
              ? new Date(fundraisingQuery.data.tenorDeadline).toDateString()
              : null}
            )
          </span>
        </h3>
        <p className="my-4">
          Rp{" "}
          {fundraisingQuery.success
            ? fundraisingQuery.data.bookedFunds.toLocaleString()
            : null}{" "}
          /{" "}
          {fundraisingQuery.success
            ? fundraisingQuery.data.fundraisingTarget.toLocaleString()
            : null}
        </p>

        <p className="my-4 text-gray-500">
          {projectQuery.success ? projectQuery.data.description : null}
        </p>

        <SectionContent title="Details">
          <ul className="text-sm text-gray-500 flex flex-col gap-3">
            <li>
              Status: {projectQuery.success ? projectQuery.data.status : null}
            </li>
            <li>
              Worker Needs:{" "}
              {projectQuery.success ? projectQuery.data.workerNeeds : null}
            </li>
            <li>
              Estimated Finish:{" "}
              {projectQuery.success
                ? new Date(projectQuery.data.estimatedFinished).toDateString()
                : null}
            </li>
          </ul>
        </SectionContent>

        <SectionContent title="Investment">
          <div className="flex justify-end">
            <div className="mt-2 w-1/2 flex flex-col items-end">
              <input
                value={amount === 0 ? "" : `Rp${amount.toLocaleString()}`}
                onChange={getValueThen((value) =>
                  // setAmount(+value.replace("Rp", "").replace(/,/g, "").replace(/[A-z]/g, "")),
                  setAmount(+value.replace(/\D/g, "")),
                )}
                placeholder="Enter amount..."
                type="text"
                className="block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                className={classNames(
                  "flex w-1/2 my-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  investmentButton.status && "opacity-50 cursor-not-allowed",
                )}
                disabled={investmentButton.status}
                onClick={makeInvestment}
              >
                {investmentButton.text}
              </button>
            </div>
          </div>
        </SectionContent>
      </div>
    </>
  );
}
