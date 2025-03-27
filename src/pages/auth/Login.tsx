import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import pic from "../../assets/11668644_20945238.png";
import { supabase } from "../../lib/supabase";
import { enqueueSnackbar } from "notistack";
import auth from "../../utils/auth";
import { USER_INFO } from "../../constants/global";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../utils/routeNames";
type AuthMode = "login" | "register";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth.getToken()) {
      navigate(`/${appRoutes.dashboard}`);
    }
  }, [location.pathname]);
  const onSubmit = async (data: FormData) => {
    if (mode === "register" && data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
        autoHideDuration: 4000,
      });
      return;
    }

    try {
      if (mode === "register") {
        // Register User
        const { data: _user, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          throw error;
        }
        enqueueSnackbar(
          "Registration successful! Check your email for verification.",
          {
            variant: "success",
            autoHideDuration: 4000,
          }
        );
      } else {
        // Login User
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (user) {
          auth.set(user.user, USER_INFO, true);
          auth.setToken(user.session?.access_token, true);
          auth.setRefreshToken(user?.session?.refresh_token, true);
          navigate(`${appRoutes.dashboard}`);
        }
        console.log(user, "login");
        if (error) {
          throw error;
        }

        enqueueSnackbar("Login Successful!", {
          variant: "success",
          autoHideDuration: 4000,
        });
        console.log("User:", user);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 4000,
      });
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="grid bg-white h-screen">
      <div className="grid-cols-[1.5fr_2fr_2fr] flex">
        <div className="p-2">
          <p>Auth Page</p>
        </div>
        <img src={pic} alt="pic" className="h-[600px] w-[600px]" />
        <div className="flex justify-center items-center w-screen">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                {mode === "login" ? "Login" : "Register"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-800">{errors.email.message}</p>
                )}
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-800">{errors.password.message}</p>
                )}
                {mode === "register" && (
                  <>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-800">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-800"
                >
                  {mode === "login" ? "Login" : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                >
                  {mode === "login"
                    ? "Need an account? Register"
                    : "Already have an account? Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
