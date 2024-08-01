import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import ProductTable from './screen/ProductTable';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ProductTable />
    </div>
  );
}

export default App
