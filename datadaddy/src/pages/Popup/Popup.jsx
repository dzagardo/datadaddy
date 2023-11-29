import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './Popup.css';

const HTMLParser = require('node-html-parser');
const JSSoup = require('jssoup').default;

const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})\b/gi;

async function scrape(addEmailToState, scrapeTimeoutReached) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab || !currentTab.url) {
      console.error('No URL to scrape');
      return;
    }

    try {
      const res = await fetch(currentTab.url);
      const body = await res.text();
      const root = HTMLParser.parse(body);
      extractDataStarter(root, 0, addEmailToState, scrapeTimeoutReached);
    } catch (error) {
      console.error('Error during scrape:', error);
    }
  });
}

function extractDataStarter(root, depth, addEmailToState, scrapeTimeoutReached) {
  if (depth >= 3 || scrapeTimeoutReached) return;

  const soup = new JSSoup(root);
  const links = soup.findAll('a');
  const keywords = ["privacy", "do not track", "personal information", "personal data"];
  const priorityLinks = [];
  const otherLinks = [];

  extractEmailsFromText(soup.text, addEmailToState);

  links.forEach(link => {
    const href = link.attrs.href;
    if (href && href !== '#' && !href.startsWith('javascript')) {
      if (href.startsWith('mailto:')) {
        extractEmailsFromHref(href, addEmailToState);
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        const linkText = link.getText();
        if (containsKeywords(linkText, keywords) || containsKeywords(href, keywords)) {
          priorityLinks.push(href);
        } else {
          otherLinks.push(href);
        }
      }
    }
  });

  fetchSequentially(priorityLinks, addEmailToState, depth, scrapeTimeoutReached);
  fetchSequentially(otherLinks, addEmailToState, depth, scrapeTimeoutReached);
}

async function fetchSequentially(urls, addEmailToState, depth, scrapeTimeoutReached) {
  for (const url of urls) {
    if (scrapeTimeoutReached) break; // Exit the loop if timeout is reached
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // Handle HTTP errors like 404, 500, etc.
        console.error(`HTTP error! status: ${res.status}`);
      } else {
        const body = await res.text();
        const newRoot = HTMLParser.parse(body);
        await delay(1000);
        await extractDataStarter(newRoot, depth + 1, addEmailToState, scrapeTimeoutReached);
      }
    } catch (error) {
      // Handle network errors, parsing errors, etc.
      // You can also implement UI error handling here, e.g., by setting a state variable.
      console.error(`Error fetching or parsing: ${url}`, error.message);
    }
  }
}

function extractEmailsFromText(text, addEmailToState) {
  const words = text.split(/\s+|[,.!?;:()]+/);
  words.forEach(word => {
    const matches = word.match(emailRegex);
    if (matches) {
      matches.forEach(email => addEmailToState(email.trim()));
    }
  });
}

function extractEmailsFromHref(href, addEmailToState) {
  const email = href.replace('mailto:', '');
  addEmailToState(email);
}

function containsKeywords(text, keywords) {
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const Popup = () => {
  const [emails, setEmails] = useState(new Set());
  const [scrapeButtonText, setScrapeButtonText] = useState('Generate Email');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeTimeoutReached, setScrapeTimeoutReached] = useState(false);


  const addEmailToState = newEmail => {
    setEmails(prevEmails => new Set([...prevEmails, newEmail]));
  };

  const handleScrape = async () => {
    setIsScraping(true);
    setScrapeButtonText(<CircularProgress size={24} />);
    setScrapeTimeoutReached(false);

    const scrapeTimeout = setTimeout(() => {
      setScrapeTimeoutReached(true);
    }, 10000); // Adjust timeout as needed

    await scrape(addEmailToState, scrapeTimeoutReached);

    setTimeout(() => {
      clearTimeout(scrapeTimeout);
      setIsScraping(false);
      setScrapeButtonText('Email Ready!');
    }, 8000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setScrapeButtonText('Email Ready!');
      setIsScraping(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

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
          <MuiButton variant="contained" onClick={handleScrape} disabled={isScraping} sx={{ width: 250, height: 60, alignContent: 'flex-start', mt: 2 }}>
            {scrapeButtonText}
          </MuiButton>
        </div>

        <footer className='App-footer'>
        </footer>
      </a>
    </div>
  );
};

export default Popup;
