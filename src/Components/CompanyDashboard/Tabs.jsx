import React from 'react';

import '../../assets/stylesheet/Tabs.scss'
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

export default function Tabs() {

  const [index, setIndex] = React.useState(0)
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);

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
    <div className='Tabs w-full'>

      <div className="tabList flex w-full">
        <div className={`tabHead ${index === 0 && 'active'}`} onClick={() => { setIndex(0) }}>Contact</div>
        <div className={`tabHead ${index === 1 && 'active'}`} onClick={() => { setIndex(1) }}>About</div>
        <div className={`tabHead ${index === 2 && 'active'}`} onClick={() => { setIndex(2) }}>Billing Credentials</div>
      </div>
      <div className="tabContent bg-white p-5 bg-white w-full" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastname,
              email: user.email ? user.email : " ",
              contact: user.contact ? user.contact : " ",
              address: user.address ? user.address : " ",
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>

<div className="flex flex-wrap w-full gap-y-5">
                  <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Contact Information</label>
                  <hr />
                  {/* <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">
                    <div><label className="font-semibold text-lg w-2/5 mx-5">Username</label></div>
                    <div> <Field
                      type="text"
                      name="username"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    /></div>
                   
                  </div> */}
                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">
                    <label className="font-semibold text-lg w-2/5 mx-5">Company Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">
                    <label className="font-semibold text-lg w-2/5 mx-5">Email</label>
                    <Field
                      name="email"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">
                    <label className="font-semibold text-lg w-2/5 mx-5">Contact</label>
                    <Field
                      name="contact"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">
                    <label className="font-semibold text-lg w-2/5 mx-5">Address</label>
                    <Field
                      name="address"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>


                </div>

              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 1}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              about: user.desc[0] ? user.desc[0].about : " ",
              motto: user.desc[0] ? user.desc[0].motto : " ",
              industry: user.desc[0] ? user.desc[0].industry : " ",
              found: user.desc[0] ? user.desc[0].found : " ",
              website: user.desc[0] ? user.desc[0].website : " ",
              company_size: user.desc[0] ? user.desc[0].company_size : " "
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>

                <div className="flex flex-wrap w-full gap-y-5">


                  <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">About</label>
                  <hr />
                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1 flex">

                    <label className="font-semibold text-lg w-2/5 mx-5">Overview</label>
                    <p
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"

                      disabled

                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    > {user.desc[0] ? user.desc[0].about : " "} </p>

                  </div>

                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Motto</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="motto"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Website</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="website"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Industry</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="industry"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Company Size</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="company_size"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 mx-9 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Company Founded on</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="found"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>


                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 2}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              gst: user.billing[0] ? user.billing[0].gst : "",
              pan: user.billing[0] ? user.billing[0].pan : "",
              location: user.billing[0] ? user.billing[0].location : "",

            }}
          >
            {({ values, isSubmitting }) => (
              <Form>

                <div className="flex-column flex-wrap w-full gap-y-5">


                  <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Billing Credentials</label>
                  <hr />


                  <div className="md:w-1/2 mx-9 my-5 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">Tax ID</label>



                    <div className='flex w-3/5' >

                      <Field

                        type="text"
                        id="location"
                        name="location"
                        className="block border-gray-100 w-14 py-1"
                        multiple={false}
                        disabled
                      >

                      </Field>


                      <Field
                        type="text"
                        className="block border-gray-100  py-1 md:w-3/4"
                        name="gst"
                        disabled
                      // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      /></div>

                  </div>

                  <div className="md:w-1/2 mx-9 my-5 flex w-full  space-y-1">

                    <label className="font-semibold text-lg w-2/5 mx-5">PAN</label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      name="pan"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>



                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  )
}

