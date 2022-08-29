import { ImHome } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { RiFileUserFill, RiFolderUserFill } from "react-icons/ri";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";
import {FaBuilding} from "react-icons/fa";
import {FaUserFriends} from "react-icons/fa";

// User Pages
import Panel from "./Pages/UserDashboard/panel";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import JobList from "./Pages/UserDashboard/jobList.jsx";
import JobDetails from "./Pages/UserDashboard/JobDetail.jsx";


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
    component: <UserProfile />,
    hide: false,
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    name: "Notification",
    path: "/notification",
    hide: false,
    icon: <BsFillBellFill className="text-xl" />,
    component: <NotificationPanel />,
  },
  {
    name: "Email Notifications",
    path: "/emailNotification",
    hide: true,
    component: <EmailNotification />,
  },
  {
    name: "Whatsapp Notifications",
    path: "/whatsappNotification",
    hide: true,
    component: <WhatsappNotification/>,
  },
  {
    name: "One Signal Notification",
    path: "/pushNotification",
    hide: true,
    component: <PushNotification />,
  },
  {
    name : "Company List",
    path : "/companies",
    hide: false,
    component : <CompanyList/>,
    icon: <FaBuilding className="text-xl" />
  },
  {
    name : "Company Details",
    path: "/company",
    hide : true,
    component : <CompanyDetails />
  },
  {
    name : "Candidates List",
    path : "/candidates",
    hide: false,
    component : <CandiadateList/>,
    icon: <FaUserFriends className="text-xl" />
  },
  {
    name : "Candidate Details",
    path: "/candidate",
    hide : true,
    component : <CandiadateDetail/>
  },
];

// Company Dashboard Routes
export const companyDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <CPanel />,
    hide: false,
  },
  {
    name: "Profile",
    icon: <RiFileUserFill className="text-xl" />,
    path: "/profile",
    component: <CompanyProfile />,
    hide: false,
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditCompanyProfile/>
  },
  {
    name: "Add Job",
    path: "/jobsAdd",
    icon: <RiFolderUserFill className="text-xl" />,
    hide: false,
    component: <AddJob />,
  },
  {
    name: "Jobs",
    path: "/jobs",
    hide: false,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <CJobList />,
  },

  {
    name: "Update Job",
    path: "/jobsUpdate",
    hide: true,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <UpdateJob />,
  },
  {
    name: "getJobById",
    path: "/jobDetails/",
    hide: true,
    component: <CJobDetails />,

  }
];

// XI Routes
export const XIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <Panel />,
    hide: false,
  }
]

// SuperXI Routes
export const superXIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <Panel />,
    hide: false,
  }
]
