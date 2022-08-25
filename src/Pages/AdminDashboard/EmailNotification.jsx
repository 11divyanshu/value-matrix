import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { sendEmailNotification } from "../../service/api";
import { AiOutlineClose } from "react-icons/ai";
import { validateSignupDetails } from "../../service/api";

const EmailNotification = () => {

  const [Alert, setAlert] = React.useState(null);

  const emailInputRef = React.useRef(null);
  const [emailList, setEmailList] = React.useState([]);
  const [emailListError, setEmailListError] = React.useState(null);
  const addBtnRef = React.useRef(null);

  const sendEmail = async (values) => {
    setAlert(null);
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = JSON.parse(await localStorage.getItem("access_token"));
    let res = sendEmailNotification(
      { user_id: user._id, emailList: emailList, ...values },
      token
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
      <p className="text-2xl font-bold">Email Notifications</p>

      {Alert === true && (
        <div
          class="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
          role="alert"
        >
          Emails Sent
        </div>
      )}
      {Alert === false && (
        <div
          class="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
          role="alert"
        >
          Emails Not Sent
        </div>
      )}

      <Formik
        initialValues={{
          text: null,
          sendTo: emailList.length === 0 ? "All" : null,
          subject: null,
        }}
        validate={(values) => {
          const errors = {};
          setEmailListError(null);
          if (values.text === null || values.text.trim() === "") {
            errors.message = "Message Required !";
          }
          if (values.subject === null || values.subject.trim() === "") {
            errors.title = "Subject Required !";
          }
          return errors;
        }}
        onSubmit={(values) => {
          sendEmail(values);
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
                  onKeyPress={async(e) => {
                    if (e.key === "Enter") {
                      if(addBtnRef.current){
                        addBtnRef.current.click();
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="bg-blue-500 px-2 py-1 text-white rounded-sm"
                  ref = {addBtnRef}
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
              <label className="block w-full">Email Subject</label>
              <Field
                name="subject"
                type="text"
                placeholder=" Your Subject Here"
                className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
              />
              <ErrorMessage
                name="subject"
                component="div"
                className="text-red-600 text-sm w-full"
              />
            </div>
            <div className="my-5 space-y-3">
              <label className="block w-full">Email Body</label>
              <Field
                name="text"
                as="textarea"
                placeholder=" Your Message Here"
                className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 h-24 focus:outline-0 focus:border-0 px-1"
              />
              <ErrorMessage
                name="text"
                component="div"
                className="text-red-600 text-sm w-full"
              />
            </div>
            {emailList.length === 0 && (
              <div>
                <label>Send Email To:</label>
                <div
                  role="group"
                  aria-labelledby="my-radio-group"
                  className="space-x-5 my-3"
                >
                  <label>
                    <Field
                      type="radio"
                      name="sendTo"
                      value="All"
                      className="mr-2"
                    />
                    All
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="sendTo"
                      value="User"
                      className="mr-2"
                    />
                    Users
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="sendTo"
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
              Send Mails
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailNotification;
