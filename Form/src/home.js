
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importing jwtDecode from 'jwt-decode'
import QRCode from "react-qr-code";



const Home = () => {
  const [decodedJWT, setDecodedJWT] = useState(null);
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [signature, setsignature] = useState('');
  const [finalString, setfinalstring] = useState('');
  // const [data, setdata] = useState(null);


  useEffect(() => {
    // Step 1: Retrieve the JWT from local storage
    const jwt = localStorage.getItem('userinfo');
    const sig= localStorage.getItem('signature');
console.log(jwt);
    // Step 2: Decode the JWT
    if (jwt) {
      const decoded = jwtDecode(jwt); 
      setusername(decoded.username);
      setemail(decoded.email);
      setsignature(sig);
      const info = `${decoded.username}\n${decoded.email}`;
      const concatenatedString = `info="${info}",signature="${sig}"`;
      setfinalstring(concatenatedString);
      // const info = `${username}\n${email}`;

      // Construct the final string
      // const finalString = `info="${info}",signature="${signature}"`;
      // setfinalstring(finalString);
   
    }
    
  }, []);

  return (
    <div>
      <h2>Decoded JWT</h2>
     <div>
      {username }
      <br></br>
      {email}
     </div>
     {signature}
     <h3>QR Generated</h3>
     {finalString}
    <QRCode value={finalString} />
     {/* <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={username}
    viewBox={`0 0 256 256`}
  />
     <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={email}
    viewBox={`0 0 256 256`}
  /> */}
    </div>
  );
};
export default Home;