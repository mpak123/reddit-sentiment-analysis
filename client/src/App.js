import React from "react";
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import Form from './Form.js';
import Data from './Data.js'; 

// nearly finished. All I need to do now is properly format everything and make sure to implement form validation, etc.

function App() {

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmission] = useState(false);

  const changeSubmission = () => {
    setSubmission(true);
  }

  useEffect(() => {
    getResponse()
    .then(response => {
      if (response.ok){
        return response.json();
      }
      throw response;
    })
    .then(data => {
      setData(data);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (!submitted) {
    return (
      <div className="Form">
        <Form onSubmission={changeSubmission}/>
      </div> 
    );
  } else {
    if (loading){
      //handle the direction of the spinning loading symbol.
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p className="loading-symbol">
              {"Loading..."}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="display-board">
          <Data data={data}/>
        </div> 
      );
    }
  }
}

// waits until api has completed its processing
async function getResponse() {
  let response = await fetch('/result');
  while (!response.ok){
    response = await fetch('/result');
  }
  return response;
}

export default App;
