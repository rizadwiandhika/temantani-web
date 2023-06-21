import React, { useEffect } from "react";
import { token } from "../../util";
import { investmentAPI } from "../../api";
import { useFetch } from "../../hooks";
import { Navbar, InvestmentCard, ArticleContent } from "../../components";

export function ListInvestmentPage() {
  const investmentQuery = useFetch();

  useEffect(() => {
    investmentQuery.trigger(() => investmentAPI.getMyInvestments(token.get()));
  }, [investmentQuery]);

  return (
    <>
      <Navbar />
      <ArticleContent title="My Investments">
        <div className="flex flex-col gap-4">
          {investmentQuery.success &&
            investmentQuery.data.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investmentId={investment.id}
                projectId={investment.fundraisingId}
                date={new Date(investment.createdAt)}
                amount={investment.amount}
                status={investment.status}
              />
            ))}
        </div>
      </ArticleContent>
    </>
  );
}
