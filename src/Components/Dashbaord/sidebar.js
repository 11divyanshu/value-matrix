import {
  ProSidebar,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import {FaUserCog} from "react-icons/fa";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  console.log(props.user);
  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return (
    <div className="relative h-screen">
      <div className="fixed bg-blue-500 left-3 top-3 rounded-full text-white p-2">
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
    </ProSidebar>
    </div>
  );
};

export default Sidebar;
