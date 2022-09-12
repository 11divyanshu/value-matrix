import axios from "axios";

export const url = "http://localhost:8000";
// export const url = "http://3.6.65.3:8000"
// export const url = "https://backend.babyhost.in"
export const frontendUrl = "http://localhost:3001";

// User Method API
export const authenticateLogin = async (user) => {
  try {
    return await axios.post(`${url}/userLogin`, user);
  } catch (error) {
    console.log("error while calling login API: ", error);
  }
};

// User Signup
export const authenticateSignUp = async (user) => {
  try {
    return await axios.post(`${url}/userSignup`, user);
  } catch (error) {
    console.log(error.response.data);
    console.log("Error while calling signup API: ", error);
  }
};

// Validate Signup details
export const validateSignupDetails = async (user) => {
  try {
    return await axios.post(`${url}/validateSignup`, user);
  } catch (error) {
    console.log("Error Calling Validate Signup API : ", error);
  }
};

// Logout
export const LogoutAPI = async (user_id) => {
  try {
    return axios.post(`${url}/logout`, { user_id: user_id });
  } catch (error) {
    console.log("Error Calling Logout API : ", error);
  }
};

// Mail OTP to users
export const OTPMail = async (mail) => {
  try {
    let c = await axios.post(`${url}/OTPMail`, mail);
    return c.data.otp;
  } catch (error) {
    console.log("Error while calling OTPMail API: ", error);
  }
};

// SMS OTP to Users
export const OTPSms = async (mail) => {
  try {
    let c = await axios.post(`${url}/OTPSms`, mail);
    return c.data.otp;
  } catch (error) {
    console.log("Error while calling OTPSms API : ", error);
  }
};

// Get Users From Tokem
export const getUserIdFromToken = async (token) => {
  try {
    let c = await axios.post(`${url}/getUserIdFromToken`, token, {
      headers: { authorization: token.access_token },
    });
    return c;
  } catch (error) {
    console.log("Error while calling Getting User From Token: ", error);
  }
};

// Search User From Id
export const getUserFromId = async (data, token) => {
  try {
    let c = await axios.post(`${url}/getUserFromId`, data, {
      headers: { authorization: token.access_token },
    });
    return c;
  } catch (error) {
    console.log("Error while calling SearchUserFromId: ", error);
  }
};

export const getProfileImage = async (data, token) => {
  try {
    let c = await axios.post(`${url}/getProfileImage`, data, {
      headers: { authorization: token.access_token },
    });
    return c;
  } catch (error) {
    console.log("Error while calling GetProfileImageFromId: ", error);
  }
};

// Update User Details
export const updateUserDetails = async (data, token) => {
  try {
    return await axios.post(`${url}/updateUserDetails`, data, {
      headers: { authorization: token.access_token },
    });
  } catch (error) {
    console.log("Error while calling UpdateUserDetails : ", error);
  }
};

// Admin Login
export const adminLogin = async (user) => {
  try {
    return await axios.post(`${url}/adminLogin`, user);
  } catch (error) {
    console.log("error while calling login API: ", error);
  }
};

// Update Email OTP
export const updateEmailOTP = async (mail, token) => {
  try {
    let c = await axios.post(`${url}/updateEmailOTP`, mail, {
      headers: { authorization: token.access_token },
    });
    return c.data;
  } catch (error) {
    console.log("Error while calling OTPMail API: ", error);
  }
};

// Update Contact OTP
export const updateContactOTP = async (contact, token) => {
  try {
    let c = await axios.post(`${url}/updateContactOTP`, contact, {
      headers: { authorization: token.access_token },
    });
    return c.data;
  } catch (error) {
    console.log("Error while calling OTPSms API : ", error);
  }
};

// Notification API
export const pushNotification = async (noti, token) => {
  try {
    return await axios.post(`${url}/pushNotification`, noti, {
      headers: { authorization: token.access_token },
    });
  } catch (error) {
    console.log("Error Calling Push Notification API : ", error);
  }
};

// Get User Notification
export const getUserNotification = async (user, token) => {
  try {
    return await axios.post(
      `${url}/getUserNotification`,
      { user_id: user._id, user: user },
      { headers: { authorization: token } }
    );
  } catch (error) {
    console.log("Error Calling Get User Notification API : ", error);
  }
};

// Mark Notification As Read
export const markNotiReadForUser = async (data, token) => {
  try {
    return await axios.post(
      `${url}/markNotificationRead`,
      { noti_id: data.noti_id, user_id: data.user_id },
      { headers: { authorization: token } }
    );
  } catch (error) {
    console.log("Error Calling Mark Notification Read API : ", error);
  }
};

// Send Email Notifications
export const sendEmailNotification = async (data, token) => {
  try {
    return await axios.post(`${url}/sendEmailNotification`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
// Send Whastapp Notification
export const sendWhatsappNotification = async (data, token) => {
  try {
    return await axios.post(`${url}/sendWhatsappNotification`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// send onesignal notification
export const sendOneSignalNotification = async (data, token) => {
  try {
    return await axios.post(`${url}/sendOneSignalNotification`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log("Error calling One Signal Notification : ", error);
  }
};

// Update Profile Image
export const updateProfileImage = async (data, token) => {
  try {
    console.log(data);
    return await axios.post(`${url}/updateProfilePicture`, data, {
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Post Job
export const postJobAPI = async (data, token) => {
  try {
    return await axios.post(`${url}/addJob`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
};

//update job

export const updateJobAPI = async (data, token) => {
  try {
    return await axios.post(`${url}/updateJobDetails`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
};

// List Jobs
export const listJobs = async (data) => {
  try {
    return await axios.post(`${url}/listJob/${data}`);
  } catch (error) {
    console.log("Error Calling List Jobs API :", error);
  }
};
export const listJobsUser = async () => {
  try {
    return await axios.post(`${url}/listJobCandidate`);
  } catch (error) {
    console.log("Error Calling List Jobs API :", error);
  }
};

// List Jobs
export const updateJobDetails = async (data, token) => {
  try {
    return await axios.post(` ${url}/updateJobDetails`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log("Error Calling List Jobs API :", error);
  }
};
// Get Job Details

export const getJobById = async (id, token) => {
  try {
    return await axios.post(
      `${url}/getJobFromId`,
      { job_id: id },
      { headers: { authorization: token } }
    );
  } catch (error) {
    console.log("Error Calling List Jobs API :", error);
  }
};

// Reset Password Mail
export const sendResetPasswordMail = async (data) => {
  try {
    return await axios.post(`${url}/sendResetPasswordMail`, data);
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Reset Password By SMS
export const sendResetPasswordSMS = async (data) => {
  try {
    return await axios.post(`${url}/sendResetPasswordSMS`, data);
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Reset Password by Username
export const sendResetPasswordByUsername = async (data) => {
  try {
    return await axios.post(`${url}/sendResetPasswordUsername`, data);
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Reset Password
export const resetPassword = async (data) => {
  try {
    return await axios.post(`${url}/resetPassword`, data);
  } catch (error) {
    console.log("Error :", error);
  }
};

// Upload Candidate Resume
export const uploadCandidateResume = async (data, token) => {
  try {
    return await axios.post(`${url}/uploadCandidateResume`, data, {
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Submit Candidate Details
export const submitCandidateDetails = async (data, token) => {
  try {
    return await axios.post(`${url}/submitCandidateDetails`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Submit Company Details
export const submitCompanyDetails = async (data, token) => {
  try {
    return await axios.post(`${url}/submitCompanyDetails`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Get Company List
export const getCompanyList = async (data, token) => {
  try {
    return await axios.post(`${url}/getCompanyList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Get User List
export const getUserList = async (data, token) => {
  try {
    return await axios.post(`${url}/getUserList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Download Resume
export const downloadResume = async (data, token) => {
  try {
    return await axios.post(`${url}/downloadResume`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Add Company User
export const addCompanyUser = async (data, token) => {
  try {
    return await axios.post(`${url}/addCompanyUser`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Add SKils
export const addSkills = async (data, token) => {
  try {
    return await axios.post(`${url}/addSkills`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Get Skills
export const getSkills = async (data, token) => {
  try {
    return await axios.post(`${url}/getSkills`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Add Admin User
export const addAdminUser = async (data, token) => {
  try {
    return await axios.post(`${url}/addAdminUser`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Sovren Resume Parser
export const sovrenResumeParser = async (data) => {
  try {
    return await axios.post(
      `https://rest.resumeparsing.com/v10/parser/resume`,
      data,
      {
        headers: {
          "Sovren-AccountId": "58045629",
          "Sovren-ServiceKey": "N6x3TEi+ULpI57PrPkIK23P44F1tfDu6lum+iV3m",
          Accept: "application/json",
          "Content-Type": "application/json",
          // 'Content-Length': Buffer.byteLength(postData)
        },
      }
    );
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Send Job Invitations
export const sendJobInvitations = async (data, token) => {
  try {
    return await axios.post(`${url}/sendJobInvitation`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Get User Invite From  Reset Pass Id
export const getUserInviteFromResetPassId = async (data) => {
  try {
    return await axios.post(`${url}/getUserInviteFromResetPassId`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// export Set Profile
export const setProfile = async (data) => {
  try {
    return await axios.post(`${url}/setProfile`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Get Job Invitations
export const getJobInvitations = async (data, token) => {
  try {
    return await axios.post(`${url}/getJobInvitations`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Handle Candidate Job Invitation
export const handleCandidateJobInvitation = async (data, token) => {
  try {
    return await axios.post(`${url}/handleCandidateJobInvitation`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Company Filters
export const FilterCompany = async (data, values) => {
  try {
    return await axios.post(
      `${url}/filterCompany/${values.picked}/${values.toggle}/${data}`
    );
  } catch (err) {
    console.log("Error : ", err);
  }
};

//  Get User Interview Applications
export const getUserInterviewApplications = async (data, token) => {
  try {
    return await axios.post(`${url}/getUserInterviewApplications`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
}
// Fetch Country
export const fetchCountry = async () => {
  try{
    return await axios.post(`${url}/fetchCountry`, );
  }catch(err){
    console.log("Error : ", err);
  }

};

// Archive Job

export const archiveJob = async (data) => {
  try{
    return await axios.post(`${url}/archiveJob`,data);
  }catch(err){
    console.log("Error : ", err);
  }
};

// List XI Interview Applications

export const listXIEvaluation = async (data,token) => {
  try {
    return await axios.post(`${url}/listXIEvaluation`,data, {
      headers: { authorization: token },});
  } catch (error) {
    console.log("Error Calling List Jobs API :", error);
  }
};


// Add Evaulation Question
export const addEvaluationQuestion = async (data, token) => {
  try {
    console.log("data", data);
    return await axios.post(`${url}/addEvaluationQuestions`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
}