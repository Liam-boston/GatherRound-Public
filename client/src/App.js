import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase"
import { Navigate } from 'react-router-dom';
import LoginSignup from './components/auth/LoginSignup'
import EmailVerification from "./components/auth/EmailVerification";
import Homepage from "./components/homepage/Homepage";
import ClubDetails from "./components/clubs/ClubDetails";
import MemberList from "./components/MemberList/MemberList";
import ActivityList from "./components/activityList/ActivityList";
import Homepage from "./components/homepage/Homepage";
import UserProfileModal from './components/common/UserProfileModal';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverResponse: "",
      isDark: false
    };
  }

  testServerConnection() {
    fetch("http://localhost:9000/test")
      .then(res => res.text())
      .then(res => this.setState({ serverResponse: res }))
  }

  componentWillMount() {
    this.testServerConnection();
  }

  
  // Added Router that facilitates page navigation
  render() {
    return (
      <div className="App" data-theme={this.state.isDark ? "dark" : "light"} data-testid='app'>
        <Router>
          <Routes>
            <Route exact path="/" element={<LoginSignup/>}/>
            <Route path="EmailVerification" element={<EmailVerification/>}/>
            <Route path="Homepage" element={<PrivateRoute><Homepage/></PrivateRoute>}/>
            <Route path="/Homepage/Clubs/:id" element={<PrivateRoute><ClubDetails/></PrivateRoute>}/>
            <Route path="/Homepage/Clubs/:id/MemberList" element={<PrivateRoute><MemberList/></PrivateRoute>}/>
            <Route path="/Homepage/Clubs/:id/ActivityList" element={<PrivateRoute><ActivityList/></PrivateRoute>}/>
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
            <Route path="Homepage" element={<Homepage/>}/>
            <Route path="TestUserProfileModal" element={<UserProfileModal show={true} onClose={console.log('close')} userId='HvWyEVnFIYPO9Fg0RXSitouINAS2' />} />
          </Routes>
        </Router>
      </div>
    );
  }
}


const PrivateRoute = ({children}) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const noUser = onAuthStateChanged(auth, (currentUser) => {
        console.log(currentUser);
        setUser(currentUser);
    });
    return () => {
        noUser();
    }
  },[])

    if (!user) {
      return <Navigate to="/"/>;
    } 
      return children;
    };


export default App;
