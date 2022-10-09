import { ReactElement, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from 'axios';
import UserType from "../types/UserType";
import { CalendarDaysIcon, AtSymbolIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import unknownImg from '../assets/unknown.png'


export default function User(): ReactElement {
  const { id } = useParams()
  const [user, setUser] = useState<UserType>()
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUser();
  }, [])

  
  useEffect(() => {
    document.title = `Pavers | ${user ? `${user.first_name} ${user.last_name}` : 'User'}`
  }, [user])

  const getUser = () => {
    axios.get(`https://abanoab-saad-pavers.herokuapp.com/user/${id}`)
    .then((res) => setUser(res.data))
    .catch((err) => setError(err.response.data.message))
  }

  const dateString = (date: string) => {
    return new Date(date).toLocaleDateString();
  }

  return (
    <div className="md:mx-[10%] mx-6 flex flex-col items-center page-height py-5 sm:py-10 sm:relative">
      <NavLink to="/users" className="sm:absolute sm:left-0 mb-5 sm:mb-0 blue-button flex-center mr-auto">
        <ArrowLeftIcon className="w-5 mr-[5px]"/>Back
      </NavLink>
      { error && 
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          <span><span className="font-medium">Error!</span> {error}</span>
        </div>
      }
      { user && (
        <>
          <p className="text-5xl mb-5">{user.first_name} {user.last_name}</p>
          <div className="flex flex-col gap-y-2 mb-5">
            <div className="flex-center">
              <AtSymbolIcon className="w-6 mr-2" />
              <a href={`mailto:${user.email}`} className="text-blue-900 underline w-full">{user.email}</a>
            </div>
            <div className="flex-center">
              <CalendarDaysIcon className="w-6 mr-2" />
              <p className="w-full">{dateString(user.date_of_birth)}</p>
            </div>
          </div>
          <img className="rounded-2xl drop-shadow mb-5 sm:mb-10 max-w-[200px]" src={user.picture ?? unknownImg}/>
          <div className="flex flex-col gap-y-2">
            <p>No. of children? {user.children_count}</p>
            <p>Interests:</p>
            <div className="flex-center flex-wrap gap-2 mt-2 max-w-xs">
              { user.interest?.map((x: string) => {
                return (
                  <p className="bg-slate-200 p-2.5 text-sm rounded-3xl" key={x}>{x}</p>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}