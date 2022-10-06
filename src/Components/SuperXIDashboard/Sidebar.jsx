import { ProSidebar, SidebarContent, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { superXIDashboardRoutes } from "../../routes";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePlus,
} from "react-icons/ai";
const Sidebar = () => {
  const [open, setOpen] = React.useState(true);
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] =  React.useState(false);
  const [activePage, setActivePage] = React.useState(null) ;
  const hasWindow = typeof window !== "undefined";
  const [close, setClose] = React.useState(null);

  const [permission, setPermissions] = React.useState({
    add_skills: false,
    add_users: false,
    list_candidates: false,
    list_companies: false,
    add_notifications: false,
    default: true,
  });
 
  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);
  const handleToggle = () => {
    if(close < 1336){
      setToggled(!toggled);
      setCollapsed(!collapsed);}
     };

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");

      // if (
      //   user1.permissions &&
      //   user1.permissions.length > 0 &&
      //   user1.permissions[0].admin_permissions
      // ) {
      //   await setPermissions(user1.permissions[0].admin_permissions);
      // }
      let user = await getUserFromId({ id: user1._id }, token);
      // if (user.data.user.isAdmin) {
      //   await setPermissions({
      //     add_skills: true,
      //     add_users: true,
      //     list_candidates: true,
      //     list_companies: true,
      //     add_notifications: true,
      //     default: true,
      //   });
      // } else if (
      //   user &&
      //   user.data.user &&
      //   user.data.user.user_type === "Admin_User" &&
      //   user.data.user.permissions
      // ) {
      //   if (user.data.user.permissions[0]) {
      //     await setPermissions({
      //       ...user.data.user.permissions[0].admin_permissions,
      //       default: true,
      //     });
      //   }
      // }
    };
    initial();
  }, [permission]);

  return (
    <div className="h-screen fixed top-20 left-0">
      <div className="absolute  text-gray-9 left-5 top-5  visible md:invisible text-gray-700 text-xl">
      <AiOutlineMenu className="text-md " onClick={()=>{handleToggle();}}/>
      </div>
    <ProSidebar
    // toggled={menu}
    // onToggle={(prev)=>setMenu(!prev)}
      width={280}
     
      className="fixed left-0 h-screen z-10 text-left active text-gray-500"
      style={{backgroundColor:"#FAFAFA"}}
      breakPoint="md"
      collapsed={collapsed} toggled={toggled} onToggle={handleToggle}
    >
      <button
      className=" hover:bg-blue-700 text-white font-bold py-2 px-10 mx-auto text-sm mt-4 text-center rounded-lg"
      style={{backgroundColor:"#034488"}}
     
    >
   <p className="py-1 px-2 text-sm font-bold"> <AiOutlinePlus/></p> Post New Job
    </button>
      <SidebarContent    className='text-left mx-5 mt-7'>
        <Menu iconShape="square">
        <MenuItem className='text-gray-700 font-semibold flex' active={window.location.pathname === `/superXI/` || window.location.pathname === `/superXI` } 
        // onClick={()=>{ handleToggle()}}
                       > <p className='text-xl flex mx-2'><AiOutlineHome/><p className='text-sm mx-4 text-gray-700 font-semibold'>Dashboard </p></p><Link to={`/superXI/`} /></MenuItem>
                       <p className='text-gray-400 font-semibold font-sm mx-4 my-5'>Analytics</p>
                {superXIDashboardRoutes.map((item) => {
                  if (item.hide === false && permission[item.permission] !== false)
                    return (
                      <MenuItem className='text-gray-700 font-semibold' active={window.location.pathname === `/superXI${item.path}`}
                      icon={item.icon}>{item.name} <Link to={`/superXI${item.path}`} onClick={()=> {setOpen(true)
                       handleToggle();
                      } 
                      
                    
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
