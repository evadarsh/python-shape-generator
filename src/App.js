// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pyodide, setPyodide] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [shapeProperties, setShapeProperties] = useState({ width: 100, height: 100, color: 'blue' });

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide();
      setPyodide(pyodideInstance);
    };
    loadPyodide();
  }, []);

  const runPythonCode = async () => {
    if (!pyodide) return;

    try {
      pyodide.runPython(`
${code}
      `);

      const width = pyodide.globals.get('width') || 100;
      const height = pyodide.globals.get('height') || 100;
      const color = pyodide.globals.get('color') || 'blue';

      setShapeProperties({ width, height, color });
      setOutput('Shape rendered based on your code.');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <div className="left-section">
        <h2>Code Execution</h2>
        <textarea
          placeholder={`Enter Python code. E.g., 
width = 150
height = 80
color = 'red'`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={runPythonCode}>Run Code</button>
      </div>
      
      <div className="right-section">
        <h2>Output</h2>
        {output.includes('Error') ? (
          <p>{output}</p>
        ) : (
          <svg width={shapeProperties.width} height={shapeProperties.height}>
            <rect
              x="0"
              y="0"
              width={shapeProperties.width}
              height={shapeProperties.height}
              fill={shapeProperties.color}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default App;
