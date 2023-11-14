import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/auth/login-page";
    }, 2000);
  }, []);

  return (
    <div>
      <h1>Logging Out...</h1>
      <BounceLoader color="#007BFF" loading={loading} size={60} />
    </div>
  );
}
