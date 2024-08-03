// import React, { useState, useEffect } from 'react';
// import './App.css';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
// import { useSelector, useDispatch } from 'react-redux'

// function App() {
//   const [username, setUsername] = useState('');
//   const [isChatActive, setIsChatActive] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [stompClient, setStompClient] = useState(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [connecting, setConnecting] = useState(true);

//   var User = useSelector((state) => (state.currentUserReducer))

//   const colors = [
//     '#2196F3', '#32c787', '#00BCD4', '#ff5652',
//     '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
//   ];

//   useEffect(() => {
//     setUsername(User.user.name)
//     if (stompClient) {
//       stompClient.onConnect = onConnected;
//       stompClient.onStompError = onError;
//       stompClient.activate();
//     }
//     // Cleanup on component unmount
//     return () => {
//       if (stompClient) {
//         stompClient.deactivate();
//       }
//     };
//   }, [stompClient]);

//   const connect = (event) => {
//     event.preventDefault();
//     if (username.trim()) {
//       setIsChatActive(true);
//       const socket = new SockJS('https://collab-doc-springboot-production.up.railway.app/ws-stomp');
//       const stompClient = Stomp.over(socket);
//       setStompClient(stompClient);
//     }
//   };

//   const onConnected = () => {
//     stompClient.subscribe('/topic/public', onMessageReceived);
//     stompClient.publish({
//       destination: "/app/chat.addUser",
//       body: JSON.stringify({ sender: username, type: 'JOIN' }),
//     });
//     setConnecting(false);
//   };

//   const onError = () => {
//     setConnecting(false);
//   };

//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (messageInput.trim() && stompClient) {
//       const chatMessage = {
//         sender: username,
//         content: messageInput,
//         type: 'CHAT'
//       };
//       stompClient.publish({
//         destination: "/app/chat.sendMessage",
//         body: JSON.stringify(chatMessage),
//       });
//       setMessageInput('');
//     }
//   };

//   const onMessageReceived = (payload) => {
//     const message = JSON.parse(payload.body);
//     setMessages((prevMessages) => [...prevMessages, message]);
//   };

//   const getAvatarColor = (messageSender) => {
//     let hash = 0;
//     for (let i = 0; i < messageSender.length; i++) {
//       hash = 31 * hash + messageSender.charCodeAt(i);
//     }
//     const index = Math.abs(hash % colors.length);
//     return colors[index];
//   };

//   return (
//     <div className="app">
//       {!isChatActive ? (
//         <div id="username-page">
//           <div className="username-page-container">
//             <h1 className="title">Let's Enter Chat</h1>
//             <form id="usernameForm" name="usernameForm" onSubmit={connect}>
//               <div className="form-group">
//                 {/* <input
//                   type="text"
//                   id="name"
//                   placeholder="Username"
//                   autoComplete="off"
//                   className="form-control"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 /> */}
//               </div>
//               <div className="form-group">
//                 <button type="submit" className="accent username-submit">Start Chatting</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       ) : (
//         <div id="chat-page">
//           <div className="chat-container">
//             <div className="chat-header">
//               <h2>Spring WebSocket Chat Demo</h2>
//             </div>
//             {connecting && <div className="connecting">Connecting...</div>}
//             <ul id="messageArea">
//               {messages.map((message, index) => (
//                 <li key={index} className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
//                   {message.type !== 'CHAT' ? (
//                     <p>{message.sender} {message.type === 'JOIN' ? 'joined!' : 'left!'}</p>
//                   ) : (
//                     <>
//                       <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
//                       <span>{message.sender}</span>
//                       <p>{message.content}</p>
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>
//             <form id="messageForm" name="messageForm" onSubmit={sendMessage}>
//               <div className="form-group">
//                 <div className="input-group clearfix">
//                   <input
//                     type="text"
//                     id="message"
//                     placeholder="Type a message..."
//                     autoComplete="off"
//                     className="form-control"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                   />
//                   <button type="submit" className="primary">Send</button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './GroupChat.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useSelector } from 'react-redux';

function GroupChat() {
  const [username, setUsername] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [connecting, setConnecting] = useState(true);

  var User = useSelector((state) => (state.currentUserReducer))

  const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  useEffect(() => {
    setUsername(User.user.name);
    axios.get('https://collab-doc-springboot-production.up.railway.app/api/messages')
      .then(response => {
        setMessages(response.data.filter((message) => message.recipient == null));
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
        type: 'CHAT'
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

  return (
    <div className="GroupChat">
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
        <div id="chat-page">
          <div className="chat-container">
            <div className="chat-header">
              <h2>Spring WebSocket Chat Demo</h2>
            </div>
            {connecting && <div className="connecting">Connecting...</div>}
            <ul id="messageArea">
              {messages.map((message, index) => (
                <li key={index} className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
                  {message.type !== 'CHAT' ? (
                    // <p>{message.sender} {message.type === 'JOIN' ? 'joined!' : 'left!'}</p>
                    <p></p>
                  ) : (
                    <>
                      <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
                      <span>{message.sender}</span>
                      <p>{message.content}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <form id="messageForm" name="messageForm" onSubmit={sendMessage}>
              <div className="form-group">
                <div className="input-group clearfix">
                  <input
                    type="text"
                    id="message"
                    placeholder="Type a message..."
                    autoComplete="off"
                    className="form-control"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button type="submit" className="primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        </>

      )}
    </div>
  );
}

export default GroupChat;
















// import React, { useState, useEffect } from 'react';
// import './GroupChat.css';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function GroupChat() {
//   const [username, setUsername] = useState('');
//   const [isChatActive, setIsChatActive] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [stompClient, setStompClient] = useState(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [connecting, setConnecting] = useState(true);
//   const [recipient, setRecipient] = useState('');  // New state for recipient

//   const User = useSelector((state) => state.currentUserReducer);

//   const colors = [
//     '#2196F3', '#32c787', '#00BCD4', '#ff5652',
//     '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
//   ];

//   useEffect(() => {
//     setUsername(User.user.name);
//     axios.get('https://collab-doc-springboot-production.up.railway.app/api/messages')
//       .then(response => {
//         setMessages(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the messages!', error);
//       });

//     if (stompClient) {
//       stompClient.onConnect = onConnected;
//       stompClient.onStompError = onError;
//       stompClient.activate();
//     }
//     return () => {
//       if (stompClient) {
//         stompClient.deactivate();
//       }
//     };
//   }, [stompClient]);

//   const connect = (event) => {
//     event.preventDefault();
//     if (username.trim()) {
//       setIsChatActive(true);
//       const socket = new SockJS('https://collab-doc-springboot-production.up.railway.app/ws-stomp');
//       const stompClient = Stomp.over(socket);
//       setStompClient(stompClient);
//     }
//   };

//   const onConnected = () => {
//     stompClient.subscribe('/user/queue/messages', onMessageReceived);  // Subscribing to private messages
//     stompClient.subscribe('/topic/public', onMessageReceived);  // Subscribing to public messages
//     stompClient.publish({
//       destination: "/app/chat.addUser",
//       body: JSON.stringify({ sender: username, type: 'JOIN' }),
//     });
//     setConnecting(false);
//   };

//   const onError = () => {
//     setConnecting(false);
//   };

//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (messageInput.trim() && stompClient) {
//       const chatMessage = {
//         sender: username,
//         content: messageInput,
//         type: 'CHAT',
//         recipient: recipient.trim()  // Include recipient if it's a private message
//       };
//       stompClient.publish({
//         destination: "/app/chat.sendMessage",
//         body: JSON.stringify(chatMessage),
//       });
//       setMessageInput('');
//     }
//   };

//   const onMessageReceived = (payload) => {
//     const message = JSON.parse(payload.body);
//     setMessages((prevMessages) => [...prevMessages, message]);
//   };

//   const getAvatarColor = (messageSender) => {
//     let hash = 0;
//     for (let i = 0; i < messageSender.length; i++) {
//       hash = 31 * hash + messageSender.charCodeAt(i);
//     }
//     const index = Math.abs(hash % colors.length);
//     return colors[index];
//   };

//   return (
//     <div className="GroupChat">
//       {!isChatActive ? (
//         <div id="username-page">
//           <div className="username-page-container">
//             <h1 className="title">Let's Enter Chat</h1>
//             <form id="usernameForm" name="usernameForm" onSubmit={connect}>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   id="recipient"
//                   placeholder="Recipient (optional)"
//                   className="form-control"
//                   value={recipient}
//                   onChange={(e) => setRecipient(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <button type="submit" className="accent username-submit">Start Chatting</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       ) : (
//         <div id="chat-page">
//           <div className="chat-container">
//             <div className="chat-header">
//               <h2>Spring WebSocket Chat Demo</h2>
//             </div>
//             {connecting && <div className="connecting">Connecting...</div>}
//             <ul id="messageArea">
//               {messages.map((message, index) => (
//                 <li key={index} className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
//                   {message.type !== 'CHAT' ? (
//                     <p>{message.sender} {message.type === 'JOIN' ? 'joined!' : 'left!'}</p>
//                   ) : (
//                     <>
//                       <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
//                       <span>{message.sender}</span>
//                       <p>{message.content}</p>
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>
//             <form id="messageForm" name="messageForm" onSubmit={sendMessage}>
//               <div className="form-group">
//                 <div className="input-group clearfix">
//                   <input
//                     type="text"
//                     id="message"
//                     placeholder="Type a message..."
//                     autoComplete="off"
//                     className="form-control"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                   />
//                   <button type="submit" className="primary">Send</button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GroupChat;
