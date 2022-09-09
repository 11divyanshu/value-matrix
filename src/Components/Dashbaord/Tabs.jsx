import React from "react";

import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field } from "formik";
import { AiOutlineHome,AiOutlineUser ,AiOutlineFolderAdd,AiOutlineUnorderedList} from "react-icons/ai";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import { CgWorkAlt } from "react-icons/cg";
import { IoSchoolOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { downloadResume, getResume } from "../../service/api";

import "react-multi-carousel/lib/styles.css";

export default function Tabs() {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [resume, setResume] = React.useState(null);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [roles, setRoles] = React.useState({});

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

      let primarySkills = {};
      let roles = new Set([]);
      user.tools.forEach((skill) => {
        roles.add(skill.role);
        if (primarySkills[skill.role]) {
          primarySkills[skill.role].add(skill.primarySkill);
        } else {
          primarySkills[skill.role] = new Set([skill.primarySkill]);
        }
      });
      setRoles(Array.from(roles));
      Array.from(roles).map((el) => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      setSkillsPrimary(primarySkills);
      console.log(user);
      await setUser(user);
    };
    func();
  }, []);

  return (
    <div className="Tabs w-full">
      <div className="tabList">
        <div
          className={`tabHead ${index === 0 && "active"}`}
          onClick={() => {
            setIndex(0);
          }}
        >
           <p className="md:visible hidden content">Contact</p><p className="icons hidden"><AiOutlineHome/></p>
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
           <p className="md:visible hidden content">Education</p><p className="icons hidden"><IoSchoolOutline/></p>
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
            <p className="md:visible hidden content">Experience</p><p className="icons hidden"><CgWorkAlt/></p>
        </div>
        <div
          className={`tabHead ${index === 3 && "active"}`}
          onClick={() => {
            setIndex(3);
          }}
        >
           <p className="md:visible hidden content">Association</p><p className="icons hidden"><HiOutlineOfficeBuilding/></p>
        </div>
        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
            <p className="md:visible hidden content">Skills</p><p className="icons hidden"><AiOutlineUnorderedList/></p>
        </div>
      </div>
      <div className="tabContent shadow-md bg-white p-5 w-full" hidden={index != 0}>
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
                 
                  <div className=" md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      disabled
                      className="block border-gray-400 py-1 md:w-3/5 sm:w-4/5 mx-5"
                      // style={{
                      //   boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                      //   border: "none",
                      // }}
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      disabled
                      className="block border-gray-400 py-1 md:w-3/5 sm:w-4/5 mx-5"
                      // style={{
                      //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                      //   border: "none",
                      // }}
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-3/5 sm:w-4/5 mx-5"
                      // style={{
                      //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                      //   border: "none",
                      // }}
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Contact
                    </label>
                    <Field
                      name="contact"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-3/5 sm:w-4/5 mx-5"
                      // style={{
                      //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                      //   border: "none",
                      // }}
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Address
                    </label>
                    <Field
                      name="address"
                      type="text"
                      disabled
                      className="block border-gray-400 py-1 md:w-3/5 sm:w-4/5 mx-5"
                      // style={{
                      //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                      //   border: "none",
                      // }}
                    />
                  </div>
                  {user.resume && (
                    <div className="flex space-x-12">
                      <p className="font-semibold">Resume</p>
                      <p
                        className="text-sm text-blue-500 cursor-pointer"
                        onClick={async () => {
                          let token = await localStorage.getItem(
                            "access_token"
                          );
                          let res = await downloadResume(
                            { user_id: user._id },
                            token
                          );
                          console.log(res);
                          let blob = new Blob([res.data.Resume.data], {
                            type: "application/pdf",
                          });
                          let link = document.createElement("a");
                          link.href = window.URL.createObjectURL(blob);
                          link.download = "resume.pdf";
                          link.click();
                        }}
                      >
                        Download Resume
                      </p>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 1}>
        {user !== null &&
          user !== undefined &&
          user.education.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-2 bg-white border border-gray-400 my-5 h-35 md:w-full mx-auto"
                key={index}
              >
                <div className="flex justify-end space-x-3 items-center"></div>
                <p className="font-bold text-md py-3">{item.school}</p>
                <div className="flex flex-wrap justify-between w-full text-gray-800 ">
                  <div className="flex space-x-2 text-sm items-center">
                    <FiInfo />
                    <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                  </div>
                  {item.grade && (
                    <div className="space-x-2 flex items-center">
                      <GrScorecard /> <p>{item.grade}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} to {item.end_date}
                    </p>
                  </div>
                </div>
               
              </div>
            );
          })}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 2}>
        {user !== null &&
          user !== undefined &&
          user.experience.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-2 bg-white border border-gray-400 my-5 h-35  md:w-full mx-auto"
                key={index}
              >
                <div className="font-semibold flex space-x-2 mt-3 text-md items-center">
                  <p className="text-md">{item.title}</p>{" "}
                  <p className="font-normal text-md">|</p>{" "}
                  <p className="font-normal text-md">{item.employment_type}</p>{" "}
                </div>
                <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">
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
          })}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 3}>
        {user !== null &&
          user !== undefined &&
          user.associate &&
          user.associate.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-2 bg-white border border-gray-400 my-5 h-35  md:w-full mx-auto"
                key={index}
              >
                <div className="font-semibold flex space-x-2 mt-3 items-center">
                  <p className="text-md">{item.title}</p>{" "}
                </div>
                <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">
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
          })}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 4}>
        {user !== null && user !== undefined && (
          <div>
            <div className="md:w-1/2 w-full space-y-1">
              <label className="font-semibold">Skills</label>
              <div className="">
                {roles
                  ? roles.map((item, index) => {
                      return (
                        <div>
                          <p className="font-semibold text-md my-3">{item}</p>
                          {skillsPrimary[item].map((el) => (
                            <div>
                              <p className="text-sm my-2">{el}</p>
                              {user.tools
                                .filter(
                                  (tool) =>
                                    tool.role === item &&
                                    tool.primarySkill === el
                                )
                                .map((item1, index) => (
                                  <span class="bg-blue-100 text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                    {item1.secondarySkill}{" "}
                                  </span>
                                ))}
                            </div>
                          ))}
                        </div>
                      );
                    })
                  : "No Skills"}
              </div>
            </div>

            {/* <div className="md:w-1/2 w-full space-y-1">
              <label className="font-semibold">Resume</label>

            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
