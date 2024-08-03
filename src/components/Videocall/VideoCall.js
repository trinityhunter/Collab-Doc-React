// import React, { useEffect, useRef, useState } from 'react';

// const VideoCall = () => {
//   const [socket, setSocket] = useState(null);
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const peerConnections = useRef({});

//   useEffect(() => {
//     const newSocket = new WebSocket('ws://localhost:8080/video-call');
//     setSocket(newSocket);

//     newSocket.onmessage = (message) => {
//       const data = JSON.parse(message.data);
//       switch (data.type) {
//         case 'offer':
//           handleOffer(data.from, data.offer);
//           break;
//         case 'answer':
//           handleAnswer(data.from, data.answer);
//           break;
//         case 'candidate':
//           handleCandidate(data.from, data.candidate);
//           break;
//         case 'join':
//           callUser(data.from);
//           break;
//         default:
//           break;
//       }
//     };

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         localStreamRef.current.srcObject = stream;
//         newSocket.onopen = () => {
//           newSocket.send(JSON.stringify({ type: 'join', from: 'your-user-id' }));
//         };
//       });

//     return () => newSocket.close();
//   }, []);

//   const callUser = (userId) => {
//     const peerConnection = new RTCPeerConnection();
//     peerConnections.current[userId] = peerConnection;

//     localStreamRef.current.srcObject.getTracks().forEach(track => {
//       peerConnection.addTrack(track, localStreamRef.current.srcObject);
//     });

//     peerConnection.onicecandidate = event => {
//       if (event.candidate) {
//         socket.send(JSON.stringify({ type: 'candidate', to: userId, candidate: event.candidate }));
//       }
//     };

//     peerConnection.ontrack = event => {
//       remoteStreamRef.current.srcObject = event.streams[0];
//     };

//     peerConnection.createOffer()
//       .then(offer => {
//         peerConnection.setLocalDescription(offer);
//         socket.send(JSON.stringify({ type: 'offer', to: userId, offer }));
//       });
//   };

//   const handleOffer = (userId, offer) => {
//     const peerConnection = new RTCPeerConnection();
//     peerConnections.current[userId] = peerConnection;

//     peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         stream.getTracks().forEach(track => {
//           peerConnection.addTrack(track, stream);
//         });

//         peerConnection.createAnswer()
//           .then(answer => {
//             peerConnection.setLocalDescription(answer);
//             socket.send(JSON.stringify({ type: 'answer', to: userId, answer }));
//           });

//         peerConnection.onicecandidate = event => {
//           if (event.candidate) {
//             socket.send(JSON.stringify({ type: 'candidate', to: userId, candidate: event.candidate }));
//           }
//         };

//         peerConnection.ontrack = event => {
//           remoteStreamRef.current.srcObject = event.streams[0];
//         };
//       });
//   };

//   const handleAnswer = (userId, answer) => {
//     const peerConnection = peerConnections.current[userId];
//     peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleCandidate = (userId, candidate) => {
//     const peerConnection = peerConnections.current[userId];
//     peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//   };

//   return (
//     <div style={{margin: "200px"}}>
//       <video ref={localStreamRef} autoPlay playsInline muted />
//       <video ref={remoteStreamRef} autoPlay playsInline />
//     </div>
//   );
// };

// export default VideoCall;


// import React, { useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import SimplePeer from 'simple-peer';

// const VideoCall = () => {
//     const videoRef = useRef(null);
//     const peerRef = useRef(null);
//     const socket = useRef(null);

//     useEffect(() => {
//         // Connect to signaling server
//         socket.current = io('https://collab-doc-springboot-production.up.railway.app/video-call');

//         // Get user media
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then(stream => {
//                 videoRef.current.srcObject = stream;
//                 videoRef.current.play();

//                 // Initialize peer connection
//                 peerRef.current = new SimplePeer({ initiator: true, stream });

//                 // Handle signaling events
//                 peerRef.current.on('signal', data => {
//                     socket.current.emit('signal', JSON.stringify(data));
//                 });

//                 // Handle peer stream
//                 peerRef.current.on('stream', remoteStream => {
//                     let remoteVideo = document.createElement('video');
//                     remoteVideo.srcObject = remoteStream;
//                     remoteVideo.play();
//                     document.body.appendChild(remoteVideo);
//                 });

//                 // Handle incoming signals
//                 socket.current.on('signal', data => {
//                     peerRef.current.signal(JSON.parse(data));
//                 });
//             })
//             .catch(err => console.error('getUserMedia error:', err));

//         return () => {
//             // Clean up
//             socket.current.disconnect();
//             if (peerRef.current) {
//                 peerRef.current.destroy();
//             }
//         };
//     }, []);

//     return (
//         <div>
//             <video ref={videoRef} autoPlay muted></video>
//         </div>
//     );
// };

// export default VideoCall;
