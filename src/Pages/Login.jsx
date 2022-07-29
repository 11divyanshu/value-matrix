import React from "react";

// Components
import SignupForm from "../Components/Login/SignUpForm";
import LoginForm from "../Components/Login/LoginForm";

// Assets
import styles from "../assets/stylesheet/login.module.css";

const Login = () => {

    const [login, showLogin] = React.useState(true);

  return (
    <div className={styles.loginLanding}>
      {/* Login Card */}
      <div className="container w-3/4 flex bg-white rounded-lg">
      {!login && (
          <div className="w-full lg:w-1/2 flex flex-col">
          <SignupForm/>
          <p className="py-5 text-center text-sm block">
          Already have an account ?{" "}
          <span
            className="text-blue-700 font-semibold cursor-pointer"
            onClick={() =>showLogin(true)}
          >
            {" "}
            Log In{" "}
          </span>
        </p>
          </div>
      )}
        {/* Card 1 */}
        <div className="w-1/2 m-0 lg:block hidden">
            <div className={styles.Card1}></div>
        </div>
        {/* Card 2 */}
        {login && (
          <div className="w-full lg:w-1/2 flex flex-col">
          <LoginForm/>
          <p className="py-5 text-center text-sm block">
          Don't have an account ?{" "}
          <span
            className="text-blue-700 font-semibold cursor-pointer"
            onClick={() => showLogin(false)}
          >
            {" "}
            Log In{" "}
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