import React, { Component } from 'react';
import classnames from 'classnames';
import './PatientNavbar.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../photos/kiruddu/logo.gif';



class Navber extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          prevScrollpos: window.pageYOffset,
          visible: true
        };
      }
    
      // Adds an event listener when the component is mount.
      componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
      }
    
      // Remove the event listener when the component is unmount.
      componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
      }
    
      // Hide or show the menu.
      handleScroll = () => {
        const { prevScrollpos } = this.state;
    
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollpos > currentScrollPos;
    
        this.setState({
          prevScrollpos: currentScrollPos,
          visible
        });
      };

      handleLogout = () => {
        sessionStorage.removeItem('usertoken');
        sessionStorage.removeItem('userData');
        window.location.href = '/';
      };

    render() { 
        return ( 
            <div>
                <Navbar className={classnames("navbar", {
                    "navbar--hidden": !this.state.visible
                  })} bg="success" text="white" expand="lg">
                <Navbar.Brand style={{color:"white"}}>
                  <img src={logo} alt="Kiruddu National Referral Hospital Logo" height="40" className="d-inline-block align-top mr-2" />
                  Kiruddu National Referral Hospital
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                    <Nav.Link className="text-white" href="/patient/login/home">Home</Nav.Link>
                    <Nav.Link className="text-white" href="/patient/login/patient_home">Patient</Nav.Link>
                    <Nav.Link className="text-white" href="/patient/login/about">About</Nav.Link>                    
                    <Nav.Link className="text-white" href="/patient/login/gallery">Gallery</Nav.Link>
                    <Nav.Link className="text-white" href="/patient/login/appointment">Appointment</Nav.Link>
                    <Nav.Link className="text-white" href="/patient/login/prescription">Prescription</Nav.Link>
                    <Nav.Link className="text-white" onClick={this.handleLogout}>Log Out</Nav.Link>
                    </Nav>
                    
                </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}
 
export default Navber;
