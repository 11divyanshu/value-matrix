import React from 'react';
import { Formik, Form, ErrorMessage, Field } from "formik";
import { sendEmailNotification } from '../../service/api';
import {ReactSession} from 'react-client-session';

const EmailNotification = () => {

    const sendEmail = async(values)=>{
        let user  = ReactSession.get("user");
        let token = ReactSession.get("access_token");
        let res = sendEmailNotification({user_id : user._id,...values },token)
    }

    return(
        <div className="p-5">
            <p className="text-2xl font-bold">Email Notifications</p>
            <Formik
        initialValues={{
          text: null,
          sendTo: "All",
          subject: null,
        }}
        validate={(values) => {
          const errors = {};
          if (values.text === null || values.text.trim() === "") {
            errors.message = "Message Required !";
          }
          if(values.subject === null || values.subject.trim() === ""){
            errors.title = "Subject Required !";
          }
          return errors;
        }}
        onSubmit={(values) => {sendEmail(values)}}
      >
        {({ values }) => (
          <Form className="w-full">
            <div className="my-5 space-y-3 w-full">
              <label className="block w-full">Email Subject</label>
              <Field
                name="subject"
                type="text"
                placeholder=" Your Subject Here"
                className="border-[0.5px] border-gray-400 w-1/2 focus:outline-0 focus:border-0 p-1"
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
                className="border-[0.5px] border-gray-400 w-1/2 h-24 focus:outline-0 focus:border-0 px-1"
              />
              <ErrorMessage
                name="text"
                component="div"
                className="text-red-600 text-sm w-full"
              />
            </div>
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
    )
}

export default EmailNotification;