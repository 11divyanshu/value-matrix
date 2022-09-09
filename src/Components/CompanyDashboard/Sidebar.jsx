import { ProSidebar, Menu, MenuItem, SubMenu,SidebarContent } from 'react-pro-sidebar';
import "react-pro-sidebar/dist/css/styles.css";
import { companyDashboardRoutes } from "../../routes";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePoweroff,
} from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { ImHome } from "react-icons/im";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] =  React.useState(false);
  // const hasWindow = typeof window !== "undefined";
  const handleToggle = () => {
    setToggled(!toggled);
    setCollapsed(!collapsed);
}
  const [permission, setPermissions] = React.useState({
    add_jobs: true,
    add_users: true,
    list_candidates: true,
    default: true,
  });

  // function getWindowDimensions() {
  //   const width = hasWindow ? window.innerWidth : null;
  //   const height = hasWindow ? window.innerHeight : null;
  //   return {
  //     width,
  //     height,
  //   };
  // }

  // const [windowDimensions, setWindowDimensions] = React.useState(
  //   getWindowDimensions()
  // );

  // React.useEffect(() => {
  //   if (hasWindow) {
  //     function handleResize() {
  //       setWindowDimensions(getWindowDimensions());
  //     }

  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // }, [hasWindow]);

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");
      let user = await getUserFromId({ id: user1._id }, token);
      console.log(user);
      if (
        user &&
        user.data.user &&
        user.data.user.user_type === "Company_User" &&
        user.data.user.permissions
      ) {
        if (user.data.user.permissions[0]) {
          await setPermissions({
            ...user.data.user.permissions[0].company_permissions,
            default: true,
          });
        }
      }
      console.log(permission);
    };
    initial();
  }, []);

  return (
    <div className="h-screen fixed top-20 left-0">
      <div className="absolute  text-gray-9 left-5 top-5  visible md:invisible text-gray-700 text-xl">
      <AiOutlineMenu className="text-md " onClick={()=>{handleToggle();}}/>
      </div>
    <ProSidebar
    // toggled={menu}
    // onToggle={(prev)=>setMenu(!prev)}
      // width={}
     
      className="fixed left-0 h-screen z-10 text-left active text-gray-500"
      style={{backgroundColor:"#FAFAFA"}}
      breakPoint="md"
      collapsed={collapsed} toggled={toggled} onToggle={handleToggle}
    >
         <button
      class=" hover:bg-blue-700 text-white font-bold py-2 px-10 mx-auto text-sm mt-4 text-center rounded-lg"
      style={{backgroundColor:"#034488"}}
     
    >
   + Post New Job
    </button>
      <SidebarContent    className='text-left mx-5 mt-7'>

   
        <Menu iconShape="square">

        <MenuItem className='text-gray-700 font-semibold flex' active={window.location.pathname === `/company/`}
                       > <p className='text-xl flex mx-2'><AiOutlineHome/><p className='text-sm mx-4 text-gray-700 font-semibold'>Dashboard </p></p><Link to={`/company/`} /></MenuItem>


{/* <hr></hr> */}
<p className='text-gray-400 font-bold text-xs mx-4 my-7 py-2'>ANALYTICS</p>
                {companyDashboardRoutes.map((item) => {
                  if (item.hide === false && permission[item.permission] !== false)
                    return (
                    

                       
                        // <Link
                        //   to={`/company${item.path}`}
                        //   onClick={() => setOpen(true)}
                        // > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                        <MenuItem className='text-gray-700 font-semibold' active={window.location.pathname === `/company${item.path}`}
                        icon={item.icon}>{item.name} <Link to={`/company${item.path}`} onClick={()=> {setOpen(true)} 
                        
                      
                      } /></MenuItem>

                     )
                })}

        </Menu>
      </SidebarContent>
      <div className='mx-4 my-24'>
      <div className='flex m-2'><p className='text-gray-700 mx-4 py-2 font-semibold'><FiSettings/> </p><p  className='text-gray-700  font-semibold py-1'>Settings</p></div>
      <div className='flex m-2'><p className='text-gray-700 mx-4 py-2 font-semibold'><MdOutlineLogout/> </p><p className='text-gray-700  font-semibold py-1'>Log Out</p></div>
     
    </div>
    </ProSidebar>
   

    


    </div>
  );
};

export default Sidebar;
