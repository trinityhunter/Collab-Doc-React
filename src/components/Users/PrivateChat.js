import React, { useState, useEffect } from 'react';
import './PrivateChat.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PrivateChat({currentProfile}) {
  const [username, setUsername] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [connecting, setConnecting] = useState(true);

  const recipient = currentProfile.name;

  console.log(currentProfile.name);

  var User = useSelector((state) => (state.currentUserReducer))

  console.log(User);

  const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  useEffect(() => {
    setUsername(User.user.name);
    axios.get('https://collab-doc-springboot-production.up.railway.app/api/messages')
      .then(response => {
        
        setMessages(response.data.filter((message) => 
            (User.user.name === message.sender && currentProfile.name === message.recipient) ||
            (User.user.name === message.recipient && currentProfile.name === message.sender)
        ));
        console.log(response.data.filter((message) => 
            (User.user.name === message.sender && currentProfile.name === message.recipient) ||
            (User.user.name === message.recipient && currentProfile.name === message.sender)
        ));
      })
      .catch(error => {
        console.error('There was an error fetching the messages!', error);
      });

    if (stompClient) {
      stompClient.onConnect = onConnected;
      stompClient.onStompError = onError;
      stompClient.activate();
    }
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  const connect = (event) => {
    event.preventDefault();
    if (username.trim()) {
      setIsChatActive(true);
      const socket = new SockJS('https://collab-doc-springboot-production.up.railway.app/ws-stomp');
      const stompClient = Stomp.over(socket);
      setStompClient(stompClient);
    }
  };

  const onConnected = () => {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify({ sender: username, type: 'JOIN' }),
    });
    setConnecting(false);
  };

  const onError = () => {
    setConnecting(false);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (messageInput.trim() && stompClient) {
      const chatMessage = {
        sender: username,
        content: messageInput,
        type: 'CHAT',
        recipient: recipient
      };
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessageInput('');
    }
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const getAvatarColor = (messageSender) => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  // return (
  //   <div className="GroupChat">
      
  //     {!isChatActive ? (
  //       <div id="username-page">
  //         <div className="username-page-container">
  //           <h1 className="title">Let's Enter Chat</h1>
  //           <form id="usernameForm" name="usernameForm" onSubmit={connect}>
  //             <div className="form-group">
  //               {/* <input
  //                 type="text"
  //                 id="name"
  //                 placeholder="Username"
  //                 autoComplete="off"
  //                 className="form-control"
  //                 value={username}
  //                 onChange={(e) => setUsername(e.target.value)}
  //               /> */}
  //             </div>
  //             <div className="form-group">
  //               <button type="submit" className="accent username-submit">Start Chatting</button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     ) : (



  //       <div id="chat-page">
  //         <div className="chat-container">
  //           <div className="chat-header">
  //             <h2>Spring WebSocket Chat Demo</h2>
  //           </div>
  //           {connecting && <div className="connecting">Connecting...</div>}
  //           <ul id="messageArea">
  //             {messages.map((message, index) => (
  //               <li key={index} className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
  //                 {message.type !== 'CHAT' ? (
  //                   <p>{message.sender} {message.type === 'JOIN' ? 'joined!' : 'left!'}</p>
  //                 ) : (
  //                   <>
  //                     <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
  //                     <span>{message.sender}</span>
  //                     <p>{message.content}</p>
  //                   </>
  //                 )}
  //               </li>
  //             ))}
  //           </ul>
  //           <form id="messageForm" name="messageForm" onSubmit={sendMessage}>
  //             <div className="form-group">
  //               <div className="input-group clearfix">
  //                 <input
  //                   type="text"
  //                   id="message"
  //                   placeholder="Type a message..."
  //                   autoComplete="off"
  //                   className="form-control"
  //                   value={messageInput}
  //                   onChange={(e) => setMessageInput(e.target.value)}
  //                 />
  //                 <button type="submit" className="primary">Send</button>
  //               </div>
  //             </div>
  //           </form>
  //         </div>
  //       </div>

  //     )}
  //   </div>
  // );


  return (
    <div>
        {!isChatActive ? (
        <div id="username-page">
          <div className="username-page-container">
            <h1 className="title">Let's Enter Chat</h1>
            <form id="usernameForm" name="usernameForm" onSubmit={connect}>
              <div className="form-group">
                {/* <input
                  type="text"
                  id="name"
                  placeholder="Username"
                  autoComplete="off"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                /> */}
              </div>
              <div className="form-group">
                <button type="submit" className="accent username-submit">Start Chatting</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
      <div className="group-chat-container">
        <div className="group-chat-top-bar">{currentProfile.name}</div>
        <div className="group-chat-messages">
          <ul id="messageArea">
            {messages.map((message, index) => (
              <li
                key={index}
                className={
                  message.type === "JOIN" || message.type === "LEAVE"
                    ? "event-message"
                    : "chat-message"
                }
              >
                {message.type !== "CHAT" ? (
                  <p>
                    {message.sender}{" "}
                    {message.type === "JOIN" ? "joined!" : "left!"}
                  </p>
                ) : (
                  <>
                    <i
                      style={{
                        backgroundColor: getAvatarColor(message.sender),
                      }}
                    >
                      {message.sender[0]}
                    </i>
                    <span>{message.sender}</span>
                    <p>{message.content}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="group-chat-bottom-bar">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      </>
      )}
    </div>
  );

}

export default PrivateChat;