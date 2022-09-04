import { ImHome } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { RiFileUserFill, RiFolderUserFill } from "react-icons/ri";
import { AiOutlineHome,AiOutlineUser ,AiOutlineFolderAdd} from "react-icons/ai";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { FaUserFriends, FaToolbox } from "react-icons/fa";

// User Pages
import Panel from "./Pages/UserDashboard/panel";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import JobList from "./Pages/UserDashboard/jobList.jsx";
import JobDetails from "./Pages/UserDashboard/JobDetail.jsx";
import JobInvitations from "./Pages/UserDashboard/JobInvitations";

// Admin Pages
import NotificationPanel from "./Pages/AdminDashboard/Notification";
import EmailNotification from "./Pages/AdminDashboard/EmailNotification";
import PushNotification from "./Pages/AdminDashboard/PushNotifications";
import APanel from "./Pages/AdminDashboard/panel";
import WhatsappNotification from "./Pages/AdminDashboard/WhatsappNotification";

// Company Pages
import CJobList from "./Pages/CompanyDashboard/jobList.jsx";
import CPanel from "./Pages/CompanyDashboard/panel";

import AddJob from "./Pages/CompanyDashboard/PostJob.jsx";
import UpdateJob from "./Pages/CompanyDashboard/UpdateJob.jsx";
import EditCompanyProfile from "./Pages/CompanyDashboard/EditProfile.jsx";
import CompanyProfile from "./Pages/CompanyDashboard/Profile";
import CJobDetails from "./Pages/CompanyDashboard/JobDetails.jsx";
import CompanyList from "./Pages/AdminDashboard/CompanyList";
import CompanyDetails from "./Pages/AdminDashboard/CompanyDetails";
import CandiadateList from "./Pages/AdminDashboard/CandidatesList";
import CandiadateDetail from "./Pages/AdminDashboard/CandidateDetail";
import AddCompanyUser from "./Pages/CompanyDashboard/AddCompanyUser";
import AddSkills from "./Components/AdminDashboard/AddSkills";
import AddAdminUser from "./Pages/AdminDashboard/AddAdminUser";

// XI Pages
import XIDashboard from "./Pages/XIDashboard/Dashboard";

// SuperXIDashboard
import SXIPanel from "./Pages/SuperXIDashboard/panel.jsx";
import SXIUserProfile from "./Pages/SuperXIDashboard/UserProfile";
import SXIEditProfile from "./Pages/SuperXIDashboard/EditProfile";
import SXIJobList from "./Pages/SuperXIDashboard/jobList.jsx";
import SXIJobDetails from "./Pages/SuperXIDashboard/JobDetails.jsx";

// User Dashboard Routes
export const dashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "",
    component: <Panel />,
    hide: false,
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
    path: "profile",
    component: <UserProfile />,
    hide: false,
  },
  {
    name: "Chat",
    icon: <BsFillChatLeftTextFill className="text-xl" />,
    path: "/",
    hide: false,
  },
  {
    name: "Edit Profile",
    path: "editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    name: "Jobs",
    path: "jobs",
    hide: false,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <JobList />,
  },
  {
    name: "getJobById",
    path: "jobDetails",
    hide: true,
    component: <JobDetails />,
  },
  {
    name : "Job Invitations",
    path : "jobInvitations",
    hide : true,
    component : <JobInvitations/>,
  }
];

// Admin Dashboard Routes
export const adminDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <APanel />,
    hide: false,
    permission: "default",
  },
  {
    name: "Group",
    icon: <MdGroups className="text-xl" />,
    path: "/",
    hide: false,
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
];

// Company Dashboard Routes
export const companyDashboardRoutes = [
  {
    name: "Home",
    icon: <AiOutlineHome className="text-xl" />,
    path: "/",
    component: <CPanel />,
    hide: false,
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
    icon: <AiOutlineUser className="text-xl" />,
    hide: false,
    component: <AddJob />,
    permission: "add_jobs",
  },
  {
    name: "Jobs",
    path: "/jobs",
    hide: false,
    icon: <AiOutlineUser className="text-xl" />,
    component: <CJobList />,
    permission: "default",
  },

  {
    name: "Update Job",
    path: "/jobsUpdate",
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
    name: "Add Company User",
    path: "/addCompanyUser",
    hide: false,
    component: <AddCompanyUser />,
    icon: <AiOutlineFolderAdd className="text-xl" />,
    permission: "add_users",
  },
];

// XI Routes
export const XIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <XIDashboard />,
    hide: false,
  },
];

// SuperXI Routes
export const superXIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <SXIPanel />,
    hide: false,
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
    path: "profile",
    component: <SXIUserProfile />,
    hide: false,
  },
  {
    name: "Chat",
    icon: <BsFillChatLeftTextFill className="text-xl" />,
    path: "/",
    hide: false,
  },
  {
    name: "Edit Profile",
    path: "editProfile",
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
    path: "jobDetails",
    hide: true,
    component: <SXIJobDetails />,
  },
];
