import { ReactElement, SyntheticEvent, useEffect, useMemo, useRef, useState} from "react";
import axios from 'axios';
import Interest from "../types/Interest";
import FormData from 'form-data';
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { NavLink } from "react-router-dom";

export default function Home(): ReactElement {
  useEffect(() => {
    document.title = "Pavers | Home";
  }, [])

  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestData, setInterestData] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const childrenRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getInterests();
  }, [])

  const getInterests = () => {
    axios.get('https://abanoab-saad-pavers.herokuapp.com/interests')
    .then((res) => {
      setInterests(res.data)
    })
    .catch(() => {})
  }

  const changeInterest = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!interestData.includes(id)) {
      setInterestData(data => [...data, id]);
    } else {
      setInterestData(interestData.filter((x: number) => x != id))
    }
  }

  const checkFile = () => {
    if (fileRef && fileRef.current && fileRef.current.files && fileRef.current.files.length == 1) {
      const file = fileRef.current.files[0];
      
      const size = Math.trunc(file.size / (1024 * 1024));

      if (size > 10) {
        setError('Please upload another file - max file size is 10mb.');
        setSuccess('');
        return false;
      } else {
        setError('');
        return true;
      }
    }

    return true;
  }

  const clearCheckboxes = () => {
    let element: HTMLInputElement  | null = null;

    for (let i = 0; i < interests.length; i++) {
      element = document.getElementById(interests[i].id.toString()) as HTMLInputElement;

      if (element && element.checked) {
        element.checked = false;
      }
    }
  }
  
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!checkFile()) {
      setError('Please upload another file - max file size is 10mb.');
      setSuccess('');
      return;
    }

    if (firstNameRef.current && lastNameRef.current && emailRef.current && dobRef.current && childrenRef.current && fileRef.current) {

      const firstName: string = firstNameRef.current.value;
      const lastName: string = lastNameRef.current.value;
      const email: string = emailRef.current.value;
      const date_of_birth: string = dobRef.current.value;
      const children_count: string = childrenRef.current.value;
      let picture: File | null = null;
      if (fileRef.current.files &&  fileRef.current.files.length == 1) {
        picture = fileRef.current.files[0];
      }

      let data = new FormData();
      data.append('first_name', firstName);
      data.append('last_name', lastName);
      data.append('email', email);
      data.append('date_of_birth', date_of_birth);
      data.append('children_count', children_count);
      if (picture) {
        data.append('picture', picture, picture.name);
      }
      data.append('interest', interestData);

      axios.post('https://abanoab-saad-pavers.herokuapp.com/register', data, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      })
      .then((res) => {
        setSuccess(res.data.message);
        setUserId(res.data.id);
        setError('');

        setInterestData([]);
        clearCheckboxes();

        if (firstNameRef.current && lastNameRef.current && emailRef.current && dobRef.current && childrenRef.current && fileRef.current) {
          firstNameRef.current.value = '';
          lastNameRef.current.value = '';
          emailRef.current.value = '';
          dobRef.current.value = '';
          childrenRef.current.value = '';
          fileRef.current.value  = '';
        }
      })
      .catch((err) => {
        setError(err.response.data.message)
        setSuccess('');
      })
    }
  }

  return (
    <div className="md:mx-[10%] mx-6 page-height flex flex-col items-center py-5 sm:py-10">
      <form onSubmit={handleSubmit} className="w-full sm:w-96">
        <h1 className="text-2xl pb-5 sm:pb-10">Create your account</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5 mb-3">
          <div>
            <label htmlFor="firstName">First name<span className="text-red-500	">*</span></label>
            <input ref={firstNameRef} autoFocus type="text" id="firstName" className="input-field p-2.5" placeholder="John" required />
          </div>

          <div>
            <label htmlFor="lastName">Surname<span className="text-red-500">*</span></label>
            <input ref={lastNameRef} autoFocus type="text" id="lastName" className="input-field p-2.5" placeholder="Smith" required />
          </div>
        </div>

        
        <label htmlFor="email">Email address<span className="text-red-500">*</span></label>
        <input ref={emailRef} type="email" id="email" className="input-field mb-3 p-2.5" placeholder="john@gmail.com" required />

        <div className="grid grid-cols-2 gap-5 mb-3">
          <div>
            <label htmlFor="email">Date of birth<span className="text-red-500">*</span></label>
            <input ref={dobRef} type="date" id="email" className="input-field p-[0.5625rem]" required />
          </div>
          <div>
            <label htmlFor="children">No. of children?<span className="text-red-500">*</span></label>
            <input ref={childrenRef} min={0} max={32767} type="number" id="children" className="input-field p-2.5" placeholder="2" required />
          </div>
        </div>

        <span>Upload profile picture</span>
        <input ref={fileRef} type="file" accept="image/*" className="input-field mb-3 p-[0.4375rem]" placeholder="hi" onChange={() => checkFile()}/>

        { interests.length > 0 && (
          <>
            <label htmlFor="email" className="font-bold">Interests</label>
            <p className="text-sm mb-3">Please select all applicable options.</p>
            <div className="grid grid-cols-2 mb-3 w-full">
              {interests.map((x: Interest) => {
                return (
                  <div key={x.id}>
                    <input type="checkbox" id={`${x.id}`} name={x.name} value={x.id} onChange={(e) => changeInterest(x.id, e)}/>
                    <label htmlFor={`${x.id}`} className="ml-2">{x.name}</label>
                  </div>
                )
              })}
            </div>
          </>
        )}
        { error &&
          <div className="p-[0.6875rem] mb-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            <span><span className="font-medium">Error!</span> {error}</span>
          </div>
        }
        { success &&
          <div className="p-[0.6875rem] mb-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 flex">
            <span className="whitespace-pre">Success, { success }! </span>
            <NavLink to={`/user/${userId}`} className="flex">
              <span className="text-blue-900 underline">View user</span>
              <ArrowRightIcon className="w-5 ml-[5px]" />
            </NavLink>
          </div>
        }
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  )
}