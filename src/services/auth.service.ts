import jwtDecode from "jwt-decode";
import { store } from "@/redux/store";
import { refreshToken } from "@/redux/thunks/auth.thunks";

interface DecodedJwtPayload {
  exp?: number;
}

const setupTokenRefresh = (access_token: string) => {
  const decodedToken = jwtDecode<DecodedJwtPayload>(access_token);

  if (decodedToken.exp) {
    console.log('decoded',decodedToken.exp)
    const currentTime = Date.now();
    const buffer = 1 * 60;
    const timeUntilExpiry = decodedToken.exp - currentTime - buffer;
    console.log('TIME_SUPUETAMENTE', timeUntilExpiry)

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        store.dispatch(refreshToken());
      }, timeUntilExpiry * 1000);
    } else {
      store.dispatch(refreshToken());
    }
  }
};

export { setupTokenRefresh };
