import React from "react";
import { ReactSession } from "react-client-session";
import DialerApp from "../dialer";
// Components
import SignupForm from "../Components/Login/SignUpForm";
import LoginForm from "../Components/Login/LoginForm";

// Assets
import styles from "../assets/stylesheet/login.module.css";

const Login = () => {
  const [login, showLogin] = React.useState(true);

  React.useEffect(() => {
    const initial = async () => {
      let access = await localStorage.getItem("access_token");
      await localStorage.removeItem("modalOnce");
      let user = JSON.parse(await localStorage.getItem("user"));
      let url = window.location.href.split("/");
      if (url[url.length - 1] === "register") showLogin(false);
      if (
        (access !== "null" ||
          access !== undefined ||
          access !== null ||
          access !== "undefined") &&
        user.access_valid === true
      ) {
        if (user.isAdmin) {
          window.location.href = "/admin?a=" + access;
        }
        if (user.user_type === "Company") {
          window.location.href = "/company?a=" + access;
        }
        if (user.user_type === "XI") {
          window.location.href = "/XI?a=" + access;
        }
        if (user.user_type === "User") {
          window.location.href = "/user?a=" + access;
        }
      }
    };
    initial();
  });

  return (
    <div className={styles.loginLanding}>
      {/* Login Card */}
      <div
        className="container md:w-5/12 flex bg-white rounded-lg"
        style={{ borderRadius: "0.7rem" }}
      >
        {!login && (
          <div className="w-full flex flex-col">
            <SignupForm />
            <p className="pb-5 text-center text-md block">
              Already have an account ?{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer"
                onClick={() => {
                  showLogin(true);
                  window.history.pushState({ url: "/login" }, "", "/login");
                }}
              >
                {" "}
                Log In{" "}
              </span>
            </p>
          </div>
        )}
        {/* Card 1 */}

        {/* Card 2 */}
        {login && (
          <div className="w-full flex flex-col">
            <LoginForm />
            <p className="pb-5 text-center mt-4 text-md block">
              Don't have an account ?{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer"
                onClick={() => {
                  showLogin(false);
                  window.history.pushState(
                    { url: "/register" },
                    "",
                    "/register"
                  );
                }}
              >
                {" "}
                Sign Up{" "}
              </span>
            </p>
          </div>
        )}
      </div>
      {/* Login Card */}
    </div>
  );
};

export default Login;
