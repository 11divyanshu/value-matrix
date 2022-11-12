import axios from "axios";

export const url = "http://localhost:8000";
// export const url = "https://dev.serve.valuematrix.ai";
// export const url = "http://3.6.65.3:8000"
// export const url = "https://backend.babyhost.in"
export const frontendUrl = "http://localhost:3001";
export const flaskurl = "http://3.110.220.19:5000";

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

export const handleXIStatusChange = async (user) => {
  try {
    return await axios.post(`${url}/handleXIStatusChange`, user);
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
// get Country Codes
export const countryCodeList = async () => {
  try {
    return await axios.get(`${url}/countryCodeList`);
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
export const sendForwardedMail = async (mail) => {
  try {
    return await axios.post(`${url}/sendForwardedMail`, mail);
    
  } catch (error) {
    console.log("Error while calling sendForwardedMail API: ", error);
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
export const getDialerToken = async () => {
  try {
    let c = await axios.get(`${url}/getDialerToken`);
    return c;
  } catch (error) {
    console.log("Error while calling SearchUserFromId: ", error);
  }
};
export const getUser = async (data, token) => {
  try {
    let c = await axios.post(`${url}/getUser`, data, {
      headers: { authorization: token },
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
export const updateSkills = async (data, token) => {
  try {
    return await axios.post(`${url}/updateSkills`, data, {
      headers: { authorization: token.access_token },
    });
  } catch (error) {
    console.log("Error while calling updateSkills : ", error);
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
export const updateProfileImage = async (data,user, token) => {
  try {
    console.log(data);
    return await axios.post(`${url}/updateProfilePicture?user=${user}`, data, {
      headers: { "Content-Type": "multipart/form-data", authorization: token },
    });
  } catch (error) {
   // return error;
    console.log("Error calling Update  : ", error);

  }
};

// Post Job
export const postJobAPI = async (data, token) => {
  console.log(data)
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

export const postUpdateJobStatus = async (data, token) => {
  console.log(data);
  try {
    return await axios.post(`${url}/jobStatusChange`, data, {
      headers: {
        authorization: token,
      },
    });
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}

export const postUpdateCandidateStatus = async (data, token) => {
  console.log(data);
  try {
    return await axios.post(`${url}/interviewApplicationstatusChange`, data, {
      headers: {
        authorization: token,
      },
    });
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}

export const postUpdateJobArchive = async (data, token) => {
  console.log(data);
  try {
    return await axios.post(`${url}/archiveJob`, data, {
      headers: {
        authorization: token,
      },
    });
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}

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
export const listBinJobs = async (data) => {
  try {
    return await axios.get(`${url}/listBinJob/${data}`);
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
export const getJobBinById = async (id, token) => {
  try {
    return await axios.post(
      `${url}/getJobBinById`,
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
// Get XI List
export const getXIList = async (data, token) => {
  try {
    return await axios.post(`${url}/getXIList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

// Get XI List
export const getXIUserList = async (data, token) => {
  try {
    return await axios.post(`${url}/getXIUserList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};
export const getSuperXIUserList = async (data, token) => {
  try {
    return await axios.post(`${url}/getSuperXIUserList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};

export const postXIUserLevel = async (data, token) => {
  try {
    return await axios.post(`${url}/postXIUserLevel`, data, {
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
    }, {
      responseType: 'blob'
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
};
// Fetch Country
export const fetchCountry = async () => {
  try {
    return await axios.post(`${url}/fetchCountry`);
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const getCountryList = async () => {
  try {
    return await axios.post(`${url}/getCountryList`);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Archive Job

export const archiveJob = async (data) => {
  try {
    return await axios.post(`${url}/archiveJob`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// List XI Interview Applications

export const listXIEvaluation = async (data, token) => {
  try {
    console.log(data)
    console.log(token)
    return await axios.post(`${url}/listXIEvaluation`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error Calling List Evaluation API :", error);
  }
};
export const getXIInterviewList = async (data, token) => {
  try {
   
    return await axios.post(`${url}/getXIInterviewList`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error Calling List Evaluation API :", error);
  }
};
export const listXIEvaluatedReports = async (data, token) => {
  try {
    return await axios.post(`${url}/listXIEvaluatedReports`, data, {
      headers: { authorization: token },
    });
  } catch (error) {
    console.log("Error Calling List Evaluation API :", error);
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
};
// Add Interview Question
export const addInterviewQuestion = async (data, token) => {
  try {
    console.log("data", data);
    return await axios.post(`${url}/addInterviewQuestions`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const fetchInterviewQuestion = async (token) => {
  try {
    return await axios.get(`${url}/fetchInterviewQuestions` ,{
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const updateInterviewQuestion = async (data) => {
  try {
    return await axios.post(`${url}/updateInterviewQuestion`,data);
  } catch (err) {
    console.log("Error : ", err);
  }
};
// Add Evaulation Question
export const addTaxId = async (data, token) => {
  try {
    console.log("data", data);
    return await axios.post(`${url}/addTaxId`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const findAndUpdateTax = async (id, data, token) => {
  try {
    console.log("data", data);
    return await axios.post(`${url}/updateTaxId/${id}`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const findAndDeleteTax = async (id, token) => {
  try {
    console.log(id);

    return await axios.post(`${url}/deleteTaxId/${id}`, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
// Get Interview Application
export const getInterviewApplication = async (data, token) => {
  try {
    return await axios.post(`${url}/getInterviewApplication`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// get Company List
export const getDBCompanyList = async (data, token) => {
  try {
    return await axios.get(`${url}/getCompanyList`);
  } catch (err) {
    console.log("Error : ", err);
  }
}
// Get School List
export const getDBSchoolList = async (data, token) => {
  try {
    return await axios.get(`${url}/getSchoolList`);
  } catch (err) {
    console.log("Error : ", err);
  }
}

// Update Evaluation Details
export const updateEvaluation = async (data, token) => {
  try {
    return await axios.post(`${url}/updateEvaluation`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
}
export const getCandidateEvaluation = async (data, token) => {
  try {
    return await axios.post(`${url}/getCandidateEvaluation`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
}

//Candidate ENdpoints

export const addCandidate = async (data, token) => {
  try {
    return await axios.post(`${url}/addCandidate`, data, {
      headers: { authorization: token },
    });
  } catch (err) {
    console.log("Error : ", err);
  }
}
export const getCandidateList = async (data) => {
  try {
    return await axios.post(`${url}/getCandidateList?id=${data}`
    );
  } catch (err) {
    console.log("Error : ", err);
  }
}
export const eligibleCandidateList = async (data) => {
  try {
    return await axios.post(`${url}/eligibleCandidateList`, data);

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const deleteCandidate = async (id , company , isDeleted) => {
  try {
     console.log(id , company,isDeleted);
    return await axios.post(`${url}/deleteCandidate?id=${id}`,{company : company , isDeleted : isDeleted}
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const eligibleJobsForCandidate = async (data) => {
  console.log(data);
  try {
    return await axios.get(`${url}/eligibleJobsForCandidate?email=${data}`
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
// unapproved jobs
export const unapprovedJobsList = async () => {
  try {
    return await axios.get(`${url}/unapprovedJobsList`
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const languagesList = async () => {
  try {
    return await axios.get(`${url}/languagesList`
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const approveJob = async (data) => {
  try {
    return await axios.post(`${url}/approveJob`,data
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const approveCompany = async (data) => {
  try {
    return await axios.post(`${url}/approveCompany`,data
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const checkCompany = async (data) => {
  try {
    return await axios.post(`${url}/checkCompany`,data
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const listUnapproveCompany = async () => {
  try {
    return await axios.get(`${url}/listUnapproveCompany`
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const saveCandidateReport = async (data) => {
  console.log(data);
  try {
    return await axios.get(`${url}/saveCandidateReport?candidate_id=${data}`
    );
    
  } catch (err) {
    console.log("Error : ", err);
  }
}

// get Company users


export const getCompanyUserList = async (id) => {
  try {
    return await axios.get(`${url}/getCompanyUserList?id=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}

// get titles
export const getJobTitles = async (id) => {
  try {
    return await axios.get(`${url}/getJobTitles`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const listUnapproveTitles = async (id) => {
  try {
    return await axios.get(`${url}/listUnapproveTitles`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const approveTitle = async (data) => {
  try {
    return await axios.post(`${url}/approveTitle`,data
    );
    
  } catch (err) {
    console.log("Error : ", err);

  }
}
export const jobTitles = async (data) => {
  try {
    return await axios.post(`${url}/jobTitles`,data
    );

  } catch (err) {
    console.log("Error : ", err);
    
  }
}
export const addcompany = async (data) => {
  try {
    return await axios.post(`${url}/addcompany`,data
    );
    
  } catch (err) {
    console.log("Error : ", err);

  }
}

// Slots

export const availableSlots = async (data,type) => {
  try {
    return await axios.post(`${url}/availableSlots`,{userId:data , type:type}
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const XISlots = async (id) => {
  try {
    return await axios.get(`${url}/XISlots?id=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const addSlot = async (data) => {
  try {
    return await axios.post(`${url}/addSlot`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const ValidateSlot = async (data) => {
  try {
    return await axios.post(`${url}/ValidateSlot`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const findCandidateByEmail = async (data) => {
  try {
    return await axios.post(`${url}/findCandidateByEmail?email=${data}`,
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const bookSlot = async (data) => {
  try {
    return await axios.post(`${url}/bookSlot`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const updateSlot = async (id,data) => {
  try {
    return await axios.put(`${url}/updateSlot?slotId=${id}`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const deleteSlot = async (id) => {
  try {
    return await axios.delete(`${url}/deleteSlot?slotId=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);
  }
}
export const slotDetailsOfXI = async (id) => {
  try {
    return await axios.get(`${url}/slotDetailsOfXI?XI_id=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const slotDetailsOfUser = async (id) => {
  try {
    console.log(id);
    return await axios.get(`${url}/slotDetailsOfUser?userId=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const userInterviewsDetails = async (id) => {
  try {
    return await axios.get(`${url}/userInterviewsDetails?slotId=${id}`
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const updateInterviewApplication = async (id ,data) => {
  try {
    return await axios.put(`${url}/updateInterviewApplication?id=${id}`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const updateXIInterviewApplication = async (id ,data) => {
  try {
    return await axios.put(`${url}/updateXIInterviewApplication?id=${id}`,data
    );

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const userUpgradePostRequest = async (data, token) => {
  console.log(data);
  try {
    return await axios.post(`${url}/insertUserInterviewApplications`, data, {
      headers: {
        authorization: token,
      },
    });
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const handleXIInterview = async (data, token) => {
  console.log(data);
  try {
    return await axios.post(`${url}/handleXIInterview`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}


export const checkinterviewdetails = async (meetingid ,participantdetails) => {
  try {
    return await axios.post(`${url}/checkinterviewdetails`,{
      meetingID: meetingid,
      participant: participantdetails
    }
    );
    
  } catch (err) {
    console.log("Error : ", err);
  }
}

export const fetchinterviewdetails = async (meetingid ,participantdetails) => {
  try {
    return await axios.post(`${url}/fetchinterviewdetails`,{
      meetingID: meetingid,
      participant: participantdetails
    }
    );
    
  } catch (err) {
    console.log("Error : ", err);
  }
}

export const getlivestatus = async (meetingid) => {
  try {
    return await axios.post(`${url}/getlivestatus`,{
      meetingID: meetingid
    }
    );
    
  } catch (err) {
    console.log("Error : ", err);
  }
}

// export const twilioToken = async () => {
//   try {
//     return await axios.get(`${url}/token`
//     );

//   } catch (err) {
//     console.log("Error : ", err);

//   }
// }

export const processFlask = async (currentUser, imageSrc, type, id) => {
  try {
    return await axios.post(`${flaskurl}/Interview`,{
      id: currentUser._id,
      data: imageSrc,
      type: type,
      interview: id,
    });
  } catch (err) {
    console.log("Error : ", err);

  }
}

export const processFlasklive = async (currentUser, imageSrc, id) => {
  try {
    return await axios.post(`${flaskurl}/Interview/Live`,{
      id: currentUser._id,
      data: imageSrc,
      type: "live",
      interview: id,
    });
  } catch (err) {
    console.log("Error : ", err);

  }
}
// XI Category

export const ListXICategory = async () => {
  try {
    return await axios.get(`${url}/ListXICategory`
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const addXICategory = async (data, token) => {
  try {
    return await axios.post(`${url}/addXICategory`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const updateXICategory = async (data, token) => {
  try {
    return await axios.post(`${url}/updateXICategory`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
// CreditCategory

export const ListCreditCategory = async () => {
  try {
    return await axios.get(`${url}/ListCreditCategory`
     
    );
  }catch (error) {
    console.log("Error calling Currency Category API : ", error);
  }
}
export const addCreditCategory = async (data) => {
  try {
    return await axios.post(`${url}/addCreditCategory`, data 
     
    );
  }catch (error) {
    console.log("Error calling Currency Category API : ", error);
  }
}
export const updateCreditCategory = async (data) => {
  try {
    return await axios.post(`${url}/updateCreditCategory`, data
     
    );
  }catch (error) {
    console.log("Error calling Currency Category API : ", error);
  }
}

// Currency Converter
export const ListCreditConverter = async () => {
  try {
    return await axios.get(`${url}/ListCreditConverter`
     
    );
  }catch (error) {
    console.log("Error calling Converter API : ", error);
  }
}
export const addCreditConverter = async (data) => {
  try {
    return await axios.post(`${url}/addCreditConverter`, data 
     
    );
  }catch (error) {
    console.log("Error calling Converter API : ", error);
  }
}
export const updateCreditConverter = async (data) => {
  try {
    return await axios.post(`${url}/updateCreditConverter`, data
     
    );
  }catch (error) {
    console.log("Error calling Converter API : ", error);
  }
}
// XI Levels

export const ListXILevel = async () => {
  try {
    return await axios.get(`${url}/ListXILevel`
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const addXILevel = async (data, token) => {
  try {
    return await axios.post(`${url}/addXILevel`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const updateXILevel = async (data, token) => {
  try {
    return await axios.post(`${url}/updateXILevel`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}


// XI Levels

export const ListXIMultiplier = async () => {
  try {
    return await axios.get(`${url}/ListXIMultiplier`
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const addXIMultiplier = async (data, token) => {
  try {
    return await axios.post(`${url}/addXIMultiplier`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const updateXIMultiplier = async (data, token) => {
  try {
    return await axios.post(`${url}/updateXIMultiplier`, data ,{
      headers: {
        authorization: token,
      },}
     
    );
  }catch (error) {
    console.log("Error calling Post Job API : ", error);
  }
}
export const updateXIInfo = async (data) => {
  try {
    return await axios.post(`${url}/updateXIInfo`, data 
     
    );
  }catch (error) {
    console.log("Error calling  API : ", error);
  }
}
export const getXIInfo = async (data) => {
  try {
    return await axios.get(`${url}/getXIInfo?id=${data}`,  
     
    );
  }catch (error) {
    console.log("Error calling  API : ", error);
  }
}
export const priorityEngine = async (data,type) => {
  try {
    return await axios.post(`${url}/priorityEngine?date=${data}`,{type:type}  
     
    );
  }catch (error) {
    console.log("Error calling  API : ", error);
  }
}
export const XIPerformance = async (data,type) => {
  try {
    return await axios.post(`${url}/XIPerformance?id=${data}` 
     
    );
  }catch (error) {
    console.log("Error calling  API : ", error);
  }
}


// razorpay
export const PaymentSuccess = async (data) => {
  try {
    return await axios.post(`${url}/payment/success`, data) 
     
    
  }catch (error) {
    console.log("Error calling  Razorpay API : ", error);
  }
}
export const newOrder = async (data) => {
  try {
    return await axios.post(`${url}/payment/orders`,data) 
     
    
  }catch (error) {
    console.log("Error calling  Razorpay API : ", error);
  }
}


// User Credit Info
export const getCreditInfoList = async (data) => {
  try {
    return await axios.post(`${url}/getCreditInfoList`, data) 
     
    
  }catch (error) {
    console.log("Error calling  Razorpay API : ", error);
  }
}
export const updateUserCreditInfo = async (data) => {
  try {
    return await axios.post(`${url}/updateUserCreditInfo`, data) 
     
    
  }catch (error) {
    console.log("Error calling  Razorpay API : ", error);
  }
}

export const updateinterviewcheck = async (type, img, id) => {
  try {
    return await axios.post(`${url}/updateinterviewcheck`,{
      type: type,
      meetingID: id
    });

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const updatelivestatus = async (stats, id) => {
  try {
    return await axios.post(`${url}/updatelivestatus`,{
      stats: stats,
      meetingID: id
    });

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const getinterviewdetails = async (id) => {
  try {
    return await axios.post(`${url}/getinterviewdetails`,{
      meetingID: id
    });

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const savecode = async (id, code, stdin, stdout) => {
  try {
    return await axios.post(`${url}/savecode`,{
      meetingID: id,
      code: code,
      stdin: stdin,
      stdout: stdout
    });

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const startinterview = async (id) => {
  try {
    return await axios.post(`${url}/startinterview`,{
      meetingID: id
    });

  } catch (err) {
    console.log("Error : ", err);
  }
}

export const endinterview = async (id) => {
  try {
    return await axios.post(`${url}/endinterview`,{
      meetingID: id
    });

  } catch (err) {
    console.log("Error : ", err);
  }
}

export const setquestionresult = async (id, qn) => {
  try {
    return await axios.post(`${url}/setquestionresult`,{
      meetingID: id,
      qn: qn
    });

  } catch (err) {
    console.log("Error : ", err);
  }
}

export const compilecode = async (formdata) => {
  try {
    return await axios.post(`${url}/compilecode`,{
      data: formdata
    });

  } catch (err) {
    console.log("Error : ", err);

  }
}
// Transactions

export const getTransactions = async (id) => {
  try {
    return await axios.get(`${url}/getTransactions?id=${id}`)

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const updateWallet = async (id) => {
  try {
    return await axios.post(`${url}/updateWallet?id=${id}`)

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const userRequestUpdate = async (id) => {
  try {
    return await axios.get(`${url}/userRequestUpdate?id=${id}`)

  } catch (err) {
    console.log("Error : ", err);

  }
}
export const userAcceptUpdate = async (id) => {
  try {
    return await axios.get(`${url}/userAcceptUpdate?id=${id}`)

  } catch (err) {
    console.log("Error : ", err);

  }
}

export const checkcompilestatus = async (token) => {
  try {
    return await axios.post(`${url}/checkcompilestatus`,{
      token: token
    });
  } catch (err) {
    console.log("Error : ", err);

  }
}

export const getUserCurrentCredit = async (id) => {
  try{
     return await axios.post(`${url}/getUserCurrentCredit`, {'userId':id}) 
  }catch(err){
    console.log("Error : " + err);
  }
}
export const getxiquestions = async (type, level, experience, category) => {
  try{
     return await axios.post(`${url}/getxiquestions`, {'type': type, "level": level, "experience": experience, "category": category}) 
  }catch(err){
    console.log("Error : " + err);
  }
}

export const getinterviewjob = async (id) => {
  try{
     return await axios.post(`${url}/getinterviewjob`, {'jobid': id}) 
  }catch(err){
    console.log("Error : " + err);
  }
}


export const createTaskScheduler = async (data) => {
  try{
     return await axios.post(`${url}/createTaskScheduler`,data) 
  }catch(err){
    console.log("Error : " + err);
  }
}