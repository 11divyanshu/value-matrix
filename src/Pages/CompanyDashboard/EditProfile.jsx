import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Components And API services
import {
  getProfileImage,
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
} from "../../service/api";
import ReactCropper from "../UserDashboard/ReactCrop";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
import Tabs from "../../Components/CompanyDashboard/EditTabs";

const EditCompanyProfile = () => {
  // Sets OTPs to NULL
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

  // Form Edit Submission
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
  //   update(values);
  // };

  // const SendOTPFunction = async (values) => {
  //   let wait = 0;
  //   if (values.email !== user.email) {
  //     let emailValidate = await validateSignupDetails({email : values.email});
  //     if(emailValidate.data.email === true){
  //       setError("Email Already Registered");
  //       return 1;
  //     }
  //     let res = await updateEmailOTP(
  //       { mail: values.email },
  //       { access_token: access_token }
  //     );
  //     if (res.otp) {
  //       setEmailOTP(res.otp);
  //       wait = 1;
  //     } else if (res.Error) {
  //       setError(res.Error);
  //     }
  //   }
  //   if (values.contact !== user.contact) {
  //     let contactValidate = await validateSignupDetails({contact : values.contact});
  //     if(contactValidate.data.contact === true){
  //       setError("Contact Already Registered");
  //       return 1;
  //     }
  //     let res2 = await updateContactOTP(
  //       { contact: values.contact },
  //       { access_token: access_token }
  //     );
  //     if (res2.otp) {
  //       setContactOTP(res2.otp);
  //       wait = 1;
  //     } else if (res2.Error) {
  //       setError(res2.Error);
  //     }
  //   }
  //   console.log(wait);
  //   return wait;
  // };

  // const update = async (values) => {

  //   let data = {
  //     firstName: values.firstName,
  //     lastname: values.lastName,
  //     about: values.about,
  //   };
  //   if (EmailOTP) {
  //     data.email = values.email;
  //   }
  //   if (ContactOTP) {
  //     data.contact = values.contact;
  //   }

  //   let res = await updateUserDetails(
  //     { user_id: user._id, updates: data },
  //     { access_token: access_token }
  //   );

  //   if (res.data.Error) {
  //     if (res.data.contact) {
  //       setError(res.data.Error);
  //       return;
  //     }
  //     if (res.data.email) {
  //       setError(res.data.Error);
  //       return;
  //     }
  //   } else if (res) {
  //     await localStorage.setItem("user", JSON.stringify(res.data.user));
  //     window.location.href = "/company/profile";
  //   } else {
  //     console.log("Error");
  //   }
  // };

  // Sets User And Access_token
  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let user1 = await getProfileImage({id: user._id}, user.access_token);
      console.log(user1.data);
      if (access_token1 === "null")
        await localStorage.setItem("access_token", user.access_token);
      if (user && user.profileImg) {
        let image = await getProfileImage({id: user._id}, user.access_token);
          await localStorage.setItem("profileImg", JSON.stringify(image));
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data.Image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfilePic(src);
      }
      setUser(user);
      setToken(access_token1);
    };
    initial();
  }, []);

  return (
    <div className="p-5 bg-slate-100">
      {user !== null && (
        <div className="m-5">
          <div className="h-48 w-full relative" style={{ background: "#99DEFF" }}>

          </div>
          <div className="relative  rounded-md w-full py-3 md:flex items-center ">
          <div className="absolute  sm:left-6 sm:px-2 -top-20 md:-top-28 md:left-20 ">
                        <img
                          src={
                             user && user.profileImg && ProfilePic ? ProfilePic : Avatar
                           }
                          //src={Avatar}
                          className="sm:h-20 sm:w-20 md:h-56 md:w-56 rounded-full"
                          alt="userAvatar"
                        />
                      </div>
                      <div className="mt-24 md:ml-80 md:px-5 md:mt-3  sm:mx-5 md:text-left">
              <p className="font-semibold md:text-3xl text-2xl ">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className=" mt-3 md:text-right  md:ml-auto sm:text-left ">
              <label>
                <button
                      style={{backgroundColor:"#034488"}}


                 class=" hover:bg-blue-700 text-white text-sm font-bold py-2 px-8 rounded"
                  onClick={() => ModalBtnRef.current.click()}
                >
                  Upload Logo
                </button>
              </label>
            </div>
          </div>

          <div className="my-7 rounded-md w-full  pt-3">

            {/* <Formik
              initialValues={{
                firstName: user.firstName,
                email: user.email ? user.email : " ",
                contact: user.contact ? user.contact : " ",
                emailOTP: "",
                contactOTP: "",
                about: "",
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
              onSubmit={(values) => submit(values)}
            >
              {({ values }) => (
                <Form>
                  {Error && <p className="text-sm text-red-500">{Error}</p>}
                  <p className="my-3">
                    <span className="font-semibold">Company Username :</span>{" "}
                    {user.username}{" "}
                  </p>
                  <div className="flex flex-wrap w-full gap-y-5">
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Company Name</label>
                      <Field
                        type="text"
                        name="firstName"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">About</label>
                      <Field
                        as="textarea"
                        className="block  py-1 md:w-1/2 w-3/4 h-20"
                        name="about"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    {EmailOTP && (
                      <div className="md:w-1/2 w-full space-y-1">
                        <label className="font-semibold">Email OTP</label>
                        <Field
                          name="emailOTP"
                          type="text"
                          className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        />
                      </div>
                    )}
                    {ContactOTP && (
                      <div className="md:w-1/2 w-full space-y-1">
                        <label className="font-semibold">Contact OTP</label>
                        <Field
                          name="contactOTP"
                          type="text"
                          className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <button
                      type="submit"
                      className="bg-blue-500 px-2 py-1 text-white rounded-sm my-5"
                      style={{ backgroundColor: " rgb(59 130 246)" }}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik> */}
            <Tabs />
          </div>
        </div>
      )}

      {/* Modal For Cropping Image */}
      <button
        type="button"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out hidden"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ModalBtnRef}
      >
        Launch static backdrop modal
      </button>
      <div
        class="modal fade fixed ml-[25vw] top-0  hidden h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered relative w-[40vw] pointer-events-none my-24 ">
          <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                class="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Update Profile Image
              </h5>
            </div>
            <div class="modal-body relative p-4">
              <ReactCropper Modal={ModalRef} />
            </div>
          </div>
          <button
            type="button"
            class="hidden px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            data-bs-dismiss="modal"
            ref={ModalRef}
          >
            Close
          </button>
        </div>
      </div>
      {/* Modal For Cropping Image */}
    </div>
  );
};

export default EditCompanyProfile;
