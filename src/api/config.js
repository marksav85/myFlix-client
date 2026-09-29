export const getApiBaseUrl = () => {
  const baseUrl = process.env.MYFLIX_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      "MYFLIX_API_BASE_URL is required. Set it in your environment before starting the app."
    );
  }

  return baseUrl.replace(/\/+$/, "");
};
