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
import { AiOutlineHome,AiOutlineUser ,AiOutlineFolderAdd} from "react-icons/ai";
import { RiBillLine} from "react-icons/ri";

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
        <div className={`tabHead ${index === 0 && 'active'}`} onClick={() => { setIndex(0) }}> 
        <p className="md:visible hidden content">Contact</p><p className="icons hidden"><AiOutlineHome/></p>
</div>
        <div className={`tabHead ${index === 1 && 'active'}`} onClick={() => { setIndex(1) }}><p className="md:visible hidden content">About</p><p className="icons hidden"><AiOutlineUser/></p>
</div>
        <div className={`tabHead ${index === 2 && 'active'}`} onClick={() => { setIndex(2) }}> <p className="md:visible hidden content">Billing Details</p><p className="icons hidden"><RiBillLine/></p>
</div>
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
                  {/* <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Contact Information</label> */}
                  {/* <hr /> */}
                  {/* <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  flex w-full  space-y-1 flex">
                    <div><label className="font-semibold text-lg md:w-2/5 mx-5">Username</label></div>
                    <div> <Field
                      type="text"
                      name="username"
                      disabled
                      className="shadow-sm border-gray-10 py-1 md:w-3/5 mx-5"
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    /></div>
                   
                  </div> */}
                  <div className=" md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1 ">
                    <label className="font-semibold text-lg md:md:w-2/5 mx-5">Company Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      disabled
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  
                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1 ">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">Email</label>
                    <Field
                      name="email"
                      type="text"
                      disabled
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1 ">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">Contact</label>
                    <Field
                      name="contact"
                      type="text"
                      disabled
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1 ">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">Address</label>
                    <Field
                      name="address"
                      type="text"
                      disabled
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
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


                  {/* <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">About</label>
                  <hr /> */}
                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1 ">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Overview</label>
                    <p
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                      disabled

                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    > {user.desc[0] ? user.desc[0].about : " "} </p>

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Motto</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                      name="motto"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Website</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                      name="website"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Industry</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                      name="industry"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Company Size</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
                      name="company_size"
                      disabled
                    // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Company Founded on</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-5 py-2 md:w-3/5 mx-5 px-4" 
                      style={{borderRadius:"5px"}}
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


                  {/* <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Billing Credentials</label> */}
                  {/* <hr /> */}


                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  my-5 md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">Tax ID</label>



                    <div className='flex md:w-3/5 mx-5' >

                      <Field

                        type="text"
                        id="location"
                        name="location"
                        className="block border-gray-100 py-1 w-1/6"
                        style={{borderRadius:"5px 0 0 5px"}}
                        multiple={false}
                        disabled
                      >

                      </Field>


                      <Field
                        type="text"
                        className="block border-gray-100  py-2 px-4 md:w-3/4 w-5/6"
                        style={{borderRadius:"0 5px 5px 0"}}
                        name="gst"
                        disabled
                      // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      /></div>

                  </div>

                  <div className="md:w-1/2 md:mx-2 my-1sm:mx-0  my-5 md:flex w-full  space-y-1">

                    <label className="font-semibold text-lg md:w-2/5 mx-5">PAN</label>
                    <Field
                      type="text"
                      className="shadow-sm border-gray-10 md:w-3/5 ml-16 mr-20 px-4 py-2"
                      style={{borderRadius:"5px"}}
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

