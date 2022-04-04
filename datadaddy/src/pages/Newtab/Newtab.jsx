import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { useState, useEffect } from 'react';

const Newtab = () => {

  function Scrape() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // When we throw an error in the .then() block,
    // .catch() detects and uses our custom message
    // whenever we hit a “404 Not Found.”

    // "?_limit=8" limits the number of posts we
    // retrieve to 8 maximum.
    useEffect(() => {
      fetch(`https://jsonplaceholder.typicode.com/posts?_limit=8`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              'This is an HTTP error: The status is ${response.status}'
            );
          }
          return response.json();
        })
        .then((actualData) => console.log(actualData))
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);
    return <div className="Scrape">Scrape</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Exercise Your CCPA Rights!
        </a>
        <h6>NewTab Test.</h6>
      </header>
    </div>
  );
};

export default Newtab;
