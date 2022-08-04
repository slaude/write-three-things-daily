import React, { useState } from 'react';
import './App.css';

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  return (
    <div className="App">
      <h1 className="text-3xl m-4 font-bold text-center">Write exactly three things a day</h1>
      <div className="container mx-auto flex flex-col items-center">
        <div className="">
          <textarea className="border-2 p-2" value={first} onChange={(e) => setFirst(e.target.value)} />
        </div>
        <div>
          <textarea className="border-2 p-2" value={second} onChange={(e) => setSecond(e.target.value)} />
        </div>
        <div>
          <textarea className="border-2 p-2" value={third} onChange={(e) => setThird(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default App;
