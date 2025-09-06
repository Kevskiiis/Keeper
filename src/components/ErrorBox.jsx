import React from 'react';
import '../styles/components/ErrorBox.css';

function ErrorBox({ ErrorMessage, type = 'error', className = '' }) {
    return (
        // Class name can be both 'warning' and 'info':
        <div className={`error-box ${type} ${className}`}>
            <h2>Error:</h2>
            <p>{ErrorMessage}</p>
        </div>
    );
}
export default ErrorBox;