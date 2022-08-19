import { ImHome } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { RiFileUserFill, RiFolderUserFill } from "react-icons/ri";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";

// User Pages
import Panel from "./Pages/UserDashboard/panel";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import JobList from "./Pages/UserDashboard/jobList.jsx";


// Admin Pages
import NotificationPanel from "./Pages/AdminDashboard/Notification";
import EmailNotification from "./Pages/AdminDashboard/EmailNotification";
import PushNotification from "./Pages/AdminDashboard/PushNotifications";

// Company Pages
import CJobList from "./Pages/CompanyDashboard/jobList.jsx";

import AddJob from "./Pages/CompanyDashboard/PostJob.jsx";
import UpdateJob from "./Pages/CompanyDashboard/UpdateJob.jsx";
import EditCompanyProfile from "./Pages/CompanyDashboard/EditProfile.jsx";
import CompanyProfile from "./Pages/CompanyDashboard/Profile";
import JobDetails from "./Pages/CompanyDashboard/JobDetails.jsx";

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
    path: "/jobDetails/",
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
    name: "One Signal Notification",
    path: "/pushNotification",
    hide: true,
    component: <PushNotification />,
  },
];

// Company Dashboard Routes
export const companyDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <Panel />,
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
    component: <JobDetails />,

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
