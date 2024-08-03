import React from 'react'
import { Link } from 'react-router-dom'
import './Users.css'
import { useParams } from 'react-router-dom'

const User = ({ user }) => {

    // const { email } = useParams();

    console.log(user);

  return (
    <Link to={`/users/${user?.email}`} className='user-profile-link'>
        <h3>{ user.name.charAt(0).toUpperCase() }</h3>
        <h5>{ user.name }</h5>
    </Link>
  )
}

export default User