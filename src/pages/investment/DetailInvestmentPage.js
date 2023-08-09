import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { classNames, token } from "../../util";
import { investmentAPI } from "../../api";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import {
  ArticleContent,
  InvestmentCard,
  SectionContent,
  Form,
  Banner,
} from "../../components";

export function DetailInvestmentPage() {
  const banner = useBanner();
  const { id: investmentId } = useParams();
  const investmentQuery = useFetch();
  const [creditCard, setCreditCard] = useState({
    card_number: "4811111111111114",
    card_cvv: "123",
    card_exp_month: "02",
    card_exp_year: "2025",
  });

  useEffect(() => {
    const midtransScriptUrl =
      "https://api.midtrans.com/v2/assets/js/midtrans-new-3ds.min.js";
    const scriptId = "midtrans-script";
    const scriptType = "text/javascript";
    const clientKey = "SB-Mid-client-WIi9CZS0XzioWHCO";
    const environment = "sandbox";

    const scriptTag = document.createElement("script");

    scriptTag.setAttribute("id", scriptId);
    scriptTag.setAttribute("type", scriptType);
    scriptTag.setAttribute("src", midtransScriptUrl);
    scriptTag.setAttribute("data-client-key", clientKey);
    scriptTag.setAttribute("data-environment", environment);

    document.body.prepend(scriptTag);
    // document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    const jwt = token.get();
    investmentQuery.trigger(() =>
      investmentAPI.getInvestmentDetail(jwt, investmentId),
    );
  }, [investmentQuery, investmentId]);

  const payButton = useDisableButton("Pay now", "Processing...");

  const updateCard = useCallback((key, value) => {
    setCreditCard((prev) => ({ ...prev, [key]: value }));
  }, []);

  const makePayment = () => {
    payButton.disable();
    investmentAPI.pay({
      investmentId,
      card: creditCard,
      paymentProcessor: window.MidtransNew3ds,
      handleFailure: () => {
        banner.show("Failed to make payment");
        payButton.enable();
      },
    });
  };

  return (
    <>
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
      />

      <ArticleContent title="Detail Investment">
        {investmentQuery.success && (
          <InvestmentCard
            investmentId={investmentId}
            projectId={investmentQuery.data.fundraisingId}
            date={new Date(investmentQuery.data.createdAt)}
            amount={investmentQuery.data.amount}
            status={investmentQuery.data.status}
            hideLink
          />
        )}

        <p className="text-sm text-gray-400 my-4">
          If you have already paid for this investment, wait for a little longer
          for the system to process then refresh to check the status. Otherwise,
          complete the payment below.
        </p>
        <SectionContent title="Payment" bold={false}>
          <div className=" mx-auto flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/2">
              <p className="text-sm font-semibold text-gray-400">
                We accept payment from all Indonesian credit/debit cards.
              </p>
            </div>
            <div className="sm:w-1/2">
              <Form.InputLabel
                label="Credit Card Number"
                placeholder="4811111111111xxx"
                value={creditCard.card_number}
                onChange={(e) => updateCard("card_number", e.target.value)}
              />
              <Form.InputLabel
                label="CVV"
                placeholder="123"
                value={creditCard.card_cvv}
                onChange={(e) => updateCard("card_cvv", e.target.value)}
              />
              <div className="flex gap-8">
                <Form.InputLabel
                  label="Month expiration"
                  placeholder="MM"
                  value={creditCard.card_exp_month}
                  onChange={(e) => updateCard("card_exp_month", e.target.value)}
                />

                <Form.InputLabel
                  label="Year expiration"
                  placeholder="YYYY"
                  value={creditCard.card_exp_year}
                  onChange={(e) => updateCard("card_exp_year", e.target.value)}
                />
              </div>

              <button
                className={classNames(
                  "flex w-full my-4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  payButton.status && "opacity-50 cursor-not-allowed",
                )}
                disabled={payButton.status}
                onClick={makePayment}
              >
                {payButton.text}
              </button>
            </div>
          </div>
        </SectionContent>
      </ArticleContent>
    </>
  );
}
