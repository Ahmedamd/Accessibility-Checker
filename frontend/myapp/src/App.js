import React, { useState } from 'react';
import axios from 'axios';
import pa11yImage from "../src/images/pa11y.png";
import { ClipLoader } from 'react-spinners'; // Importing a spinner component

function App() {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState({ issues: [], documentTitle: '', pageUrl: '' });
    const [error, setError] = useState('');
    const [showFullReport, setShowFullReport] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const checkAccessibility = async () => {
        try {
            setError('');
            setLoading(true);  // Start loading
            const response = await axios.post('http://localhost:5300/api/check-url', { url });

            setResults({
                issues: response.data.results.issues || [],
                documentTitle: response.data.results.documentTitle || 'Untitled Page',
                pageUrl: response.data.results.pageUrl || 'N/A',
            });
            setShowFullReport(false);
        } catch (err) {
            console.error('Request failed:', err.message);
            setError('Failed to check the URL. Please ensure the URL is correct and try again.');
        } finally {
            setLoading(false);  // End loading
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url) {
            checkAccessibility();
        } else {
            setError('Please enter a valid URL.');
        }
    };

    return (
        <div>
            <h1>Accessibility Checker</h1>
            <h3>Enter URL to check for accessibility</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h3>Powered by</h3>
                <a href='https://pa11y.org/'>
                    <img src={pa11yImage} style={{ display: 'flex', marginLeft: '10px', height: '65px' }} alt="Accessibility Checker Screenshot" />
                </a>
            </div>

            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder=" 🌐 Enter URL"
                    />
                </label>
                <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    Check Accessibility
                </button>
            </form>

            {error && <p className="error">{error}</p>}

             {/* Show the spinner while loading */}
             {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <ClipLoader color="#007bff" size={60} />  {/* Spinner component */}
                </div>
            )}

          
            {/* Accessibility results */}
            {!loading && Array.isArray(results.issues) && results.issues.length > 0 && (
                <div className='cont' style={{ marginTop: '20px' }}>
                    <div>
                        <h2 className='title'>
                            Accessibility Report for: <a href={results.pageUrl} target="_blank" rel="noopener noreferrer">{results.documentTitle}</a>
                        </h2>
                        <p className='total-issues'>Total Issues: {results.issues.length}</p>
                        {results.issues.slice(0, showFullReport ? results.issues.length : 15).map((issue, index) => (
                            <div className='issue' key={index}>
                                <h3 style={{ textAlign: 'left' }}>Issue {index + 1}</h3>
                                <p><strong>Code:</strong> {issue.code}</p>
                                <p><strong>Message:</strong> {issue.message}</p>
                                {issue.context && (
                                    <p><strong>Context:</strong> <code>{issue.context}</code></p>
                                )}
                                {issue.selector && (
                                    <p><strong>Selector:</strong> {issue.selector}</p>
                                )}
                                {issue.runnerExtras && issue.runnerExtras.suggestions && (
                                    <div>
                                        <p><strong>Suggested Solutions:</strong></p>
                                        <ul>
                                            {issue.runnerExtras.suggestions.map((suggestion, idx) => (
                                                <li key={idx}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                        {results.issues.length > 15 && !showFullReport && (
                            <button className='showButton'
                                onClick={() => setShowFullReport(true)}
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                            >
                                Show Full Report
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
