import { FullcardsApiClient } from "./apiClient";

const apiClient: FullcardsApiClient = new FullcardsApiClient();

function loginIfAvailable() {
  if (process.browser && isApiClientLoggedIn()) {
    apiClient.request.config.TOKEN = getApiClientLoginToken();
  }
}
loginIfAvailable();

export function getApiClient() {
  loginIfAvailable();
  return apiClient;
}

export function apiClientLogin(token: string) {
  localStorage.setItem("api-jwt", token);
  apiClient.request.config.TOKEN = token;
}

export function getApiClientLoginToken() {
  return localStorage.getItem("api-jwt");
}

export function isApiClientLoggedIn() {
  return typeof window !== "undefined" && getApiClientLoginToken() !== null;
}

export function apiClientLogout() {
  localStorage.removeItem("api-jwt");
  apiClient.request.config.TOKEN = null;
}
