// VideoPlayer.jsx
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayer = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({
    text: '',
    position: 'top-left',
    fontSize: "16",
  });

  useEffect(() => {
    fetchOverlays();
  }, []);

  const handleInputChange = (e) => {
    setRtspUrl(e.target.value);
  };

  const handlePlayPauseClick = () => {
    if (!rtspUrl) {
      alert('Please provide an RTSP URL!!');
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const fetchOverlays = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/video');
      const data = await response.json();
      console.log(data)
      setOverlays(data);
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  };

  const saveOverlay = async () => {
      if (!newOverlay.text.trim()) {
        alert('Please enter a non-empty text before saving.');
        return;
      }
      let data = new FormData();
      data.append('text',newOverlay.text);
      data.append('position', newOverlay.position);
      data.append('fontSize', newOverlay.fontSize);
  
      // data.append('text', 'shubham kumar');
      // data.append('position', 'right');
      // data.append('fontSize', '102');
      
      console.log(data)
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:5001/video',
        data : data
      };
      axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
      setNewOverlay({ text: '', position: 'top', fontSize: '16' });
  };

  const renderTextOverlays = () => {
    return overlays.map((overlay, index) => {
      const { text, fontSize } = overlay;
      const style = {
        position: 'absolute',
        fontSize: `${fontSize}px`,
        top: '0',
        left: '50%', // Center the text horizontally
        transform: 'translateX(-50%)', // Center the text horizontally
      };
      return (
        <div key={index} style={style}>
          {text}
        </div>
      );
    });
  };

  return (
    <div style={styles.container}>
      {/* <h1 style={styles.header}>RTSP Video Player</h1> */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={rtspUrl}
          onChange={handleInputChange}
          placeholder="Enter RTSP URL"
          style={styles.input}
        />
        <button onClick={handlePlayPauseClick} style={styles.playPauseButton}>
          {isPlaying ? '❚❚ Pause' : '▶ Play'}
        </button>
      </div>
      {rtspUrl && (
        <div style={styles.videoContainer}>
          <ReactPlayer
            url={rtspUrl}
            controls
            width="100%"
            height="100%"
            playing={isPlaying}
            volume={volume}
          />
        </div>
      )}
      <div style={styles.overlayContainer}>
        <h3>Overlays</h3>
        <ul>
          {overlays.map((overlay, index) => (
            <li key={index}>
              {overlay.text} - {overlay.position} - {overlay.size}px
            </li>
          ))}
        </ul>
        <div style={styles.newOverlayContainer}>
          <input
            type="text"
            placeholder="Enter text"
            value={newOverlay.text}
            onChange={(e) => setNewOverlay({ ...newOverlay, text: e.target.value })}
          />
          <select
            value={newOverlay.position}
            onChange={(e) => setNewOverlay({ ...newOverlay, position: e.target.value })}
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
          <input
            type="text"
            placeholder="Font Size"
            value={newOverlay.fontSize}
            onChange={(e) => setNewOverlay({ ...newOverlay, fontSize: e.target.value })}
          />
          <button onClick={saveOverlay}>Save Overlay</button>
        </div>
      </div>
      <div style={styles.volumeContainer}>
        <label style={styles.volumeLabel}>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={styles.volumeSlider}
        />
      </div>
      {renderTextOverlays()}
    </div>
  );
};

const styles = {
  // ... (existing styles remain unchanged)
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#007bff',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  videoContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '100%',
    height: '400px',
  },
  overlayContainer: {
    marginTop: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
  },
  newOverlayContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  volumeContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  volumeLabel: {
    marginRight: '10px',
  },
  volumeSlider: {
    width: '100%',
  },
  playPauseButton: {
    padding: '8px 12px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    background: '#007bff',
    color: '#fff',
  },
};



export default VideoPlayer;
