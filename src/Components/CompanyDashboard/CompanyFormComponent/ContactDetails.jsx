import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { useInsertionEffect } from "react";
import  {AiFillLinkedin} from "react-icons/ai"
import { url } from "../../../service/api";

const ContactDetailForm = (props) => {
  const [contactDetails, setContactDetails] = React.useState({
    contact: null,
    email: null,
    address: null,
  });
  const formikRef = React.useRef(null);
  const [showForm, setShowForm] = React.useState(false);

  const [contactVerify, setContactVerify] = React.useState(false);
  const [emailVerify, setEmailVerify] = React.useState(false);
  const [linkedinVerify, setLinkedinVerify] = React.useState(false);

  const [address, setAddress] = React.useState(null);
  

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let e = JSON.parse(await localStorage.getItem("companyDetails"));
      let ed = {
        email: null,
        contact: null,
        address: null,
        linkedInId:null,
      };
      if(e !== null){
        if(e.contact.address)
          setAddress(e.contact.address);
      }
      if (user.contact) {
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
      if (user.linkedInId) {
        ed.linkedInId = user.linkedInId;
        setLinkedinVerify(true);
        // if (formikRef.current) {
        //   formikRef.current.setFieldValue("email", user.email);
        // }
      }
      setContactDetails(ed);
      await setShowForm(true);
    };
    initial();
  }, []);

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
              if (!values.contact) {
                errors.contact = "Required";
              }
              if (!values.email) {
                errors.email = "Required";
              }
              if (!values.address) {
                errors.address = "Required";
              }
            }}
            onSummit={(values) => {}}
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
                      disabled={values.contact !== null}
                    />
                    {contactVerify && (
                      <p className="text-green-600 text-md">Verified</p>
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

                    <label>Linked In *</label>
                    {/* <Field
                      name="email"
                      type="email"
                      className="w-full text-600"
                      style={{ borderRadius: "10px" }}
                      value={values.email}
                      disabled={values.email !== null}
                    /> */}
                    {linkedinVerify ? (
                      <p className="text-green-600 text-md">Connected</p> ): 
                      (
                        <form action={`${url}/auth/linkedin`}>
                      <button type="submit" className="bg-blue-600 p-2 text-white  flex rounded-lg mt-3 block hover:bg-blue-600 cursor-pointer" style={{verticalAlign:"middle"}}
                      > <div className="text-2xl "><AiFillLinkedin></AiFillLinkedin></div><p className="px-2">Sign In with LinkedIn</p></button>
                      </form>
                      
                      )
                    }
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
                      value={values.address}
                      onChange={async (e) => {
                        await setContactDetails({
                          ...contactDetails,
                          address: e.target.value,
                        });
                        let c = JSON.parse(
                          await localStorage.getItem("companyDetails")
                        );
                        c.contact.address = e.target.value;
                        localStorage.setItem(
                          "companyDetails",
                          JSON.stringify(c)
                        );
                      }}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-sm text-red-600"
                    />
                    {address && (<p className="my-2"><span className="font-semibold">Current Address : </span>{address}</p>)}
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
          onClick={() => props.setStep(0)}
        >
          Prev
        </button>
        {(contactDetails.address || address) &&
        contactDetails.contact &&
        contactDetails.email ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            onClick={() => props.setStep(2)}
          >
            Next
          </button>
        ) : (
          <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactDetailForm;
