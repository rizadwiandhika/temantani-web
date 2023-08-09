import {
  resolveFetch,
  dateToISOWithOffset,
  jsonRequest,
  formRequest,
} from "../util";

const host = "http://127.0.0.1:8283";

export async function getDetailProject(token = "", id = "") {
  const url = `${host}/projects/${id}`;
  return resolveFetch(
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function getProjects(token = "") {
  const url = `${host}/admins/projects`;
  return resolveFetch(
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function getProjectsOfLand(token = "", landId = "") {
  const url = `${host}/lands/${landId}/projects`;
  return resolveFetch(jsonRequest.get(url, { token }));
}

export async function createProject(
  token,
  data = {
    landId: "",
    description: "",
    harvest: "",
    workerNeeds: 0,
    fundaisingTarget: 0,
    fundaisingDeadline: null,
    estimatedFinished: null,
  },
) {
  const url = `${host}/admins/projects`;
  data.fundaisingDeadline = dateToISOWithOffset(data.fundaisingDeadline);
  data.estimatedFinished = dateToISOWithOffset(data.estimatedFinished);
  return resolveFetch(jsonRequest.post(url, { token, body: data }));
}

export async function gotoHiring(token = "", id = "") {
  const url = `${host}/admins/projects/${id}/hire`;
  return resolveFetch(
    fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function execute(token = "", id = "") {
  const url = `${host}/admins/projects/${id}/execute`;
  return resolveFetch(
    fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function finish(token = "", id = "") {
  const url = `${host}/admins/projects/${id}/finish`;
  return resolveFetch(
    fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function getProfitDistributionsOf(token = "", projectId = "") {
  const url = `${host}/projects/${projectId}/profit-distributions`;

  return resolveFetch(
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
  );
}

export async function addExpense(
  token = "",
  projectId = "",
  expense = {
    name: "",
    description: "",
    amount: 0,
    invoice: null,
  },
) {
  const url = `${host}/admins/projects/${projectId}/expenses`;
  return resolveFetch(formRequest.post(url, { token, data: expense }));
}

export async function generateNewProfitDistribution(
  token = "",
  projectId = "",
) {
  const url = `${host}/admins/projects/${projectId}/profit-distributions`;
  return resolveFetch(jsonRequest.post(url, { token }));
}

export async function uploadTransferProofs(
  token = "",
  profitDistributionId = "",
  data = { profitDistributionDetailIds: [], proofs: [] },
) {
  const url = `${host}/admins/profit-distributions/${profitDistributionId}`;
  return resolveFetch(formRequest.post(url, { token, data }));
}
