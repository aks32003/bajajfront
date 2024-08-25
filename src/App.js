import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const parsedData = JSON.parse(jsonInput);
        if (!parsedData.data || !Array.isArray(parsedData.data)) {
            setError('Invalid JSON format. "data" should be an array.');
            return;
        }

        const response = await axios.post('https://bajajback-im93.onrender.com/bfhl', parsedData);
        setResponseData(response.data);
    } catch (err) {
        setError('Invalid JSON format or server error.');
        console.error(err);
    }
  };

  const handleMultiSelectChange = (e) => {
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
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

    return (
      <div className="response-container">
        {selectedOptions.includes('Numbers') && (
          <div className="response-item">
            <strong>Numbers:</strong> {JSON.stringify(numbers)}
          </div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div className="response-item">
            <strong>Alphabets:</strong> {JSON.stringify(alphabets)}
          </div>
        )}
        {selectedOptions.includes('Highest Lowercase Alphabet') && (
          <div className="response-item">
            <strong>Highest Lowercase Alphabet:</strong> {JSON.stringify(highest_lowercase_alphabet)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>{'Bajaj Task - 21BEC0097'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label>JSON Input:</label>
          <textarea
            value={jsonInput}
            onChange={handleJsonInputChange}
            rows="5"
            cols="50"
            placeholder='{"data": ["A", "B", "c"]}'
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {responseData && (
        <div className="response-section">
          <h2>Multi-Select Filter</h2>
          <select multiple onChange={handleMultiSelectChange} className="multi-select">
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          <h2>Filtered Response</h2>
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
