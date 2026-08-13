import { useMutation } from "@tanstack/react-query";
import { signUpGoogleApi } from "../Api/auth";
import toast from "react-hot-toast";

export function useSignUpGoogle() {
  const {
    mutate: signupGoogle,
    isError,
    data,
    error,
  } = useMutation({
    mutationFn: signUpGoogleApi,
    onSuccess: () => {
      // Cookie is set by the server via Set-Cookie header
      setTimeout(() => {
        window.location.href = "/";
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { signupGoogle, isError, data, error };
}
