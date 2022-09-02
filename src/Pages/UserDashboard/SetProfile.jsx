import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getUserInviteFromResetPassId,
  resetPassword,
  setProfile,
  validateSignupDetails,
} from "../../service/api";

// Assets
import styles from "../../assets/stylesheet/login.module.css";
import Loader from "../../assets/images/loader.gif";
import { isCompositeComponent } from "react-dom/test-utils";

const SetProfile = () => {
  const [error, setError] = React.useState(null);
  const [Alert, setAlert] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const initial = async () => {
      let res = await getUserInviteFromResetPassId({ reset_id: id });
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

  const resetPasswordHandle = async (values) => {
    setLoading(true);
    setAlert(null);
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
        <div className="md:w-1/2 w-full">
          <div className={styles.Card1}></div>
        </div>
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
                    username: null,
                    newPassword: null,
                    newPassword2: null,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.username) {
                      errors.username = "Required";
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
                            classsName="text-red-500 text-sm"
                          />
                          {usernameError && (
                            <div className="text-red-500 text-sm">
                              {usernameError}
                            </div>
                          )}
                        </div>
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
                            className="mt-6 bg-blue-600 p-3 text-white rounded-lg"
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