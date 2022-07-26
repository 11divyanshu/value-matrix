import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ReactSession } from "react-client-session";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import swal from "sweetalert";

// Assets
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Github from "../../assets/images/Social/github.svg";

import Loader from "../../assets/images/loader.gif";
import { adminLogin, authenticateLogin, url } from "../../service/api";
import jsCookie from "js-cookie";

const LoginForm = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [error, setError] = React.useState(0);
  const [captcha, setCaptcha] = React.useState(true);

  const [showPassword, setShowPassword] = React.useState(false);

  const captchaRef = React.useRef();

  const Login = async (values) => {
    if (captcha === false && error >= 3) {
      setCaptchaError("Confirm Captcha");
      return;
    } else {
      setCaptchaError(null);
    }
    let res = null;
    setLoading(true);
    if (props.admin) res = await adminLogin(values);
    else res = await authenticateLogin(values);
    // console.log(res);
    if (res) {
      setCaptcha(true);
      setCaptchaError(null);
      setLoading(false);
      await localStorage.setItem("access_token", res.data.access_token);
      let access = res.data.access_token;
      // swal({
      //   title: "Login",
      //   text: "Login Successful",
      //   icon: "success",
      //   button: "Continue",
      // }).then(() => {

        if (res.data.user.invite) {
          window.location.href = "/setProfile/" + res.data.user.resetPassId;
        } else if (res.data.user.user_type === "User")
          window.location.href = "/user/?a=" + access;
        else if (
          res.data.user.user_type === "Company" ||
          res.data.user.user_type === "Company_User"
        )
          window.location.href = "/company?a=" + access;
        else if (res.data.user.user_type === "XI" || res.data.user.user_type === "SuperXI")
          window.location.href = "/XI/?a=" + access;
        else if (
          res.data.user.isAdmin ||
          res.data.user.user_type === "Admin_User"
        ) {
          window.location.href = "/admin/?a=" + access;
        }
      // });
    } else {
      setCaptcha(false);
      if (captchaRef.current !== undefined) {
        captchaRef.current.reset();
      }
      let e = error + 1;
      setError(e);
      if (error >= 3) {
        setCaptcha(false);
      }
      // setLoginError("Username and Password doesn't match !");
      swal({
        title: "Login",
        text: "Username and Password doesn't match !",
        icon: "error",
        button: false,
      });
      setLoading(false);
    }
  };

  return (
    <div className="pt-5 lg:p-7 h-100">
      <span
        style={{ fontWeight: 700 }}
        className="text-4xl font-bold flex pl-9"
      >
        Value<p className="px-2" style={{ color: "#3667E9" }}>Matrix</p>
      </span>
      <div className="my-2">
        <span className="font-semibold pl-9">
          Welcome ! Please enter your details.
        </span>
      </div>
      <div className=" px-6 mx-6 lg:p-4 pt-4">
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={(values) => {
            Login(values);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-2 pt-3">
              <div className="my-3">
                <label className="font-semibold">Username, Phone or Email Address</label>
                <br></br>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username, Phone or Email Address"
                  className="w-full text-600 my-1"
                  style={{ borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-600 mb-4"
                />
              </div>
              <div className="pt-2">
                <label className="font-semibold">Password</label>
                <br />
                <div
                  className="w-full flex items-center"
                  style={{ borderRadius: "12px" }}
                >
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full text-600 my-1"
                    style={{ borderRadius: "8px" }}
                  />
                  <div className="relative flex items-center">
                  {showPassword ? (
                    <p
                      className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3" 
                      onClick={() => {
                        setShowPassword(false);
                      }}
                    >
                      <AiFillEyeInvisible className="text-xl" />
                    </p>
                  ) : (
                    <p
                      className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold absolute right-3" 
                      onClick={() => {
                        setShowPassword(true);
                      }}
                    >
                      <AiFillEye className="text-xl"/>
                    </p>
                  )}
                  </div>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <div className="w-100">
                <p className="text-sm text-blue-600 text-right font-semibold">
                  <Link to="/resetPassword">Forgot Password ?</Link>
                </p>
              </div>
              {error >= 3 && (
                <div>
                  <ReCAPTCHA
                    sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"
                    onChange={(value) => {
                      setCaptcha(true);
                    }}
                    ref={captchaRef}
                  />
                </div>
              )}
              {captchaError && (
                <p className="text-sm my-0 text-red-600">{captchaError}</p>
              )}
              {!loading && (
                <button
                  className="bg-blue-600 px-4 py-2 text-white rounded-md font-bold text-lg block mt-6 mx-auto hover:bg-blue-700 text-center w-full cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "#01458C" }}
                >
                  Log In
                </button>
              )}
              {loading && (
                <button className="h-8 bg-blue-600 rounded-sm block mx-auto cursor-pointer w-1/2 px-8 align-middle" style={{ backgroundColor: "#01458C" }}>
                  <img src={Loader} alt="loader" className="h-9 mx-auto" />
                </button>
              )}
            </Form>
          )}
        </Formik>

        <div className="flex space-x-3 justify-center w-full items-center text-gray-600 py-5">
          {/* <div className="h-[0.5px] w-12 bg-gray-600 block"></div> */}
          <p className="text-gray-800 text-md font-semibold"> Or Login With </p>
          {/* <div className="h-[0.5px] w-12 bg-gray-600 block"></div> */}
        </div>
        <div className="flex flex-wrap justify-center space-x-2 h-7 mt-3">
          <form action={`${url}/auth/google`}>
              <button type="submit" className="my-0.5">
                <div className="flex px-2 py-1 border border-gray-300 ">
                  <img
                    src={Google}
                    alt="google-login"
                    className="cursor-pointer h-3 my-px"
                  />
                  <p className="text-xs font-semibold px-2">Google</p>
                </div>
              </button>
          </form>
          <form action={`${url}/auth/microsoft`}>
          <button type="submit" className="my-0.5">
          <div className="flex px-2 py-1 border border-gray-300">

              <img
                src={Microsoft}
                alt="microsoft-login"
                className="cursor-pointer h-3 my-px"
              />

              <p className="text-xs font-semibold px-2">Microsoft</p>
              </div>
              </button>
          </form>
          <form action={`${url}/auth/linkedin`}>
          <button type="submit" className="my-0.5">
          <div className="flex px-2 py-1 border border-gray-300">

              <img
                src={Linkedin}
                alt="linkedin-login"
                className="cursor-pointer h-3 my-px"
              />
              <p className="text-xs font-semibold px-2">Linkedin</p>
              </div>
              </button>
          </form>       
        </div>
        <div className="h-5 block"></div>
      </div>
    </div>
  );
};

export default LoginForm;
