import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import {
  pushNotification,
  sendEmailNotification,
  sendOneSignalNotification,
} from "../../service/api";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  validateSignupDetails,
  sendWhatsappNotification,
  getUserFromId,
  getUserList,
} from "../../service/api";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

const ChannelNotificationPanel = () => {
  const [Alert, setAlert] = React.useState(null);

  const emailInputRef = React.useRef(null);
  const [emailList, setEmailList] = React.useState([]);
  const [users, setUser] = React.useState([]);
  const [emailListError, setEmailListError] = React.useState(null);
  const addBtnRef = React.useState(null);
  const [selectedUser, setSelectedUsers] = React.useState([]);

  const addNotification = async (values) => {
    setAlert(null);
    let access_token = await localStorage.getItem("access_token");
    let user = await localStorage.getItem("user");
    
    selectedUser.forEach(async (user) => {
      if (values.pushNotification) {
        let res = await sendOneSignalNotification(
          {
            message: {
              app_id: "91130518-13a8-4213-bf6c-36b55314829a",
              contents: { en: values.text },
              included_segments: ["Subscribed Users"],
            },
            user_id: user._id,
          },
          access_token
        );
      }
      if (values.emailNotification) {
        let res = sendEmailNotification(
          { user_id: user._id, emailList: [user.email], subject: values.title, text: values.text },
          access_token
        );
      }
      if (values.dashboardNotification) {
        let res = await pushNotification(
          { user_id: user._id, emailList: [user.email], title: values.title, message: values.text },
          { access_token: user.access_token }
        );
      }
      if(values.whatsappNotification){
        await sendWhatsappNotification( {
           
            contents:  values.text,
            contactList: [user.contact], ...values,
          
          user_id : user._id
        }, access_token);
      }
    });
    // if (res) {
    //   setAlert(true);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 4000);
    // } else {
    //   setAlert(false);
    // }
  };

  const navigate = useNavigate();

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (
          res.data.permissions &&
          res.data.permissions.length > 0 &&
          res.data.user.permissions[0].admin_permissions.add_notifications ===
            false
        ) {
          navigate(-1);
        }
      }
      let res1 = await getUserList({ user_id: user._id }, user.access_token);
      console.log(res1);
      await setUser(res1.data.user.filter((el) => el.user_type === "User"));
    };
    initial();
  }, []);

  return (
    <div className=" bg-white my-5 shadow-md p-5">
      <p className="text-2xl font-bold">Notification Panel</p>
      <div className="flex my-3 flex-wrap ">
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
          whatsappNotification: false,
          emailNotification: false,
          pushNotification: false,
          dashboardNotification: false,
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
            <div className="my-5 space-y-3 w-full mb-3">
              <label className="block w-full">Send To</label>
              {/* <div className="flex space-x-2 items-center">
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
                  style={{backgroundColor:"#034488"}}
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
              </div> */}
              {/* {emailListError && (
                <p className="text-sm text-red-500">{emailListError}</p>
              )}
              <div className="flex items-center">
                {emailList.length > 0 &&
                  emailList.map((item, index) => {
                    return (
                      <div
                        className="text-sm text-blue-800 bg-blue-300 mr-3 space-x-2 flex items-center p-1 px-2 "
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
              </div> */}
            </div>
            <div>
              <Listbox
                onChange={setSelectedUsers}
                value={selectedUser}
                multiple
              >
                <div className="relative mt-1 w-3/4 mb-5">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border-1 border-">
                    <span className="block truncate">
                      {selectedUser.length === 0 && "Select"}{" "}
                      {selectedUser.map((person) => person.email).join(", ")}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {users.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-100 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.email}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            {selectedUser.length === 0 && (
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
                </div>
              </div>
            )}

            <div className="my-5 space-y-3">
              <label className="block w-full">Select Channels</label>
              <div className="flex items-center space-x-5">
                <div className="flex items-center">
                  <Field
                    name="whatsappNotification"
                    type="checkbox"
                    className="mr-2"
                  />
                  <label>Whatsapp</label>
                </div>
                <div className="flex items-center">
                  <Field
                    name="emailNotification"
                    type="checkbox"
                    className="mr-2"
                  />
                  <label>Email</label>
                </div>
                <div className="flex items-center">
                  <Field
                    name="pushNotification"
                    type="checkbox"
                    className="mr-2"
                  />
                  <label>Push Notification</label>
                </div>
                <div className="flex items-center">
                  <Field
                    name="dashboardNotification"
                    type="checkbox"
                    className="mr-2"
                  />
                  <label>Dashboard Notification</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 rounded-sm text-white px-4 py-1"
              style={{ backgroundColor: "#034488" }}
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChannelNotificationPanel;
