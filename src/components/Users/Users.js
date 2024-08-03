import React, { useState, useEffect } from 'react'
import axios from 'axios'
import User from './User'


const Users = () => {

    const [users, setusers] = useState(null)

    useEffect(() => {
      
        axios.get('https://collab-doc-springboot-production.up.railway.app/api/users')
        .then(function (response) {
            // handle success
            setusers(response.data)
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
        
    }, [])
    

  return (
    <div style={{marginTop: "70px"}}>
        {
            users!== null
            ?
            users.map((user) => (
                <User user={user} key={user.email}/>
            ))
            :
            ""
        }
    </div>
  )
}

export default Users