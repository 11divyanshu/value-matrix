import {ImHome} from "react-icons/im";
import {MdGroups} from "react-icons/md";
import {RiFileUserFill, RiFolderUserFill} from "react-icons/ri";
import {BsFillChatLeftTextFill,BsFillBellFill} from "react-icons/bs";
import Panel from "./Pages/UserDashboard/panel";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import NotificationPanel from "./Pages/AdminDashboard/Notification";
import EmailNotification from "./Pages/AdminDashboard/EmailNotification";
import PushNotification from "./Pages/AdminDashboard/PushNotifications";
import AddJob from "./Pages/AdminDashboard/PostJob";
import JobList from "./Pages/UserDashboard/jobList";

export const dashboardRoutes = [
    {
        name: "Home",
        icon: <ImHome className="text-xl"/>,
        path: "",
        component:<Panel/>,
        hide: false,
    },
    {
        name: "Group",
        icon: <MdGroups className="text-xl"/>,
        path:"/",
        hide:false,
    },
    {
        name:"Profile",
        icon: <RiFileUserFill className="text-xl"/>,
        path:"profile",
        component:<UserProfile/>,
        hide:false,
    },
    {
        name:"Chat",
        icon: <BsFillChatLeftTextFill className="text-xl"/>,
        path:"/",
        hide:false,
    },{
        name:'Edit Profile',
        path: "editProfile",
        hide:true,
        component:<EditProfile/>
    },{
        name:'Jobs',
        path: "jobs",
        hide:false,
        icon:<RiFolderUserFill className="text-xl"/>,
        component:<JobList/>
    }
]


export const adminDashboardRoutes = [
    {
        name: "Home",
        icon: <ImHome className="text-xl"/>,
        path: "/",
        component:<Panel/>,
        hide: false,
    },
    {
        name: "Group",
        icon: <MdGroups className="text-xl"/>,
        path:"/",
        hide:false,
    },
    {
        name:"Profile",
        icon: <RiFileUserFill className="text-xl"/>,
        path:"/profile",
        component:<UserProfile/>,
        hide:false,
    },
    {
        name:'Edit Profile',
        path: "/editProfile",
        hide:true,
        component:<EditProfile/>
    },
    {
        name: "Notification",
        path:"/notification",
        hide: false,
        icon:<BsFillBellFill className="text-xl" />,
        component:<NotificationPanel/>
    },
    {
        name:"Email Notifications",
        path:'/emailNotification',
        hide:true,
        component: <EmailNotification/>
    },
    {
        name:"One Signal Notification",
        path:'/pushNotification',
        hide:true,
        component: <PushNotification/>
    },{
        name:"Add Job",
        path:"/jobsAdd",
        icon:<RiFolderUserFill className="text-xl"/>,
        hide:false,
        component:<AddJob/>
    },
    {
        name:'Jobs',
        path: "/jobs",
        hide:false,
        icon:<RiFolderUserFill className="text-xl"/>,
        component:<JobList/>
    }
]