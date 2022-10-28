import { ImHome } from "react-icons/im";
import { MdGroups, MdOutlineWorkOutline } from "react-icons/md";
import { RiFileUserFill, RiFolderUserFill } from "react-icons/ri";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUserAdd,
  AiOutlineUnorderedList
} from "react-icons/ai";
import {
  BsFillChatLeftTextFill,
  BsFillBellFill,
  BsChatRightDots,
} from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { FaUserFriends, FaToolbox } from "react-icons/fa";
import { CgWorkAlt } from "react-icons/cg";
import { BsQuestionCircleFill } from "react-icons/bs";

// User Pages
import Panel from "./Pages/UserDashboard/panel";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import JobList from "./Pages/UserDashboard/jobList.jsx";
import JobDetails from "./Pages/UserDashboard/JobDetail.jsx";
import JobInvitations from "./Pages/UserDashboard/JobInvitations";
import InterviewApplication from "./Pages/UserDashboard/InterviewApplication";
import Interviews from "./Pages/UserDashboard/Interviews";
import InterviewsDetails from "./Pages/UserDashboard/InterviewDetails";

// import AllSlots from "./Pages/UserDashboard/AllSlots.jsx";
import PrintAble from "./Pages/UserDashboard/PrintAble"
import PrintAbleUi from "./Pages/UserDashboard/PrintAbleUi";


// Admin Pages
import NotificationPanel from "./Pages/AdminDashboard/Notification";
import EmailNotification from "./Pages/AdminDashboard/EmailNotification";
import PushNotification from "./Pages/AdminDashboard/PushNotifications";
import APanel from "./Pages/AdminDashboard/panel";
import WhatsappNotification from "./Pages/AdminDashboard/WhatsappNotification";
import ChannelNotificationPanel from "./Pages/AdminDashboard/ChannelNotification";

// Company Pages
import CJobList from "./Pages/CompanyDashboard/jobList.jsx";
import CPanel from "./Pages/CompanyDashboard/panel";
import CEvalDetails from "./Pages/CompanyDashboard/evaluationDetails";

import AddJob from "./Pages/CompanyDashboard/AddJob.jsx";
// import AddJob from "./Pages/CompanyDashboard/PostJob.jsx";
import UpdateJob from "./Pages/CompanyDashboard/UpdateJob1.jsx";
// import UpdateJob from "./Pages/CompanyDashboard/UpdateJob.jsx";
import EditCompanyProfile from "./Pages/CompanyDashboard/EditProfile.jsx";
import CompanyProfile from "./Pages/CompanyDashboard/Profile";
import CJobDetails from "./Pages/CompanyDashboard/JobDetails.jsx";
import CompanyList from "./Pages/AdminDashboard/CompanyList";
import CompanyDetails from "./Pages/AdminDashboard/CompanyDetails";
import CandiadateList from "./Pages/AdminDashboard/CandidatesList";
import CandiadateDetail from "./Pages/AdminDashboard/CandidateDetail";
import AddCompanyUser from "./Pages/CompanyDashboard/AddCompanyUser";
import CandidateList from "./Pages/CompanyDashboard/CandidateList";
import CandidateReport from "./Pages/CompanyDashboard/CandidateReport";
import Masking from "./Pages/CompanyDashboard/Masking";
import CompanyUserList from "./Pages/CompanyDashboard/CompanyUsersList";







import Jobvalidate from "./Pages/AdminDashboard/jobValidate";
import CompanyValidate from "./Pages/AdminDashboard/companyValidate";
import TitleValidate from "./Pages/AdminDashboard/TitleValidate";

import CityValidate from "./Pages/AdminDashboard/companyValidate copy";



// Admin Pages
import AddSkills from "./Components/AdminDashboard/AddSkills";
import AddAdminUser from "./Pages/AdminDashboard/AddAdminUser";
import AddTaxId from "./Pages/AdminDashboard/AddTaxId";

// XI Pages
import XIDashboard from "./Pages/XIDashboard/Dashboard";
import XIEvaluationList from "./Pages/XIDashboard/EvaluationList";
import XIJobDetails from "./Pages/XIDashboard/JobDetails.jsx";
import XIEvaluatedList from "./Pages/XIDashboard/EvaluatedList.jsx";
import XISlots from "./Pages/XIDashboard/Slots.jsx";
import EvaluatedReport from "./Pages/XIDashboard/EvaluationReports.jsx";

// SuperXIDashboard
import SXIPanel from "./Pages/SuperXIDashboard/panel.jsx";
import SXIUserProfile from "./Pages/SuperXIDashboard/UserProfile";
import SXIEditProfile from "./Pages/SuperXIDashboard/EditProfile";
import SXIJobList from "./Pages/SuperXIDashboard/jobList.jsx";
import SXIJobDetails from "./Pages/SuperXIDashboard/JobDetails.jsx";
import AddQuestions from "./Pages/AdminDashboard/AddQuestions";
import UpdateInterviewApplication from "./Pages/XIDashboard/UpdateInterviewApplication";




import { FiSettings } from "react-icons/fi";
import CPrintable from "./Pages/CompanyDashboard/CPrintable";
import XIOnboarding from "./Pages/AdminDashboard/AdminUserList";
import AdminUserProfile from "./Pages/AdminDashboard/AdminUserProfile";



// User Dashboard Routes
export const dashboardRoutes = [

  {
    name: "printAble",
    path: "PrintAbleUi",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAbleUi/>,
  },
  {
    name: "printAblee",
    path: "PrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAble/>,
  },

  {
    name: "Home",
    icon: <AiOutlineHome className="text-xl" />,
    path: "",
    component: <Panel />,
    hide: true,
  },

  {
    name: "Group",
    icon: <RiFolderUserFill className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "profile",
    component: <UserProfile />,
    hide: false,
  },
  {
    name: "Jobs",
    icon: <CgWorkAlt className="text-xl" />,
    path: "jobs",
    component: <JobList />,
    hide: true,
  },
  {
    name: "Chat",
    icon: <BsChatRightDots className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Edit Profile",
    path: "editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    name: "getJobById",
    path: "jobDetails",
    hide: true,
    component: <JobDetails />,
  },
  {
    name: "Invitations",
    path: "interviewInvitations",
    hide: false,
    icon: <CgWorkAlt className="text-xl" />,
    component: <JobInvitations />,
  },

  {
    name: "Interview Applications",
    path: "interviewApplications",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <InterviewApplication />,
  },
  {
    name: "Interviews",
    path: "interviews",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <Interviews />,
    permission: "default",
  },
  {
    name: "InterviewDetails",
    path: "interviewsDetails",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <InterviewsDetails />,
  },
];

// Admin Dashboard Routes
export const adminDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <APanel />,
    hide: true,
    permission: "default",
  },

  {
    name: "UserProfile",
    path: "/AdminUserProfile",
    hide: true,
    component: <AdminUserProfile />,
    permission: "default",
  },

  {
    name: "Profile",
    icon: <RiFileUserFill className="text-xl" />,
    path: "/profile",
    component: <UserProfile />,
    hide: false,
    permission: "default",
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditProfile />,
    permission: "default",
  },
  {
    name: "Notification",
    path: "/notification",
    hide: false,
    icon: <BsFillBellFill className="text-xl" />,
    component: <ChannelNotificationPanel />,
    permission: "add_notifications",
  },
  {
    name: "Notification",
    path: "/dashboardNotification",
    hide: true,
    icon: <BsFillBellFill className="text-xl" />,
    component: <NotificationPanel />,
    permission: "add_notifications",
  },
  {
    name: "Email Notifications",
    path: "/emailNotification",
    hide: true,
    component: <EmailNotification />,
    permission: "add_notifications",
  },
  {
    name: "Whatsapp Notifications",
    path: "/whatsappNotification",
    hide: true,
    component: <WhatsappNotification />,
  },
  {
    name: "One Signal Notification",
    path: "/pushNotification",
    hide: true,
    component: <PushNotification />,
    permission: "add_notifications",
  },
  {
    name: "Company List",
    path: "/companies",
    hide: false,
    component: <CompanyList />,
    icon: <FaBuilding className="text-xl" />,
    permission: "list_companies",
  },
  {
    name: "Company Details",
    path: "/company",
    hide: true,
    component: <CompanyDetails />,
    permission: "list_companies",
  },
  {
    name: "Candidates List",
    path: "/candidates",
    hide: false,
    component: <CandiadateList />,
    icon: <FaUserFriends className="text-xl" />,
    permission: "list_candidates",
  },
  {
    name: "Candidate Details",
    path: "/candidate",
    hide: true,
    component: <CandiadateDetail />,
    permission: "list_candidates",
  },
  {
    name: "Candidate Details",
    path: "/candidate",
    hide: true,
    component: <CandiadateDetail />,
    permission: "list_candidates",
  },
  {
    name: "Job Details",
    path: "/jobvalidate",
    hide: true,
    component: <Jobvalidate />,
    permission: "default",
  },
  {
    name: "Company Validation",
    path: "/companyValidate",
    hide: true,
    component: <CompanyValidate />,
    permission: "default",
  },
  {
    name: "Company Validation",
    path: "/cityValidate",
    hide: true,
    component: <CityValidate />,
    permission: "default",
  },
  {
    name: "Company Validation",
    path: "/titleValidate",
    hide: true,
    component: <TitleValidate />,
    permission: "default",
  },
  {
    name: "Add Skills",
    path: "/addSkills",
    hide: false,
    component: <AddSkills />,
    icon: <FaToolbox className="text-xl" />,
    permission: "add_skills",
  },
  {
    name: "Add Admin User",
    path: "/addAdminUser",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <AddAdminUser />,
    permission: "add_users",
  },
  {
    name: "XIOnboarding",
    path: "/XIOnboarding",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <XIOnboarding />,
    permission: "default",
  },
  {
    name: "Add Questions",
    path: "/addQuestions",
    hide:false,
    icon : <BsQuestionCircleFill className="text-xl" />,
    permission:"default",
    component : <AddQuestions/>
  },
  {
    name:"Add Tax Id",
    path: "/addtaxid",
    hide:false,
    icon : <BsQuestionCircleFill className="text-xl" />,
    permission:"default",
    component : <AddTaxId/>
  }
];

// Company Dashboard Routes
export const companyDashboardRoutes = [
  {
    name: "Home",
    icon: <AiOutlineHome className="text-xl" />,
    path: "/",
    component: <CPanel />,
    hide: true,
    permission: "default",
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "/profile",
    component: <CompanyProfile />,
    hide: false,
    permission: "default",
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditCompanyProfile />,
    permission: "default",
  },
  {
    name: "Add Job",
    path: "/jobsAdd",
    icon: <AiOutlineUserAdd className="text-xl" />,
    hide: true,
    component: <AddJob />,
    permission: "add_jobs",
  },
  {
    name: "Jobs",
    path: "/jobs",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <CJobList />,
    permission: "default",
  },

  {
    name: "Update Job",
    path: "/jobUpdate",
    hide: true,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <UpdateJob />,
    permission: "default",
  },
  {
    name: "getJobById",
    path: "/jobDetails/",
    hide: true,
    component: <CJobDetails />,
    permission: "default",
  },
  {
    name: "candidateEvaluation",
    path: "/evaluationDetails/",
    hide: true,
    component: <CEvalDetails />,
    permission: "default",
  },
  {
    name: "CPrintAble",
    path: "/CPrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintable/>,
  },
  {
    name: "Add User",
    path: "/addCompanyUser",
    hide: true,
    component: <AddCompanyUser />,
    icon: <AiOutlineFolderAdd className="text-xl" />,
    permission: "add_users",
  },
  {
    name: "Users List",
    path: "/CompanyUserList",
    hide: true,
    component: <CompanyUserList />,
    icon: <AiOutlineFolderAdd className="text-xl" />,
    permission: "add_users",
  },
  {
    name: "Candidates",
    path: "/candidateList",
    hide: false,
    component: <CandidateList />,
    icon: <AiOutlineUnorderedList className="text-xl" />,
    permission: "default",
  },
  {
    name: "Setting",
    path: "/masking",
    hide: true,
    component: <Masking />,
    icon: <FiSettings className="text-xl" />,
    permission: "default",
  },
  {
    name: "Candidate Report",
    path: "/candidateReport",
    hide: true,
    component: <CandidateReport />,
    permission: "default",
  },

];

// XI Routes
export const XIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <XIDashboard />,
    hide: true,
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "/profile",
    component: <UserProfile />,
    hide: false,
    permission: "default",
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    name: "Interviews",
    path: "/evaluationlist",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XIEvaluationList />,
    permission: "default",
  },
  {
    name: "Evaluated Reports",
    path: "/evaluatedlist",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XIEvaluatedList />,
    permission: "default",
  },
  {
    name: "Slots",
    path: "/slots",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XISlots />,
    permission: "default",
  },
 
  {
    name: "getJobById",
    path: "/jobDetails/",
    hide: true,
    component: <XIJobDetails />,
  },
  {
    name: "Evaluation Details",
    path: "/updateEvaluationDetails",
    hide: true,
    component: <UpdateInterviewApplication />,
  },
  {
    name: "Reports Details",
    path: "/reportDetails",
    hide: true,
    component: <EvaluatedReport />,
  },
  {
    name: "printAbleUi",
    path: "/evaluationreport",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAbleUi/>,
  },
];

// SuperXI Routes
export const superXIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <SXIPanel />,
    hide: true,
  },
  {
    name: "Group",
    icon: <MdGroups className="text-xl" />,
    path: "/",
    hide: false,
  },
  {
    name: "Profile",
    icon: <RiFileUserFill className="text-xl" />,
    path: "/profile",
    component: <SXIUserProfile />,
    hide: false,
  },
  {
    name: "Chat",
    icon: <BsFillChatLeftTextFill className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <SXIEditProfile />,
  },
  {
    name: "Jobs",
    path: "jobs",
    hide: false,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <SXIJobList />,
  },
  {
    name: "getJobById",
    path: "/jobDetails",
    hide: true,
    component: <SXIJobDetails />,
  },
];
