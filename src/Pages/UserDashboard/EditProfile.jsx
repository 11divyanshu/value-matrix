import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";

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
import EditTabs from "../../Components/Dashbaord/EditTabs"

const EditProfile = () => {
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
  const submit = async (values) => {
    let wait = 0;
    console.log("values");
    if (EmailOTP === null && ContactOTP === null)
      wait = await SendOTPFunction(values);
    if (wait) return;
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

    update(values);
  };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({email : values.email});
      if(emailValidate.data.email === true){
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
      let contactValidate = await validateSignupDetails({contact : values.contact});
      if(contactValidate.data.contact === true){
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
    return wait;
  };

  const update = async (values) => {
    let data = {
      firstName: values.firstName,
      lastname: values.lastName,
      about : values.about
    };
    if (EmailOTP) {
      data.email = values.email;
    }
    if (ContactOTP) {
      data.contact = values.contact;
    }
    console.log(user, data);
    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );
if(res.data.user){
      await localStorage.setItem("user", JSON.stringify(res.data.user));
}
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
      window.location.href = "/user/profile";
    } else {
      console.log("Error");
    }
  };

  // Sets User And Access_token
  React.useEffect(() => {
    const getData = async () => {
      let access_token1 =await localStorage.getItem("access_token");
      let user =await  JSON.parse(localStorage.getItem("user"));
      await setUser(user);
      await setToken(access_token1);
      if(access_token1 === "null")
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
    };
    getData();
  }, []);

  return (
    <div className="p-5 bg-slate-100">
      <p className="text-2xl mx-4 font-bold">Edit Profile</p>
      {user !== null && (
        <div className="m-2">
          <div className="h-48 w-full relative" style={{ background: "#99DEFF" }}>

          </div>
          <div className="relative  rounded-md w-full py-3 md:flex items-center ">
            <div className="absolute  sm:left-10 -top-20 md:-top-28 md:left-20 " >

              <img
                src={
                  user && user.profileImg && ProfilePic ? ProfilePic : Avatar
                }
                className="sm:h-20 sm:w-20 md:h-56 md:w-56 rounded-full"
                alt="userAvatar"
              />
            </div>
            <div className=" md:ml-80 md:px-5 text-right md:text-left">
              <p className="font-semibold md:text-3xl sm:text-xl ">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className="ml-auto mr-0 mt-5 text-right md:text-left">
                            <label>
                <button
                   class=" hover:bg-blue-700 text-white text-sm font-bold py-2 mx-3 px-6 rounded"
                  onClick={() => ModalBtnRef.current.click()}
                  style={{backgroundColor:"#034488"}}

                >
                  Upload Image
                </button>
              </label>
            </div>
          </div>

          <div className="my-3  rounded-md w-full  mt-6 pt-3">
          
         
          <EditTabs/>
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
        <div class="modal-dialog relative w-[40vw] pointer-events-none my-5">
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
            class="hideen px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
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

export default EditProfile;
