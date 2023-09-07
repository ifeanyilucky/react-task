import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //TODO
      const { user, role } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "LOGOUT",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    //TODO
    async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const { user } = state;
        const response = await fetch(`${sdk._baseurl}/v2/api/lambda/check`, {
          method: "POST",
          body: JSON.stringify({
            role: user.role,
          }),
          headers: sdk.getHeader(),
        });
        if (response.status !== 200) {
          tokenExpireError(dispatch, "TOKEN_EXPIRED");
        }
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
