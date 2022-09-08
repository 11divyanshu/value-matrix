import { ProSidebar, Menu, MenuItem, SubMenu,SidebarContent } from 'react-pro-sidebar';

import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import { RiAdminFill } from "react-icons/ri";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
} from "react-icons/ai";
const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const [menu, setMenu] = React.useState(false)
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] =  React.useState(false);
  const [activePage, setActivePage] = React.useState(null) ;

function handleActive(event) {
  if (!event.target.classList.value.includes("active")) {
    event.target.classList.toggle('active') ;
    if (activePage)
      activePage.classList.remove("active") ;
    setActivePage(event.target) ;
  }
}
  const handleToggle = () => {
      setToggled(!toggled);
      setCollapsed(!collapsed);
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
    <div className="h-screen">
      <div className="absolute  text-gray-9 left-5 top-5  visible md:invisible text-gray-700 text-xl">
      <AiOutlineMenu className="text-md " onClick={()=>{handleToggle();}}/>
      </div>
    <ProSidebar
    // toggled={menu}
    // onToggle={(prev)=>setMenu(!prev)}
      width={250}
     
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
          {/* <MenuItem
           
          >
           Value matrix
          </MenuItem> */}
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
  );
};

export default Sidebar;
