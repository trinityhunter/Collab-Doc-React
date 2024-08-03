import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import PrivateChat from './PrivateChat';

const UserProfile = () => {

  const { id } = useParams();

  console.log(id);

  const [users, setusers] = useState()

  const [currentProfile, setcurrentProfile] = useState()

  useEffect(() => {
    
    axios.get('https://collab-doc-springboot-production.up.railway.app/api/users')
    .then(function (response) {
      // handle success
      setusers(response.data)
      setcurrentProfile(response.data.filter((user) => user.email === id)[0])
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
    
  }, [setcurrentProfile, setusers])


  console.log(currentProfile);
  

  return (
    <div>
      {
        currentProfile!==undefined
        ?
        <PrivateChat currentProfile={currentProfile}/>
        :
        ""
      }
    </div>
  )
}

export default UserProfile