import React from 'react';
import logo from './logo.svg';
import './App.css';
import WorkspacePlan from './components/WorkspacePlan';
import SitePlan from './components/SitePlan';
import EcommercePlan from './components/EcommercePlan';

function App() {
  return (
    <div className="App">
      <WorkspacePlan />
      <SitePlan />
      <EcommercePlan />
    </div>
  );
}

export default App;
