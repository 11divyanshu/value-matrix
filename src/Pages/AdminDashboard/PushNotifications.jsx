import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { sendOneSignalNotification } from "../../service/api";
import { ReactSession } from "react-client-session";

const PushNotification = () => {


  const [Alert, setAlert ] = React.useState(null);

  const sendNotification = async (values) => {
      setAlert(null); 
        let access_token  = ReactSession.get("access_token");
        let user = ReactSession.get("user");
        let res = await sendOneSignalNotification({message:  {
            app_id: "91130518-13a8-4213-bf6c-36b55314829a",
            contents: { en: values.text },
            included_segments: ["Subscribed Users"],
          },
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
      <p className="text-2xl font-bold">Email Notifications</p>
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

export default PushNotification;