import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import {
  addAdminUser,
  getUserFromId,
  validateSignupDetails,
} from "../../service/api";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const AddAdminUser = () => {
  const [emailError, setEmailError] = React.useState(null);
  const [userNameError, setUserNameError] = React.useState(null);
  const [contactError, setContactError] = React.useState(null);

  const [permissions, setPermissions] = React.useState([
    {
      title: "Add Notifications",
      id: "add_notifications",
      value: false,
    },
    {
      title: "Add Users",
      id: "add_users",
      value: false,
    },
    {
      title: "List Candidates",
      id: "list_candidates",
      value: false,
    },
    {
      title: "List Companies",
      id: "list_companies",
      value: false,
    },
    {
      title: "Add Skills",
      id: "add_skills",
      value: false,
    },
  ]);

  // User Details Initial State
  const [initialValue, setInitialValue] = React.useState({
    username: null,
    firstName: null,
    lastName: "",
    email: null,
    password: "",
    contact: null,
    permission: permissions,
  });

  const handleSumbit = async (values) => {
    try {
      setUserNameError(null);
      setEmailError(null);
      setContactError(null);
      let validate = await validateSignupDetails({
        email: values.email,
        contact: values.contact,
        username: values.username,
      });
      console.log(validate);
      if (validate && validate.data.email) {
        setEmailError("Email already reigstered");
      }
      if (validate && validate.data.contact) {
        setContactError("Contact already reigstered");
      }
      if (validate && validate.data.username) {
        setUserNameError("Username already reigstered");
      }
      if (
        validate.data.email ||
        validate.data.contact ||
        validate.data.username
      ) {
        return;
      }
      let token = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await addAdminUser({ ...values, company_id: user._id }, token);
      if (res && res.status === 200) {
        swal({
          title: "User Added",
          text: "User Added Successfully",
          icon: "success",
          button: "Continue",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        swal({
          title: "Error",
          text: "Something Went Wrong",
          icon: "error",
          button: "Continue",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigate =useNavigate();

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res =await  getUserFromId({ id: user._id }, user.access_token);
      console.log(res);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.add_users === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();  
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Add Admin User</p>
      <div className="w-full">
        <Formik
          initialValues={initialValue}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Username is required";
            }
            if (!values.firstName) {
              errors.firstName = "First Name is required";
            }
            if (!values.lastName) {
              errors.lastName = "Last Name is required";
            }
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid Email Address";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            if (!values.contact) {
              errors.contact = "Contact is required";
            } else if (
              !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                values.contact
              )
            ) {
              errors.contact = "Invalid Contact Number";
            }
            let r = values.permission.filter((item) => item.value);
            if (r.length === 0) {
              errors.permission = "Please select atleast one permission";
            }
            return errors;
          }}
          onSubmit={handleSumbit}
        >
          {({ values }) => {
            return (
              <Form>
                <div className="flex w-full">
                  <div className="my-3 mt-4 w-3/4">
                    <label htmlFor="username" className="text-gray-700">
                      Username *
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="text-600 w-2/5 block my-1"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-sm text-red-600"
                    />
                    {userNameError && (
                      <div className="text-sm text-red-600">
                        {userNameError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full items-center flex-wrap">
                  <div className="my-2 w-2/5">
                    <label htmlFor="firstName" className="text-gray-700">
                      First Name *
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="text-600 block my-1 w-3/4"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="w-2/5">
                    <label htmlFor="lastName" className="text-gray-700">
                      Last Name *
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      className="text-600 block my-1 w-3/4"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full items-center flex-wrap">
                  <div className="my-2 w-2/5">
                    <label htmlFor="email" className="text-gray-700">
                      Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="text-600 block my-1 w-3/4"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-600"
                    />
                    {emailError && (
                      <div className="text-sm text-red-600">{emailError}</div>
                    )}
                  </div>
                  <div className="w-2/5">
                    <label htmlFor="contact" className="text-gray-700">
                      Contact *
                    </label>
                    <Field
                      type="text"
                      name="contact"
                      className="text-600 block my-1 w-3/4"
                    />
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red-600"
                    />
                    {contactError && (
                      <div className="text-sm text-red-600">{contactError}</div>
                    )}
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="my-3 mt-4 w-3/4">
                    <label htmlFor="password" className="text-gray-700">
                      Password *
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="text-600 w-2/5 block my-1"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="permissions" className="text-gray-700">
                    User permissions
                  </label>
                  {permissions.map((item, index) => {
                    return (
                      <div className="">
                        <Field
                          type="checkbox"
                          name={item.title}
                          className="my-1"
                          onClick={() => {
                            let temp = permissions;
                            temp[index].value = !temp[index].value;
                            setPermissions(temp);
                          }}
                        />
                        <label
                          htmlFor="permissions"
                          className="text-gray-700 mx-3"
                        >
                          {item.title}
                        </label>
                      </div>
                    );
                  })}
                  <ErrorMessage
                    name="permission"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <button
                  type="submit"
                  className="my-3 px-2 py-1 bg-blue-500 text-white "
                >
                  {" "}
                  Add User
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddAdminUser;
