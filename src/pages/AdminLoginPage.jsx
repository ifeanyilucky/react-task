import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdSDK from "../utils/MkdSDK";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import SnackBar from "../components/SnackBar";
import { GlobalContext, showToast } from "../globalContext";

const AdminLoginPage = () => {
  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })
    .required();

  const { dispatch, state } = React.useContext(AuthContext);
  console.log(state);
  const globalContext = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "admin",
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    let sdk = new MkdSDK();
    //TODO
    const { email, password, role } = data;
    setIsLoading(true);
    await sdk
      .login(email, password, role)
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        showToast(globalContext.dispatch, "Login successful");
        dispatch({
          type: "LOGIN",
          payload: {
            user: response,
            role: response.role,
          },
        });
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        navigate("/" + role + "/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        showToast(globalContext.dispatch, "Something went wrong.");
        console.log(error);
      });
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <SnackBar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 "
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="******************"
            {...register("password")}
            className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">
            {errors.password?.message}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Sign In"
            disabled={isLoading ? true : false}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
