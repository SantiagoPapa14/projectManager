import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import "../globals.css"

function LoginForm()
{

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.authorization);
        sessionStorage.setItem('username', formData.username);
        navigate('/home');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'90vh'}}> {/* Centering */}
      <Box //Main form
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          p: 3,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: 3,
      }}>

    <Typography variant="h5" component="h1" sx={{ //Title
          mb: 1, 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: '24px',
          color: '#333',
      }}>
      Project Manager
    </Typography>

    <TextField //Username Input
      required
      name="username"
      label="Username"
      value={formData.username}
      onChange={handleChange}
      sx={{ mt: 3, mb: 2}}
    />
    <br></br>
    <TextField //Password Input
      required
      name="password"
      type='password'
      label="Password"
      value={formData.password}
      defaultValue=""
      onChange={handleChange}
      sx={{ mt: 3, mb: 2}}
    />
    <Button //Login Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2}}
        >
          Sign In
    </Button>
  </Box>
</Box>
);
}

export default LoginForm;
