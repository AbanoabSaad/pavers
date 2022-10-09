import { ReactElement, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { UsersIcon } from "@heroicons/react/24/outline";

export default function Header(): ReactElement {
  return (
    <div className="flex items-center justify-between bg-[#eff1f6] md:px-[10%] px-6 py-5">
      <a href="/">
        <Logo className="w-40" />
      </a>
      
      <NavLink to="/users" className="flex-center border border-[#004d6d] rounded-xl p-1.5 hover:text-white hover:bg-[#004d6d]">
        <UsersIcon className="w-5 mr-2" />
        <span>Users</span>
      </NavLink>
    </div>
  )
}