import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { SectionContent, Banner, LabelStatus } from "../../components";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import { classNames, token, getValueThen, isAdmin } from "../../util";
import { investmentAPI, projectAPI, landAPI } from "../../api";
import moneyBag from "../../assets/img/money-bag.png";
import deadline from "../../assets/img/deadline.png";
import location from "../../assets/img/location.png";
import warn from "../../assets/img/warn.png";

export function DetailFundraisingPage({
  picture = "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
}) {
  const { id: fundraisingId } = useParams();
  const navigate = useNavigate();
  const banner = useBanner();
  const userRoles = useMemo(() => token.getRoles(), []);
  const investmentButton = useDisableButton("Make investment", "Creating...");

  const fundraisingQuery = useFetch();
  const projectQuery = useFetch();
  const landQuery = useFetch();
  const investmentMutation = useFetch();

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fundraisingQuery.trigger(() =>
      // investmentAPI.getFundarisingDetail(fundraisingId),
      Promise.resolve({
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        status: "OPEN",
        fundraisingTarget: 12000000.0,
        bookedFunds: 3000000.0,
        description: "Project 2",
        tenorDeadline: "2021-12-31T23:59:59+07:00",
        createdAt: "2021-01-01T00:00:00+07:00",
      }),
    );
    projectQuery.trigger(() =>
      // projectAPI.getDetailProject(token.get(), fundraisingId),
      Promise.resolve({
        id: "10cdae59-99e5-475f-9810-6cf03dfb1554",
        landId: "10cdae59-99e5-475f-9810-6cf03dfb1520",
        managerId: "10cdae59-99e5-475f-9810-6cf03dfb1510",
        description:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque eaque nihil, dicta dolores alias quibusdam. Consequatur quod ducimus exercitationem id quidem. Corrupti omnis deserunt ipsa. Aspernatur ipsa placeat molestiae saepe ab est vel magnam, illo, eius praesentium quasi eaque. Consequuntur consectetur tempore illum doloribus minus beatae, quidem in, obcaecati distinctio, maxime enim autem temporibus dolor cupiditate quisquam tempora nostrum! ",
        details: {},
        harvest: "Pertanian Kacang Polong",
        status: "FUNDRAISING",
        workerNeeds: 18,
        fundraisingTarget: 75000000,
        fundraisingDeadline: "2023-10-12T00:00:00+07:00",
        estimatedFinished: "2024-10-12T00:00:00+07:00",
        collectedFunds: 60000000,
        income: 35000000,
        distributedIncome: 30000000,
        createdAt: "2023-06-10T00:00:00+07:00",
        executedAt: "2023-08-10T00:00:00+07:00",
        finishedAt: "2023-10-10T00:00:00+07:00",
        failureMessages: [],
        shareHolders: [
          {
            userId: "10cdae59-99e5-475f-9810-6cf03dfb1500",
            type: "LANDOWNER",
            devidend: 0.149999999999999994,
          },
          {
            userId: "10cdae59-99e5-475f-9810-6cf03dfb1501",
            type: "INVESTOR",
            devidend: 0.349999999999999978,
          },
          {
            userId: "10cdae59-99e5-475f-9810-6cf03dfb1502",
            type: "INVESTOR",
            devidend: 0.5,
          },
        ],
        expenses: [
          {
            id: "5546915a-c6ed-4648-8b22-086e26fdf82a",
            projectId: "10cdae59-99e5-475f-9810-6cf03dfb1554",
            name: "Pupuk 1",
            description: "Description",
            invoiceUrl: "INVOICE_URL",
            amount: 2000000,
            createdAt: "2021-10-16T18:10:30+07:00",
          },
          {
            id: "5546915a-c6ed-4648-8b22-086e26fdf82b",
            projectId: "10cdae59-99e5-475f-9810-6cf03dfb1554",
            name: "Obeng 2",
            description: "Description",
            invoiceUrl: "INVOICE_URL",
            amount: 4000000,
            createdAt: "2021-10-16T18:10:30+07:00",
          },
          {
            id: "5546915a-c6ed-4648-8b22-086e26fdf82c",
            projectId: "10cdae59-99e5-475f-9810-6cf03dfb1554",
            name: "Kayu 3",
            description: "Description",
            invoiceUrl: "INVOICE_URL",
            amount: 8000000,
            createdAt: "2021-10-16T18:10:30+07:00",
          },
        ],
      }),
    );
  }, [fundraisingQuery, projectQuery, fundraisingId]);

  useEffect(() => {
    if (projectQuery.success) {
      landQuery.trigger(() =>
        // landAPI.getDetailLand(token.get(), projectQuery.data.landId),
        Promise.resolve({
          id: "c55afe50-4162-492f-9b7e-a7c7304423cb",
          proposal: {
            approvedAt: "2023-06-05T19:55:18.383568+07:00",
            proposedAt: "2023-06-05T19:54:23.835789+07:00",
            revisionMessages: [""],
            failureMessages: [""],
          },
          approver: {
            id: "6a899b91-cb17-43da-afce-964375d5165a",
            email: "adminland@mail.com",
            name: "Admin Project",
          },
          assessment: {
            harvestSuitabilities: ["Apple", "Banana"],
            groundHeight: {
              value: 10,
              unit: "METER",
            },
            soilPh: 6.71999999999999975,
            waterAvailabilityStatus: "ABUNDANT",
            landUsageHistory: "Land was used to harvest Banana",
          },
          landStatus: "AVAILABLE",
          area: {
            unit: "HECTARE",
            valueInHectare: 12,
          },
          address: {
            street: "Jalan jalan",
            city: "New York",
            postalCode: "12345",
            complete: true,
          },
          certificateUrl:
            "/Users/riza/Documents/Kuliah/Tugas-Akhir/teman-tani/storage/Circle.png",
          photos: [picture],
        }),
      );
    }
  }, [landQuery, projectQuery.data?.landId, projectQuery.success]);

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
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
      />
      <div className="w-11/12 md:max-w-3xl mt-8 mx-auto">
        {landQuery.success && (
          <img
            src={landQuery.data.photos[0]}
            alt="fundraising img"
            className="block object-cover max-h-72 w-full rounded-xl shadow-2xl"
          />
        )}
        <h3 className="font-bold my-4 text-xl">
          {projectQuery.success ? projectQuery.data.harvest : null}
        </h3>
        <p className="my-2 text-gray-600">
          <img
            src={moneyBag}
            alt="moneybag"
            className="inline-block w-8 mr-2"
          />{" "}
          Collected funds:{" "}
          <span className="font-bold text-black">
            Rp
            {fundraisingQuery.success
              ? fundraisingQuery.data.bookedFunds.toLocaleString()
              : null}
          </span>{" "}
          of Rp
          {fundraisingQuery.success
            ? fundraisingQuery.data.fundraisingTarget.toLocaleString()
            : null}{" "}
          target
        </p>
        <p>
          <img
            src={deadline}
            alt="moneybag"
            className="inline-block w-8 mr-2"
          />{" "}
          <span className="font-light text-gray-500">
            (
            {fundraisingQuery.success
              ? new Date(fundraisingQuery.data.createdAt)
                  .toDateString()
                  .split(" ")
                  .slice(1)
                  .join(" ")
              : null}{" "}
            -{" "}
            {fundraisingQuery.success
              ? new Date(fundraisingQuery.data.tenorDeadline)
                  .toDateString()
                  .split(" ")
                  .slice(1)
                  .join(" ")
              : null}
            )
          </span>
        </p>
        <p className="my-2">
          <img
            src={location}
            alt="moneybag"
            className="inline-block w-8 mr-2"
          />{" "}
          <span className="font-light text-gray-500">
            Kota Bandung, Jawa Barat
          </span>
        </p>

        <p className="my-4 text-gray-500 text-sm">
          {projectQuery.success ? projectQuery.data.description : null}
        </p>

        <SectionContent title="Details">
          <ul className="text-sm text-gray-500 flex flex-col gap-3">
            <li>
              Status:{" "}
              <span className="font-bold">
                <LabelStatus
                  spaceX="nospace"
                  color="yellow"
                  status={projectQuery.success ? projectQuery.data.status : ""}
                />
              </span>
            </li>

            <li>
              Estimated Project Finish:{" "}
              {projectQuery.success
                ? new Date(projectQuery.data.estimatedFinished).toDateString()
                : null}
            </li>
          </ul>
        </SectionContent>

        {!isAdmin(userRoles) &&
          fundraisingQuery.success &&
          fundraisingQuery.data.status === "OPEN" && (
            <SectionContent title="Investment">
              <div className="flex gap-4">
                <p className="text-gray-600 text-sm w-1/2 leading-relaxed">
                  Make investment by filling up the amount on the side. The
                  minimum investment is Rp100.0000. By making investment, you
                  agree to the investment{" "}
                  <img
                    src={warn}
                    alt="warn"
                    className="inline-block w-4 mr-1"
                  />
                  <Link className="underline text-indigo-600">
                    terms & conditions
                  </Link>
                </p>

                <div className="mt-2 w-1/2 flex flex-col items-end">
                  <input
                    value={amount === 0 ? "" : `Rp${amount.toLocaleString()}`}
                    onChange={getValueThen((value) =>
                      setAmount(+value.replace(/\D/g, "")),
                    )}
                    placeholder="Enter amount..."
                    type="text"
                    className="block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    className={classNames(
                      "flex w-1/2 my-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                      investmentButton.status &&
                        "opacity-50 cursor-not-allowed",
                    )}
                    disabled={investmentButton.status}
                    onClick={makeInvestment}
                  >
                    {investmentButton.text}
                  </button>
                </div>
              </div>
            </SectionContent>
          )}
      </div>
    </>
  );
}
