import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { HomeIcon, ShipWheelIcon, UsersIcon, BellIcon, CircleFadingPlusIcon } from "lucide-react";
import ConnectLiveLogo from "./ConnectLiveLogo";

const Sidebar = () => {

    const {authUser} = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">

      <Link to = "/" className="flex items-center justify-center h-16 border-b border-base-300">
        <ConnectLiveLogo />
      </Link>
        
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active border-amber-50" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active border-amber-50" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active border-amber-50" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>

        <Link
          to="/add-post"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/add-post" ? "btn-active border-amber-50" : ""
          }`}
        >
          <CircleFadingPlusIcon className="size-5 text-base-content opacity-70" />
          <span>Add Post</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <Link to = {`/user-profile`}>
        <div className="p-4 border-t border-base-300 mt-auto btn flex justify-start btn-ghost border-none m-2">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full border ">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className ="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </Link>
    </aside>
  )
}

export default Sidebar
