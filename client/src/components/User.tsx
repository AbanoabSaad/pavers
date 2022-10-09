import { ReactElement, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserType from "../types/UserType";

interface Props {
  user: UserType
}

export const User:React.FC<Props> = ({user}): ReactElement => {
  return (
    <NavLink to={`/user/${user.id}`} className="bg-[#eff1f6] flex-center flex-col user-card min-w-[150px]">
      <p className="text-xl text-center">{user.first_name} {user.last_name}</p>
      <p>{user.email}</p>
    </NavLink>
  )
}