import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage/Homepage.js'
import AuthForm from './components/AuthForm/AuthForm'
import Editor from './components/Editor/Editor.js'
import App from './components/GroupChat/GroupChat.js'
import Users from './components/Users/Users.js'
import UserProfile from './components/Users/UserProfile.js'
import VideoCall from './components/Videocall/VideoCall.js'
import LobbyScreen from './screens/Lobby.js'
import RoomPage from './screens/Room.js'
import Test from './components/Homepage/Test.js'

const AllRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Homepage/>}/>
            <Route path='/auth' element={<AuthForm />}/>
            <Route path='/editor' element={<Editor />}/>
            <Route path='/groupChat' element={<Test />}/>
            {/* <Route path='/test' element={<Test />}/> */}

            {/* <Route path="/lobby" element={<LobbyScreen />} />
            <Route path="/room/:roomId" element={<RoomPage />} /> */}
            {/* <Route path='/videoCall' element={<VideoCall />}/> */}
            <Route path='/users' element={<Users />}/>
            <Route path='/users/:id' element={<UserProfile />}/>
        </Routes>
    </div>
  )
}

export default AllRoutes