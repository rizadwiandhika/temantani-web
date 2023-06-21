import { resolveFetch } from "../util";

const host = "http://127.0.0.1:8282";

export async function getFundarisings(token = "") {
  const url = `${host}/fundraisings`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function getFundarisingDetail(id = "") {
  const url = `${host}/fundraisings/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function makeInvestment(
  token = "",
  fundraisingId = "",
  amount = 0,
) {
  const url = `${host}/investments`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: fundraisingId, amount }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function getMyInvestments(token = "") {
  const url = `${host}/investments`;
  return resolveFetch(
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
  );
}

export async function getInvestmentDetail(token = "", id = "") {
  const url = `${host}/investments/${id}`;
  return resolveFetch(
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
  );
}

async function getChargeUrl(investmentId = "", token_id = "") {
  const chargeUrl = `${host}/midtrans/investments/${investmentId}/charge`;

  const response = await fetch(chargeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to charge");
  }
  return response.json();
}

export async function pay({
  handleFailure = () => {},
  paymentProcessor = null,
  investmentId = "",
  card = {
    card_number: "",
    card_exp_month: "",
    card_exp_year: "",
    card_cvv: "",
  },
}) {
  const options = {
    onSuccess: async (response) => {
      const token_id = response.token_id;

      console.log("Success to get card token_id, response:", response);
      console.log("This is the card token_id:", token_id);

      try {
        const data = await getChargeUrl(investmentId, token_id);
        console.log("midtrans charge:", data);
        paymentProcessor.redirect(data.redirect_url, {
          callbackUrl: `${host}/midtrans/redirect/ui?investmentId=${investmentId}`,
        });
      } catch (err) {}
    },
    onFailure: (response) => {
      console.log("Fail to get card token_id, response:", response);
      handleFailure();
    },
  };

  paymentProcessor.getCardToken(card, options);
}
