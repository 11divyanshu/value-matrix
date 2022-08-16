import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import wildcards from "disposable-email-domains/wildcard.json";
import axios from "axios";
// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Loader from "../../assets/images/loader.gif";
import {
  authenticateSignUp,
  OTPMail,
  OTPSms,
  validateSignupDetails,
  url,
} from "../../service/api";

const validateUserEmail = (value) => {
  let domain = value.split("@")[1];
  let host = domain.split(".")[0];
  if (wildcards.includes(host) | wildcards.includes(domain)) {
    return false;
  }
  return true;
};

const validateCompanyEmail = (value) => {
  let domain = value.split("@")[1];
  let host = domain.split(".")[0];
  let domains = ["gmail", "yahoo", "bing"];
  if (domains.includes(host)) {
    return false;
  }
  return true;
};

const SignupForm = () => {
  const [signupError, setSignupError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [OTP, setOTP] = React.useState(null);
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [SmsOTP, setSMSOTP] = React.useState(null);
  const [SmsOTPError, setSmsOTPError] = React.useState(false);
  const [EmailOTPError, setEmailOTPError] = React.useState(false);
  const [EmailError, setEmailError] = React.useState(null);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [captcha, setCaptcha] = React.useState(false);

  const captchaRef = React.useRef();

  const OTPField = useRef(null);

  const sendOTP = async (values) => {
    if (values.user_type === "Company") {
      if (validateCompanyEmail(values.email) === false) {
        setSignupError("Enter Company Email !");
        return;
      }
    }
    if (validateUserEmail(values.email) === false) {
      setSignupError("Invalid Email Address");
      return;
    }
    setSignupError(null);
    setLoading(true);
    let check = await validateSignupDetails(values);
    console.log(check.data);
    if (check.data.username && check.data.email === true) {
      setSignupError("Username and Email Already Registered");
    }
    if (check.data.username && check.data.contact) {
      setSignupError("Username and Contact Already Registered");
    }
    if (check.data.email) {
      setSignupError("Email Already Registered");
    }
    if (check.data.contact) {
      setSignupError("Contact Already Registered");
    }
    if (check.data.username) {
      setSignupError("Username Already Registered");
    }
    if (check.data.username || check.data.contact || check.data.email) {
      setLoading(false);
      return;
    }

    let res1 = await OTPSms({ contact: values.contact });
    let res2 = await OTPMail({ mail: values.email });

    if (res1) {
      setSMSOTP(res1);
    }
    if (res2) {
      setEmailOTP(res2);
    } else if (!res1 && !res2) {
      console.log("Error");
    }
    setOTP(true);
    setLoading(false);
  };

  const signup = async (values) => {
    if (parseInt(values.SmsOTP) === parseInt(SmsOTP)) {
      setSmsOTPError(false);
    }
    if (parseInt(values.EmailOTP) === parseInt(EmailOTP)) {
      setEmailOTPError(false);
    }
    if (
      parseInt(values.SmsOTP) === parseInt(SmsOTP) &&
      parseInt(values.EmailOTP) === parseInt(EmailOTP)
    ) {
      if (captcha === false) {
        setShowCaptcha(true);
      } else {
        let res = await authenticateSignUp(values);
        setSmsOTPError(false);
        setEmailOTPError(false);
        setLoading(true);
        console.log("valjue");
        if (res && !res.data.Error) {
          window.location.href = "/login";
        } else if (res) {
          setSignupError(res.data.Error);
          setOTP(null);
        } else {
          setOTP(null);
          setSignupError("Error Signing Up");
          OTPField.current = "";
          setEmailOTPError(null);
          setSmsOTPError(null);
        }
        setLoading(false);
      }
    } else if (parseInt(values.SmsOTP) !== parseInt(SmsOTP)) {
      setSmsOTPError(true);
    } else {
      setEmailOTPError(true);
    }
  };

  return (
    <div className="p-5 pt-5 pb-2 lg:p-9 ">
      <p className="text-3xl font-semibold">Repute Hire</p>
      <div className="p-2 lg:p-12 pt-8  pb-2 pl-5">
        <p className="text-xl font-bold">OPs/Admin Signup</p>
        <p className="text-sm">Get Admin Support of ReputeHire </p>

        <Formik
          initialValues={{
            name: "",
            email: "",
            username: "",
            password: "",
            user_type: "User",
            contact: "",
            agree: false,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Username Required";
            }
            if (!values.name) {
              errors.name = "Name Required";
            }
            if (!values.email) {
              errors.email = "Email Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid Email Address";
            }
            if (!values.contact) {
              errors.contact = "Contact Required";
            } else if (
              !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                values.contact
              )
            ) {
              errors.contact = "Invalid Contact Number";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            if (!values.agree) {
              errors.agree = "You need to accept to continue";
            }
            return errors;
          }}
          onSubmit={(values) => {
            if (OTP) {
              signup(values);
            } else {
              sendOTP(values);
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-3 py-3">
              <Field
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full"
                disabled={OTP !== null}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="w-full"
                disabled={OTP !== null}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="text"
                name="email"
                disabled={OTP !== null}
                placeholder="Email"
                className="w-full"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-600"
              />
              <label>Register As : </label>
              <Field as="select" name="user_type">
                <option value="Candidate">Candidate</option>
                <option value="Company">Company</option>
                <option value="XI">XI</option>
              </Field>

              <Field
                type="text"
                name="contact"
                disabled={OTP !== null}
                placeholder="Contact Number"
                className="w-full"
              />
              <ErrorMessage
                name="contact"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="password"
                name="password"
                disabled={OTP !== null}
                placeholder="Password"
                className="w-full"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600"
              />
              {EmailOTP && (
                <Field
                  type="number"
                  name="EmailOTP"
                  ref={OTPField}
                  placeholder="Email OTP"
                  className="w-full"
                />
              )}
              {EmailOTP && EmailOTPError && (
                <p className="text-sm text-red-600">Invalid Email OTP !</p>
              )}
              {SmsOTP && (
                <Field
                  type="number"
                  name="SmsOTP"
                  ref={OTPField}
                  placeholder="Contact OTP"
                  className="w-full"
                />
              )}
              {SmsOTP && SmsOTPError && (
                <p className="text-sm text-red-600">Invalid SMS OTP !</p>
              )}
              {signupError && (
                <p className="text-sm text-red-600">{signupError}</p>
              )}
              <div>
                <Field type="checkbox" name="agree" className="mr-2" />
                <label>
                  Agree to the{" "}
                  <a href="#" target="_blank">
                    Terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" target="_blank">
                    Privacy policy
                  </a>
                  .
                </label>
                <ErrorMessage
                  name="agree"
                  component="div"
                  className="text-sm text-red-600 w-100"
                />
              </div>
              {showCaptcha && (
                <div>
                  <div>
                    <ReCAPTCHA
                      sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"
                      onChange={(value) => {
                        setCaptcha(true);
                      }}
                      ref={captchaRef}
                    />
                  </div>
                  {captchaError && (
                    <p className="text-sm my-0 text-red-600">{captchaError}</p>
                  )}
                </div>
              )}
              {!loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-sm mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "rgb(37 99 235)" }}
                >
                  {OTP === null ? "Continue" : "Signup"}
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
        <div className="lg:h-5 h-0 block"></div>
      </div>
    </div>
  );
};

export default SignupForm;
