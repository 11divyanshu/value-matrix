import React,{ useState, Fragment }  from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  getProfileImage,
  uploadCandidateResume
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
import EditTabs from "../../Components/Dashbaord/EditTabs";
import Loader from "../../assets/images/loader.gif";

const EditProfile = () => {
  // Sets OTPs to NULL
  const [error, seterror] = React.useState(null);

  // const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [profileImg, setProfileImg] = React.useState(null);
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);
  const handleChange = async (e) => {
    setLoading(true);
    setError(null);
    if (e.target && e.target.files) {
      let user = JSON.parse(await localStorage.getItem("user"));
      let access_token = await localStorage.getItem("access_token");
      console.log(user, " ", access_token);
      let fd = new FormData();
      fd.append("user_id", user._id);
      fd.append("file", e.target.files[0]);

      let response = await uploadCandidateResume(fd, access_token);
      if (response && response.status === 200) {
        console.log(response);
        setLoading(false);
        localStorage.setItem("resumeInfo" , JSON.stringify(response.data));
        await setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
       
      } else {
        let res = await localStorage.getItem("candidateDetails");
        res = JSON.parse(res);
        res.resume = e.target.files[0].name;
        await localStorage.setItem("candidateDetails", JSON.stringify(res));      }

      // Resume Parser
      // var fileReader = new FileReader();
      // var base64;
      // // Onload of file read the file content
      // let base64String = "";
      // fileReader.onload = async function (fileLoadedEvent) {
      //   var modifiedDate = (new Date(fileLoadedEvent.lastModified)).toISOString().substring(0, 10);
      //   // base64 = Base64.encodeArray(fileLoadedEvent.target.result);
      //   base64 = fileLoadedEvent.target.result;
      //   base64String = base64;
        // let resumeResponse = await sovrenResumeParser({
        //   DocumentAsBase64String: base64,
        //   SkillsSettings: {
        //     Normalize: false,
        //     TaxonomyVersion: "",
        //   },
        //   ProfessionsSettings: {
        //     Normalize: false,
        //   },
        //   DocumentLastModified : modifiedDate,
        // });
        // console.log(resumeResponse);
      // };
      // await fileReader.readAsDataURL(e.target.files[0]);
      // setLoading(false);
      // e.target.files = null;
    }
  };
  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let access_token = localStorage.getItem("access_token");
      if (user && user.profileImg) {
        let image = await getProfileImage({ id: user._id }, user.access_token);
        if(image.status === 200){

        await localStorage.setItem("profileImg", JSON.stringify(image));

       // let base64string = btoa(
        //  String.fromCharCode(...new Uint8Array(image.data.Image.data))
      // );

     let base64string = btoa(new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
     return data + String.fromCharCode(byte);
      }, ''));
        let src = `data:image/png;base64,${base64string}`;
        await setProfileImg(src);}
      }
      if (access_token === null) window.location.href = "/login";

      await setUser(user);
    };
    func();
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
    return wait;
  };

  const update = async (values) => {
    let data = {
      firstName: values.firstName,
      lastname: values.lastName,
      about: values.about,
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
    if (res.data.user) {
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
  // React.useEffect(() => {
  //   const getData = async () => {
  //     let access_token1 = await localStorage.getItem("access_token");
  //     let user = await JSON.parse(localStorage.getItem("user"));
  //     await setUser(user);
  //     await setToken(access_token1);
  //     if (access_token1 === "null")
  //       await localStorage.setItem("access_token", user.access_token);
  //       if (user && user.profileImg) {
  //         let image = await getProfileImage({id: user._id}, user.access_token);
  //           await localStorage.setItem("profileImg", JSON.stringify(image));
  //         let base64string = btoa(
  //           String.fromCharCode(...new Uint8Array(image.data.Image.data))
  //         );
  //         let src = `data:image/png;base64,${base64string}`;
  //         await setProfilePic(src);
  //       }
  //   };
  //   getData();
  // }, []);

  return (
    <div className="px-3 h-100 bg-slate-100">
      {user !== null && (
        <div className="m-1">
          {/* <div
            className="h-48 w-full -z-[3]"
            style={{ background: "#99DEFF" }}
          ></div>
          <div className="relative  rounded-md w-full py-3 md:flex items-center ">
            <div className="absolute  sm:left-10 -top-20 md:-top-28 md:left-20 ">
              <img
                src={
                  user && user.profileImg && ProfilePic ? ProfilePic : Avatar
                }
                className="sm:h-20 sm:w-20 md:h-56 md:w-56 rounded-full -z-[3]"
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
                  className=" hover:bg-blue-700 text-white text-sm font-bold py-2 mx-3 px-6 rounded"
                  onClick={() => ModalBtnRef.current.click()}
                  style={{ backgroundColor: "#034488" }}
                >
                  Upload Image
                </button>
              </label>
            </div> */}
          {/* </div> */}

          <div
            className="md:h-48 h-24 w-full relative -z-[3]"
            style={{ background: "#99DEFF" }}
          ></div>
          <div className="relative  rounded-md w-full py-3 md:flex  ">
            <div className="absolute  sm:left-6 sm:px-2 -top-20 md:-top-28 md:left-20 ">
              <img
                src={
                  user && user.profileImg && profileImg ? profileImg : Avatar
                }
                //src={Avatar}
                className=" h-36 w-36 md:h-32 md:w-32 lg:h-56 lg:w-56 rounded-full relative"
                alt="userAvatar"
              />
            </div>

            <div className="mt-16 md:ml-80 md:px-5 md:mt-3  sm:mx-5 md:text-left">
              <p className="font-semibold md:text-3xl text-2xl ">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className=" mt-3 md:text-right  md:ml-auto sm:text-left  flex">
            <div className="mt-2">
          {loading ? (
            <button   className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 text-xs rounded"
            style={{ backgroundColor: "#034488" }}>
              <img src={Loader} className="h-4" alt="loader" />
            </button>
          ) : (
            <label
              htmlFor="resume"
              className="py-3 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
              style={{ backgroundColor: "#034488" }}
            >
              {" "}
              Upload Resume{" "}
            </label>
          )}
          <input
            type="file"
            name="resume"
            className="hidden"
            id="resume"
            accept="application/pdf, application/msword"
            onChange={handleChange}
          />
        </div>
        <div>
              <button
                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                style={{ backgroundColor: "#034488" }}
               
                  onClick={() => ModalBtnRef.current.click()}

              
              >
                Upload Image
              </button>
              </div>
            </div>
          </div>

          <div className="my-3  rounded-md w-full  mt-6 pt-3">
            <EditTabs />
          </div>
        </div>
      )}

      {/* Modal For Cropping Image */}
      <button
        type="button"
        className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out hidden"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ModalBtnRef}
      >
        Launch static backdrop modal
      </button>
      <div
        className="modal fade fixed ml-[25vw] top-20 hidden h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-[40vw] pointer-events-none my-5">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Update Profile Image
              </h5>
            </div>
            <div className="modal-body relative p-4">
              <ReactCropper Modal={ModalRef} user="User"/>
            </div>
          </div>
          <button
            type="button"
            className="hidden px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
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
