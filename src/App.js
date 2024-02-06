// // App.jsx
// import React from 'react';
// import VideoPlayer from './VideoPlayer';

// const App = () => {
//   return (
//     <div style={{backgroundColor:"blueviolet"}}>
//       <div>
//         <VideoPlayer />
//       </div>
//     </div>
//   );
// };

// export default App;


// App.jsx
import React from 'react';
import VideoPlayer from './VideoPlayer';

const App = () => {
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>RTSP Video Player App</h1>
      </header>
      <main style={styles.mainContent}>
        <VideoPlayer />
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Video Player App</p>
      </footer>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  header: {
    background: '#007bff',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
  },
  headerText: {
    margin: 0,
    fontSize: '1.5rem',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    background: '#007bff',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    marginTop: 'auto',
  },
  footerText: {
    margin: 0,
    fontSize: '0.8rem',
  },
};

export default App;
