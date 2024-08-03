import React, { useState, useEffect } from "react";
import "./Test.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import { useSelector } from "react-redux";

const Test = () => {
  const [username, setUsername] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [connecting, setConnecting] = useState(true);

  var User = useSelector((state) => state.currentUserReducer);

  const colors = [
    "#2196F3",
    "#32c787",
    "#00BCD4",
    "#ff5652",
    "#ffc107",
    "#ff85af",
    "#FF9800",
    "#39bbb0",
  ];

  useEffect(() => {
    if (User && User.user) {
      setUsername(User.user.name);
    }
  }, [User]);

  useEffect(() => {
    setUsername(User?.user.name);
    axios
      .get("https://collab-doc-springboot-production.up.railway.app/api/messages")
      .then((response) => {
        setMessages(
          response.data.filter((message) => message.recipient == null)
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the messages!", error);
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
      const socket = new SockJS("https://collab-doc-springboot-production.up.railway.app/ws-stomp");
      const stompClient = Stomp.over(socket);
      setStompClient(stompClient);
    }
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify({ sender: username, type: "JOIN" }),
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
        type: "CHAT",
      };
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessageInput("");
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
        <div className="group-chat-top-bar">Group Chat</div>
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
                  // <p>
                  //   {message.sender}{" "}
                  //   {message.type === "JOIN" ? "joined!" : "left!"}
                  // </p>
                  <p></p>
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
};

export default Test;
