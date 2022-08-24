import React from "react";
import { ReactSession } from "react-client-session";

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
      
      let user = JSON.parse(await localStorage.getItem("user"));
      let url = window.location.href.split("/");
      if (url[url.length - 1] === "register") showLogin(false);
      if (access !== "null" || access !== undefined || access !== null || access !== "undefined") {
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
      <div className="container w-3/4 flex bg-white rounded-lg" style={{borderRadius:"0.7rem"}}>
        {!login && (
          <div className="w-1/2 w-full flex flex-col">
            <SignupForm />
            <p className="pb-5 text-center text-sm block">
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
       
{login&&  <div className="w-1/2 m-0 md:block hidden" >
          <div className={styles.Card1}></div>
        </div>}

        {!login && <div className="w-1/2 m-0 md:block hidden" >
          <div className={styles.Card2}></div>
        </div>}


        {/* Card 2 */}
        {login && (
          <div className="w-1/2 w-full flex flex-col">
            <LoginForm />
            <p className="pb-5 text-center text-sm block">
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
