import React from "react";
import { BounceLoader } from "react-spinners";

interface LoadingProps {
  loading: boolean;
  size?: number;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  size = 60,
  color = "#007BFF",
}) => {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <BounceLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loading;