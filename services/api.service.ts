const BASE_URL = "http://localhost:8080/api";

export const get = async (url: string) => {
  const result = await fetch(BASE_URL + url, {
    cache: "no-store",
  });
  const data = await result.json();

  return data;
};
