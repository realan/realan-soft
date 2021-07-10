import configJson from "./auth_config.json";

// in the auth_config.json was "audience": "https://realan-suvenir.ru/",

// "audience": "https://realan.eu.auth0.com/api/v2/",
// "scope": "read:current_user update:current_user_metadata"

export function getConfig() {
  // Configure the audience here. By default, it will take whatever is in the config
  // (specified by the `audience` key) unless it's the default value of "YOUR_API_IDENTIFIER" (which
  // is what you get sometimes by using the Auth0 sample download tool from the quickstart page, if you
  // don't have an API).
  // If this resolves to `null`, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience =
    configJson.audience && configJson.audience !== "YOUR_API_IDENTIFIER"
      ? configJson.audience
      : null;

  // console.log("audience", audience);
  const obj = {
    domain: configJson.domain,
    clientId: configJson.clientId,
    ...(audience ? { audience } : null),
  };
  console.log(obj);
  return obj;
  // {
  //   domain: configJson.domain,
  //   clientId: configJson.clientId,
  //   ...(audience ? { audience } : null),
  // };
}
