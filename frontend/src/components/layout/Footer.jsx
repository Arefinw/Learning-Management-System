/**
 * @file Footer.jsx
 * @description This component renders the footer for the application.
 * It displays a simple copyright notice.
 * @module components/layout/Footer
 * @requires react
 */

import React from 'react';

/**
 * @component Footer
 * @description The application footer component.
 * @returns {JSX.Element} The footer component.
 */
const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-200 py-4 text-center">
      <p>&copy; 2025 LMS</p>
    </footer>
  );
};

export default Footer;