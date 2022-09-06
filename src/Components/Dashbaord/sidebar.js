import {
  ProSidebar,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import { RiAdminFill } from "react-icons/ri";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);

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
      {/* <div className="fixed bg-blue-500 left-3 top-3 rounded-full text-white p-2">
      <AiOutlineMenu className="text-md" onClick={()=>{setOpen(false);}}/>
      </div>
    <ProSidebar
      width={200}
      collapsedWidth={windowDimensions.width < 769 ? 1 : 65}
      className="fixed left-0 h-screen z-10"
      collapsed={open}
    >
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem
            icon={
              open ? (
                <AiOutlineMenu className="text-xl" />
              ) : (
                <AiOutlineClose className="text-xl" />
              )
            }
            onClick={() => setOpen(!open)}
          >
            Repute Hire
          </MenuItem>
          {dashboardRoutes.map((item) => {
            if(item.hide === false)
            return (
                <MenuItem icon={item.icon}>{item.name} <Link to={`/user/${item.path}`} onClick={()=>setOpen(true)} /></MenuItem>
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
    </ProSidebar> */}

      <div className="flex">
        <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
          <div className="space-y-3">
            <div className="flex items-center">
              {/* <h2 className="text-xl font-bold px-3">Dashboard</h2> */}
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

      </div>
    </div>
  );
};

export default Sidebar;
