import {
  TOKEN_KEY,
  USER_INFO,
  BBID,
  REFRESH_TOKEN_KEY,
} from "../constants/global";
const parse = JSON.parse;
const stringify = JSON.stringify;

const auth = {
  clear(key: string) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.removeItem(key);
    }

    return null;
  },

  clearAppStorage() {
    if (localStorage) {
      const onboarding = auth.get("onboarding");
      localStorage.clear();
      localStorage.setItem("onboarding", onboarding);
    }

    if (sessionStorage) {
      sessionStorage.clear();
    }
  },

  clearToken(tokenKey = TOKEN_KEY) {
    return auth.clear(tokenKey);
  },

  clearUserInfo(userInfo = USER_INFO) {
    return auth.clear(userInfo);
  },

  get(key: string) {
    if (localStorage && localStorage.getItem(key)) {
      return parse(localStorage.getItem(key) as string) || null;
    }
    if (sessionStorage && sessionStorage.getItem(key)) {
      return parse(sessionStorage.getItem(key) as string) || null;
    }
    return null;
  },

  getToken(tokenKey = TOKEN_KEY) {
    return auth.get(tokenKey);
  },
  getRefreshToken(tokenKey = REFRESH_TOKEN_KEY) {
    return auth.get(tokenKey);
  },

  getUserInfo(key?: any) {
    const user = auth.get(USER_INFO);
    const data = key ? user?.[key] : user;
    return data;
  },

  set(value: any, key: string, isLocalStorage: boolean) {
    if (value == null || Object.keys(value).length === 0) {
      return null;
    }

    if (isLocalStorage && localStorage) {
      return localStorage.setItem(key, stringify(value));
    }

    if (sessionStorage) {
      return sessionStorage.setItem(key, stringify(value));
    }

    return null;
  },

  setToken(value = "", isLocalStorage = false, tokenKey = TOKEN_KEY) {
    return auth.set(value, tokenKey, isLocalStorage);
  },
  setRefreshToken(
    value = "",
    isLocalStorage = false,
    tokenKey = REFRESH_TOKEN_KEY,
  ) {
    return auth.set(value, tokenKey, isLocalStorage);
  },

  setUserInfo(
    value: string = "",
    isLocalStorage = false,
    userInfo = USER_INFO,
  ) {
    return auth.set(value, userInfo, isLocalStorage);
  },

  logout() {
    auth.clearAppStorage();
    window.location.reload();
  },

  getUniqId() {
    let data = auth.get(BBID);

    if (!data) {
      data = generateRandomString();
      auth.set(data, BBID, true);
    }
    return data;
  },
};

export default auth;

function generateRandomString() {
  let result = "";
  const characters =
    "wg3HFxRD3BNVkyK6RXPvBdCYdjzMSRAxrzgMRgBeYK79n985r7HSE7yeZJhmwDA8YMhERpQSANHvxpMLJs2dLt39GuYeRBgqTR2r";
  const length = 50;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

