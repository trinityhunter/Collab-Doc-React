// import React, { useEffect, useState, useRef } from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-monokai";
// import { useSelector, useDispatch } from 'react-redux';
// import { userTyping, userStoppedTyping } from '../../actions/typing'
// import axios from "axios";
// import copy from 'copy-to-clipboard'

// const Editor = () => {
//   const [content, setContent] = useState(`console.log("Hello World")`);
//   const [isTyping, setIsTyping] = useState(false);
//   const socketRef = useRef(null);
//   const User = useSelector((state) => state.currentUserReducer);
//   const typingUsers = useSelector((state) => state.typingReducer); // Update to use typingReducer
//   const dispatch = useDispatch();



//   useEffect(() => {
//     socketRef.current = new WebSocket("ws://localhost:8080/ws-custom");

//     socketRef.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === 'content') {
//         setContent(message.data);
//       } else if (message.type === 'typing') {
//         dispatch(userTyping(message.user.userId, message.user.name));
//       } else if (message.type === 'stoppedTyping') {
//         dispatch(userStoppedTyping(message.user.userId));
//       }
//     };

//     return () => {
//       socketRef.current.close();
//     };
//   }, [dispatch]);

//   const handleChange = (value) => {
//     setContent(value);
//     setIsTyping(true);

//     const message = JSON.stringify({
//       type: 'content',
//       data: value,
//       user: { userId: User.user.id, name: User.user.name },
//     });

//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(message);
//     } else {
//       socketRef.current = new WebSocket("ws://localhost:8080/ws-custom");
//       socketRef.current.onopen = () => {
//         socketRef.current.send(message);
//       };
//     }

//     const typingMessage = JSON.stringify({
//       type: 'typing',
//       user: { userId: User.user.id, name: User.user.name },
//     });

//     socketRef.current.send(typingMessage);

//     setTimeout(() => {
//       setIsTyping(false);
//       const stoppedTypingMessage = JSON.stringify({
//         type: 'stoppedTyping',
//         user: { userId: User.user.id, name: User.user.name },
//       });
//       socketRef.current.send(stoppedTypingMessage);
//     }, 3000);
//   };

//   const handleSaveCode = () => {
//     axios.post('https://collab-doc-springboot-production.up.railway.app/api/document', content)
//     .then(response => {
//       console.log('PUT request successful:', response.data);
//     })
//     .catch(error => {
//       console.error('Error during PUT request:', error);
//     });
//   };

//   const handleGetCode = () => {
//     axios.get('https://collab-doc-springboot-production.up.railway.app/api/document')
//     .then(response => {
//       console.log(response.data);
//       copy(response.data.content)
//       alert("Old Code Copied to Clipboard");
//       // setContent(response.data.content); // Assuming response.data is structured as { content: "..." }
//     })
//     .catch(error => {
//       console.error('Error during GET request:', error);
//     });
//   };

//   return (
//     <div>
//       <AceEditor
//         mode="javascript"
//         theme="monokai"
//         value={content}
//         onChange={handleChange}
//         name="UNIQUE_ID_OF_DIV"
//         editorProps={{ $blockScrolling: true }}
//         setOptions={{ useWorker: false }}
//         style={{ width: "70%", height: "400px", margin: "100px" }}
//       />
//       <div>
//         <button onClick={handleSaveCode}>Save Code</button>
//         <button onClick={handleGetCode}>Retrieve Old Code</button>
//       </div>
//       {/* {isTyping && <p>{User.user.name} is Typing...</p>} */}
//       {Object.values(typingUsers).map((name, index) => (
//         <p key={index}>{name} is Typing...</p>
//       ))}
//     </div>
//   );
// };

// export default Editor;


/////////////////////////////////////////////////////////////////


// import React, { useEffect, useState, useRef } from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-monokai";
// import { useSelector, useDispatch } from 'react-redux';
// import { userTyping, userStoppedTyping } from '../../actions/typing';
// import { Client } from '@stomp/stompjs';

// const Editor = () => {
//   const [content, setContent] = useState("Hii");
//   const User = useSelector((state) => state.currentUserReducer);
//   const typingUsers = useSelector((state) => state.typingReducer); 
//   const dispatch = useDispatch();
//   const client = useRef(null);

//   useEffect(() => {
//     client.current = new Client({
//       brokerURL: 'ws://localhost:8080/ws-stomp',
//       onConnect: () => {
//         client.current.subscribe('/topic/content', (message) => {
//           const body = JSON.parse(message.body);
//           setContent(body.data);
//         });

//         client.current.subscribe('/topic/typing', (message) => {
//           const body = JSON.parse(message.body);
//           dispatch(userTyping(body.user.userId, body.user.name));
//         });

//         client.current.subscribe('/topic/stoppedTyping', (message) => {
//           const body = JSON.parse(message.body);
//           dispatch(userStoppedTyping(body.user.userId));
//         });
//       },
//       onStompError: (frame) => {
//         console.error(`Broker reported error: ${frame.headers['message']}`);
//         console.error(`Additional details: ${frame.body}`);
//       }
//     });

//     client.current.activate();

//     return () => {
//       client.current.deactivate();
//     };
//   }, [dispatch]);

//   const handleChange = (value) => {
//     setContent(value);

//     const message = {
//       type: 'content',
//       data: value,
//       user: { userId: User.user.id, name: User.user.name },
//     };

//     if (client.current.connected) {
//       client.current.publish({ destination: '/app/content', body: JSON.stringify(message) });
//     }

//     const typingMessage = {
//       type: 'typing',
//       user: { userId: User.user.id, name: User.user.name },
//     };

//     client.current.publish({ destination: '/app/typing', body: JSON.stringify(typingMessage) });

//     setTimeout(() => {
//       const stoppedTypingMessage = {
//         type: 'stoppedTyping',
//         user: { userId: User.user.id, name: User.user.name },
//       };
//       client.current.publish({ destination: '/app/stoppedTyping', body: JSON.stringify(stoppedTypingMessage) });
//     }, 3000);
//   };

//   return (
//     <div>
//       <AceEditor
//         mode="javascript"
//         theme="monokai"
//         value={content}
//         onChange={handleChange}
//         name="UNIQUE_ID_OF_DIV"
//         editorProps={{ $blockScrolling: true }}
//         setOptions={{ useWorker: false }}
//         style={{ width: "70%", height: "400px", margin: "100px" }}
//       />
//       {Object.values(typingUsers).map((name, index) => (
//         <p key={index}>{name} is Typing...</p>
//       ))}
//     </div>
//   );
// };

// export default Editor;





import React, { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { useSelector, useDispatch } from 'react-redux';
import { userTyping, userStoppedTyping } from '../../actions/typing';
import axios from "axios";
import copy from 'copy-to-clipboard';
import './Editor.css';

const Editor = () => {
  const [content, setContent] = useState(`console.log("Hello World")`);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const User = useSelector((state) => state.currentUserReducer);
  const typingUsers = useSelector((state) => state.typingReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = new WebSocket("ws://collab-doc-springboot-production.up.railway.app/ws-custom");

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'content') {
        setContent(message.data);
      } else if (message.type === 'typing') {
        dispatch(userTyping(message.user.userId, message.user.name));
      } else if (message.type === 'stoppedTyping') {
        dispatch(userStoppedTyping(message.user.userId));
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, [dispatch]);

  const handleChange = (value) => {
    setContent(value);
    setIsTyping(true);

    const message = JSON.stringify({
      type: 'content',
      data: value,
      user: { userId: User.user.id, name: User.user.name },
    });

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      socketRef.current = new WebSocket("ws://collab-doc-springboot-production.up.railway.app/ws-custom");
      socketRef.current.onopen = () => {
        socketRef.current.send(message);
      };
    }

    const typingMessage = JSON.stringify({
      type: 'typing',
      user: { userId: User.user.id, name: User.user.name },
    });

    socketRef.current.send(typingMessage);

    setTimeout(() => {
      setIsTyping(false);
      const stoppedTypingMessage = JSON.stringify({
        type: 'stoppedTyping',
        user: { userId: User.user.id, name: User.user.name },
      });
      socketRef.current.send(stoppedTypingMessage);
    }, 3000);
  };

  const handleSaveCode = () => {
    axios.post('https://collab-doc-springboot-production.up.railway.app/api/document', content)
    .then(response => {
      console.log('POST request successful:', response.data);
    })
    .catch(error => {
      console.error('Error during POST request:', error);
    });
  };

  const handleGetCode = () => {
    axios.get('https://collab-doc-springboot-production.up.railway.app/api/document')
    .then(response => {
      console.log(response.data);
      copy(response.data.content);
      alert("Old Code Copied to Clipboard");
    })
    .catch(error => {
      console.error('Error during GET request:', error);
    });
  };

  return (
    <div className="editor-container">
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={content}
        onChange={handleChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useWorker: false }}
        className="ace-editor"
        style={{ width: "90%", height: "700px", margin: "100px" }}
      />
      <div className="editor-buttons">
        <button onClick={handleSaveCode}>Save Code</button>
        <button onClick={handleGetCode}>Retrieve Old Code</button>
      </div>
      {Object.values(typingUsers).map((name, index) => (
        <p key={index}>{name} is Typing...</p>
      ))}
    </div>
  );
};

export default Editor;
