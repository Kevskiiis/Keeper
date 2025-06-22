import React from 'react';
import '../styles/components/Footer.css';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright &copy; {year}</p>
    </footer>
  );
}
export default Footer;
