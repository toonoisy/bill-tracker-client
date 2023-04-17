const ENV = import.meta.env.MODE;

export const baseURL = ENV == "development" ? "/" : "http://api.chennick.wang";
