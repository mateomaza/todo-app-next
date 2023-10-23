import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';

export default function Logout() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }, 2000); 
  }, []);

  return (
    <div>
      <h1>Logging Out...</h1>
      <BounceLoader color="#007BFF" loading={loading} size={60} />
    </div>
  );
}