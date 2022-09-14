import { ProSidebar, Menu, MenuItem, SubMenu,SidebarContent } from 'react-pro-sidebar';
import "../../assets/stylesheet/layout.scss"

import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import { RiAdminFill } from "react-icons/ri";
import React from "react";
import { LogoutAPI } from "../../service/api";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const [menu, setMenu] = React.useState(false)
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] =  React.useState(false);
  const [activePage, setActivePage] = React.useState(null) ;
  const sideRef = React.useRef(null);
  const Logout = async () => {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    console.log(res);
    await localStorage.setItem("user", null);
    await localStorage.setItem("access_token", null);
    window.location.href = "/login";
  };
function handleActive(event) {

}
  const handleToggle = (event) => {
      setToggled(!toggled);
      setCollapsed(!collapsed);
      // let side  = document.getElementById("prosidebar");
      // if (!sideRef.current.classList.value.includes("active")) {
      //   sideRef.current.classList.toggle('active') ;
      //   if (activePage)
      //     activePage.classList.remove("active") ;
      //   setActivePage(sideRef) ;
      // }
  }
  // const hasWindow = typeof window !== 'undefined';

  // function getWindowDimensions() {
  //   const width = hasWindow ? window.innerWidth : null;
  //   const height = hasWindow ? window.innerHeight : null;
  //   return {
  //     width,
  //     height,
  //   };
  // }

  // const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  // React.useEffect(() => {
  //   if (hasWindow) {
  //     function handleResize() {
  //       setWindowDimensions(getWindowDimensions());
  //     }

  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  //   }
  // }, [hasWindow]);
  

  return (
    <div className='sidebarComponent z-20'>
    <div className="h-screen fixed top-20 left-0" style={{marginTop:"-10px"}}>
      <div className="absolute text-gray-9 left-5 -top-10   text-gray-800 text-xl menu" style={{zIndex:18}}>
      <AiOutlineMenu className="text-md menu-bar" onClick={()=>{handleToggle();}}  style={{zIndex:20}}/>
      </div>



    <ProSidebar
    // toggled={menu}
    // onToggle={(prev)=>setMenu(!prev)}
      // width={280}
      id="prosidebar"
      ref={sideRef}
      className="fixed left-0 h-screen z-0 text-left active text-gray-500"
      style={{backgroundColor:"#FAFAFA" , zIndex:-1}}
      breakPoint="xl"
      collapsed={collapsed} toggled={toggled} onToggle={handleToggle}
    >
      <button
      class=" hover:bg-blue-700 text-white font-bold py-2 px-4 mx-auto text-xs mt-4 flex text-center rounded-lg"
      style={{backgroundColor:"#034488"}}
     
    >
{/* <p classname=" py-2"><AiOutlinePlus/></p> */}
<p className="py-1 px-2 text-sm font-bold"> <AiOutlinePlus/></p><p className='py-1'>Connect New Account</p>
    </button>
      <SidebarContent  style={{zIndex:-1}}  className='text-left mx-5 mt-7'>
        <Menu iconShape="square">
          {/* <MenuItem
           
          >
           Value matrix
          </MenuItem> */}
           <MenuItem className='text-gray-700 font-semibold flex' active={window.location.pathname === `/user/` || window.location.pathname === `/user`}
                       > <p className='text-xl flex mx-2'><AiOutlineHome/><p className='text-sm mx-4 text-gray-700 font-semibold'>Dashboard </p></p><Link to={`/user/`} /></MenuItem>

<p className='text-gray-400 font-bold text-xs mx-4 my-5'>ANALYTICS</p>
          {dashboardRoutes.map((item) => {
            if(item.hide === false)
            return (
                <MenuItem className='text-gray-700 font-semibold' active={window.location.pathname === `/user/${item.path}`}
                icon={item.icon}>{item.name} <Link to={`/user/${item.path}`} onClick={()=> {setOpen(true)} 
                
              
              } /></MenuItem>
            );
            return null;
          })}
          {props.user && props.user.isAdmin === true && (
          <MenuItem
          icon={<FaUserCog className="text-xl"/>}>
            <Link to="/admin">Admin Panel</Link>
          </MenuItem>)}
        </Menu>
      </SidebarContent>
      <div className='mx-4 my-24'>
      <div className='flex m-2'><a href="/user/profile" className='text-gray-700 mx-4 py-2 font-semibold'><FiSettings/> </a><a href="/user/profile" className='text-gray-700  font-semibold py-1'>Settings</a></div>
      <div className='flex m-2' onClick={Logout} style={{cursor:"pointer"}}><p className='text-gray-700 mx-4 py-2 font-semibold'><MdOutlineLogout/> </p><p  className='text-gray-700  font-semibold py-1'>Log Out</p></div>
     
    </div>
    </ProSidebar>
{/* 
      <div className="flex">
        <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
          <div className="space-y-3">
            <div className="flex items-center">
            </div>
            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                {dashboardRoutes.map((item) => {
                  if (item.hide === false)
                    return (
                      <li className="rounded-sm">


                        <Link
                          to={`/user/${item.path}`}
                          onClick={() => setOpen(true)}
                        > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                      </li>)
                })}

                {props.user && props.user.isAdmin === true && (
                  // <MenuItem
                  // icon={<FaUserCog className="text-xl"/>}>
                  //   <Link to="/admin">Admin Panel</Link>
                  // </MenuItem>

                  <Link
                    to={`/admin`}

                  > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-xl text-gray-600"> <RiAdminFill/></p>  <p className="font-bold">Admin Panel</p> </span></Link>

                )}

              </ul>
            </div>
          </div>
        </div>

      </div> */}



    </div>
    </div>
  );
};

export default Sidebar;
