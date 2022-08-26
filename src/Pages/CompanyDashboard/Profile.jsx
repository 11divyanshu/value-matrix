import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../Components/CompanyDashboard/Card";
import ProgressBar from "@ramonak/react-progress-bar";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Tabs from "../../Components/CompanyDashboard/Tabs";
const CompanyProfile = () => {
  let navigate = useNavigate();

  // Access Token And User State
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
 
  // Sets User and AccessToken from SessionStorage



  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let access_token = localStorage.getItem("access_token");
      if (user && user.profileImg) {
        const img = user.profileImg;
        const imgBase64 = img.toString("base64");
        console.log(imgBase64);
        setProfileImg(img);
        setProfileImg(imgBase64);
      }
      if (access_token === null) window.location.href = "/login";


   

      await setUser(user);
    };
    func();
  }, []);


  return (
    <div className="p-5">
      <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p>
    
      {user !== null && user !== undefined && (


        <div className="m-5">

<div className="my-3 shadow-md mx-5  rounded-md w-full p-3 flex items-center ">
            <div>
              <img
                // src={
                //   user && user.profileImg && profileImg ? profileImg : Avatar
                // }
                src={Avatar}
                className="h-16 w-16 rounded-md mx-6"
                alt="userAvatar"
              />
            </div>
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-700 text-sm">User</p>
            </div>
            <div className="ml-auto mr-6 ">
              <button
                className="border-[0.5px] border-gray-600 text-gray-600 px-2 py-1 rounded-sm"
                onClick={() => {
                  let url = window.location.href;
                  let type = url.split("/")[3];
                  window.location.href = "/" + type + "/editProfile";
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
       


          <div className="my-3 mx-5 shadow-md rounded-lg w-full  pt-3 w-3/4">
          {/* <Tabs/> */}
            {/* <p className="my-3  font-bold text-lg">Company Details</p> */}
            {/* <Formik
              initialValues={{
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastname,
                email: user.email ? user.email : " ",
                contact: user.contact ? user.contact : " ",
                about: user.about ? user.about : ""
              }}
            >
              {({ values, isSubmitting }) => (
                <Form>

                  <div className="flex flex-wrap w-full gap-y-5">
                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Contact Information</label>
                    <hr />
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Username</label>
                      <Field
                        type="text"
                        name="username"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Company Name</label>
                      <Field
                        type="text"
                        name="firstName"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>

                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">About</label>
                    <hr />
                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">About</label>
                      <Field
                        as="textarea"
                        className="block  py-1 md:w-1/2 w-3/4 h-20"
                        name="about"
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Website</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Industry</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Company Size</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>
                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Location</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>
                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Social Media</label>


                    <div className="md:w-1/2 w-full ml-3 space-y-1 flex">

                      {(user.linkedInId) && (<img
                        src={Linkedin}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}
                      {(user.googleId) && (<img
                        src={Google}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}
                      {(user.microsoftId) && (<img
                        src={Microsoft}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}

                    </div>
                  </div>
                </Form>
              )}
            </Formik> */}
            <div className="App ">
      <Tabs/>
      </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default CompanyProfile;
