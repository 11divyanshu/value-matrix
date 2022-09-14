import React from "react";

import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
// Assets

import "react-multi-carousel/lib/styles.css";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  fetchCountry,
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop";
import { AiOutlineHome,AiOutlineUser ,AiOutlineFolderAdd} from "react-icons/ai";
import { RiBillLine} from "react-icons/ri";

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
  const [aboutDetail, setAboutDetail] = React.useState([]);
  const [billingDetail, setBillingDetail] = React.useState([]);
  const [country, setCountry] = React.useState([]);
  const [error, setFormError] = React.useState(false);
  const [conerror, setConError] = React.useState(false);

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("user"));

      setUser(e);
      if (e === null) return null;
      let ed = e.desc;
      console.log(ed);
      if (ed !== "null" || ed !== null) {
        setAboutDetail(ed);
      }
      if (aboutDetail === null) {
        setAboutDetail([]);
      }

      let eb = e.billing;
      console.log(ed);
      if (eb !== "null" || eb !== null) {
        setBillingDetail(ed);
      }
      if (aboutDetail === null) {
        setBillingDetail([]);
      }

      const res = await fetchCountry();
      // console.log(res.data.countries[0].country);
      setCountry(res.data.countries[0].country);
      // console.log(country)
    };
    initial();
  }, []);

  const save = async (values) => {
    console.log(values);

    if (values.firstName) {
      if(!conerror){

      
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
      })}else{
        swal({
          icon: "error",
          title: "EditProfile",
          text: "Incorrect Details",
          button: "Continue",
        });
      }
    }

    if (values.about) {
      let e = JSON.parse(await localStorage.getItem("user"));
      const temp = [...user.desc];
      temp[0] = values;
      console.log(temp);
      e.desc = temp;
      setUser(e);
      // update(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setAboutDetail(temp);
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

    if (values.gst || values.pan) {
      if(!error){

     
      let e = JSON.parse(await localStorage.getItem("user"));
      const temp = [...user.billing];
      temp[0] = values;
      console.log(temp);
      e.billing = temp;
      setUser(e);
      // update(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setBillingDetail(temp);
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }else{
      swal({
        icon: "error",
        title: "EditProfile",
        text: "Incorrect Details",
        button: "Continue",
      });
    }
    }
  };

  const submit = async (values) => {
    console.log("values");
    let wait = 0;
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
    console.log("values");
    if (EmailOTP && values.emailOTP !== EmailOTP) {
      setError("Invalid Email OTP");
      return;
    }
    console.log("values");
    if (ContactOTP && values.contactOTP !== ContactOTP) {
      setError("Invalid Contact OTP");
      return;
    }
    console.log("values");
    update(user);
  };

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

  const update = async (ed) => {
    console.log(ed);

    let data = {
      firstName: ed.firstName,
      lastname: ed.lastName,
      address: ed.address,
      desc: ed.desc,
      billing: ed.billing,
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
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Updated Succesfully",
        button: "Continue",
      }).then(async () => {
        await localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/company/profile";
      });
    } else {
      console.log("Error");
    }
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
      <div className={`tabHead ${index === 0 && 'active'}`} onClick={() => { setIndex(0) }}> 
        <p className="md:visible hidden content">Contact</p><p className="icons hidden"><AiOutlineHome/></p>
</div>
        <div className={`tabHead ${index === 1 && 'active'}`} onClick={() => { setIndex(1) }}><p className="md:visible hidden content">About</p><p className="icons hidden"><AiOutlineUser/></p>
</div>
        <div className={`tabHead ${index === 2 && 'active'}`} onClick={() => { setIndex(2) }}> <p className="md:visible hidden content">Billing Details</p><p className="icons hidden"><RiBillLine/></p>
</div>
      </div>
      <div className="tabContent bg-white w-full p-5" hidden={index != 0}>
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
              if(errors.firstName || errors.email || errors.contact){
                setConError(true);
              }
              else{
                setConError(false);
              }
              return errors;
            }}
            // onSubmit={(values) => submit(values)}
          >
            {({ values }) => (
              <Form>
                {Error && <p className="text-sm text-red-500">{Error}</p>}
                {/* <p className="my-3">
                  <span className="font-semibold">Company Username :</span>{" "}
                  {user.username}{" "}
                </p> */}
                <div className="flex flex-wrap w-full gap-y-5">
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Address
                    </label>
                    <Field
                      type="text"
                      name="address"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      disabled={EmailOTP !== null || ContactOTP !== null}
                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Contact
                    </label>
                    <Field
                      name="contact"
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      disabled={EmailOTP !== null || ContactOTP !== null}
                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  {EmailOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-5">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                        style={{ borderRadius: "5px" }}
                        // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-5">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                        style={{ borderRadius: "5px" }}
                        // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                      />
                    </div>
                  )}
                </div>
                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1  text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Save
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
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
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              about: user.desc[0] ? user.desc[0].about : " ",
              motto: user.desc[0] ? user.desc[0].motto : " ",
              industry: user.desc[0] ? user.desc[0].industry : " ",
              found: user.desc[0] ? user.desc[0].found : " ",
              website: user.desc[0] ? user.desc[0].website : " ",
              company_size: user.desc[0] ? user.desc[0].company_size : "",
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <div className="flex flex-wrap w-full gap-y-5">
                  <div className="md:mx-2 my-3 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Overview
                    </label>
                    <Field
                      type="textarea"
                      className="block md:w-3/4 w-full py-2 px-4"
                      style={{
                        borderRadius: "5px",
                        border: "rgb(156 163 175) solid 0.5px",
                      }}
                      name="about"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Motto
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="motto"

                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Website
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="website"

                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Industry
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="industry"

                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Size
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="company_size"

                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Founded on
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="found"

                      // style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", border: "none" }}
                    />
                  </div>
                </div>
                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
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
      <div className="tabContent bg-white p-5" hidden={index != 2}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              gst: user.billing[0] ? user.billing[0].gst : "",
              pan: user.billing[0] ? user.billing[0].pan : "",
              location: user.billing[0] ? user.billing[0].location : "",
            }}

            validate={(values) => {
              const errors = {};
              if (
                !/^[0-9]{8}$/.test(
                  values.pan
                )
              ) {
                errors.pan = "Invalid Pan Number";
              }

              if(errors.pan){
                setFormError(true);
              }
              else{
                setFormError(false);
              }
              return errors;
            
            
            
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <div className="flex flex-wrap w-full gap-y-5">
                  {/* <hr />
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                  <label className="font-semibold text-lg md:md:w-2/5 mx-5">Country</label>
           <Field
             component="select"
             id="location"
             name="location"
             className="block border-gray-100 rounded-lg py-1 md:w-3/4 w-full"
             multiple={false}
           >
             <option value="NY">India</option>
             <option value="NY">New Zealand</option>
             <option value="SF">USA</option>
             <option value="CH">UK</option>
             <option value="OTHER">Other</option>
           </Field>
           </div> */}
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1 -space-x-3">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Tax ID.
                    </label>
                    <div className='shadow-sm border-gray-10 md:w-4/5  flex py-2' >
                      <Field
                        component="select"
                        id="location"
                        name="location"
                        className="block border-gray-100 py-1 w-1/6"
                        style={{
                          borderRadius: "5px 0 0 5px",
                          border: "solid 0.5px rgb(156 163 175)",
                        }}
                        multiple={false}
                      >
                        {country &&
                          country.map((item) => {
                            return (
                              <option value={item.code}>{item.name}</option>
                            );
                          })}
                      </Field>

                      <Field
                        type="text"
                        className="block border-gray-100  py-2 w-5/6"
                        name="gst"
                        style={{
                          borderRadius: " 0 5px 5px 0",
                          border: "solid 0.5px rgb(156 163 175)",
                        }}

                        // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}
                      ></Field>
                      
                  </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      PAN
                    </label>
                    <div className="py-1 md:w-3/5 sm:w-4/5">
                    <Field
                      type="text"
                      className="block border-gray-400 w-full py-1  "
                      name="pan"

                      // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}
                    /> <ErrorMessage
                    name="pan"
                    component="div"
                    className="text-sm text-red-600"
                  />
                  </div>
                  
                  </div>
                </div>

                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
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
    </div>
  );
}
