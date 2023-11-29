import React from 'react';
import logo from '../../assets/img/logo.svg';
import datadaddy from '../../assets/img/DataDaddyLogo.png';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import TextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { getElementById } from 'domutils';
import Tautologistics from 'htmlparser';
import { useState, useEffect } from 'react';

const HTMLParser = require('node-html-parser')

const JSSoup = require('jssoup').default;

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

let root;
var emails = new Set();  // Using a Set to avoid duplicate emails
var emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})\b/gi;

async function scrape() {
  console.log('Starting the scrape function'); // Debugging step
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab || !currentTab.url) {
      console.error('No URL to scrape');
      return;
    }
    console.log(`Scraping URL: ${currentTab.url}`); // Debugging step

    try {
      const res = await fetch(currentTab.url);
      const body = await res.text();
      root = HTMLParser.parse(body);
      extractDataStarter(root, 0); // Ensure depth starts at 0
    } catch (error) {
      console.error('Error during scrape:', error);
    }
  });
}

function extractDataStarter(root, depth, currentTabUrl) {
  console.log(`Extracting data, depth is ${depth}`);
  if (depth >= 3) {
    // console.log('Reached max depth');
    return;
  }

  const soup = new JSSoup(root);
  var links = soup.findAll('a');
  var priorityLinks = [];
  var otherLinks = [];
  const keywords = ["privacy", "do not track", "personal information", "personal data"];

  console.log(`Found ${links.length} links at depth ${depth}`);
  extractEmailsFromText(soup.text);  // Extract emails from the text of the page

  for (let link of links) {
    let href = link.attrs.href;
    if (href && href !== '#' && !href.startsWith('javascript')) {
      // console.log('Found href:', href);
  
      if (href.startsWith('mailto:')) {
        extractEmailsFromHref(href);  // Extract emails from mailto links
      } else {
        // Check if the URL is absolute; if not, return immediately
        if (!href.startsWith('http://') && !href.startsWith('https://')) {
          continue;
        }
        
        let linkText = link.getText();
        if (containsKeywords(linkText, keywords) || containsKeywords(href, keywords)) {
          priorityLinks.push(href);
        } else {
          otherLinks.push(href);
        }
      }
    }
  }

  console.log('Priority Hyperlinks:', priorityLinks);
  console.log('Other Hyperlinks:', otherLinks);
  console.log('Emails:', Array.from(emails));  // Log collected emails

  // Sequential fetch with delay to prevent rate limiting
  const delay = ms => new Promise(res => setTimeout(res, ms));
  // Make sure this part is calling the recursive function correctly
  const fetchSequentially = async (urls) => {
    for (const url of urls) {
      try {
        // console.log(`Fetching ${url} at depth ${depth}`);
        const res = await fetch(url);
        const body = await res.text();
        let newRoot = HTMLParser.parse(body);
        await delay(1000);
        extractDataStarter(newRoot, depth + 1, url); // Ensure the depth is incremented
      } catch (error) {
        console.error('Error fetching or parsing:', url, error);
      }
    }
  };

  // Process priority links first
  fetchSequentially(priorityLinks).then(() => {
    // Process other links after priority links
    fetchSequentially(otherLinks);
  });
}

function extractEmailsFromText(text) {
  // Split the text by spaces and other non-word characters to avoid concatenation issues
  let words = text.split(/\s+|[,.!?;:()]+/); 
  words.forEach(word => {
    let matches = word.match(emailRegex);
    if (matches) {
      matches.forEach(email => emails.add(email.trim())); // Trim any whitespace around the email
    }
  });
}

function extractEmailsFromHref(href) {
  let email = href.replace('mailto:', '');
  emails.add(email);
}

function containsKeywords(text, keywords) {
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

// Call the scrape function with the current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabUrl = tabs[0].url;
  scrape(currentTabUrl); // Pass the current tab URL to the scrape function
});

function domainFromUrl(url, baseDomain) {
  // If the URL is relative, prepend the base domain to make it absolute
  if (url.startsWith('/')) {
    url = `${baseDomain}${url}`;
  }

  // Create a URL object, which can handle various URL formats and edge cases
  try {
    const urlObj = new URL(url);
    return urlObj.hostname; // Returns the domain along with subdomains if any
  } catch (e) {
    console.error(`Error parsing URL: ${url}`, e);
    return null; // Return null if the URL couldn't be parsed
  }
}

scrape();

const Popup = () => {

  async function generateEmail() {
    var emailOne = "https://mail.google.com/mail/?view=cm&fs=1&to=";
    var emailTwo = Array.from(emails);
    var emailThree = "&su=";
    var emailFour = "Right to Access Request (Section 110 of the CCPA)";
    var emailFive = "&body=";
    var emailSix = "To%20whom%20it%20may%20concern%3A%0A%0AI%20am%20writing%20to%20request%20access%20to%20personal%20information%20pursuant%20to%20Section%201798.110%20of%20The%20California%20Consumer%20Privacy%20Act%20(CCPA).%20Please%20advise%20as%20to%20the%20following%3A%0A1.%20Please%20confirm%20to%20me%20whether%20or%20not%20my%20personal%20information%20has%20been%20collected%2C%20sold%20or%20disclosed%20over%20the%20past%2012%20months.%20If%20so%2C%20please%20disclose%3A%0A%20%201.1%20What%20categories%20of%20personal%20information%20has%20been%20collected%20or%20disclosed%20for%20business%20purposes%2C%20and%20provide%20me%20with%20a%20copy%20of%2C%20or%20access%20to%2C%20my%20personal%20information%20that%20you%20have%20or%20are%20processing%0A%20%201.2%20Please%20identify%20the%20specific%20pieces%20of%20personal%20information%20that%20you%20have%20collected%20about%20me%0A%20%201.3%20Please%20advise%20what%20sources%20were%20used%20to%20obtain%20my%20personal%20information%0A%20%201.4%20Please%20advise%20what%20categories%20of%20my%20personal%20information%20that%20you%20have%20shared%20with%20or%20disclosed%20to%20third%20parties%0A%20%201.5%20Please%20advise%20in%20which%20countries%20my%20personal%20information%20is%20stored%2C%20or%20accessible%20from.%20In%20case%20you%20make%20use%20of%20cloud%20services%20to%20store%20or%20process%20my%20data%2C%20please%20include%20the%20countries%20in%20which%20the%20servers%20are%20located%20where%20my%20data%20are%20or%20were%20(in%20the%20past%2012%20months)%20stored%0A2.%20Please%20provide%20me%20with%20a%20detailed%20accounting%20of%20the%20business%20or%20commercial%20purposes%20for%20which%20you%20are%20collecting%20or%20selling%20my%20personal%20information%0A3.%20Please%20advise%20how%20long%20you%20store%20my%20personal%20information%2C%20and%20if%20retention%20is%20based%20upon%20the%20category%20of%20personal%20information%2C%20please%20identify%20how%20long%20each%20category%20is%20retained%0A4.%20Please%20advise%20as%20to%20whether%20any%20categories%20of%20my%20personal%20information%20have%20been%20sold%20to%20a%20third%20party%2C%20and%20if%20so%2C%20what%20categories%20were%20included%20in%20such%20sale.%20If%20my%20personal%20information%20has%20been%20sold%2C%20please%20identify%3A%0A%20%204.1%20The%20categories%20of%20third%20parties%20to%20whom%20the%20information%20was%20sold%0A%20%204.1%20What%20specific%20personal%20information%20has%20been%20sold%20to%20such%20third%20party(ies)%0APlease%20note%20that%20I%20do%20not%20consent%20to%20any%20personal%20information%20which%20is%20part%20of%20this%20request%2C%20including%20my%20email%20address%20and%20name%2C%20to%20be%20used%20for%20any%20purpose%20other%20than%20fulfilling%20this%20request.%0AIf%20you%20do%20not%20normally%20deal%20with%20these%20requests%2C%20please%20forward%20this%20email%20to%20the%20relevant%20person%20in%20your%20organization.%20Please%20note%20that%20you%20have%2045%20days%20to%20comply%20with%20this%20request%20as%20required%20under%20subsection%201798.130.%0A%0AKind%20regards%2C%0A";
    var emailSeven = document.getElementById('userName').value;
    var newURL = emailOne + emailTwo + emailThree + emailFour + emailFive + emailSix + emailSeven;
    chrome.tabs.create({ url: newURL });
  }

  return (
    <div className="App">
      <header className="App-header">
        <script defer src="./dist/bundle.js" />

        {/* Logo, DataDaddyCCPA */}
        <p className="Logo-text">
          <span className="App-title-one">datadaddy.</span>
          <span className="App-title-two">CC</span>
          <span className="App-title-three">P</span>
          <span className="App-title-two">A</span>
        </p>

      </header>

      <a
        className="App-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <TextField id="userName" label="Your Name" variant="outlined" sx={{ width: 250, height: 60, mt: 2 }} />
          <MuiButton variant="outlined" onClick={generateEmail} endIcon={<SendIcon />} sx={{ width: 250, height: 60, mt: 2 }}>OPEN EMAIL IN NEW TAB</MuiButton>
          <MuiButton variant="contained" onClick={scrape} sx={{ width: 250, height: 60, alignContent: 'flex-start', mt: 2 }}>Scrape</MuiButton>
        </div>

        <footer className='App-footer'>
        </footer>
      </a>
    </div>
  );
};

export default Popup;
