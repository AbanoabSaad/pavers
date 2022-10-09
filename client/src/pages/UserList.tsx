import { ReactElement, useEffect, useState } from "react";
import axios from 'axios';
import UserType from "../types/UserType";
import { User } from "../components/User";
import { NavLink } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

export default function UserList(): ReactElement {
  useEffect(() => {
    document.title = "Pavers | Users";
  }, [])

  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {
    await axios.get('https://abanoab-saad-pavers.herokuapp.com/users')
    .then((res) => {
      setUsers(res.data)
    })
    .catch((err) => setError(err.response.data.message))

    setLoading(false);
  }

  return (
    <div className="md:mx-[10%] mx-6 py-5 sm:py-10 page-height flex items-center flex-col">
      <h1 className="text-2xl mb-5 sm:mb-10 text-center">Users</h1>
      { error &&
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          <span><span className="font-medium">Error!</span> {error}</span>
        </div>
      }
      <div className="flex-center flex-wrap gap-5">
        {users.map((user: UserType) => <User key={user.id} user={user}/>)}
        {(!error && !loading && users.length == 0) && 
          <div className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800">
            <span><span className="font-medium">Warning!</span> There is no users in the system to display. <NavLink to="/" className="text-blue-900 underline">Click here</NavLink> to add a user.</span>
          </div>
        }
      </div>
      {users.length > 0 && <NavLink to="/" className="sm:mb-0 blue-button flex-center mt-10">Add another user</NavLink>}
    </div>
  )
}