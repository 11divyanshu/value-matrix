import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useParams } from "react-router-dom";
import {
  resetPassword,
  sendResetPasswordMail,
  sendResetPasswordSMS,
  sendResetPasswordByUsername,
} from "../../service/api";
import swal from "sweetalert";

// Assets
import styles from "../../assets/stylesheet/login.module.css";
import Loader from "../../assets/images/loader.gif";

const ResetPassword = () => {
  const [error, setError] = React.useState(null);
  const [Alert, setAlert] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [component, setComponent] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);

  const { id } = useParams();

  React.useEffect(() => {
    if (id === undefined) {
      setComponent(1);
    } else {
      setComponent(2);
    }
  }, []);

  const resetPasswordHandle = async (values) => {
    setLoading(true);
    setAlert(null);
    try {
      let res = await resetPassword({
        reset_id: id,
        password: values.newPassword,
      });
      console.log(res);
      if (res && res.status === 200) {
        swal({
          title: "Success",
          text: "Password Reset Successfully",
          icon: "success",
          button: "Ok",
        })
        window.location.href = "/login";
      } else {
        setAlert({ message: "Error reseting password !", success: false });
      }
    } catch (error) {
      setAlert({ success: false, message: "Error reseting password !" });
    }
    setLoading(false);
  };

  const submitHandle = async (values) => {
    if(values.contact === "" || values.contact === null){
      setAlert({
        success:false,
        message : "Enter A Valid Value"
      })
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.contact)) {
        
        let res = await sendResetPasswordMail(values);
        console.log(res);
        if (res && res.status === 200) {
          swal({
            title: "Success",
            text: "Reset Password Link Sent To Your Mail",
            icon: "success",
            button: "Ok",
          })
          setAlert({
            success: true,
            message: "A SMS has sent to reset your password !",
          });
        } else {
          swal({
            title : "Error",
            text : "Error Sending Mail",
            icon : "error",
            button : "Ok"
          })
          setAlert({
            success: false,
            message: res.data.Error,
          });
        }
      } else if (
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
          values.contact
        )
      ) {
        let res = await sendResetPasswordSMS(values);
        if (res && res.status === 200) {
          swal({
            title: "Success",
            text: "Reset Password Link Sent To Your ",
            icon: "success",
          })
          setAlert({
            success: true,
            message: "A SMS has sent to reset your password !",
          });
        } else {
          swal({
            title : "Error",
            text : "Error Sending SMS",
            icon : "error",
            button : "Ok"
          })
          setAlert({
            success: false,
            message: res.data.Error,
          });
        }
      } else {
        let res = await sendResetPasswordByUsername(values);
        if (res && res.status === 200) {
          swal({
            title: "Success",
            text: "Reset Password Link Sent To Your Mail",
            icon: "success",
            button: "Ok",
          })
          setAlert({
            success: true,
            message: "An Email has sent to reset your password !",
          });
        } else {
          swal({
            title : "Error",
            text : "Error Sending Mail",
            icon : "error",
            button : "Ok"
          })
          setAlert({
            success: false,
            message: res.data.Error,
          });
        }
      }
      setLoading(false);
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 30000);
    } catch (error) {
      setLoading(false);
      setAlert({ message: "Error Sending reset link", success: false });
    }
  };

  return (
    <div className={styles.loginLanding}>
      <div className="container md:w-5/12 flex bg-white rounded-lg h-2/3">
        <div className="md:w-1/2 w-full flex flex-col">
          <div className="p-5 pt-5 pb-2 lg:p-9 text-left">
            <span
              style={{ fontWeight: 700 }}
              className="text-3xl font-bold flex px-2"
            >
              Value <p style={{ color: "#3667E9" }}>Matrix</p>
            </span>
            {component === 1 && (
              <div className="p-2 lg:p-12 pt-8  pb-2 pl-5">
                <p className="text-xl font-semibold">Reset Your Password</p>
                <p className="text-sm my-2 mb-7">Please Enter Your Details</p>
                {Alert && Alert.success === true && (
                  <div
                    class="bg-green-100 rounded-lg py-5 px-6 my-3 mb-2 text-base text-green-800"
                    role="alert"
                  >
                    {Alert.message}
                  </div>
                )}
                {Alert && Alert.success === false && (
                  <div
                    class="bg-red-100 rounded-lg py-5 px-6 mb-2 text-base text-red-700"
                    role="alert"
                  >
                    {Alert.message}
                  </div>
                )}

                <div>
                  <Formik
                    initialValues={{
                      contact: "",
                    }}
                    validate={(values) => {
                      const errors = {};
                      if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.contact
                        ) ||
                        !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                          values.contact
                        )
                      ) {
                        errors.contact = "Invalid Details";
                      }
                    }}
                    onSubmit={submitHandle}
                  >
                    {(values) => {
                      return (
                        <Form className="mb-8 w-100 ">
                          <div className="w-full mx-auto">
                            <Field
                              type="text"
                              name="contact"
                              placeholder="Enter Email, Contact or Username "
                              className="w-3/4"
                              style={{ borderRadius: "10px" }}
                            />
                            <ErrorMessage
                              name="contact"
                              component="div"
                              className="text-sm text-red-600"
                            />
                            {error && (
                              <p className="text-sm text-red-600">{error}</p>
                            )}
                          </div>
                          {loading ? (
                            <button className="mt-6 bg-blue-600 px-2 py-1 text-white rounded-lg">
                              <img
                                src={Loader}
                                className="h-9 mx-auto"
                                alt="loader"
                              />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={disabled}
                              className="mt-6 bg-blue-600 p-3 text-white rounded-lg"
                            >
                              {" "}
                              Send Link
                            </button>
                          )}
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
                <p>
                  Didn't have an account ?
                  <Link to="/register" className="text-blue-600">
                    Create New
                  </Link>
                </p>
              </div>
            )}
            {component === 2 && (
              <div className="p-2 lg:p-12 pt-8 pb-2 pl-5">
                <p className="text-xl">Reset Your Password</p>
                <p className="text-sm my-2">
                  Forgot your password ? Just fill in your New Password.
                </p>
                {Alert && Alert.success === true && (
                  <div
                    class="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
                    role="alert"
                  >
                    {Alert.message}
                  </div>
                )}
                {Alert && Alert.success === false && (
                  <div
                    class="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
                    role="alert"
                  >
                    {Alert.message}
                  </div>
                )}
                <div>
                  <Formik
                    initialValues={{
                      newPassword: null,
                      newPassword2: null,
                    }}
                    validate={(values) => {
                      const errors = {};
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
                          <div className="w-3/4 text-start">
                            <label className="">Enter New Password </label>
                            <Field
                              type="password"
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
                              type="password"
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
                              className="mt-6 bg-blue-600 p-3 text-white rounded-lg"
                            >
                              {" "}
                              Reset Password
                            </button>
                          )}
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
