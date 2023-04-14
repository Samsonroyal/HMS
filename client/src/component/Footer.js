import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
            <h2 className="text-white font-bold text-lg mb-4">Contact Us</h2>
            <p className="text-white mb-2">
              Email address: info@kiruddu.hosp.go.ug
            </p>
            <p className="text-white mb-2">
              Telephone no: +256 41 4672315
            </p>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-white font-bold text-lg mb-4">
              Physical Address
            </h2>
            <p className="text-white mb-2">
              Salaama Road, Makindye, 00000 Kampala, Central, Uganda
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-400">
        <p>©2023 Kiruddu Hospital. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;