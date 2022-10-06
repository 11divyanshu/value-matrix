import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getUserInviteFromResetPassId,
  resetPassword,
  setProfile,
  validateSignupDetails,
  OTPMail,
  OTPSms,
} from "../../service/api";
import swal from "sweetalert";
// Assets
import styles from "../../assets/stylesheet/login.module.css";
import Loader from "../../assets/images/loader.gif";
import { isCompositeComponent } from "react-dom/test-utils";

const SetProfile = () => {
  const [error, setError] = React.useState(null);
  const [Alert, setAlert] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(null);

  const [OTPEmail, setOTPEmail] = React.useState(null);
  const [OTPContact, setOTPContact] = React.useState(null);

  const [EmailVerify, setEmailVerify] = React.useState(false);
  const [ContactVerify, setContactVerify] = React.useState(false);

  const [emailLoading, setEmailLoading] = React.useState(false);
  const [contactLoading, setContactLoading] = React.useState(false);

  const [disableEmail, setDisableEmail] = React.useState(false);
  const [disableContact, setDisableContact] = React.useState(false);

  const [emailError, setEmailError] = React.useState(null);
  const [contactError, setContactError] = React.useState(null);

  const [userEmail, setUserEmail] = React.useState(null);
  const [userContact, setUserContact] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const initial = async () => {
      let res = await getUserInviteFromResetPassId({ reset_id: id });
      await setUserEmail(res.data.email);
      await setUserContact(res.data.contact);
      if (res && res.data.user_invite === 0) {
        try {
          navigate(-1);
        } catch (err) {
          window.location.href = "/login";
        }
      }
    };
    initial();
  }, []);
  const { id } = useParams();

  const sendEmailOTP = async () => {
    setEmailError(null);
    setEmailLoading(true);
    setDisableEmail(true);
    let res = await OTPMail({ mail: userEmail });
    if (res) {
      setEmailLoading(false);
      setOTPEmail(res);
    }
    setTimeout(() => {
      setDisableEmail(false);
    }, 30000);
  };

  const sendContactOTP = async (v) => {
    if(!userContact){
      if(!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v)
      ){
        setContactError("Invalid Contact Number");
        return;
      }
    }
    let res1 = await validateSignupDetails({contact: userContact});
    if(!userContact && res1 && res1.data.contact){
      setContactError("Contact already exists");
      return;
    }
    setContactError(null);
    setContactLoading(true);
    setDisableContact(true);
    let res = await OTPSms({ contact: userContact });
    if (res) {
      setContactLoading(false);
      setOTPContact(res);
    }
    setTimeout(() => {
      setDisableContact(false);
    }, 30000);
  };

  const verifyEmailOTP = async (otp) => {
    setEmailError(null);
    
    if (otp === OTPEmail) {
      swal("Email Verified", "Success", "success");
      setEmailVerify(true);
    } else {
      setEmailError("Invalid OTP");
    }
  };

  const verifyContactOTP = async (otp) => {
    setContactError(null);
    if (otp === OTPContact) {
      swal("Contact Verified", "Success", "success");
      setContactVerify(true);
    } else {
      setContactError("Invalid OTP");
    }
  };

  const resetPasswordHandle = async (values) => {
    setLoading(true);
    setAlert(null);
    if(!EmailVerify || !ContactVerify){
      setAlert("Please verify your email and contact");
      swal("Please verify your email and contact", "Error", "error");
      setLoading(false);
      return;
    }
    try {
      let res2 = await validateSignupDetails({
        username: values.username,
      });
      console.log(res2);
      if (res2 && res2.data.username) {
        setUsernameError("Username already taken");
        setLoading(false);
        return;
      }

      let res = await setProfile({
        username: values.username,
        reset_pass_id: id,
        password: values.newPassword,
      });

      if (res && res.status === 200) {
        window.location.href = "/user?a=" + res.data.access_token;
      } else {
        setAlert({ message: "Error reseting password !", success: false });
      }
    } catch (error) {
      setAlert({ success: false, message: "Error reseting password !" });
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginLanding}>
      <div className="container w-2/3 flex bg-white rounded-lg h-2/3">
        <div className="md:w-1/2 w-full flex flex-col">
          <div className="p-5 pt-5 pb-2 lg:p-9 text-left">
            <span
              style={{ fontWeight: 700 }}
              className="text-3xl font-bold flex "
            >
              Value <p style={{ color: "#3667E9" }}>Matrix</p>
            </span>

            <div className="p-2 lg:p-12 pt-8 pb-2 pl-5">
              <p className="text-xl">Set Your Profile</p>
              <p className="text-sm my-2">Enter The Details To Continue</p>
              {Alert && Alert.success === true && (
                <div
                  className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
                  role="alert"
                >
                  {Alert.message}
                </div>
              )}
              {Alert && Alert.success === false && (
                <div
                  className="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
                  role="alert"
                >
                  {Alert.message}
                </div>
              )}
              <div>
                <Formik
                  initialValues={{
                    username: null,
                    newPassword: null,
                    newPassword2: null,
                    EmailOTP: null,
                    ContactOTP: null,
                    Email: userEmail,
                    Contact: userContact,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.username) {
                      errors.username = "Required !";
                    }
                    if (!values.newPassword) {
                      errors.newPassword = "Required !";
                    }
                    if (!values.newPassword2) {
                      errors.newPassword2 = "Required !";
                    }
                    if (
                      values.newPassword &&
                      values.newPassword2 &&
                      values.newPassword !== values.newPassword2
                    ) {
                      errors.newPassword = "Please enter correct password !";
                    }
                    return errors;
                  }}
                  onSubmit={resetPasswordHandle}
                >
                  {({ values }) => {
                    return (
                      <Form className="my-8 w-100">
                        <div className="flex flex-col">
                          <label>Enter New Username</label>
                          <Field
                            type="text"
                            name="username"
                            className="w-3/4"
                            style={{ borderRadius: "10px" }}
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                          {usernameError && (
                            <div className="text-red-500 text-sm">
                              {usernameError}
                            </div>
                          )}
                        </div>
                        {userEmail && (
                          <div className="w-3/4 text-start mt-5">
                            <label>Email</label>
                            <Field
                              value={userEmail}
                              type="email"
                              name="Email"
                              className="w-full text-black"
                              style={{ borderRadius: "5px" }}
                              disabled
                            />
                            {EmailVerify && (
                              <div className="text-green-500 text-sm">
                                Email Verified
                              </div>
                            )}
                            {OTPEmail && EmailVerify === false && (
                              <div className="w-full text-start my-3">
                                <label>Enter Email OTP</label>
                                <Field
                                  type="text"
                                  name="EmailOTP"
                                  className="w-full"
                                  style={{ borderRadius: "5px" }}
                                />
                              </div>
                            )}
                            {emailError && (
                              <div className="text-red-500 text-sm">
                                {emailError}
                              </div>
                            )}
                            <div className="flex space-x-4 my-3">
                              {EmailVerify === false && (
                                <button
                                  className="px-4 py-1 rounded-sm text-white"
                                  style={{ backgroundColor: "#034488" }}
                                  type="button"
                                  onClick={sendEmailOTP}
                                  disabled={disableEmail}
                                >
                                  {!emailLoading && (OTPEmail === null
                                    ? "Send OTP"
                                    : "Resend OTP")}
                                  {emailLoading && (
                                    <img
                                      src={Loader}
                                      alt="Loader"
                                      className="mx-auto h-8"
                                    />
                                  )}
                                </button>
                              )}
                              {EmailVerify === false && OTPEmail && (
                                <button
                                  className="px-4 py-1 rounded-sm text-white"
                                  type="button"
                                  style={{ backgroundColor: "#034488" }}
                                  onClick={() => {
                                    verifyEmailOTP(values.EmailOTP);
                                  }}
                                >
                                  Verify OTP
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        {userContact && (
                          <div className="w-3/4 text-start mt-5">
                            <label>Contact</label>
                            <Field
                              value={userContact}
                              type="text"
                              name="Contact"
                              className="w-full"
                              style={{ borderRadius: "5px" }}
                              disabled={userContact ? true : false}
                            />
                            { ContactVerify && (
                              <div className="text-green-500 text-sm">
                                Contact Verified
                                </div>)
                            }
                            {OTPContact && ContactVerify === false && (
                              <div className="w-full text-start my-3">
                                <label>Enter Contact OTP</label>
                                <Field
                                  type="text"
                                  name="ContactOTP"
                                  className="w-full"
                                  style={{ borderRadius: "5px" }}
                                />
                              </div>
                            )}
                            {contactError && (
                              <div className="text-red-500 text-sm">
                                {contactError}
                              </div>
                            )}
                            <div className="flex space-x-4 my-3">
                              {ContactVerify === false && (
                                <button
                                  className="px-4 py-1 rounded-sm text-white"
                                  type="button"
                                  style={{ backgroundColor: "#034488" }}
                                  onClick={()=>sendContactOTP(values.Contact)}
                                  disabled={disableContact}
                                >
                                  {!contactLoading && (OTPContact === null
                                    ? "Send OTP"
                                    : "Resend OTP")}
                                  {contactLoading && (
                                    <img
                                      src={Loader}
                                      alt="Loader"
                                      className="mx-auto h-8"
                                    />
                                  )}
                                </button>
                              )}
                              {ContactVerify === false && OTPContact && (
                                <button
                                  className="px-4 py-1 rounded-sm text-white"
                                  type="button"
                                  style={{ backgroundColor: "#034488" }}
                                  onClick={() => {
                                    verifyContactOTP(values.ContactOTP);
                                  }}
                                >
                                  Verify OTP
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="w-3/4 text-start mt-5">
                          <label className="">Enter New Password </label>
                          <Field
                            type="text"
                            name="newPassword"
                            className="w-full"
                            style={{ borderRadius: "10px" }}
                          />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>
                        <div className="w-3/4 text-start mt-5">
                          <label className="">Re-Enter New Password </label>
                          <Field
                            type="text"
                            name="newPassword2"
                            className="w-full"
                            style={{ borderRadius: "10px" }}
                          />
                          <ErrorMessage
                            name="newPassword2"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>
                        {loading ? (
                          <button className="mt-6 bg-blue-600 px-2 py-1 text-white rounded-sm">
                            <img
                              src={Loader}
                              className="h-9 mx-auto"
                              alt="loader"
                            />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="mt-6 bg-blue-600 p-3 text-white rounded-sm px-4 py-1"
                            style={{ backgroundColor: "#034488" }}
                          >
                            {" "}
                            Set Profile
                          </button>
                        )}
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetProfile;
