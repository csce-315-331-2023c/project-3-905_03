import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
  const [error, setError] = useState<string>(""); // add type annotation for 'error'
  const { loginWithOAuth } = useAuth();
  const history = useHistory();

  async function handleOAuthLogin(provider: string) {
    try {
      await loginWithOAuth(provider);
      history.push("/");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={() => handleOAuthLogin("google")}>Login with Google</button>
      <button onClick={() => handleOAuthLogin("facebook")}>Login with Facebook</button>
    </div>
  );
}

export default Login;
