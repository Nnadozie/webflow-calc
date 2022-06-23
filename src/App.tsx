import './App.css';
import WorkspacePlan from './components/WorkspacePlan';
import SitePlan from './components/SitePlan';
import EcommercePlan from './components/EcommercePlan';
import Store from './state/store';
import SumTotal from './components/SumTotal';

function App() {
  return (
    <div className="App">
      <Store>
        <WorkspacePlan />
        <SitePlan />
        <EcommercePlan />
        <SumTotal></SumTotal>
      </Store>
    </div>
  );
}

export default App;
