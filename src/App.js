import React, { useState } from 'react';
import axios from 'axios';
import Ajv from 'ajv';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const validateJSON = (data) => {
    const ajv = new Ajv();
    const schema = { type: 'object', properties: { data: { type: 'array', items: { type: 'string' } } }, required: ['data'], additionalProperties: false };
    const validate = ajv.compile(schema);
    return validate(data);
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);

    try {
      const jsonData = JSON.parse(input);

      if (!validateJSON(jsonData)) {
        setError('Invalid JSON format');
        return;
      }

      const res = await axios.post('https://bajajback-im93.onrender.com/bfhl', jsonData);
      setResponse(res.data);
    } catch (err) {
      setError('Error processing request');
    }
  };

  const handleOptionChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { alphabets, numbers, highestLowercaseAlphabet } = response;
    let dataToRender = [];

    if (selectedOptions.includes('Alphabets')) dataToRender = [...dataToRender, ...alphabets];
    if (selectedOptions.includes('Numbers')) dataToRender = [...dataToRender, ...numbers];
    if (selectedOptions.includes('Highest lowercase alphabet')) dataToRender.push(highestLowercaseAlphabet);

    return (
      <div>
        <h3>Response Data:</h3>
        <ul>
          {dataToRender.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>My Frontend App</h1>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter JSON input"
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <select multiple onChange={handleOptionChange}>
          <option value="Alphabets">Alphabets</option>
          <option value="Numbers">Numbers</option>
          <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
        </select>
      )}
      {renderResponse()}
    </div>
  );
};

export default App;
