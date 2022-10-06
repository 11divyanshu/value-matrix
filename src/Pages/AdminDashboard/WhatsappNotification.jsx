import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { sendWhatsappNotification } from "../../service/api";
import { ReactSession } from "react-client-session";
import { validateSignupDetails } from "../../service/api";
import { AiOutlineClose } from "react-icons/ai";

const WhatsappNotification = () => {


  const [Alert, setAlert ] = React.useState(null);
  const [contactList, setContactList] = React.useState([]);
  const [contactListError, setContactListError] = React.useState(null);

  const addBtnRef = React.useRef(null);
  const contactInputRef = React.useRef(null);

  const sendNotification = async (values) => {
      setAlert(null); 
        let access_token  = await localStorage.getItem("access_token");
        let user = await localStorage.getItem("user");
        let res = await sendWhatsappNotification( {
           
            contents:  values.text,
            contactList: contactList, ...values,
          
          user_id : user._id
        }, access_token);
        console.log(res);
        if(res){
          setAlert(true); 
            setTimeout(() => {
              window.location.reload();
            }, 4000);
        }
        else{
          setAlert(false); 
        }
  };

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Whatsapp Notifications</p>
      {Alert === true && (
        <div
          className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
          role="alert"
        >
          Notification Added
        </div>
      )}
      {Alert === false && (
        <div
          className="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
          role="alert"
        >
          Notification Push Failed
        </div>
      )}
      <Formik
        initialValues={{
          text: null,
        }}
        validate={(values) => {
          const errors = {};
          if (values.text === null || values.text.trim() === "") {
            errors.message = "Message Required !";
          }
          return errors;
        }}
        onSubmit={(values) => {
          sendNotification(values);
        }}
      >
        {({ values }) => (
          <Form className="w-full">
            <div className="my-5 space-y-3">
              <label className="block w-full">Notification Message</label>

              <div className="flex space-x-2 items-center">
                <Field
                  type="contact"
                  name="sendToContact"
                  innerRef={contactInputRef}
                  className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  onKeyPress={async(e) => {
                    if (e.key === "Enter") {
                      if(addBtnRef.current){
                        addBtnRef.current.click();
                      }
                    }
                  }}
                />
                 {contactListError && (
                <p className="text-sm text-red-500">{contactListError}</p>)}
                <div className="flex items-center">
                {contactList.length > 0 &&
                  contactList.map((item, index) => {
                    return (
                      <div
                        className="text-sm text-gray-700 bg-gray-300 mr-3 flex space-x-2 items-center p-1"
                        key={index}
                      >
                        <p>{item}</p>
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            let list = contactList.filter(
                              (contact) => contact !== item
                            );
                            setContactList(list);
                          }}
                        >
                          <AiOutlineClose />
                        </p>
                      </div>
                    );
                  })}
              </div>
             
                <button
                  type="button"
                  className="bg-blue-500 px-2 py-1 text-white rounded-sm"
                  ref = {addBtnRef}
                  onClick={async () => {
                    if (
                      contactInputRef.current &&
                      contactInputRef.current.value.trim() !== "" &&
                      contactInputRef.current.value.trim() !== null &&
                      !contactList.includes(contactInputRef.current.value.trim())
                     
                    ) {
                      let res = await validateSignupDetails({
                        contact: contactInputRef.current.value.trim(),
                      });
                      if (res && res.data.contact) {
                        setContactList([
                          ...contactList,
                          contactInputRef.current.value,
                        ]);
                        contactInputRef.current.value = "";
                      } else {
                        setContactListError("Contact Not Found");
                      }
                    } else if (
                      contactInputRef.current &&
                      contactList.includes(contactInputRef.current.value.trim())
                    ) {
                      setContactListError("contact Already Added");
                    } else {
                      setContactListError("Invalid contact");
                    }
                  }}
                >
                  Add
                </button>
                </div>
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
            {contactList.length === 0 && (
              <div>
                <label>Send Message To:</label>
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
              Send Notification
            </button>
          </Form>
        )}
      </Formik>      
    </div>
  );
};

export default WhatsappNotification;