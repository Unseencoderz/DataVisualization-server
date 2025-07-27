
import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <Dashboard />

      <footer className="App-footer">
        <p>
          ✨ Backcoffer Company © {new Date().getFullYear()} •
          Built with React & Material-UI •
          Enhanced with Glassmorphism ✨
        </p>
      </footer>
    </div>
  );
}

export default App;
