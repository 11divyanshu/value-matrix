import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Loader from "../../assets/images/loader.gif";
import { authenticateSignUp, OTPMail, OTPSms, validateSignupDetails } from "../../service/api";

const SignupForm = () => {

  const [signupError, setSignupError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [OTP, setOTP] = React.useState(null);
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [SmsOTP, setSMSOTP] = React.useState(null);
  const [SmsOTPError, setSmsOTPError] = React.useState(false);
  const [EmailOTPError, setEmailOTPError] = React.useState(false);

  const OTPField = useRef(null);

  const sendOTP = async (values) => {
    
    setSignupError(null);
    setLoading(true);
    let check = await validateSignupDetails(values);
    console.log(check.data);
    if(check.data.username && check.data.email === true){
      setSignupError("Username and Email Already Registered");
    }
    if(check.data.username && check.data.contact){
      setSignupError("Username and Contact Already Registered");
    }
    if(check.data.email){
        setSignupError("Email Already Registered");
    }
    if(check.data.contact){
      setSignupError("Contact Already Registered");
    }
    if(check.data.username){
      setSignupError("Username Already Registered");
    }
    if(check.data.username || check.data.contact || check.data.email){
      setLoading(false);
      return;
    } 

    let res1 = await OTPSms({contact : values.contact});
    let res2 = await OTPMail({mail : values.email});
        
    if(res1){
        setSMSOTP(res1);
    }
    if(res2){
      setEmailOTP(res2);
    }
    else if(!res1 && !res2){
        console.log("Error");
    }
    setOTP(true);
    setLoading(false);
};

  const signup = async(values) => {
    if(values.SmsOTP == SmsOTP){
      setSmsOTPError(false);
    }
    if(values.EmailOTP == EmailOTP){
      setEmailOTP(false);
    }
    if(values.SmsOTP == SmsOTP && values.EmailOTP == EmailOTP){
        setSmsOTPError(false);
        setEmailOTP(false);
        setLoading(true);
        let res = await authenticateSignUp(values);
        
        if(res && !res.data.Error){
          window.location.href="/login";
        }
        else if(res){
          setSignupError(res.data.Error);
          setOTP(null);
        }
        else{
          setOTP(null);
          setSignupError("Error Signing Up");
          OTPField.current = "";  
          setEmailOTPError(null);
          setSmsOTPError(null);
        }
        setLoading(false);
    }
    else if(values.SmsOTP != SmsOTP){
        setSmsOTPError(true);
    }
    else{
        setEmailOTPError(true);
    }
  };

  return (
    <div className="p-9 pt-5 pb-2">
      <p className="text-3xl font-semibold">Repute Hire</p>
      <div className="p-12 pt-8 pb-2 pl-5">
        <p className="text-xl font-bold">OPs/Admin Signup</p>
        <p className="text-sm">Get Admin Support of ReputeHire </p>
        
        <Formik
          initialValues={{ name: "", email: "", username: "", password: "", contact:"" }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }
            if (!values.name) {
              errors.name = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email) 
            ) {
              errors.email = "Invalid Email Address";
            }
            if(!values.contact){
              errors.contact="Required";
            }else if(!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(values.contact)){
              errors.contact = "Invalid Contact Number";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}

          onSubmit={(values) => { if(OTP){signup(values);} else{sendOTP(values);} }}
        >
          {({ values, isSubmitting,}) => (
            <Form className="space-y-3 py-3">
              <Field
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full"
                disabled={(OTP !== null)}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="w-full"
                disabled={(OTP !== null)}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="text"
                name="email"
                disabled={(OTP !== null)}
                placeholder="Email"
                className="w-full"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="text"
                name="contact"
                disabled={(OTP !== null)}
                placeholder="Contact Number"
                className="w-full"
              />
              <ErrorMessage
                name="contact"
                component="div"
                className="text-sm text-red-600"
              />
              <Field
                type="password"
                name="password"
                disabled={(OTP !== null)}
                placeholder="Password"
                className="w-full"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600"
              />
              {EmailOTP && (
                <Field
                  type="number"
                  name="EmailOTP"
                  ref={OTPField}
                  placeholder="Email OTP"
                  className="w-full"
                />
              )}
              {EmailOTP && EmailOTPError && (
                <p className="text-sm text-red-600">Invalid Email OTP !</p>
              )}
              {SmsOTP && (
                <Field
                  type="number"
                  name="SmsOTP"
                  ref={OTPField}
                  placeholder="Contact OTP"
                  className="w-full"
                />
              )}
              {SmsOTP && SmsOTPError && (
                <p className="text-sm text-red-600">Invalid SMS OTP !</p>
              )}
              {signupError && 
              <p className="text-sm text-red-600">{signupError}</p>}
              {!loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-sm mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer" type="submit"
                  style={{backgroundColor:"rgb(37 99 235)"}}
                >
                  {OTP === null ? "Continue" : "Signup" }
                </button>
              )}
              {loading && <button className="h-8 bg-blue-600 rounded-sm block mx-auto cursor-pointer w-1/2 px-8 align-middle" ><img src={Loader} alt="loader" className="h-9 mx-auto"/></button>}
            </Form>
          )}
        </Formik>
        <div className="flex space-x-3 justify-center w-full items-center text-gray-600 py-3">
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
          <p> or </p>
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
        </div>
        <div className="flex justify-center space-x-7 h-7 mt-3">
          <form action="http://localhost:8000/auth/google"><button type="submit"><img src={Google} alt="google-login" className="cursor-pointer h-7"/></button></form>
          <form action="http://localhost:8000/auth/microsoft"><button type="submit"><img src={Microsoft} alt="microsoft-login" className="cursor-pointer h-7" /></button></form>
          <img src={Linkedin} alt="linkedin-login" className="cursor-pointer" />
        </div>
        <div className="h-5 block"></div>
      
      </div>
    </div>
  );
};

export default SignupForm;
