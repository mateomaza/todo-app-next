const ErrorComponent = ({ statusCode }: { statusCode: number }) => {
  let errorMessage;

  switch (statusCode) {
    case 401:
      errorMessage =
        "Unauthorized: Access is denied due to invalid credentials.";
      break;
    case 403:
      errorMessage =
        "Forbidden: You do not have permission to access this resource.";
      break;
    case 404:
      errorMessage = "Not Found: The requested resource could not be found.";
      break;
    default:
      errorMessage = "An unexpected error occurred.";
      break;
  }

  return (
    <div>
      <h1>Error {statusCode}</h1>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorComponent;
