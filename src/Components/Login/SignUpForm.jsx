import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import wildcards from "disposable-email-domains/wildcard.json";
import swal from "sweetalert";
// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Github from "../../assets/images/Social/github.svg";
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
  const [SmsError, setSmsError] = React.useState(null);

  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [captcha, setCaptcha] = React.useState(false);

  const [emailLoad, setEmailLoading] = React.useState(false);
  const [verifyEmail, setverifyEmail] = React.useState(false);

  const [smsLoad, setSmsLoading] = React.useState(false);
  const [verifySms, setverifySms] = React.useState(false);

  const captchaRef = React.useRef();

  const OTPField = useRef(null);

  // const sendOTP = async (values) => {
  //   if (values.user_type === "Company") {
  //     if (validateCompanyEmail(values.email) === false) {
  //       setSignupError("Enter Company Email !");
  //       return;
  //     }
  //   }
  //   if (validateUserEmail(values.email) === false) {
  //     setSignupError("Invalid Email Address");
  //     return;
  //   }
  //   setSignupError(null);
  //   setLoading(true);
  //   let check = await validateSignupDetails(values);
  //   console.log(check.data);
  //   if (check.data.username && check.data.email === true) {
  //     setSignupError("Username and Email Already Registered");
  //   }
  //   if (check.data.username && check.data.contact) {
  //     setSignupError("Username and Contact Already Registered");
  //   }
  //   if (check.data.email) {
  //     setSignupError("Email Already Registered");
  //   }
  //   if (check.data.contact) {
  //     setSignupError("Contact Already Registered");
  //   }
  //   if (check.data.username) {
  //     setSignupError("Username Already Registered");
  //   }
  //   if (check.data.username || check.data.contact || check.data.email) {
  //     setLoading(false);
  //     return;
  //   }

  //   let res1 = await OTPSms({ contact: values.contact });
  //   let res2 = await OTPMail({ mail: values.email });

  //   if (res1) {
  //     setSMSOTP(res1);
  //   }
  //   if (res2) {
  //     setEmailOTP(res2);
  //   } else if (!res1 && !res2) {
  //     console.log("Error");
  //   }
  //   setOTP(true);
  //   setLoading(false);
  // };

  const sendEmailOTP = async (values) => {
    if (values.user_type === "Company") {
      if (validateCompanyEmail(values.email) === false) {
        // setSignupError("Enter Company Email !");
        swal({
          title: "Sign Up",
          text: "Enter Company Email !",
          icon: "error",
          button: false,
        });
        return;
      }
    }
    if (validateUserEmail(values.email) === false) {
      // setSignupError("Invalid Email Address");
      swal({
        title: "Sign Up",
        text: "Invalid Email Address",
        icon: "error",
        button: false,
      });
      return;
    }
    setSignupError(null);
    let check = await validateSignupDetails(values);
    console.log(check.data);
    if (check.data.username && check.data.email === true) {
      setSignupError("Username and Email Already Registered");
      swal({
        title: "Sign Up",
        text: "Username and Email Already Registered",
        icon: "error",
        button: false,
      });
    }

    if (check.data.email) {
      // setSignupError("Email Already Registered");
      swal({
        title: "Sign Up",
        text: "Email Already Registered",
        icon: "error",
        button: false,
      });
    }

    if (check.data.username) {
      // setSignupError("Username Already Registered");
      swal({
        title: "Sign Up",
        text: "Username Already Registered",
        icon: "error",
        button: false,
      });
    }
    if (check.data.username || check.data.email) {
      setLoading(false);
      return;
    }
    console.log(values.mail);

    let res2 = await OTPMail({ mail: values.email });

    if (res2) {
      setEmailOTP(res2);
    } else if (!res2) {
      console.log("Error");
    }

    // setOTP(true);
    // setLoading(false);
  };

  const verifyEmailOTP = async (values) => {
    if (parseInt(values.EmailOTP) === parseInt(EmailOTP)) {
      setEmailOTPError(false);
      setverifyEmail(true);
      swal({
        title: "Sign Up",
        text: "OTP Verified!",
        icon: "success",
        button: false,
      });
    } else {
      // setEmailOTPError(true);
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
    }
    if (verifyEmail && verifySms) {
      setOTP(true);
    }
  };

  const sendSmsOTP = async (values) => {
    if (values.user_type === "Company") {
      if (validateCompanyEmail(values.email) === false) {
        // setSignupError("Enter Company Email !");
        swal({
          title: "Sign Up",
          text: "Enter Company Email !",
          icon: "error",
          button: false,
        });
        return;
      }
    }

    setSignupError(null);
    setSmsLoading(true);
    setverifySms(false);
    let check = await validateSignupDetails(values);
    console.log(check.data);

    if (check.data.username && check.data.contact) {
      // setSignupError("Username and Contact Already Registered");
      swal({
        title: "Sign Up",
        text: "Username and Contact Already Registered",
        icon: "error",
        button: false,
      });
    }

    if (check.data.contact) {
      // setSignupError("Contact Already Registered");
      swal({
        title: "Sign Up",
        text: " Contact Already Registered",
        icon: "error",
        button: false,
      });
    }
    if (check.data.username) {
      // setSignupError("Username Already Registered");
      swal({
        title: "Sign Up",
        text: "Username Already Registered",
        icon: "error",
        button: false,
      });
    }
    if (check.data.username || check.data.contact) {
      setLoading(false);
      return;
    }

    let res1 = await OTPSms({ contact: values.contact });

    if (res1) {
      setSMSOTP(res1);
    } else if (!res1) {
      console.log("Error");
    }
    setSmsLoading(false);
  };

  const verifySmsOTP = async (values) => {
    if (parseInt(values.SmsOTP) === parseInt(SmsOTP)) {
      setSmsOTPError(false);
      setverifySms(true);
      swal({
        title: "Sign Up",
        text: "OTP Verified!",
        icon: "success",
        button: false,
      });
    } else {
      // setSmsOTPError(true);
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
    }
    if (verifyEmail && verifySms) {
      setOTP(true);
    }
  };

  const signup = async (values) => {
    if (!verifyEmail) {
      // setEmailError(true)
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
      return;
    }
    if (!verifySms) {
      // setSmsError(true)
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
      return;
    }

    if (
      parseInt(values.SmsOTP) === parseInt(SmsOTP) &&
      parseInt(values.EmailOTP) === parseInt(EmailOTP)
    ) {
      if (captcha === false) {
        console.log("show Captcha");
        setShowCaptcha(true);
      } else if (captcha) {
        let res = await authenticateSignUp(values);
        setSmsOTPError(false);
        setEmailOTPError(false);
        setLoading(true);
        
  
        if (res && !res.data.Error) {
          swal({
            title: "Sign Up",
            text: "Signup Successfull",
            icon: "success",
            button: "Continue",
          }).then(async () => {
            let user = res.data.user;
            let access = res.data.access_token;
            await localStorage.setItem("user", JSON.stringify(user));
            await localStorage.setItem("access_token", access);
            if (user.user_type === "User")
              window.location.href = "/user/profile";
            else if (
              user.user_type === "Company" ||
              user.user_type === "Company_User"
            )
              window.location.href = "/company/profile";
            else if (user.user_type === "XI")
              window.location.href = "/XI/?a=" + access;
            else if (user.isAdmin) window.location.href = "/admin/?a=" + access;
          });
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
    <div className="px-7 pt-5  lg:p-7 ">
      <span
        style={{ fontWeight: 700 }}
        className="text-3xl font-bold flex px-4"
      >
        Value{" "}
        <p className="px-2" style={{ color: "#3667E9" }}>
          Matrix
        </p>
      </span>
      <br></br>
      <div className="p-4 lg:p-8 pt-2  pb-2 px-7">
        {/* <p className="text-xl font-bold">OPs/Admin Signup</p> */}
        <p className="text-xl font-semibold mb-4" style={{ fontWeight: 700 }}>
          Create New Account{" "}
        </p>

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
            // if (OTP) {
            signup(values);
            // }

            // else {
            //   sendOTP(values);
            // }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-3 py-1">
              <div className="my-2">
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full"
                  disabled={OTP !== null}
                  style={{ borderRadius: "12px" }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="my-2">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full"
                  disabled={OTP !== null}
                  style={{ borderRadius: "12px" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="my-1">
                <label>Register As : </label>
                <Field
                  as="select"
                  name="user_type"
                  className="mx-3"
                  style={{ borderRadius: "12px" }}
                >
                  <option value="User">Candidate</option>
                  <option value="Company">Company</option>
                  <option value="XI">XI</option>
                </Field>
              </div>
              <div className="my-1">
                <Field
                  type="text"
                  name="email"
                  disabled={verifyEmail}
                  placeholder="Email"
                  className="w-full"
                  style={{ borderRadius: "12px" }}
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600"
                />
                {EmailOTP && !verifyEmail && (
                  <Field
                    type="number"
                    name="EmailOTP"
                    refs={OTPField}
                    placeholder="Email OTP"
                    className="w-full"
                    style={{ borderRadius: "12px", marginTop: "10px" }}
                  />
                )}
                {EmailOTP && EmailOTPError && (
                  <p className="text-sm text-red-600">Invalid Email OTP !</p>
                )}
                {EmailError && (
                  <p className="text-sm text-red-600">Email Not Verified !</p>
                )}

                <div className="d-flex w-full justify-content-between space-x-2">
                  {!verifyEmail && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 cursor-pointer"
                      style={{ backgroundColor: "#01458C" }}
                      onClick={() => sendEmailOTP(values)}
                    >
                      {" "}
                      {EmailOTP ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}

                  {EmailOTP && !verifyEmail && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 cursor-pointer"
                      style={{ backgroundColor: "#01458C" }}
                      onClick={() => verifyEmailOTP(values)}
                    >
                      {" "}
                      Verify OTP
                    </button>
                  )}

                  {EmailOTP && verifyEmail && (
                    <p
                      className="p-2"
                      style={{ fontWeight: 600, color: "green" }}
                    >
                      Email Verified
                    </p>
                  )}
                </div>
              </div>
              <div className="my-1">
                <Field
                  type="text"
                  name="contact"
                  disabled={verifySms}
                  placeholder="Contact Number"
                  className="w-full"
                  style={{ borderRadius: "12px" }}
                />
                <ErrorMessage
                  name="contact"
                  component="div"
                  className="text-sm text-red-600"
                />
                {SmsOTP && !verifySms && (
                  <Field
                    type="number"
                    name="SmsOTP"
                    // refs={OTPField}
                    placeholder="Contact OTP"
                    className="w-full"
                    style={{ borderRadius: "12px", marginTop: "10px" }}

                    // disabled={verifySms}
                  />
                )}
                {SmsOTP && SmsOTPError && (
                  <p className="text-sm text-red-600">Invalid SMS OTP !</p>
                )}
                {SmsError && (
                  <p className="text-sm text-red-600">Contact Not Verified !</p>
                )}

                <div className="d-flex w-full justify-content-between space-x-2">
                  {!verifySms && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 py-1 cursor-pointer"
                      style={{ backgroundColor: "#01458C" }}
                      onClick={() => sendSmsOTP(values)}
                    >
                      {" "}
                      {SmsOTP ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}

                  {SmsOTP && !verifySms && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 py-1 cursor-pointer"
                      style={{ backgroundColor: "#01458C" }}
                      onClick={() => verifySmsOTP(values)}
                    >
                      Verify OTP
                    </button>
                  )}
                  {SmsOTP && verifySms && (
                    <p
                      className="p-2"
                      style={{ fontWeight: 600, color: "green" }}
                    >
                      Contact Verified
                    </p>
                  )}
                </div>
              </div>
              <Field
                type="password"
                name="password"
                disabled={OTP !== null}
                placeholder="Password"
                className="w-full"
                style={{ borderRadius: "12px" }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600"
              />

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

              <div>
                <div className="w-full justify-center flex">
                  <ReCAPTCHA
                    sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"
                    
                    onChange={(values) => {
                      setCaptcha(true);
                    }}
                    ref={captchaRef}
                  />
                </div>
                {captchaError && (
                  <p className="text-sm my-0 text-red-600">{captchaError}</p>
                )}
              </div>

              {!loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-lg mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "#01458C" }}
                  // disabled={OTP !== true}
                >
                  {/* {OTP === null ? "Continue" : "Signup"} */}
                  SignUp
                </button>
              )}
              {loading && (
                <button className="h-8 bg-blue-600 rounded-lg block mx-auto cursor-pointer w-1/2 px-8 align-middle">
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
          <form action={`${url}/auth/github`}>
          <button type="submit" className="my-0.5">
          <div className="flex px-2 py-1 border border-gray-300">

              <img
                src={Github}
                alt="github-login"
                className="cursor-pointer h-3 my-px"
              />
              <p className="text-xs font-semibold px-2">Github</p>
              </div>
              </button>
          </form>
        </div>
        <div className="lg:h-5 h-0 block"></div>
      </div>
    </div>
  );
};

export default SignupForm;
