import React from "react";
import { ReactSession } from "react-client-session";

// Components
import SignupForm from "../Components/Login/SignUpForm";
import LoginForm from "../Components/Login/LoginForm";

// Assets
import styles from "../assets/stylesheet/login.module.css";
import jsCookie from "js-cookie";
import { LogoutAPI } from "../service/api";

const Login = () => {
  
  const [login, showLogin] = React.useState(true);

  const Logout =async () => {
    let user = ReactSession.get("user");
    await LogoutAPI(user._id);
    ReactSession.set("user", null);
    jsCookie.set("access_token",null);
    ReactSession.set("access_token", null);
  };

  React.useEffect(()=>{
    let access = ReactSession.get("access_token");
    let user = ReactSession.get("user");
    if(access === null || access === undefined)
      access  = jsCookie.get('access_token');
    if(access && user){
        Logout();
    }
  })

  return (
    <div className={styles.loginLanding}>
      {/* Login Card */}
      <div className="container w-3/4 flex bg-white rounded-lg">
        {!login && (
          <div className="md:w-1/2 w-full flex flex-col">
            <SignupForm />
            <p className="py-5 text-center text-sm block">
              Already have an account ?{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer"
                onClick={() => showLogin(true)}
              >
                {" "}
                Log In{" "}
              </span>
            </p>
          </div>
        )}
        {/* Card 1 */}
        <div className="w-1/2 m-0 md:block hidden">
          <div className={styles.Card1}></div>
        </div>
        {/* Card 2 */}
        {login && (
          <div className="md:w-1/2 w-full flex flex-col">
            <LoginForm />
            <p className="py-5 text-center text-sm block">
              Don't have an account ?{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer"
                onClick={() => showLogin(false)}
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
