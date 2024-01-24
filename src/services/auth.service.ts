import jwtDecode from "jwt-decode";
import { store } from "@/redux/store";
import { refreshToken } from "@/redux/thunks/auth.thunks";

let refreshTimeout: NodeJS.Timeout | number;

interface DecodedJwtPayload {
  exp?: number;
}

const setupTokenRefresh = (access_token: string) => {
  const decodedToken = jwtDecode<DecodedJwtPayload>(access_token);

  if (decodedToken.exp) {
    const currentTime = Date.now() / 1000;
    const buffer = 1 * 60;
    const timeUntilExpiry = (decodedToken.exp - currentTime - buffer) * 1000;
    if (refreshTimeout) clearTimeout(refreshTimeout);

    if (timeUntilExpiry > 0) {
      refreshTimeout = setTimeout(() => {
        store.dispatch(refreshToken());
      }, timeUntilExpiry);
    } else {
      store.dispatch(refreshToken());
    }
  }
};

export { setupTokenRefresh };
