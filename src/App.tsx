import React from 'react';
import logo from './logo.svg';
import './App.css';
import WorkspacePlan from './components/WorkspacePlan';
import SitePlan from './components/SitePlan';

function App() {
  return (
    <div className="App">
      <WorkspacePlan />
      <SitePlan />
    </div>
  );
}

export default App;
