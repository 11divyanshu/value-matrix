import {ImHome} from "react-icons/im";
import {MdGroups} from "react-icons/md";
import {RiFileUserFill} from "react-icons/ri";
import {BsFillChatLeftTextFill} from "react-icons/bs";

export const dashboardRoutes = [
    {
        name: "Home",
        icon: <ImHome className="text-xl"/>,
        path: "/",
    },
    {
        name: "Group",
        icon: <MdGroups className="text-xl"/>,
        path:"/"
    },
    {
        name:"Profile",
        icon: <RiFileUserFill className="text-xl"/>,
        path:"/",
    },
    {
        name:"Chat",
        icon: <BsFillChatLeftTextFill className="text-xl"/>,
        path:"/",
    }
]