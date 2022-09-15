import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { IoSchoolOutline } from "react-icons/io5";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

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
  const [rolesProf, setRolesProf] = React.useState([]);
  const [dbCopy, setDbCopy] = React.useState([]);

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
  const [error, setFormError] = React.useState(false);
  const [aserror, setAsFormError] = React.useState(false);
  const [exerror, setExFormError] = React.useState(false);
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
    console.log(error);
    if (!error) {
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
    } else {
      swal({
        icon: "error",
        title: "EditProfile",
        text: "Incorrect Details",
        button: "Continue",
      });
    }
  };

  const updateExperience = async (values) => {
    if (!exerror) {
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
    } else {
      swal({
        icon: "error",
        title: "EditProfile",
        text: "Incorrect Details",
        button: "Continue",
      });
    }
  };

  const updateAssociation = async (values) => {
    if (!aserror) {
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
    } else {
      swal({
        icon: "error",
        title: "EditProfile",
        text: "Incorrect Details",
        button: "Continue",
      });
    }
  };

  const save = async (values) => {
    console.log(values);
    let wait = 0;
    if (values.firstName) {
      if (EmailOTP === null && ContactOTP === null)
        wait = await SendOTPFunction(values);
      if (wait !== 0) return;
      console.log("values");
      if (EmailOTP && ContactOTP) {
        if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
          setError("Invalid Email OTP and Contact OTP");
          return;
        }
      }
      
      if (EmailOTP && values.emailOTP !== EmailOTP) {
        setError("Invalid Email OTP");
        return;
      }
      
      if (ContactOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Contact OTP");
        return;
      }
      let user = JSON.parse(localStorage.getItem("user"));
      user.username = values.username;
      user.firstName = values.firstName;
      user.lastname = values.lastName;
      user.address = values.address;
      user.contact = values.contact;
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
      let pr1 = JSON.parse(await localStorage.getItem("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }
        await setDbCopy(res.data);
        await setRolesProf(pr1);
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
    let skills = [];
    
    dbSkills.forEach((el,index)=>{
      if(prof[index]>0){
        el.proficiency = prof[index];
        skills.push(el);
      }
    })
    
    let data = {
      firstName: ed.firstName,
      lastname: ed.lastName,
      address: ed.address,
      experience: ed.experience,
      username: ed.username,
      associate: ed.associate,
      education: ed.education,
      tools: skills,
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
      await localStorage.removeItem("prof");
      await localStorage.removeItem("RolesProf");
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
        await setProfilePic(src);
      }
      console.log(user);
      await setUser(user);
      await setToken(access_token1);
    };
    initial();
  }, []);

  return (
    <div className="Tabs w-full mt-3">
      <div className="tabList flex w-full">
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
          <p className="md:visible hidden content">Skills</p>
          <p className="icons hidden">
            <AiOutlineUnorderedList />
          </p>
        </div>
      </div>
      <div className="tabContent bg-white  w-full p-5" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: user.firstName,
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
              emailOTP: "",
              contactOTP: "",
              address: user.address,
            }}
            onSubmit={(values) => save(values)}
            validate={async (values) => {
              const errors = {};
              if (values.username !== user.username) {
                let check = await validateSignupDetails({
                  username: values.username,
                });
                console.log(check);
                if (check.data.username) {
                  errors.username = "Username already exists";
                }
              }
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
          >
            {({ values }) => (
              <Form>
                {/* <p className="md:w-1/2  flex w-full  space-y-1 my-5">
                <span className="font-semibold text-lg w-2/5 mx-2"> Username :</span>{" "}
                {user.username}{" "}
              </p> */}

                <div className="flex flex-wrap mt-2 w-full gap-y-5">
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Username
                    </label>
                    <div className="w-4/5">
                      <Field
                        type="text"
                        name="username"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Name
                    </label>
                    <div className="w-4/5">
                      <Field
                        type="text"
                        name="firstName"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Address
                    </label>
                    <div className="w-4/5">
                      <Field
                        type="text"
                        name="address"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Email
                    </label>
                    <div className="w-4/5">
                      <Field
                        name="email"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Contact
                    </label>
                    <div className="w-4/5">
                      <Field
                        name="contact"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  {EmailOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Connect Social Account
                    </label>
                    <div className="w-4/5 flex items-center px-4">
                      {user && !user.linkedInId && (
                        <a href={`${url}/auth/linkedin`} target="_blank">
                          <img
                            src={Linkedin}
                            className="h-5 ml-1"
                            alt="socialauthLinkedIn"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                  {Error && <p className="text-sm text-red-500">{Error}</p>}
                </div>

                <div className="w-full text-center">
                  <button
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#034488" }}
                    type="submit"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#034488" }}
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
                className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 w-full "
                key={index}
              >
                <div className="flex justify-end space-x-3 items-center">
                  {/* <RiEditBoxLine
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
                  /> */}
                </div>
                <p className="font-semibold text-md md:w-2/5 ">{item.school}</p>
                <div className="md:flex flex-wrap justify-between w-full  text-gray-800 ">
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
                      {item.start_date} - {item.end_date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        setEdit(index);
                        setEduInitialValues(item);
                        setShowEduForm(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        <div className="flex mx-auto justify-center text-center">
          <button
            className=" py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
            style={{ backgroundColor: "#034488" }}
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
            className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
            style={{ backgroundColor: "#034488" }}
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
            className="relative z-1050 w-full"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-1050 w-5/6"
              onClose={() => {}}
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

              <div className="fixed inset-0 overflow-y-auto ">
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                      <div className={`${!showEduForm ? "hidden" : "block"}`}>
                        {/* <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-5">
                          Add Education
                        </p> */}
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
                            if (values.grade === null) {
                              errors.grade = "Required !";
                            }
                            console.log(errors);
                            if (
                              errors.degree ||
                              errors.field_of_study ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.grade
                            ) {
                              setFormError(true);
                            } else {
                              setFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    School{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="school"
                                      type="text"
                                      placeholder="Ex. Boston University"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.school}
                                    />
                                    <ErrorMessage
                                      name="school"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Degree{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="degree"
                                      type="text"
                                      placeholder="Ex. Bachelor's"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.degree}
                                    />
                                    <ErrorMessage
                                      name="degree"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Field{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="field_of_study"
                                      type="text"
                                      placeholder="Ex. Business"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.field_of_study}
                                    />
                                    <ErrorMessage
                                      name="field_of_study"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Work Period{" "}
                                  </label>

                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div className="">
                                        <Field
                                          name="end_date"
                                          type="month"
                                          className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.end_date}
                                        />
                                        <ErrorMessage
                                          name="end_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Grade
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="grade"
                                      type="text"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.grade}
                                    />
                                    <ErrorMessage
                                      name="grade"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-2 w-full h-20 border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
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
                                </div>
                                <div className=" flex justify-center mt-4 text-center">
                                  <button
                                    onClick={() => updateEducation(values)}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
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
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
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
                    /> */}
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">
                      {item.employment_type}
                    </p>{" "}
                  </div>
                  <div className="md:flex flex-wrap justify-between w-full py-1 text-gray-800 ">
                    <div className="space-x-2 my-2 flex items-center">
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
                        {item.start_date} - {item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setEdit(index);
                          setExInitialValues(item);
                          setShowExForm(true);
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

          <div className=" flex justify-center text-center">
            <button
              className="  py-2 text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
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
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#034488" }}
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
            className="relative z-10000"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10000"
              onClose={() => {}}
              static={true}
            >
              <div
                className="fixed inset-0 bg-black/30 z-10000"
                aria-hidden="true"
              />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25 z-10000" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto z-10000">
                <div className="flex min-h-full items-center justify-center z-10000 p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                      {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                      <div className={`${!showExForm ? "hidden" : "block"}`}>
                        {/* <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-5">
                          Add Experience
                        </p> */}
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

                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location
                            ) {
                              setExFormError(true);
                            } else {
                              setExFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Title{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="title"
                                      type="text"
                                      placeholder="Ex. Manager"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.title}
                                    />
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5  md:flex   space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Employment Type{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="employment_type"
                                      as="select"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                    >
                                      <option value="">Please Select</option>
                                      <option value="Full Time">
                                        Full Time
                                      </option>
                                      <option value="Part Time">
                                        Part Time
                                      </option>
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
                                </div>
                                <div className=" md:w-4/5  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Company{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="company_name"
                                      type="text"
                                      placeholder="Ex. Microsoft"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.company_name}
                                    />
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Location{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="location"
                                      type="text"
                                      placeholder="Ex. London"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.location}
                                    />
                                    <ErrorMessage
                                      name="location"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div className="">
                                        <Field
                                          name="end_date"
                                          type="month"
                                          className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.end_date}
                                        />
                                        <ErrorMessage
                                          name="end_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="  md:flex w-full md:w-4/5  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Industry{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="industry"
                                      type="text"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.industry}
                                    />
                                    <ErrorMessage
                                      name="industry"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5  md:flex   space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
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
                                </div>
                                <div className="flex flex-wrap flex justify-center text-center">
                                  <button
                                    onClick={() => updateExperience(values)}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
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
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    {/* <RiEditBoxLine
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
                    /> */}
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">{item.location}</p>{" "}
                  </div>
                  <div className="md:flex flex-wrap justify-between w-full py-1 text-gray-800 ">
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
                        {item.start_date} - {item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        class=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setEdit(index);
                          setAsInitialValues(item);
                          setShowAsForm(true);
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

          <div className="flex mx-auto justify-center text-center">
            <button
              className="py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
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
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#034488" }}
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
            className="relative z-10000"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10000"
              onClose={() => {}}
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
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                      {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                      <div className={`${!showAsForm ? "hidden" : "block"}`}>
                        {/* <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-5">
                          Add Association
                        </p> */}
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
                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location
                            ) {
                              setAsFormError(true);
                            } else {
                              setAsFormError(false);
                            }
                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Title{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="title"
                                      type="text"
                                      placeholder="Ex. Manager"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.title}
                                    />
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>

                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Company{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="company_name"
                                      type="text"
                                      placeholder="Ex. Microsoft"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.company_name}
                                    />
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5 md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Location{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="location"
                                      type="text"
                                      placeholder="Ex. London"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.location}
                                    />
                                    <ErrorMessage
                                      name="location"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div className="">
                                        <Field
                                          name="end_date"
                                          type="month"
                                          className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.end_date}
                                        />
                                        <ErrorMessage
                                          name="end_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Industry{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="industry"
                                      type="text"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.industry}
                                    />
                                    <ErrorMessage
                                      name="industry"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
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
                                </div>
                                <div className="flex px-5 w-full justify-center text-center">
                                  <button
                                    onClick={() => updateAssociation(values)}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
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
            <label className="font-semibold text-lg w-2/5 mx-2">Skills</label>
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
              <button
                className="h-10 bg-blue-600 text-white rounded-lg block cursor-pointer px-8 align-middle ml-3"
                style={{ backgroundColor: "#034488" }}
              >
                Search
              </button>
            </div>
            <div className="md:w-1/2  flex w-full  space-y-1 my-5">
              <div className="w-full">
                {showRoles &&
                  showRoles.map((el, index) => {
                    return (
                      <div key={index}>
                        <Disclosure>
                          {({ open }) => (
                            <div className={`${open ? "shadow-md" : ""}`}>
                              <Disclosure.Button
                                className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                  open ? "shadow-lg " : ""
                                }`}
                              >
                                <span>{el}</span>
                                <div className="ml-auto mr-5 flex items-center space-x-2">
                                  <p>0</p>
                                  <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={rolesProf[index]}
                                    onChange={(e) => {
                                      console.log(dbSkills);
                                      dbSkills.forEach((skill) => {
                                        if (skill.role === el) {
                                          skill.proficiency = e.target.value;
                                          let inde = dbSkills.findIndex(
                                            (el) => {
                                              return el === skill;
                                            }
                                          );
                                          let p = prof;
                                          p[inde] = e.target.value;
                                          setProf(p);
                                          skill.rating = e.target.value;
                                        }
                                      });
                                      console.log(dbSkills);
                                      let rp = rolesProf;
                                      rp[index] = e.target.value;
                                      setRolesProf(rp);
                                      localStorage.setItem(
                                        "RolesProf",
                                        JSON.stringify(rolesProf)
                                      );
                                    }}
                                  />
                                  <p>5</p>
                                </div>
                                <ChevronUpIcon
                                  className={`${
                                    !open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="p-3 px-4">
                                {primarySkills[el].map((skill, index) => {
                                  return (
                                    <div>
                                      <Disclosure>
                                        {({ open }) => (
                                          <div
                                            className={`${
                                              open ? "shadow-md" : ""
                                            }`}
                                          >
                                            <Disclosure.Button
                                              className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                                open ? "shadow-lg" : ""
                                              } `}
                                            >
                                              <span>{skill}</span>
                                              <ChevronUpIcon
                                                className={`${
                                                  !open
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
                                                    <div className="flex my-2 text-sm justify-between items-center px-3 py-1">
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
                                                        <p className="text-xs font-italics">
                                                          {prof[index1] > 0
                                                            ? "Self-assetsted"
                                                            : "Unassested"}
                                                        </p>
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

            <div className="p-5">
              {rolesC
                ? rolesC.map((item, index) => {
                    return (
                      <div>
                        <p className="font-semibold text-md md:w-1/2  flex w-full  space-y-2 my-5">
                          {item}
                        </p>
                        {skillsPrimary[item].map((el) => (
                          <div>
                            <p className="text-sm my-2">{el}</p>
                            <div className="flex flex-wrap">
                            {user.tools
                              .filter(
                                (tool) =>
                                  tool.role === item && tool.primarySkill === el
                              )
                              .map((item1, index) => (
                                <p class="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                  {item1.secondarySkill}{" "}
                                  {item1.proficiency &&
                                    `(${item1.proficiency})`}
                                </p>
                              ))}
                          </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                : "No Skills"}
            </div>
          </div>
        )}

        <div className="md:w-1/2  flex w-full  space-y-1 my-5">
          <label className="font-semibold text-lg w-2/5 my-4">Resume</label>
          {/* <input type="file" value={user.resume} /> */}
        </div>

        <button
          className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
          style={{ backgroundColor: "#034488" }}
          onClick={() => update(user)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
