import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import {AiOutlineMenu,AiOutlineClose} from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <ProSidebar
    style={{backgroundColor:"red !important"}}
      width={200}
      collapsedWidth={65}
      className="fixed left-0 h-screen z-10"
      collapsed={open}
    >
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={open ?<AiOutlineMenu className="text-xl"/>:<AiOutlineClose className="text-xl"/>} onClick={() => setOpen(!open)}>Repute Hire</MenuItem>
          {dashboardRoutes.map((item) => {
            return (
              <MenuItem to={item.path} icon={item.icon}>
                {item.name}
              </MenuItem>
            );
          })}
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
