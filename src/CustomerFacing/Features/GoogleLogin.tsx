import { useSignUpGoogle } from "../../Queries/useSignUpGoogle";
import { GoogleLogin as Google } from "@react-oauth/google";

const GoogleLogin = () => {
  const { signupGoogle } = useSignUpGoogle();

  const responseMessage = async (response: any) => {
    if (response.credential) {
      signupGoogle({ idToken: response.credential });
    }
  };

  const errorMessage = () => {
  };
  return <Google onSuccess={responseMessage} onError={errorMessage} />;
};

export default GoogleLogin;

