import React from 'react';

import '../../assets/stylesheet/Tabs.scss'
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { getResume } from '../../service/api';

import "react-multi-carousel/lib/styles.css";


export default function Tabs() {

  const [index, setIndex] = React.useState(0)
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [resume, setResume] = React.useState(null);

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
    <div className='Tabs'>

      <div className="tabList flex">
        <div className={`tabHead ${index === 0 && 'active'}`} onClick={() => { setIndex(0) }}>Contact</div>
        <div className={`tabHead ${index === 1 && 'active'}`} onClick={() => { setIndex(1) }}>Education</div>
        <div className={`tabHead ${index === 2 && 'active'}`} onClick={() => { setIndex(2) }}>Experience</div>
        <div className={`tabHead ${index === 3 && 'active'}`} onClick={() => { setIndex(3) }}>Skills</div>
      </div>
      <div className="tabContent p-5" hidden={index != 0}>
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
                  <div className="md:w-1/2 w-full space-y-1">
                    <label className="font-semibold">Address</label>
                    <Field
                      name="address"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                      style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                    />
                  </div>


                </div>

              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent p-5" hidden={index != 1}>



        {user !== null && user !== undefined && user.education.map((item, index) => {
          return (
            <div className="my-2 shadow-md rounded-md p-5 bg-gray-50 h-35" key={index}>
              <div className="flex justify-end space-x-3 items-center">


              </div>
              <p className="font-semibold py-3">{item.school}</p>
              <div className="flex flex-wrap justify-between w-full py-3 text-gray-800 ">
                <div className="flex space-x-2 text-sm items-center">
                  <FiInfo />
                  <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                </div>
                {item.grade && (
                  <div className="space-x-2 flex items-center">
                    <GrScorecard /> <p>{item.grade}</p>
                  </div>)}
                <div className="flex items-center space-x-2">
                  <BsCalendar />
                  <p className="text-sm text-gray-600 mr-5">
                    {item.start_date} - {item.end_date}
                  </p>
                </div>
              </div>
              {item.description && (
                <div className="py-2">{item.description}</div>
              )}
            </div>
          );
        })
        }


      </div>
      <div className="tabContent p-5" hidden={index != 2}>
        {user !== null && user !== undefined && user.experience.map((item, index) => {
          return (
            <div className="my-2 shadow-md rounded-md p-5  bg-gray-50 h-40" key={index}>

              <div className="font-semibold flex space-x-2 mt-3 items-center">
                <p className='text-xl'>{item.title}</p> <p className="font-normal text-lg">|</p>{" "}
                <p className="font-normal text-lg">
                  {item.employment_type}
                </p>{" "}
              </div>
              <div className="flex flex-wrap justify-between w-full py-5 text-gray-800 ">
                <div className="space-x-2 flex items-center">
                  <FaRegBuilding />
                  <p>{item.company_name}</p>
                </div>
                <div className="space-x-2 flex items-center">
                  <CgWorkAlt />
                  <p>{item.industry}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BsCalendar />
                  <p className="text-sm text-gray-600 mr-5">
                    {item.start_date} - {item.end_date}
                  </p>
                </div>
              </div>
              {item.description && (
                <div className="py-2">{item.description}</div>
              )}
            </div>
          );
        })
        }
      </div>
      <div className="tabContent p-5" hidden={index != 3}>

        {user !== null && user !== undefined &&
          <div>
            <div className="md:w-1/2 w-full space-y-1">
              <label className="font-semibold">Skills</label>
              <div className="flex">
              {user.tools ? user.tools.map((item, index) => {
                return (
                  
                  <span class="bg-blue-100 text-blue-800 text-xs my-4 font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{item}</span>

                  
                  )
              }) : "No Skills"}
              </div>
            </div>



            <div className="md:w-1/2 w-full space-y-1">
              <label className="font-semibold">Resume</label>
              {/* <iframe src={resume}/> */}

            </div>
          </div>

        }
      </div>
    </div>
  )
}

