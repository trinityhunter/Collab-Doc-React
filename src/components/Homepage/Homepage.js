import React from 'react';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Collab-Doc</h1>
        <p>Collaborate, chat, and code in real-time with your peers.</p>
      </header>
      <main className="homepage-main">
        <section className="features">
          <div className="feature">
            <h2>Real-time Collaboration</h2>
            <p>Edit code with others in real-time. See changes as they happen.</p>
          </div>
          <div className="feature">
            <h2>Instant Messaging</h2>
            <p>Chat with other users instantly to discuss and share ideas.</p>
          </div>
          <div className="feature">
            <h2>Project Management</h2>
            <p>Manage your projects and keep track of progress with ease.</p>
          </div>
        </section>
      </main>
      <footer className="homepage-footer">
        <p>© 2024 CodeCollaborate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
