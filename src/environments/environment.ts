import * as process from 'process';

export const environment = {
  production: process.env.NG_APP_PRODUCTION === 'true',
  qa: process.env.NG_APP_QA === 'true',
  analyticsEnabled: process.env.NG_APP_ANALYTICS_ENABLED === 'true',
  stripe: {
    pk: process.env.NG_APP_STRIPE_PK,
    clientId: process.env.NG_STRIPE_CLIENT_ID,
  },
  baseUrl: process.env.NG_APP_BASE_URL,
  apiUrl: process.env.NG_APP_BASE_URL + 'api/v1/',
  wsBase: process.env.NG_APP_WS_BASE,
  jitsiUrl: process.env.NG_APP_JITSI_URL,
  logRocketAppId: process.env.NG_APP_LOGROCKET_APP_ID,
  paypal: {
    clientID: process.env.NG_APP_PAYPAL_CLIENT_ID,
  },
  oneSignal: {
    appId: process.env.NG_APP_ONESIGNAL_APP_ID,
    safari_web_id: process.env.NG_APP_ONESIGNAL_SAFARI_WEB_ID,
    allowLocalhostAsSecureOrigin:
      process.env.NG_APP_ONESIGNAL_ALLOW_LOCALHOST_AS_SECURE_ORIGIN === 'true',
  },
  revision: process.env.NG_APP_GIT_REVISION,
  mode: process.env.NG_APP_ENVIRONMENT,
  appTitle: process.env.NG_APP_TITLE,
  // Lupai WebSocket configuration
  lupai: {
    wsUrl: process.env.NG_APP_LUPAI_WS_URL,
    token: process.env.NG_APP_LUPAI_TOKEN,
  },
};
