import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">About Us</h5>
            <p>
              Kiruddu National Referral Hospital is in the neighborhood of
              Kiruddu, on Buziga Hill, in Makindye Division, one of the five
              administrative units of the Kampala Capital City Authority. The
              hospital opened to the public on 16 May 2016.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a className="text-white" href="/">
                  Home
                </a>
              </li>
              <li>
                <a
                  className="text-white"
                  href="https://www.kiruddu.hosp.go.ug/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  className="text-white"
                  href="https://www.kiruddu.hosp.go.ug/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">Contact Us</h5>
            <p className="mb-1">Address: Salaama Road, 2 4092, Makindye</p>
            <p className="mb-1">Email: info@kiruddu.hosp.go.ug</p>
            <p className="mb-1">Telephone: (256)-770-401296</p>
            <p className="mb-0">Working Hours: 24 hours / 7 days</p>
          </div>
        </div>
      </div>
      <div className="text-center py-3 border-top">
        <p className="mb-0 text-muted">
          ©2022 Kiruddu National Referral Hospital. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
