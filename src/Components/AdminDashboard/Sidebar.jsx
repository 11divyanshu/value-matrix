import { ProSidebar, SidebarContent, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { adminDashboardRoutes } from "../../routes";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  const hasWindow = typeof window !== "undefined";

  const [permission, setPermissions] = React.useState({
    add_skills: false,
    add_users: false,
    list_candidates: false,
    list_companies: false,
    add_notifications: false,
    default: true,
  });
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] =  React.useState(false);
  // const hasWindow = typeof window !== "undefined";
  const handleToggle = () => {
    setToggled(!toggled);
    setCollapsed(!collapsed);
}

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

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");

      if (
        user1.permissions &&
        user1.permissions.length > 0 &&
        user1.permissions[0].admin_permissions
      ) {
        await setPermissions(user1.permissions[0].admin_permissions);
      }
      let user = await getUserFromId({ id: user1._id }, token);
      if (user.data.user.isAdmin) {
        await setPermissions({
          add_skills: true,
          add_users: true,
          list_candidates: true,
          list_companies: true,
          add_notifications: true,
          default: true,
        });
      } else if (
        user &&
        user.data.user &&
        user.data.user.user_type === "Admin_User" &&
        user.data.user.permissions
      ) {
        if (user.data.user.permissions[0]) {
          await setPermissions({
            ...user.data.user.permissions[0].admin_permissions,
            default: true,
          });
        }
      }
    };
    initial();
  }, []);

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
    <SidebarContent    className='text-left mx-5 mt-7'>
      <Menu iconShape="square">
                {adminDashboardRoutes.map((item) => {
                  if (item.hide === false && permission[item.permission] !== false)
                    return (
                      <MenuItem className='text-gray-700 font-semibold' active={window.location.pathname === `/admin${item.path}`}
                      icon={item.icon}>{item.name} <Link to={`/admin${item.path}`} onClick={()=> {setOpen(true)} 
                      
                    
                    } /></MenuItem>
                      )
                })}

</Menu>
      </SidebarContent>
    </ProSidebar>

    


    </div>
  );
};

export default Sidebar;
