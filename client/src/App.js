import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
     <div>
        <Dashboard />
    
      <footer className="App-footer">
        <p>Backcoffer Company © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
