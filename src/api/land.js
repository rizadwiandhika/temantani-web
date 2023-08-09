import { resolveFetch, jsonRequest, formRequest } from "../util";

const host = "http://127.0.0.1:8281";

export async function getAllLandsAsAdmin(token = "") {
  const url = `${host}/admins/lands`;
  return resolveFetch(
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
  );
}

export async function getAllOwnedLands(token = "") {
  const url = `${host}/lands`;
  return resolveFetch(jsonRequest.get(url, { token }));
}

export async function getDetailLandAsAdmin(token = "", landId = "") {
  const url = `${host}/admins/lands/${landId}`;
  return resolveFetch(jsonRequest.get(url, { token }));
}

export async function getDetailLand(token = "", landId = "") {
  const url = `${host}/lands/${landId}`;
  return resolveFetch(jsonRequest.get(url, { token }));
}

export async function proposeLand(
  token = "",
  data = {
    address: { street: "", city: "", postalCode: "" },
    area: { unit: "", value: 0 },
    certificate: null,
    photo: null,
  },
) {
  const url = `${host}/lands`;
  return resolveFetch(formRequest.post(url, { token, data }));
}

export async function reviseLand(
  token = "",
  landId = "",
  data = {
    address: { street: "", city: "", postalCode: "" },
    area: { unit: "", value: 0 },
    certificate: null,
    photo: null,
  },
) {
  const url = `${host}/lands/${landId}/revise`;
  return resolveFetch(formRequest.put(url, { token, data }));
}

export async function cancelProposal(token = "", landId = "") {
  const url = `${host}/lands/${landId}/cancel`;
  return resolveFetch(jsonRequest.put(url, { token }));
}

export async function markAsRevision(token = "", landId = "", messages = []) {
  const url = `${host}/admins/lands/${landId}/revise`;
  return resolveFetch(jsonRequest.put(url, { token, body: messages }));
}

export async function rejectLand(token = "", landId = "", messages = []) {
  const url = `${host}/admins/lands/${landId}/reject`;
  return resolveFetch(jsonRequest.put(url, { token, body: messages }));
}

export async function approve(
  token = "",
  landId = "",
  assesment = {
    approvalStatus: "",
    harvestSuitabilities: [],
    groundHeightValue: "",
    groundHeightUnit: "",
    soilPh: 0,
    waterAvailabilityStatus: "",
    landUsageHistory: "",
  },
) {
  const url = `${host}/admins/lands/${landId}/approve`;
  return resolveFetch(jsonRequest.put(url, { token, body: assesment }));
}
