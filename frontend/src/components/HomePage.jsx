import React, { useEffect, useState } from 'react';
import '../globals.css';

function HomePage(){ 
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          const token = sessionStorage.getItem('token');
          const username = sessionStorage.getItem('username');
    
          if (!token) {
            console.error('No token found in session storage');
            return;
          }
    
          try {
            const params = new URLSearchParams({ param: username }).toString();
            const url = `http://localhost:8080/user/?${params}`
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json'
              }
            });
    
            if (response.ok) {
              const result = await response.json();
              setData(result);
            } else {
              setError(`Error: ${response.statusText}`);
            }
          } catch (error) {
            setError(`Error: ${error.message}`);
          }
        };
    
        fetchData();
      }, []);
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            {error && <p>{error}</p>}
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default HomePage