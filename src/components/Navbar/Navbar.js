import React, { useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../Avatar/Avatar'
import { setCurrentUser } from '../../actions/currentUser';
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    var User = useSelector((state) => (state.currentUserReducer))

    console.log(User);
    

    const handleLogOut = () => {
        dispatch({ type: 'LOGOUT' })
        navigate('/')
        dispatch(setCurrentUser(null))
    }


    useEffect(() => {

        const token  = User?.token

        if(token){
            const decodedToken = jwtDecode(token)

            if(decodedToken.exp * 1000 < new Date().getTime()){
                handleLogOut()
            }
        }

        dispatch(setCurrentUser(JSON.parse(localStorage.getItem('Profile'))))
        // eslint-disable-next-line
    }, [User?.token, dispatch])
    

  return (
    <nav className="main-nav">
        <div className="navbar">
            <Link to='/' className='nav-item nav-logo'>
                <h1 style={{fontWeight: "bold"}}>Collab-Doc</h1>
            </Link>
            {
                User === null ?
                <Link to='/Auth' className='nav-item nav-btn'>Live Doc</Link>
                :
                <Link to='/editor' className='nav-item nav-btn'>Live Doc</Link>

            }
            {
                User === null ?
                <Link to='/Auth' className='nav-item nav-btn'>Group Chat</Link>
                :
                <Link to='/groupChat' className='nav-item nav-btn'>Group Chat</Link>

            }
            {
                User === null ?
                <Link to='/Auth' className='nav-item nav-btn'>Users</Link>
                :
                <Link to='/users' className='nav-item nav-btn'>Users</Link>

            }
            
            <form>
                <input type="text" placeholder='Search...' />
            </form>
            {User === null ? 
                <Link to='/Auth' className='nav-item nav-links'>Log In</Link>
                :
                <>
                    <Avatar backgroundColor='#009bff' px='10px' py='7px' borderRadius='50%' color='white' ><Link style={{textDecoration: "none"}}>{User.user.name.charAt(0).toUpperCase()}</Link></Avatar>
                    <button className='nav-item nav-links' onClick={handleLogOut}>Log Out</button>
                </>
            }
        </div>
    </nav>
  )
}

export default Navbar;