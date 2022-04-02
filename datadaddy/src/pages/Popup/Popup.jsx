import React from 'react';
import logo from '../../assets/img/logo.svg';
import datadaddy from '../../assets/img/DataDaddyLogo.png';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { Cheerio } from 'cheerio';
import URLParse from 'url-parse';
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

var html = `
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p class="foo">First</p>
    <p class="foo bar">Second</p>
    <div class="foo">Third</div>
  </body>
</html>
`;

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

let root;
const url = "https://www.ycombinator.com/legal/"

fetch(`${url}`)
  .then(res => res.text())
  .then(body => root = HTMLParser.parse(body))
  .then(() => extractData(root))

async function extractData(root) {
  // const description = await root.querySelector('p')
  // console.log(root)

  const soup = new JSSoup(root);
  // console.log(soup)
  var links = soup.findAll('a');
  console.log(links);
  console.log(links[0]);

  console.log(links[0].attrs);
  for (let i in links) {
    console.log(links[i].attrs.href);
  }
  // links.name
  // links.name = 'span'
  // flattens circular html doc into readable html with <tags></tags>
  // console.log(soup.prettify());
  // gets inner html text that is not <tags></tags>
  // console.log(soup.text);
}

const Popup = () => {

  var databroker_map = {
    "towerData": "privacy@towerdata.com",
    "db2": "db2@gmail.com",
    "db3": "db3@gmail.com",
    "db4": "db4@gmail.com"
  }

  const [dataBroker, setBroker] = React.useState('');

  const handleChange = (event) => {
    setBroker(event.target.value);
  };

  function generateEmail() {
    var emailOne = "https://mail.google.com/mail/?view=cm&fs=1&to=";
    // This 1's for u Bolor
    // Data Broker Email Address
    // Right here vvv
    // var emailTwo = setBroker(target.value);
    var emailTwo = "privacy@towerdata.com";
    var emailThree = "&su=";
    var emailFour = "Right to Access Request (Section 110 of the CCPA)";
    var emailFive = "&body=";
    var emailSix = "To%20whom%20it%20may%20concern%3A%0A%0AI%20am%20writing%20to%20request%20access%20to%20personal%20information%20pursuant%20to%20Section%201798.110%20of%20The%20California%20Consumer%20Privacy%20Act%20(CCPA).%20Please%20advise%20as%20to%20the%20following%3A%0A1.%20Please%20confirm%20to%20me%20whether%20or%20not%20my%20personal%20information%20has%20been%20collected%2C%20sold%20or%20disclosed%20over%20the%20past%2012%20months.%20If%20so%2C%20please%20disclose%3A%0A%20%201.1%20What%20categories%20of%20personal%20information%20has%20been%20collected%20or%20disclosed%20for%20business%20purposes%2C%20and%20provide%20me%20with%20a%20copy%20of%2C%20or%20access%20to%2C%20my%20personal%20information%20that%20you%20have%20or%20are%20processing%0A%20%201.2%20Please%20identify%20the%20specific%20pieces%20of%20personal%20information%20that%20you%20have%20collected%20about%20me%0A%20%201.3%20Please%20advise%20what%20sources%20were%20used%20to%20obtain%20my%20personal%20information%0A%20%201.4%20Please%20advise%20what%20categories%20of%20my%20personal%20information%20that%20you%20have%20shared%20with%20or%20disclosed%20to%20third%20parties%0A%20%201.5%20Please%20advise%20in%20which%20countries%20my%20personal%20information%20is%20stored%2C%20or%20accessible%20from.%20In%20case%20you%20make%20use%20of%20cloud%20services%20to%20store%20or%20process%20my%20data%2C%20please%20include%20the%20countries%20in%20which%20the%20servers%20are%20located%20where%20my%20data%20are%20or%20were%20(in%20the%20past%2012%20months)%20stored%0A2.%20Please%20provide%20me%20with%20a%20detailed%20accounting%20of%20the%20business%20or%20commercial%20purposes%20for%20which%20you%20are%20collecting%20or%20selling%20my%20personal%20information%0A3.%20Please%20advise%20how%20long%20you%20store%20my%20personal%20information%2C%20and%20if%20retention%20is%20based%20upon%20the%20category%20of%20personal%20information%2C%20please%20identify%20how%20long%20each%20category%20is%20retained%0A4.%20Please%20advise%20as%20to%20whether%20any%20categories%20of%20my%20personal%20information%20have%20been%20sold%20to%20a%20third%20party%2C%20and%20if%20so%2C%20what%20categories%20were%20included%20in%20such%20sale.%20If%20my%20personal%20information%20has%20been%20sold%2C%20please%20identify%3A%0A%20%204.1%20The%20categories%20of%20third%20parties%20to%20whom%20the%20information%20was%20sold%0A%20%204.1%20What%20specific%20personal%20information%20has%20been%20sold%20to%20such%20third%20party(ies)%0APlease%20note%20that%20I%20do%20not%20consent%20to%20any%20personal%20information%20which%20is%20part%20of%20this%20request%2C%20including%20my%20email%20address%20and%20name%2C%20to%20be%20used%20for%20any%20purpose%20other%20than%20fulfilling%20this%20request.%0AIf%20you%20do%20not%20normally%20deal%20with%20these%20requests%2C%20please%20forward%20this%20email%20to%20the%20relevant%20person%20in%20your%20organization.%20Please%20note%20that%20you%20have%2045%20days%20to%20comply%20with%20this%20request%20as%20required%20under%20subsection%201798.130.%0A%0AKind%20regards%2C%0A";
    // var emailSeven = "dave";
    var emailSeven = document.getElementById('userName').value;
    // Concatenate the variables into newURL
    var newURL = emailOne + emailTwo + emailThree + emailFour + emailFive + emailSix + emailSeven;
    // Pass newURL through tabs.create to open a new tab
    chrome.tabs.create({ url: newURL });
  }

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));

  return (
    <div className="App">
      <header className="App-header">
        <script defer src="./dist/bundle.js" />

        <p className="Logo-text">
          <text className="App-title-one">datadaddy.</text>
          <text className="App-title-two">CC</text>
          <text className="App-title-three">P</text>
          <text className="App-title-two">A</text>
        </p>

        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <img src={datadaddy} className="App-logo" alt="logo" /> */}

      </header>

      <p>

      </p>
      <a
        className="App-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <div>
            <TextField id="userName" label="Your Name" variant="outlined" sx={{ width: 250, height: 50, mt: 1 }} />
            <FormControl sx={{ minWidth: 250, height: 50, mt: 2 }}>
              <InputLabel id="dataBrokers">Select Broker</InputLabel>
              <Select
                labelId="dataBrokers"
                id="dataBrokers"
                value={dataBroker}
                label="Select Broker"
                onChange={handleChange}
              >
                <MenuItem value={databroker_map["towerData"]}>Tower Data</MenuItem>
                <MenuItem value={databroker_map["db2"]}>db2</MenuItem>
                <MenuItem value={databroker_map["db3"]}>db3</MenuItem>
                <MenuItem value={databroker_map["db4"]}>db4</MenuItem>
              </Select>
            </FormControl>
          </div>
          <MuiButton variant="outlined" onClick={generateEmail} endIcon={<SendIcon />} sx={{ width: 250, height: 56, mt: 2 }}>OPEN EMAIL IN NEW TAB</MuiButton>
        </div>

        <footer className='App-footer'>
          <MuiButton variant="contained" onClick={extractData} sx={{ width: 250, height: 50, alignContent: 'flex-start', mt: 1 }}>Scrape</MuiButton>
        </footer>
      </a>
    </div>
  );
};

export default Popup;
