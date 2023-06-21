const registerPayload = {
  email: "",
  name: "",
  password: "",
  phoneNumber: "",
  address: {
    street: "",
    city: "",
    postalCode: "",
  },
};

const host = "http://127.0.0.1:8280";

export async function register(payload = registerPayload) {
  const url = `${host}/auth/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function login(payload = { email: "", password: "" }) {
  const url = `${host}/auth/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function updateProfile(
  token = "",
  userId = "",
  payload = {
    name: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
    },
    bankAccount: {
      bank: "",
      accountNumber: "",
      accountHolderName: "",
    },
  },
) {
  const url = `${host}/users/${userId}`;
  if (payload.bankAccount.bank === "") {
    delete payload.bankAccount;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function me(token = "") {
  const url = `${host}/users/me`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function activateRole(
  token = "",
  userId = "",
  payload = {
    role: "",
    identityCardNumber: "",
    address: { street: "", city: "", postalCode: "" },
    identityCard: null,
    bank: {
      name: "",
      accountNumber: "",
      accountHolderName: "",
    },
  },
) {
  const bodyContent = new FormData();
  bodyContent.append("role", payload.role);
  bodyContent.append("identityCardNumber", payload.identityCardNumber);
  bodyContent.append("bankAccount.accountNumber", payload.bank.accountNumber);
  bodyContent.append("bankAccount.bank", payload.bank.name);
  bodyContent.append(
    "bankAccount.accountHolderName",
    payload.bank.accountHolderName,
  );
  bodyContent.append("address.street", payload.address.street);
  bodyContent.append("address.city", payload.address.city);
  bodyContent.append("address.postalCode", payload.address.postalCode);
  bodyContent.append(
    "identityCard",
    payload.identityCard,
    payload.identityCard.name,
  );

  const url = `${host}/users/${userId}/activate-role`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: bodyContent,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
