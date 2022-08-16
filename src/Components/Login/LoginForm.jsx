import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ReactSession } from "react-client-session";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Loader from "../../assets/images/loader.gif";
import { adminLogin, authenticateLogin, url } from "../../service/api";
import jsCookie from "js-cookie";

const LoginForm = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [error, setError] = React.useState(0);
  const [captcha, setCaptcha] = React.useState(true);

  const captchaRef = React.useRef();
  console.log(captchaRef);
  const Login = async (values) => {
    if (captcha === false && error >= 3) {
      setCaptchaError("Confirm Captcha");
      return;
    }else{
      setCaptchaError(null);
    }
    let res = null;
    setLoading(true);
    if (props.admin) res = await adminLogin(values);
    else res = await authenticateLogin(values);
    console.log(res);
    if (res) {
      setCaptcha(true);
      setCaptchaError(null);
      setLoading(false);
      ReactSession.set("access_token", res.data.access_token);
      jsCookie.set("access_token", res.data.access_token);
      if (!props.admin) {
        if (res.data.user.user_type === "User")
          window.location.href = "/user";
        else if (res.data.user.user_type === "Company")
          window.location.href = "/company";
      } else {
        window.location.href = "/admin";
      }
    } else {
      setCaptcha(false);
      if(captchaRef.current !== undefined){
        captchaRef.current.reset();
      }
      let e = error + 1;
      setError(e);
      if (error >= 3) {
        setCaptcha(false);
      }
      setLoginError("Username and Password doesn't match !");
      setLoading(false);
    }
  };

  return (
    <div className="p-5 pt-5 pb-2 lg:p-9 ">
      <p className="text-3xl font-semibold">Repute Hire</p>
      <div className="p-2 lg:p-12 pt-8  pb-2 pl-5">
        <p className="text-xl font-bold">
          OPs {props.admin ? "Admin" : ""} Signup
        </p>
        <p className="text-sm">Get Admin Support of ReputeHire </p>

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
            <Form className="space-y-3 py-3">
              <Field
                type="text"
                name="username"
                placeholder="Username, Phone or Email Address"
                className="w-full"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600"
              />
        
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <div className="w-100">
              <p className="text-sm text-blue-600 mx-auto"><Link to="/resetPassword">Forgot Password ?</Link></p>
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
              {
                captchaError && (
                  <p className="text-sm my-0 text-red-600">{captchaError}</p>
                )
              }
              {!loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-sm mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "rgb(37 99 235)" }}
                >
                  Log In
                </button>
              )}
              {loading && (
                <button className="h-8 bg-blue-600 rounded-sm block mx-auto cursor-pointer w-1/2 px-8 align-middle">
                  <img src={Loader} alt="loader" className="h-9 mx-auto" />
                </button>
              )}
            </Form>
          )}
        </Formik>

        <div className="flex space-x-3 justify-center w-full items-center text-gray-600 py-3">
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
          <p> or </p>
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
        </div>
        <div className="flex justify-center space-x-7 h-7 mt-3">
          <form action={`${url}/auth/google`}>
            <button type="submit">
              <img
                src={Google}
                alt="google-login"
                className="cursor-pointer h-7"
              />
            </button>
          </form>
          <form action={`${url}/auth/microsoft`}>
            <button type="submit">
              <img
                src={Microsoft}
                alt="microsoft-login"
                className="cursor-pointer h-7"
              />
            </button>
          </form>
          <form action={`${url}/auth/linkedin`}>
            <button type="submit">
              <img
                src={Linkedin}
                alt="linkedin-login"
                className="cursor-pointer h-7"
              />
            </button>
          </form>
        </div>
        <div className="h-5 block"></div>
      </div>
    </div>
  );
};

export default LoginForm;