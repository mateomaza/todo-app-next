import jwtDecode from "jwt-decode";
import { store } from "../redux/store";
import { refresh } from "../redux/thunks/auth.thunks";

interface DecodedJwtPayload {
  exp?: number;
}

const setupTokenRefresh = (access_token: string) => {
  const decodedToken = jwtDecode<DecodedJwtPayload>(access_token);

  if (decodedToken.exp) {
    const currentTime = Date.now();
    const buffer = 1 * 60;
    const timeUntilExpiry = decodedToken.exp - currentTime - buffer;

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        store.dispatch(refresh());
      }, timeUntilExpiry * 1000);
    } else {
      store.dispatch(refresh());
    }
  }
};

export { setupTokenRefresh };
