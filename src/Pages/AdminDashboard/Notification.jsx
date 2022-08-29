import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { pushNotification } from "../../service/api";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { validateSignupDetails } from "../../service/api";

const NotificationPanel = () => {
  const [Alert, setAlert] = React.useState(null);

  const emailInputRef = React.useRef(null);
  const [emailList, setEmailList] = React.useState([]);
  const [emailListError, setEmailListError] = React.useState(null);
  const addBtnRef = React.useState(null);

  const addNotification = async (values) => {
    setAlert(null);
    let access_token = await localStorage.getItem("access_token");
    let user = await localStorage.getItem("user");
    let res = await pushNotification(
      { user_id: user._id, emailList: emailList, ...values },
      { access_token: user.access_token }
    );
    if (res) {
      setAlert(true);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } else {
      setAlert(false);
    }
  };

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Notification Panel</p>
      <div className="flex my-3 flex-wrap">
        <Link to="/admin/emailNotification">
          <p className="rounded-md bg-gray-200 text-gray-500 px-2 py-1 mr-3 my-2">
            Send Email Notification
          </p>
        </Link>
        <Link to="/admin/pushNotification">
          <p className="rounded-md bg-gray-200 text-gray-500 px-2 py-1 mr-3 my-2">
            Send Push Notification
          </p>
        </Link>
        <Link to="/admin/whatsappNotification">
          <p className="rounded-md bg-gray-200 text-gray-500 px-2 py-1 mr-3 my-2">
            Send Whatsapp Notification
          </p>
        </Link>
      </div>
      {Alert === true && (
        <div
          class="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
          role="alert"
        >
          Notification Added
        </div>
      )}
      {Alert === false && (
        <div
          class="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
          role="alert"
        >
          Notification Push Failed
        </div>
      )}

      <Formik
        initialValues={{
          message: null,
          forAll: emailList.length === 0 ? "All" : null,
          title: null,
        }}
        validate={(values) => {
          const errors = {};
          setEmailListError(null);
          if (values.message === null || values.message.trim() === "") {
            errors.message = "Message Required !";
          }
          if (values.title === null || values.title.trim() === "") {
            errors.title = "Title Required !";
          }
          return errors;
        }}
        onSubmit={(values) => {
          addNotification(values);
        }}
      >
        {({ values }) => (
          <Form className="w-full">
            <div className="my-5 space-y-3 w-full">
              <label className="block w-full">Send To</label>
              <div className="flex space-x-2 items-center">
                <Field
                  type="email"
                  name="sendToEmail"
                  innerRef={emailInputRef}
                  className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  onKeyPress={async (e) => {
                    if (e.key === "Enter") {
                      if (addBtnRef.current) {
                        addBtnRef.current.click();
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="bg-blue-500 px-2 py-1 text-white rounded-sm"
                  ref={addBtnRef}
                  onClick={async () => {
                    if (
                      emailInputRef.current &&
                      emailInputRef.current.value.trim() !== "" &&
                      emailInputRef.current.value.trim() !== null &&
                      !emailList.includes(emailInputRef.current.value.trim()) &&
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        emailInputRef.current.value.trim()
                      )
                    ) {
                      let res = await validateSignupDetails({
                        email: emailInputRef.current.value.trim(),
                      });
                      if (res && res.data.email) {
                        setEmailList([
                          ...emailList,
                          emailInputRef.current.value,
                        ]);
                        emailInputRef.current.value = "";
                      } else {
                        setEmailListError("Email Not Found");
                      }
                    } else if (
                      emailInputRef.current &&
                      emailList.includes(emailInputRef.current.value.trim())
                    ) {
                      setEmailListError("Email Already Added");
                    } else {
                      setEmailListError("Invalid Email");
                    }
                  }}
                >
                  Add
                </button>
              </div>
              {emailListError && (
                <p className="text-sm text-red-500">{emailListError}</p>
              )}
              <div className="flex items-center">
                {emailList.length > 0 &&
                  emailList.map((item, index) => {
                    return (
                      <div
                        className="text-sm text-gray-700 bg-gray-300 mr-3 flex space-x-2 items-center p-1"
                        key={index}
                      >
                        <p>{item}</p>
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            let list = emailList.filter(
                              (email) => email !== item
                            );
                            setEmailList(list);
                          }}
                        >
                          <AiOutlineClose />
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="my-5 space-y-3 w-full">
              <label className="block w-full">Notification Title</label>
              <Field
                name="title"
                type="text"
                placeholder=" Your Title Here"
                className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-600 text-sm w-full"
              />
            </div>
            <div className="my-5 space-y-3">
              <label className="block w-full">Notification Message</label>
              <Field
                name="message"
                as="textarea"
                placeholder=" Your Message Here"
                className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 h-24 focus:outline-0 focus:border-0 px-1"
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-red-600 text-sm w-full"
              />
            </div>
            {emailList.length === 0 && (
              <div>
                <label>Send Notification To:</label>
                <div
                  role="group"
                  aria-labelledby="my-radio-group"
                  className="space-x-5 my-3"
                >
                  <label>
                    <Field
                      type="radio"
                      name="forAll"
                      value="All"
                      className="mr-2"
                    />
                    All
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="forAll"
                      value="User"
                      className="mr-2"
                    />
                    Users
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="forAll"
                      value="Admin"
                      className="mr-2"
                    />
                    Admin
                  </label>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 rounded-sm text-white px-2 py-1"
              style={{ backgroundColor: "rgb(50 130 246)" }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NotificationPanel;
