import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {Link} from "react-router-dom"

// Assets
import styles from "../../assets/stylesheet/login.module.css";
import jsCookie from "js-cookie";
import Loader from "../../assets/images/loader.gif";

const ResetPassword = () => {
  const [error, setError] = React.useState(null);

  return (
    <div className={styles.loginLanding}>
      <div className="container w-1/2 flex bg-white rounded-lg">
        <div className="md:w-1/2 w-full flex flex-col">
          <div className="p-5 pt-5 pb-2 lg:p-9 text-center">
            <p className="text-3xl font-semibold">Repute Hire</p>
            <div className="p-2 lg:p-12 pt-8  pb-2 pl-5">
              <p className="text-xl">Reset Your Password</p>
              <p className="text-sm my-2">
                Forgot your password ? Just fill in your Email Address, Contact
                or Username.
              </p>
              <div className="w-100">
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
                >
                  {(values) => {
                    return (
                      <Form className="my-8 w-100 ">
                        <div className="w-full mx-auto">
                          <Field
                            type="text"
                            name="contact"
                            placeholder="Enter Email, Contact or Username "
                            className="w-2/4"
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
                          <button type="submit" className="mt-6 bg-blue-600 px-2 py-1 text-white rounded-sm"> Send Link</button>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
              <p>Don't have an account ? <Link to="/login" className="text-blue-6x00">Create One</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
