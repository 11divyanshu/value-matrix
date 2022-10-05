import React from "react";

import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field } from "formik";

import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
  AiOutlineDelete,
  AiOutlineRead
} from "react-icons/ai";
import { IoPeople } from "react-icons/io5";


// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import { CgWorkAlt } from "react-icons/cg";
import { IoSchoolOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { downloadResume, getResume, getUserFromId } from "../../service/api";

import "react-multi-carousel/lib/styles.css";

export default function Tabs() {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [resume, setResume] = React.useState(null);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [secEmail, setSecEmail] = React.useState([]);
  const [secContact, setSecContact] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const [link, setLink] = React.useState({});

  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let user1 = await getUserFromId({ id: user._id }, user.access_token);
      console.log(user1)
      let access_token = localStorage.getItem("access_token");
      if (user && user.profileImg) {
        const img = user.profileImg;
        const imgBase64 = img.toString("base64");
        console.log(imgBase64);
        setProfileImg(img);
        setProfileImg(imgBase64);
      }
      if (access_token === null) window.location.href = "/login";
      setSecContact(user1.data.user.secondaryContacts)
      setSecEmail(user1.data.user.secondaryEmails)
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
          <p className="lg:visible hidden content">Contact</p>
          <p className="icons hidden">
            <AiOutlineHome />
          </p>
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
          <p className="lg:visible hidden content">Education</p>
          <p className="icons hidden">
            <IoSchoolOutline />
          </p>
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
          <p className="lg:visible hidden content">Experience</p>
          <p className="icons hidden">
            <CgWorkAlt />
          </p>
        </div>
        <div
          className={`tabHead ${index === 3 && "active"}`}
          onClick={() => {
            setIndex(3);
          }}
        >
          <p className="lg:visible hidden content">Association</p>
          <p className="icons hidden">
            <HiOutlineOfficeBuilding />
          </p>
        </div>
        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
          <p className="lg:visible hidden content">Skills</p>
          <p className="icons hidden">
            <AiOutlineUnorderedList />
          </p>
        </div>
      </div>
      <div
        className="tabContent shadow-md bg-white p-5 w-full"
        hidden={index != 0}
      >
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastname,
              email: user.email ? user.email : " ",
              contact: user.contact
                ? [
                  user.googleId,
                  user.microsoftId,
                  user.linkedInId,
                  user.username,
                  user.githubId,
                ].includes(user.contact)
                  ? " "
                  : user.contact
                : " ",
              houseNo: user.houseNo,
              street: user.street,
              city: user.city,
              country: user.country,
              state: user.state,
              zip: user.zip,
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>

                <div className="flex flex-wrap w-70 gap-y-5">

                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-bold text-lg md:w-2/5 mx-5 mt-2">
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      disabled
                      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
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
                      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
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
                      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
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
                      value={
                        user.contact
                          ? [
                            user.googleId,
                            user.microsoftId,
                            user.linkedInId,
                            user.githubId,
                          ].includes(user.contact)
                            ? " "
                            : user.contact
                          : " "
                      }
                      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
                    // style={{
                    //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                    //   border: "none",
                    // }}
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    {/* <label className="font-semibold text-lg w-2/5 mx-2">
                                    Work Period{" "}
                                  </label> */}

                    <label className="font-semibold text-lg md:w-1/3 mx-5">
                      Address
                    </label>
                    <div className="w-2/3 mx-3">
                      <div
                        className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 md:w-5/6 lg:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 ml-2 md:ml-0 align-middle">
                          <label className="font-normal text-md py-2">
                            House/ Flat No.
                          </label>
                          <div className="">
                            <Field
                              name="houseNo"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              disabled

                            />

                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0 mr-2 md:mr-0 align-middle ">
                          <label className="font-normal text-md ml-2 md:ml-0 py-2">
                            Street
                          </label>
                          <div >
                            <div className="">
                              <Field
                                name="street"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                disabled

                              />
                            </div>




                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 md:w-5/6 lg:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 ml-2 md:ml-0 align-middle">
                          <label className="font-normal text-md py-2">
                            City
                          </label>
                          <div className="">
                            <Field
                              name="city"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              disabled

                            />

                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0 mr-2 md:mr-0 align-middle">
                          <label className="font-normal text-md ml-2 md:ml-0 py-2">
                            State/Region
                          </label>
                          <div >

                            <div className="">
                              <Field
                                name="state"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                disabled

                              />


                            </div>




                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2  md:w-5/6 lg:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 ml-2 md:ml-0  align-middle">
                          <label className="font-normal text-md py-2">
                            Country
                          </label>
                          <div className="">
                            <Field
                              name="country"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              disabled

                            />

                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0 mr-2 align-middle">
                          <label className="font-normal text-md  ml-2 md:ml-0 py-2">
                            Zip Code
                          </label>
                          <div >

                            <div className="">
                              <Field
                                name="zip"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                disabled

                              />


                            </div>




                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Secondary Emails
                    </label>
                    <div className="md:w-4/5 sm:w-4/5 mx-5">
                      {secEmail && secEmail.map((item, index) => {
                        return (
                          <input
                            value={item}
                            type="text"
                            disabled
                            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                            className="block border-gray-200 py-1 w-full my-3"
                          // style={{
                          //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                          //   border: "none",
                          // }}
                          />
                        )
                      })}
                    </div>

                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Secondary Contacts
                    </label>
                    <div className=" md:w-4/5 sm:w-4/5 mx-5">
                      {secContact && secContact.map((item, index) => {
                        return (
                          <input
                            value={item}
                            type="text"
                            disabled
                            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                            className="block border-gray-200 py-1 my-3 w-full"
                          // style={{
                          //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                          //   border: "none",
                          // }}
                          />
                        )
                      })}
                    </div>

                  </div>
                  {user.resume && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-5">
                        Resume</label>
                      <div className="w-4/5 flex items-center px-4">

                        <button
                          class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                          style={{ backgroundColor: "#034488" }} onClick={async () => {
                            let token = await localStorage.getItem(
                              "access_token"
                            );
                            let res = await downloadResume(
                              { user_id: user._id },
                              token
                            )
                            console.log(res);
                            // let blob = new Blob([res.data.Resume.data], {
                            //   type: "application/pdf",
                            // });
                            // console.log(blob);
                            // var blob=new buffer.Blob([res.data.Resume.data], {type:"application/pdf"});
                            // var link=document.createElement('a');
                            // link.href=window.URL.createObjectURL(blob);
                            // link.download="Report_"+new Date()+".pdf";
                            // link.click();


                            const url = window.URL.createObjectURL(new Blob([new Uint8Array(res.data.Resume.data).buffer]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'Resume.pdf');
                            document.body.appendChild(link);
                            link.click();

                          }}
                        >
                          Download Resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 1}>
        {user !== null && user !== undefined && user.education.length === 0 && (
          <p className="my-5 text-center">No Education Details Added</p>
        )}

        {user !== null &&
          user !== undefined &&
          user.education.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-2 bg-white border border-gray-400 my-5 h-35 md:w-full mx-auto"
                key={index}
              // style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}
              >
                <div className="flex justify-end space-x-3 items-center"></div>
                <p className="font-semibold text-md md:w-2/5 ">{item.school}</p>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 align-items-right">
                  <div className="flex my-2 space-x-2 text-sm items-center">
                    <FiInfo />
                    <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                  </div>
                  {item.grade && (
                    <div className="space-x-2 my-2 flex items-center">
                      <GrScorecard /> <p>{item.grade}</p>
                    </div>
                  )}
                  <div className="flex items-center my-2 space-x-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex text-right mr-auto space-x-2 justify-end">
                    <button
                      class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded ml-auto content-end"
                      style={{ backgroundColor: "#034488" }}

                      onClick={() => {
                        window.location.href = "/user/editProfile"

                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="tabContent shadow-md bg-white p-5" hidden={index != 2}>
        {user !== null &&
          user !== undefined &&
          user.experience.length === 0 && (
            <p className="my-5 text-center">No Experience Details Added</p>
          )}
        {user !== null &&
          user !== undefined &&
          user.experience.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-3 bg-white border border-gray-400 my-5 h-35  md:w-full mx-auto"
                key={index}
              >
                <div className="font-semibold flex space-x-2 items-center">
                  <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                  <p className="font-normal text-sm">
                    {item.employment_type}
                  </p>{" "}
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 align-items-right">
                  <div className="space-x-2 my-2 flex items-center ">
                    <FaRegBuilding />
                    <p>{item.company_name}</p>
                  </div>
                  <div className="space-x-2 my-2 flex items-center">
                    <CgWorkAlt />
                    <p>{item.industry}</p>
                  </div>
                  <div className="flex items-center space-x-2 my-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        window.location.href = "/user/editProfile"

                      }}
                    >
                      Edit
                    </button>
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
          user.associate && user.associate.length === 0 && (
            <p className="my-5 text-center">No Association Details Added</p>
          )}
        {user !== null &&
          user !== undefined &&
          user.associate &&
          user.associate.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-3 bg-white border border-gray-400 my-5 h-35  md:w-full mx-auto"
                key={index}
              >
                <div className="font-semibold flex space-x-2 items-center">
                  <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                  <p className="font-normal text-sm">{item.location}</p>{" "}
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 align-items-right">
                  <div className="space-x-2 flex items-center">
                    <FaRegBuilding />
                    <p>{item.company_name}</p>
                  </div>

                  <div className="space-x-2 flex items-center">
                    <CgWorkAlt />
                    <p>{item.industry}</p>
                  </div>

                  <div className="flex items-center space-x-2 my-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        window.location.href = "/user/editProfile"

                      }}
                    >
                      Edit
                    </button>
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
              {roles && roles.length === 0 && (
                <p className="my-5 text-center">No Skills Added</p>
              )}
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
                                <span class="bg-blue-100 inline-block text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                  {item1.secondarySkill}
                                  ({item1.proficiency}) <span className="text-sm"> {item1.lastassested ? `(lastassested(${item1.lastassested}))` : ("unassested")}</span>
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

            <div className="my-2">
              <label className="font-semibold text-lg w-2/5 mx-2">Language Skills</label>

              <div className=" mx-auto justify-center text-center">
                <div className="w-2/3">
                  {user.language &&
                    user.language.map((item, index) => {
                      return (
                        <div
                          className=" rounded-md py-2 px-4 bg-white border my-4 h-35"
                          key={index}
                        >
                          <div className="flex justify-end space-x-3 items-center">
                            {/* <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setExInitialValues(item);
                        setShowExForm(true);
                      }}
                    />
                  */}
                          </div>
                          <div className="font-semibold flex space-x-2 items-center">
                            <p>{item.name}</p> <p className="font-normal text-sm">|</p>{" "}

                          </div>
                          <div className="grid grid-cols-1 md:gap-2 gap-0 lg:grid-cols-6 space-between align-items-right ">
                            <div className="col-start-1 col-end-3 flex">
                              <div className="space-x-2 my-2 flex items-center pr-2">

                                {item.read ? <p className="text-lg flex "><AiOutlineRead className="my-auto mx-2" /> Read</p> : ""}
                              </div>
                              <div className="space-x-2 my-2 flex items-center px-2">

                                <p className="text-lg">{item.write ? <p className="text-lg flex"><HiPencil className="my-auto mx-2" />Write</p> : ""}</p>
                              </div>
                              <div className="flex items-center space-x-2 my-2 px-2">

                                <p className="text-gray-600 text-lg">
                                  {item.speak ? <p className="text-lg flex"><IoPeople className="my-auto mx-2" />Speak</p> : ""}
                                </p>
                              </div>
                            </div>
                            <div className="col-start-5 col-end-7 col-span-2 flex items-center space-x-2 ">
                              <button
                                class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {

                                }}
                              >
                                Edit
                              </button>
                              <div className="text-xl mx-5 px-7 py-2">


                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                </div>



              </div>
            </div>

            <div className="md:w-1/2 w-full block space-y-1">
              <label className="font-semibold">Resume</label><br />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
