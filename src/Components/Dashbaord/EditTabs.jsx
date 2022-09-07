import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { Disclosure } from "@headlessui/react";
import { getSkills } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";

import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
// Assets
import swal from "sweetalert";

import "react-multi-carousel/lib/styles.css";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
export default function Tabs(props) {
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);

  // States for the Page
  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);

  const inputSkillRef = React.useRef(null);
  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);

  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);

  const [upImg, setUpImg] = React.useState(null);

  const [index, setIndex] = React.useState(0);
  const [profileImg, setProfileImg] = React.useState(null);

  //education
  const [educationalDetail, setEducationalDetail] = React.useState([]);

  const [showEduForm, setShowEduForm] = React.useState(false);

  const [edit, setEdit] = React.useState(null);
  const [showError, setShowError] = React.useState(true);

  const resetBtn = React.useRef(null);
  const [initialValues, setInitialValues] = React.useState({
    //education
    contact: null,
    email: null,
    address: null,
    //experience
  });
  const [eduinitialValues, setEduInitialValues] = React.useState({
    //education
    school: null,
    degree: null,
    field_of_study: null,
    start_date: null,
    end_date: null,
    grade: null,
    description: null,
    //experience
  });
  const [exinitialValues, setExInitialValues] = React.useState({
    title: null,
    employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

  // Experience
  const [experienceDetail, setExperienceDetail] = React.useState([]);
  const [showExForm, setShowExForm] = React.useState(false);

  //Association
  const [associateDetail, setAssociateDetail] = React.useState([]);
  const [showAsForm, setShowAsForm] = React.useState(false);

  const [asinitialValues, setAsInitialValues] = React.useState({
    title: null,
    // employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

  //Tools
  const [tools, setTools] = React.useState([]);
  const [error, seterror] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("user"));
      setUser(e);
      if (e === null) return null;
      let ed = e.education;
      console.log(ed);
      if (ed !== "null" || ed !== null) {
        setEducationalDetail(ed);
      }
      if (ed === null) {
        setEducationalDetail([]);
      }
      let ex = e.experience;
      console.log(ex);
      if (ex !== "null" || ex !== null) {
        setExperienceDetail(ex);
      }
      if (ex === null) {
        setExperienceDetail([]);
      }

      let as = e.associate;
      console.log(as);
      if (as !== "null" || as !== null) {
        setAssociateDetail(as);
      }
      if (as === null) {
        setAssociateDetail([]);
      }

      let et = e.tools;
      console.log(ex);
      if (et !== "null" || et !== null) {
        setTools(et);
      }
      if (et === null) {
        setTools([]);
      }

      let primarySkills = {};
      let roles = new Set([]);
      e.tools.forEach((skill) => {
        roles.add(skill.role);
        if (primarySkills[skill.role]) {
          primarySkills[skill.role].add(skill.primarySkill);
        } else {
          primarySkills[skill.role] = new Set([skill.primarySkill]);
        }
      });
      setCRoles(Array.from(roles));
      Array.from(roles).map((el) => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      setSkillsPrimary(primarySkills);
    };
    initial();
  }, []);

  const updateEducation = async (values) => {
    let e = JSON.parse(await localStorage.getItem("user"));
    if (edit !== null) {
      const temp = [...educationalDetail];
      temp[edit] = values;
      await setEducationalDetail(temp);
      await setEdit(null);
      resetBtn.current.click();
      e.education = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));

      return;
    }
    let temp = educationalDetail;
    temp = [...educationalDetail, values];
    await setEducationalDetail(temp);
    e.education = temp;
    setUser(e);
    await localStorage.setItem("user", JSON.stringify(e));
    await setEduInitialValues({
      school: null,
      degree: null,
      field_of_study: null,
      start_date: null,
      end_date: null,
      grade: null,
      description: null,
    });

    resetBtn.current.click();
    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Saved",
      button: "Continue",
    });
  };

  const updateExperience = async (values) => {
    let e = JSON.parse(await localStorage.getItem("user"));
    if (edit !== null) {
      const temp = [...experienceDetail];
      temp[edit] = values;
      await setExperienceDetail(temp);
      e.experience = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setEdit(null);
      resetBtn.current.click();
      return;
    }
    let temp = experienceDetail;
    temp = [...experienceDetail, values];
    await setExperienceDetail(temp);
    e.experience = temp;
    setUser(e);
    await localStorage.setItem("user", JSON.stringify(e));
    await setExInitialValues({
      title: null,
      employment_type: "",
      company_name: null,
      location: null,
      start_date: null,
      end_date: null,
      industry: null,
      description: null,
    });
    resetBtn.current.click();
    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Saved",
      button: "Continue",
    });
  };

  const updateAssociation = async (values) => {
    let e = JSON.parse(await localStorage.getItem("user"));
    if (edit !== null) {
      const temp = [...associateDetail];
      temp[edit] = values;
      await setAssociateDetail(temp);
      e.associate = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setEdit(null);
      resetBtn.current.click();
      return;
    }
    let temp = associateDetail;
    temp ? (temp = [...associateDetail, values]) : (temp = [values]);
    await setAssociateDetail(temp);
    e.associate = temp;
    setUser(e);
    await localStorage.setItem("user", JSON.stringify(e));
    await setAsInitialValues({
      title: null,

      company_name: null,
      location: null,
      start_date: null,
      end_date: null,
      industry: null,
      description: null,
    });
    resetBtn.current.click();
    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Saved",
      button: "Continue",
    });
  };

  const save = async (values) => {
    console.log(values);

    if (values.firstName) {
      // if (EmailOTP === null && ContactOTP === null)
      //   wait = await SendOTPFunction(values);
      // if (wait !== 0) return;
      // console.log("values");
      // if (EmailOTP && ContactOTP) {
      //   if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
      //     setError("Invalid Email OTP and Contact OTP");
      //     return;
      //   }
      // }
      // console.log("values");
      // if (EmailOTP && values.emailOTP !== EmailOTP) {
      //   setError("Invalid Email OTP");
      //   return;
      // }
      // console.log("values");
      // if (ContactOTP && values.contactOTP !== ContactOTP) {
      //   setError("Invalid Contact OTP");
      //   return;
      // }
      let user = JSON.parse(localStorage.getItem("user"));

      user.firstName = values.firstName;
      user.lastname = values.lastName;
      user.address = values.address;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

    // if (values.about) {
    //   // user.desc[0] = values;
    //   // console.log(user);
    //   // setUser(user);
    //   // localStorage.setItem("user", JSON.stringify(user));
    //   let e = JSON.parse(
    //     await localStorage.getItem("user")
    //   );
    //   const temp = [...user.desc];
    //   temp[0] = values;
    //   console.log(temp)
    //   e.desc = temp;
    //   update(e);
    //   await localStorage.setItem(
    //     "user",
    //     JSON.stringify(e)
    //   );
    //   await setAboutDetail(temp);

    //   // e.about = temp;

    //   // await props.setUser({
    //   //   desc: temp,
    //   //   ...props.user,
    //   // });

    //   // await localStorage.setItem("user", JSON.stringify(user));
    //   // return;
    // }
  };

  // const submit = async (values) => {
  //   console.log("values");
  //   let wait = 0;
  //   if (EmailOTP === null && ContactOTP === null)
  //     wait = await SendOTPFunction(values);
  //   if (wait !== 0) return;
  //   console.log("values");
  //   if (EmailOTP && ContactOTP) {
  //     if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
  //       setError("Invalid Email OTP and Contact OTP");
  //       return;
  //     }
  //   }
  //   console.log("values");
  //   if (EmailOTP && values.emailOTP !== EmailOTP) {
  //     setError("Invalid Email OTP");
  //     return;
  //   }
  //   console.log("values");
  //   if (ContactOTP && values.contactOTP !== ContactOTP) {
  //     setError("Invalid Contact OTP");
  //     return;
  //   }
  //   console.log("values");
  //   update(user);
  // };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({ email: values.email });
      if (emailValidate.data.email === true) {
        setError("Email Already Registered");
        return 1;
      }
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      let contactValidate = await validateSignupDetails({
        contact: values.contact,
      });
      if (contactValidate.data.contact === true) {
        setError("Contact Already Registered");
        return 1;
      }
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    console.log(wait);
    return wait;
  };

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let p = JSON.parse(await localStorage.getItem("prof"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        console.log(user.tools);
        let pr = new Array(res.data.length).fill(0);
        console.log(res.data[221]);
        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
            console.log(index);
          });
          console.log(pr);
          await setProf([...pr]);
          console.log(prof);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const update = async (ed) => {
    console.log(ed);

    let data = {
      firstName: ed.firstName,
      lastname: ed.lastName,
      address: ed.address,
      experience: ed.experience,
      associate: ed.associate,
      education: ed.education,
      tools: ed.tools,
    };
    if (EmailOTP) {
      data.email = ed.email;
    }
    if (ContactOTP) {
      data.contact = ed.contact;
    }

    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );

    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      await localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/user/profile";
    } else {
      console.log("Error");
    }

    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Updated Succesfully",
      button: "Continue",
    });
  };

  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      if (access_token1 === "null" || access_token === "undefined")
        await localStorage.setItem("access_token", user.access_token);
      if (user && user.profileImg) {
        let image = JSON.parse(await localStorage.getItem("profileImg"));
        console.log(image);
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        console.log(src);
        await setProfilePic(src);
      }
      console.log(user);
      await setUser(user);
      await setToken(access_token1);
    };
    initial();
  }, []);

  return (
    <div className="Tabs w-full">
      <div className="tabList flex w-full">
        <div
          className={`tabHead ${index === 0 && "active"}`}
          onClick={() => {
            setIndex(0);
          }}
        >
          Contact
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
          Education
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
          Experience
        </div>
        <div
          className={`tabHead ${index === 3 && "active"}`}
          onClick={() => {
            setIndex(3);
          }}
        >
          Association
        </div>
        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
          Skills
        </div>
      </div>
      <div className="tabContent bg-white  w-full p-5" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              firstName: user.firstName,
              email: user.email ? user.email : " ",
              contact: user.contact ? user.contact : " ",
              emailOTP: "",
              contactOTP: "",
              address: user.address,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = "Required";
              }
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid Email Address";
              }
              if (!values.contact) {
                errors.contact = "Required";
              } else if (
                !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                  values.contact
                )
              ) {
                errors.contact = "Invalid Contact Number";
              }
              return errors;
            }}
          // onSubmit={(values) => submit(values)}
          >
            {({ values }) => (
              <Form>
                {Error && <p className="text-sm text-red-500">{Error}</p>}
                {/* <p className="md:w-1/2  flex w-full  space-y-1 my-3">
                <span className="font-semibold text-lg w-2/5 mx-5"> Username :</span>{" "}
                {user.username}{" "}
              </p> */}
                <div className="flex flex-wrap w-full gap-y-5">
                  <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                    <label className="font-semibold text-lg w-2/5 mx-5">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                    <label className="font-semibold text-lg w-2/5 mx-5">
                      Address
                    </label>
                    <Field
                      type="text"
                      name="address"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                    <label className="font-semibold text-lg w-2/5 mx-5">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      disabled={EmailOTP !== null || ContactOTP !== null}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                    <label className="font-semibold text-lg w-2/5 mx-5">
                      Contact
                    </label>
                    <Field
                      name="contact"
                      type="text"
                      className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      disabled={EmailOTP !== null || ContactOTP !== null}
                    />
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  {EmailOTP && (
                    <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                      <label className="font-semibold text-lg w-2/5 mx-5">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                      <label className="font-semibold text-lg w-2/5 mx-5">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                      />
                    </div>
                  )}
                </div>
                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: " rgb(59 130 246)" }}
                  >
                    Save
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: " rgb(59 130 246)" }}
                    onClick={() => update(user)}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 1}>
        {user !== null &&
          user !== undefined &&
          educationalDetail.map((item, index) => {
            return (
              <div
                className=" rounded-md p-5 bg-white border border-gray-400 my-5 h-35"
                key={index}
              >
                <div className="flex justify-end space-x-3 items-center">
                  <RiEditBoxLine
                    className="cursor-pointer"
                    onClick={() => {
                      setEdit(index);
                      setEduInitialValues(item);
                      setShowEduForm(true);
                    }}
                  />
                  <AiOutlineDelete
                    className="text-red-600 cursor-pointer"
                    onClick={async () => {
                      setEducationalDetail(
                        educationalDetail.filter((item, i) => i !== index)
                      );
                      let res = JSON.parse(await localStorage.getItem("user"));
                      res.education = educationalDetail.filter(
                        (item, i) => i !== index
                      );
                      localStorage.setItem("user", JSON.stringify(res));
                    }}
                  />
                </div>
                <p className="font-semibold text-lg w-2/5 mx-5">
                  {item.school}
                </p>
                <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">
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
        <div className="flex mx-auto justify-center text-center">
          <button
            className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
            onClick={async () => {
              await setShowError(true);
             
              await setEduInitialValues({
                school: null,
                degree: null,
                field_of_study: null,
                start_date: null,
                end_date: null,
                grade: null,
                description: null,
              });
              await setShowEduForm(true);
             
            }}
          >
            Add Education
          </button>

          <button
            className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
            style={{ backgroundColor: " rgb(59 130 246)" }}
            onClick={() => update(user)}
          >
            Submit
          </button>
        </div>
        {showEduForm && (
          <Transition
            appear
            show={showEduForm}
            as={Fragment}
            className="relative z-50 w-100"
          >
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => { }}
              static={true}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-3xl px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title>
                      <div className={`${!showEduForm ? "hidden" : "block"}`}>
                        <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-3">
                          Add Education
                        </p>
                        <Formik
                          initialValues={eduinitialValues}
                          validate={(values) => {
                            if (showEduForm === false) return {};
                            const errors = {};
                            if (
                              values.school === null ||
                              values.school.trim() === ""
                            ) {
                              errors.school = "Required !";
                            }
                            if (
                              values.degree === null ||
                              values.degree.trim() === ""
                            ) {
                              errors.degree = "Required !";
                            }
                            if (
                              values.field_of_study === null ||
                              values.field_of_study.trim() === ""
                            ) {
                              errors.field_of_study = "Required !";
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                {/* <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-2/5 mx-5">
                                    Company Name
                                  </label>
                                  <Field
                                    type="text"
                                    name="firstName"
                                    disabled
                                    className="block border-gray-400 py-1 md:w-1/2 w-3/5"
                                  // style={{
                                  //   boxShadow:
                                  //     "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                                  //   border: "none",
                                  // }}
                                  />
                                </div> */}
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">School *</label>
                                  <Field
                                    name="school"
                                    type="text"
                                    placeholder="Ex. Boston University"
                                    className=" block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.school}
                                  />
                                  <ErrorMessage
                                    name="school"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Degree *</label>
                                  <Field
                                    name="degree"
                                    type="text"
                                    placeholder="Ex. Bachelor's"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.degree}
                                  />
                                  <ErrorMessage
                                    name="degree"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Field *</label>
                                  <Field
                                    name="field_of_study"
                                    type="text"
                                    placeholder="Ex. Business"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.field_of_study}
                                  />
                                  <ErrorMessage
                                    name="field_of_study"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="flex  w-full flex-wrap">
                                  <div className=" my-3 flex">
                                    <label className="font-semibold text-lg mx-5">Start Date *</label>
                                    <Field
                                      name="start_date"
                                      type="month"
                                      className="block border-gray-400 py-1 mx-3"
                                      style={{ borderRadius: "10px" }}
                                      value={values.start_date}
                                    />
                                    <ErrorMessage
                                      name="start_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                  <div className=" my-3 flex">
                                    <label className="font-semibold text-lg mx-5">End Date*</label>
                                    <Field
                                      name="end_date"
                                      type="month"
                                      className="block border-gray-400 py-1"
                                      style={{ borderRadius: "10px" }}
                                      value={values.end_date}
                                    />
                                    <ErrorMessage
                                      name="end_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Grade</label>
                                  <Field
                                    name="grade"
                                    type="text"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.grade}
                                  />
                                  <ErrorMessage
                                    name="grade"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Description</label>
                                  <Field
                                    name="description"
                                    type="textarea"
                                    className="block border-gray-400 py-1 w-4/5 border-[0.5px] border-[#6b7280] p-2"
                                    style={{
                                      borderRadius: "10px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.description}
                                  />
                                  <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className=" flex justify-center text-center">
                                  <button
                                    onClick={() => updateEducation(values)}
                                    className="h-8 bg-blue-600 text-white rounded-lg block cursor-pointer px-8 align-middle"
                                  >
                                    {edit === null ? "Add " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className="h-8 border-[0.5px] mx-3 border-red-600 text-red-600 rounded-lg block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      await setShowError(false);
                                      await setShowEduForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 2}>
        <div>
          {user &&
            experienceDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md p-5 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setExInitialValues(item);
                        setShowExForm(true);
                      }}
                    />
                    <AiOutlineDelete
                      className="text-red-600 cursor-pointer"
                      onClick={async () => {
                        setExperienceDetail(
                          experienceDetail.filter((item, i) => i !== index)
                        );
                        let res = JSON.parse(
                          await localStorage.getItem("user")
                        );
                        res.experience = experienceDetail.filter(
                          (item, i) => i !== index
                        );
                        localStorage.setItem("user", JSON.stringify(res));
                      }}
                    />
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">
                      {item.employment_type}
                    </p>{" "}
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

          <div className=" flex justify-center text-center">
            <button
              className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
              onClick={async () => {
                await setShowError(true);
               
                await setExInitialValues({
                  title: null,
            
                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowExForm(true);
              }}
            >
              Add Experience
            </button>

            <button
              className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
              style={{ backgroundColor: " rgb(59 130 246)" }}
              onClick={() => update(user)}
            >
              Submit
            </button>
          </div>
        </div>

        {showExForm && (
          <Transition
            appear
            show={showExForm}
            as={Fragment}
            className="relative z-50"
          >
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => { }}
              static={true}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title>
                      <div className={`${!showExForm ? "hidden" : "block"}`}>
                        <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-3">
                          Add Experience
                        </p>
                        <Formik
                          initialValues={exinitialValues}
                          validate={(values) => {
                            if (showExForm === false) return {};
                            const errors = {};
                            if (!values.title) {
                              errors.title = "Required";
                            }
                            if (!values.employment_type) {
                              errors.employment_type = "Required";
                            }
                            if (!values.company_name) {
                              errors.company_name = "Required";
                            }
                            if (!values.location) {
                              errors.location = "Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "Required !";
                            }
                            if (values.end_date === null) {
                              errors.end_date = "Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (values.start_date > values.end_date) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Title *</label>
                                  <Field
                                    name="title"
                                    type="text"
                                    placeholder="Ex. Manager"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.title}
                                  />
                                  <ErrorMessage
                                    name="title"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Employment Type *</label>
                                  <Field
                                    name="employment_type"
                                    as="select"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                  >
                                    <option value="">Please Select</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Self Employed">
                                      Self Employed
                                    </option>
                                    <option value="Internship">
                                      Internship
                                    </option>
                                    <option value="Free Lancer">
                                      Free Lancer
                                    </option>
                                  </Field>
                                  <ErrorMessage
                                    name="employment_type"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Company *</label>
                                  <Field
                                    name="company_name"
                                    type="text"
                                    placeholder="Ex. Microsoft"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.company_name}
                                  />
                                  <ErrorMessage
                                    name="company_name"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Location *</label>
                                  <Field
                                    name="location"
                                    type="text"
                                    placeholder="Ex. London"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.location}
                                  />
                                  <ErrorMessage
                                    name="location"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="flex md:w-1/2  w-full flex-wrap">
                                  <div className=" my-3 md:w-1/2 flex pr-2">
                                    <label className="font-semibold text-lg mx-5">Start Date *</label>
                                    <Field
                                      name="start_date"
                                      type="month"
                                      className="block border-gray-400 py-1 "
                                      style={{ borderRadius: "10px" }}
                                      value={values.start_date}
                                    />
                                    <ErrorMessage
                                      name="start_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                  <div className=" my-3 md:w-1/2 flex pr-2">
                                    <label className="font-semibold text-lg mx-5">End Date*</label>
                                    <Field
                                      name="end_date"
                                      type="month"
                                      className="block border-gray-400 py-1"
                                      style={{ borderRadius: "10px" }}
                                      value={values.end_date}
                                    />
                                    <ErrorMessage
                                      name="end_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Industry *</label>
                                  <Field
                                    name="industry"
                                    type="text"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.industry}
                                  />
                                  <ErrorMessage
                                    name="industry"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Description</label>
                                  <Field
                                    name="description"
                                    type="textarea"
                                    className="block border-gray-400 py-1 w-4/5 border-[0.5px] border-[#6b7280] p-2"
                                    style={{
                                      borderRadius: "10px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.description}
                                  />
                                  <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="flex flex-wrap flex justify-center text-center">
                                  <button
                                    onClick={() => updateExperience(values)}
                                    className=" bg-blue-600 text-white rounded-sm block cursor-pointer py-2 px-8 align-middle"
                                  >
                                    {edit === null ? "Add " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-red-600 py-2 text-red-600 rounded-sm block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      await setShowError(false);
                                      await setShowExForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 3}>
        <div>
          {user &&
            associateDetail &&
            associateDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md p-5 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setAsInitialValues(item);
                        setShowAsForm(true);
                      }}
                    />
                    <AiOutlineDelete
                      className="text-red-600 cursor-pointer"
                      onClick={async () => {
                        setAssociateDetail(
                          associateDetail.filter((item, i) => i !== index)
                        );
                        let res = JSON.parse(
                          await localStorage.getItem("user")
                        );
                        res.associate = associateDetail.filter(
                          (item, i) => i !== index
                        );
                        localStorage.setItem("user", JSON.stringify(res));
                      }}
                    />
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">{item.location}</p>{" "}
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

          <div className="flex mx-auto justify-center text-center">
            <button
              className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
              onClick={async () => {
                await setShowError(true);
            
                await setAsInitialValues({
                  title: null,
            
                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowAsForm(true);

              }}
            >
              Add Association
            </button>

            <button
              className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
              style={{ backgroundColor: " rgb(59 130 246)" }}
              onClick={() => update(user)}
            >
              Submit
            </button>
          </div>
        </div>

        {showAsForm && (
          <Transition
            appear
            show={showAsForm}
            as={Fragment}
            className="relative z-50"
          >
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => { }}
              static={true}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title>
                      <div className={`${!showAsForm ? "hidden" : "block"}`}>
                        <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-3">
                          Add Association
                        </p>
                        <Formik
                          initialValues={asinitialValues}
                          validate={(values) => {
                            if (showAsForm === false) return {};
                            const errors = {};
                            if (!values.title) {
                              errors.title = "Required";
                            }

                            if (!values.company_name) {
                              errors.company_name = "Required";
                            }
                            if (!values.location) {
                              errors.location = "Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "Required !";
                            }
                            if (values.end_date === null) {
                              errors.end_date = "Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (values.start_date > values.end_date) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Title *</label>
                                  <Field
                                    name="title"
                                    type="text"
                                    placeholder="Ex. Manager"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.title}
                                  />
                                  <ErrorMessage
                                    name="title"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                {/* <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                <label className="font-semibold text-lg w-1/5 mx-5">Employment Type *</label>
                                <Field
                                  name="employment_type"
                                  as="select"
                                  className="block border-gray-400 py-1 w-4/5"
                                  style={{ borderRadius: "10px" }}
                                >
                                  <option value="">Please Select</option>
                                  <option value="Full Time">Full Time</option>
                                  <option value="Part Time">Part Time</option>
                                  <option value="Self Employed">Self Employed</option>
                                  <option value="Internship">Internship</option>
                                  <option value="Free Lancer">Free Lancer</option>
                                </Field>
                                <ErrorMessage
                                  name="employment_type"
                                  component="div"
                                  className="text-sm text-red-600"
                                />
                              </div> */}
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Company *</label>
                                  <Field
                                    name="company_name"
                                    type="text"
                                    placeholder="Ex. Microsoft"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.company_name}
                                  />
                                  <ErrorMessage
                                    name="company_name"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Location *</label>
                                  <Field
                                    name="location"
                                    type="text"
                                    placeholder="Ex. London"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.location}
                                  />
                                  <ErrorMessage
                                    name="location"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="flex md:w-1/2  w-full flex-wrap">
                                  <div className=" my-3 md:w-1/2 flex pr-2">
                                    <label className="font-semibold text-lg mx-5">Start Date *</label>
                                    <Field
                                      name="start_date"
                                      type="month"
                                      className="block border-gray-400 py-1"
                                      style={{ borderRadius: "10px" }}
                                      value={values.start_date}
                                    />
                                    <ErrorMessage
                                      name="start_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                  <div className=" my-3 md:w-1/2 flex pr-2">
                                    <label className="font-semibold text-lg mx-5">End Date*</label>
                                    <Field
                                      name="end_date"
                                      type="month"
                                      className="block border-gray-400 py-1"
                                      style={{ borderRadius: "10px" }}
                                      value={values.end_date}
                                    />
                                    <ErrorMessage
                                      name="end_date"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Industry *</label>
                                  <Field
                                    name="industry"
                                    type="text"
                                    className="block border-gray-400 py-1 w-4/5"
                                    style={{ borderRadius: "10px" }}
                                    value={values.industry}
                                  />
                                  <ErrorMessage
                                    name="industry"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="md:w-1/2  flex w-full  space-y-1 my-3">
                                  <label className="font-semibold text-lg w-1/5 mx-5">Description</label>
                                  <Field
                                    name="description"
                                    type="textarea"
                                    className="block border-gray-400 py-1 w-4/5 border-[0.5px] border-[#6b7280] p-2"
                                    style={{
                                      borderRadius: "10px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.description}
                                  />
                                  <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-sm text-red-600"
                                  />
                                </div>
                                <div className="flex px-5 w-full justify-center text-center">
                                  <button
                                    onClick={() => updateAssociation(values)}
                                    className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 align-middle"
                                  >
                                    {edit === null ? "Add " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className="h-8 border-[0.5px] mx-3 border-red-600 text-red-600 rounded-sm block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      await setShowError(false);
                                      await setShowAsForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index !== 4}>
        {user !== null && user !== undefined && (
          <div>
            <label className="font-semibold text-lg w-2/5 mx-5">Skills</label>
            <div className="my-3 px-4 flex items-center flex-wrap">
              <input
                type="text"
                className="w-3/4 text-600 border-[0.5px] border-[#6b7280] p-2"
                placeholder="Search Skill..."
                ref={inputSkillRef}
                onChange={async () => {
                  let role = new Set([]);
                  if (
                    inputSkillRef.current.value.trim() !== "" ||
                    !inputSkillRef ||
                    !inputSkillRef.current.value
                  ) {
                    dbSkills.forEach((el) => {
                      if (
                        el.role
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      } else if (
                        el.primarySkill
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      } else if (
                        el.secondarySkill
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      }
                    });
                    await setShowRoles(Array.from(role));
                  } else {
                    await setShowRoles(roles);
                  }
                }}
              />
              <button className="h-10 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 align-middle ml-3">
                Search
              </button>
            </div>
            <div className="md:w-1/2  flex w-full  space-y-1 my-3">

              <div className="w-full">
                {showRoles &&
                  showRoles.map((el, index) => {
                    return (
                      <div key={index}>
                        <Disclosure>
                          {({ open }) => (
                            <div className={`${open ? "shadow-md":""}`}>
                              <Disclosure.Button className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg ":""}`}>
                                <span>{el}</span>
                                <ChevronUpIcon
                                  className={`${!open ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="p-3 px-4">
                                {primarySkills[el].map((skill, index) => {
                                  return (
                                    <div>
                                      <Disclosure>
                                        {({ open }) => (
                                          <div className={`${open ? "shadow-md":""}`}>
                                            <Disclosure.Button className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg":""} `}>
                                              <span>{skill}</span>
                                              <ChevronUpIcon
                                                className={`${!open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                  } h-5 w-5 text-blue-500`}
                                              />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="p-3 px-12">
                                              {dbSkills
                                                .filter((secSkill) => {
                                                  return (
                                                    secSkill.primarySkill ===
                                                    skill &&
                                                    secSkill.role === el
                                                  );
                                                })
                                                .map((secSkill, index) => {
                                                  let d = dbSkills;
                                                  let index1 = d.findIndex(
                                                    (el) => {
                                                      return el === secSkill;
                                                    }
                                                  );
                                                  return (
                                                    <div className="flex my-2 text-sm justify-between items-center px-3">
                                                      <p>
                                                        {
                                                          secSkill.secondarySkill
                                                        }
                                                      </p>

                                                      <div className="flex items-center space-x-2">
                                                        <p>0</p>
                                                        <input
                                                          type="range"
                                                          min="0"
                                                          max="5"
                                                          value={prof[index1]}
                                                          onChange={async (
                                                            e
                                                          ) => {
                                                            let d = dbSkills;
                                                            d[index1] = {
                                                              ...d[index1],
                                                              proficiency:
                                                                e.target.value,
                                                            };
                                                            let p = prof;
                                                            prof[index1] =
                                                              e.target.value;
                                                            await localStorage.setItem(
                                                              "prof",
                                                              JSON.stringify(p)
                                                            );
                                                            await setProf([
                                                              ...p,
                                                            ]);
                                                            await setDbSkills([
                                                              ...d,
                                                            ]);
                                                            if (
                                                              e.target.value > 0
                                                            ) {
                                                              let u = user;
                                                              let to = u.tools;
                                                              to.push({
                                                                proficiency:
                                                                  e.target
                                                                    .value,
                                                                ...secSkill,
                                                              });
                                                              u.tools = to;
                                                              await setUser({
                                                                ...u,
                                                              });
                                                            }
                                                          }}
                                                        />
                                                        <p>5</p>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                            </Disclosure.Panel>
                                          </div>
                                        )}
                                      </Disclosure>
                                    </div>
                                  );
                                })}
                              </Disclosure.Panel>
                            </div>
                          )}
                        </Disclosure>
                      </div>
                    );
                  })}
              </div>
            </div>
            {/*   <div className="md:w-1/2  flex w-full  space-y-1 my-3">
            <input
              className="w-4/5 text-600 md:w-1/2  flex w-full  space-y-1 my-3 mr-3"
              style={{ borderRadius: "10px" }}
              type="text"
              ref={inputRef}

              onChange={() => {
                if (inputRef.current) {
                  const res = tools.findIndex((el) => {
                    return (
                      el.toLowerCase() === inputRef.current.value.toLowerCase()
                    );
                  });
                  if (res !== -1) {
                    setDisabled(true);
                    setError("Already added");
                  } else {
                    setDisabled(false);
                    setError(null);
                  }
                }
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && disabled === false) {
                  if (inputRef.current) {
                    if (inputRef.current.value !== "") {
                      let t = user.tools;
                      await setTools([...user.tools, inputRef.current.value]);
                      t.push(inputRef.current.value);
                      console.log(t);
                      inputRef.current.value = "";
                      let res = await localStorage.getItem("user");
                      res = JSON.parse(res);
                      res.tools = t;
                      setUser(res);
                      await localStorage.setItem(
                        "user",
                        JSON.stringify(res)
                      );
                      setError(null);
                    }
                  }
                }
              }}
            />
            <button
              type="button"
              className="bg-blue-600 rounded-sm text-white  py-2 px-3"
              disabled={disabled}
              onClick={async () => {
                if (inputRef.current && inputRef.current.value !== "") {
                  let t = user.tools;
                  await setTools([...user.tools, inputRef.current.value]);
                  t.push(inputRef.current.value);
                  inputRef.current.value = "";
                  let res = await localStorage.getItem("user");
                  res = JSON.parse(res);
                  res.tools = t;
                  setUser(res);
                  await localStorage.setItem(
                    "user",
                    JSON.stringify(res)
                  );
                  setError(null);
                }
              }}
            >
              Add
            </button>
            {error && <p className="text-sm text-red-500 mb-5">{error}</p>} */}

            <div className="p-5">
              {rolesC
                ? rolesC.map((item, index) => {
                  return (
                    <div>
                      <p className="font-semibold text-md md:w-1/2  flex w-full  space-y-1 my-3">{item}</p>
                      {skillsPrimary[item].map((el) => (
                        <div>
                          <p className="text-sm my-2">{el}</p>
                          {user.tools
                            .filter(
                              (tool) =>
                                tool.role === item && tool.primarySkill === el
                            )
                            .map((item1, index) => (
                              <span class="bg-blue-100 text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                {item1.secondarySkill}{" "}
                                {item1.proficiency &&
                                  `(${item1.proficiency})`}
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
        )}

        <div className="md:w-1/2  flex w-full  space-y-1 my-3">
          <label className="font-semibold text-lg w-2/5 my-4">Resume</label>
          {/* <input type="file" value={user.resume} /> */}
        </div>

        <button
          className="bg-blue-500 px-2 mx-2 py-1 text-white rounded-sm my-5"
          style={{ backgroundColor: " rgb(59 130 246)" }}
          onClick={() => update(user)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
