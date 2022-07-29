import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";

// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Loader from "../../assets/images/loader.gif";
import { authenticateLogin } from '../../service/api';


const LoginForm = () => {

    const [loading, setLoading] = React.useState(false);
    const [loginError, setLoginError] = React.useState(null);

    const Login = async (values) => {
        setLoading(true);
        let res = await authenticateLogin(values) ;
        console.log(res);
        if(res){
            setLoading(false);
            window.location.href="/";
        }
        else{
            setLoginError("Username and Password doesn't match !")
            setLoading(false);
        }
    }

    return (
        <div className="p-9 pt-5 pb-2">
        <p className="text-3xl font-semibold">Repute Hire</p>
        <div className="p-12 pt-8 pb-2 pl-5">
          <p className="text-xl font-bold">OPs/Admin Signup</p>
          <p className="text-sm">Get Admin Support of ReputeHire </p>
          
          <Formik
            initialValues={{ username: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.username) {
                errors.username = "Required";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
  
            onSubmit={(values) => { Login(values) }}
          >
            {({ values, isSubmitting,}) => (
              <Form className="space-y-3 py-3">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username, Phone or Email Address"
                  className="w-full"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-600"
                />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600"
                />
                {loginError && <p className="text-sm text-red-600">{loginError}</p>}
                {!loading && (
                  <button
                    className="bg-blue-600 px-8 py-2 text-white rounded-sm mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer" type="submit"
                    style={{backgroundColor:"rgb(37 99 235)"}}
                  >
                    Log In
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
            <img
              src={Linkedin}
              alt="linkedin-login"
              className="cursor-pointer"
            />
          </div>
          <div className="h-5 block"></div>
        </div>
      </div>
    )
}

export default LoginForm;