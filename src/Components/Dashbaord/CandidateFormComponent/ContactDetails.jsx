import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { useInsertionEffect } from "react";
import { OTPSms, validateSignupDetails } from "../../../service/api";
import Loader from "../../../assets/images/loader.gif";
import swal from "sweetalert";
import { submitCandidateDetails } from "../../../service/api";

const ContactDetailForm = (props) => {
  const [contactDetails, setContactDetails] = React.useState({
    contact: null,
    email: null,
    address: null,
  });
  const formikRef = React.useRef(null);
  const [showForm, setShowForm] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const [firstName, setFirstName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [contact, setContact] = React.useState(null);
  const [contactVerify, setContactVerify] = React.useState(false);
  const [emailVerify, setEmailVerify] = React.useState(false);

  const [contactOTP, setContactOTP] = React.useState(null);
  let contactOTPRef = React.useRef(null);
  const [contactError, setContactError] = React.useState(null);
  const [contactOTPError, setContactOTPError] = React.useState(null);
  const [loadingContact, setLoadingContact] = React.useState(false);

  const [address, setAddress] = React.useState(null);
  const [addressValue, setAddressValue] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let e = JSON.parse(await localStorage.getItem("candidateDetails"));
      let resume = JSON.parse(await localStorage.getItem("resumeInfo"));
      let ed = {
        email: null,
        contact: null,
        address: null,
      };
      if(resume){
       
        if (resume === null) return null;
       
        setEmail(resume.email)
        if(resume.contact){
        setContact(resume.contact)
        if (formikRef.current) {
          formikRef.current.setFieldValue("contact", resume.contact);
        }
      }
      }else{
        let ad = null;
        if (e !== null && e.address !== null && e.contact.address !== null) {
          await setAddress(e.contact.address);
        } else if (user.address) {
          await setAddress(user.address);
        }
        if (e !== null && e.contact && e.contact.contact) {
          ed.contact = e.contact.contact;
          setContactVerify(true);
          if (formikRef.current) {
            formikRef.current.setFieldValue("contact", e.contact.contact);
          }
        } else if (
          user.contact &&
          user.contact !== user.googleId &&
          user.contact !== user.microsoftId &&
          user.contact !== user.linkedInId &&
          user.contact !== user.githubId
        ) {
          ed.contact = user.contact;
          setContactVerify(true);
          if (formikRef.current) {
            formikRef.current.setFieldValue("contact", user.contact);
          }
        }
        if (user.email) {
          ed.email = user.email;
          setEmailVerify(true);
          if (formikRef.current) {
            formikRef.current.setFieldValue("email", user.email);
          }
        }
  
        setContactDetails(ed);
        e.contact = ed;
        e.contact.address = address;
        await localStorage.setItem("candidateDetails", JSON.stringify(e));
        e.contact.address = null;
        await setShowForm(true);
      };
      }
     
      
    initial();
  }, []);

  const handleContactOTP = async (values) => {
    setContactError(null);
    setLoadingContact(true);
    let contactExist = await validateSignupDetails({ contact: values.contact });
    if (contactExist && contactExist.data.contact) {
      setContactError("Contact Number Already Registered");
      setLoadingContact(false);
      return;
    }
    let res = await OTPSms({ contact: values.contact });
    console.timeLog(res);
    if (res) {
      await setContactOTP(res);
    }
    setLoadingContact(false);
  };

  const verifyOTP = async (values) => {
    setContactOTPError(null);
    if (contactOTPRef.current) {
      if (contactOTPRef.current.value === contactOTP) {
        swal({
          icon: "success",
          title: "Contact Verified",
          text: "Contact Number Verified Successfully",
          button: "Continue",
        });
        setContactVerify(true);
        setContactError(null);
        let e = JSON.parse(await localStorage.getItem("candidateDetails"));
        e.contact.contact = values.contact;
        await localStorage.setItem("candidateDetails", JSON.stringify(e));
      } else {
        setContactOTPError("Invalid OTP");
      }
    }
  };

  return (
    <div>
      <p className="font-bold text-lg">Contact Details</p>

      {showForm && (
        <div>
          <Formik
            innerRef={formikRef}
            initialValues={contactDetails}
            validate={(values) => {
              const errors = {};
              if (!values.contact || !contactVerify) {
                errors.contact = "Required";
              }
              if (
                !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                  values.contact
                )
              ) {
                errors.contact = "Invalid Contact !";
              }
              if (!values.email || !emailVerify) {
                errors.email = "Required";
              }
              if (!values.address) {
                errors.address = "Required";
              }
            }}
            onSubmit={(values) => {}}
          >
            {({ values }) => {
              return (
                <Form className="w-4/5">
                  <div className="my-3">
                    <label>Contact Number *</label>
                    <Field
                      name="contact"
                      type="text"
                      className="w-full text-600"
                      style={{ borderRadius: "10px" }}
                      value={values.contact}
                      disabled={values.contact !== null && contactVerify}
                    />
                    {contactVerify && (
                      <p className="text-green-600 text-md">Verified</p>
                    )}
                    {contactError && (
                      <p className="text-red-600 text-md text-sm">
                        {contactError}
                      </p>
                    )}
                    {!contactVerify && contactOTP && (
                      <div className="my-2">
                        <label>Contact OTP</label>
                        <Field
                          type="text"
                          name="contactOTP"
                          className="w-full text-600"
                          style={{ borderRadius: "10px " }}
                          innerRef={contactOTPRef}
                          onChange={()=>{
                            contactOTPError(null);
                          }}
                        />
                      </div>
                    )}
                    {contactOTPError && (
                      <p className="text-red-600 text-md text-sm">
                        {contactOTPError}
                      </p>
                    )}
                    {!contactVerify &&
                      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                        values.contact
                      ) && (
                        <div className="flex space-x-2 my-2">
                          {loadingContact ? (
                            <button className="bg-blue-500 px-2 py-1 rounded-md text-white" style={{backgroundColor:"#034488"}}>
                              <img src={Loader} className="h-8" alt="loader" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="bg-blue-500 px-2 py-1 rounded-md text-white"
                              style={{backgroundColor:"#034488"}}
                              onClick={() => {
                                handleContactOTP(values);
                              }}
                            >
                              {contactOTP !== null ? "Resend OTP" : "Send OTP"}
                            </button>
                          )}
                          <button
                            type="button"
                            className="bg-blue-500 px-2 py-1 rounded-md text-white"
                            disabled={contactOTP === null ? true : false}
                            onClick={() => verifyOTP(values)}
                            style={{backgroundColor:"#034488"}}
                          >
                            Verify OTP
                          </button>
                        </div>
                      )}
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="my-3">
                    <label>Email Address *</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full text-600"
                      style={{ borderRadius: "10px" }}
                      value={values.email}
                      disabled={values.email !== null}
                    />
                    {emailVerify && (
                      <p className="text-green-600 text-md">Verified</p>
                    )}
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="my-3">
                    <label>Address*</label>

                    <Field
                      name="address"
                      type="text"
                      className="w-full text-600"
                      style={{ borderRadius: "10px" }}
                      onChange={async (e) => {
                        if (e.target.value === null) return;
                        await setContactDetails({
                          ...contactDetails,
                          address: e.target.value,
                        });
                        await setAddressValue(e.target.value);
                        let c = JSON.parse(
                          await localStorage.getItem("candidateDetails")
                        );
                        c.contact.address = e.target.value;
                        localStorage.setItem(
                          "candidateDetails",
                          JSON.stringify(c)
                        );
                      }}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-sm text-red-600"
                    />
                    {address && (
                      <p className="my-2">
                        <span className="font-semibold">
                          Current Address :{" "}
                        </span>
                        {address}
                      </p>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          style={{backgroundColor:"#034488"}}
          onClick={async () => {
            let access = await localStorage.getItem("access_token");
            let details = JSON.parse(
              await localStorage.getItem("candidateDetails")
            );
            let user = JSON.parse(await localStorage.getItem("user"));
            await submitCandidateDetails(
              { contact: details.contact, user_id: user._id },
              access
            );
            props.setStep(3);
          }}
        >
          Prev
        </button>
        {(contactDetails.address || address || addressValue) &&
        contactDetails.contact &&
        emailVerify &&
        contactVerify &&
        contactDetails.email ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            style={{backgroundColor:"#034488"}}
            onClick={async () => {
              let ed = JSON.parse(
                await localStorage.getItem("candidateDetails")
              );
              if (ed.contact.address === null) ed.contact.address = address;
              await localStorage.setItem(
                "candidateDetails",
                JSON.stringify(ed)
              );
              let access = await localStorage.getItem("access_token");
              let details = JSON.parse(
                await localStorage.getItem("candidateDetails")
              );
              let user = JSON.parse(await localStorage.getItem("user"));
              await submitCandidateDetails(
                { contact: details.contact, user_id: user._id },
                access
              );
              props.setStep(5);
            }}
          >
            Next
          </button>
        ) : (
          <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white" style={{backgroundColor:"#034388d7"}}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactDetailForm;
