import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Link, 
  InputAdornment, 
  IconButton,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import ziingLogo from '../assets/ziingLogo.png';
import loginBackground from '../assets/loginBackground.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = () => {
    setError('');
    setEmailError(false);
    setPasswordError(false);

    let isValid = true;

    if (!email) {
      setEmailError(true);
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(true);
      isValid = false;
    }

    if (!password) {
      setPasswordError(true);
      isValid = false;
    }

    if (!isValid) return;

    const result = login(email, password);

    if (result.success) {
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      localStorage.setItem('currentUser', JSON.stringify(result.user));

      if (result.user.role === 'client') {
        navigate('/dashboard');
      } else if (result.user.role === 'admin') {
        navigate('/admin');
      }
    } else {
      setError(result.error);
    }
  };

  const isFormValid = email && password && validateEmail(email);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <Card
        sx={{
          width: '400px',
          padding: '40px 32px',
          borderRadius: '8px',
          backgroundColor: '#FCEFE5',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          zIndex: 2,
          position: 'relative',
          top: '-20px', // Slight offset upwards as per design
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Box 
            component="img" 
            src={ziingLogo} 
            alt="ziing.ai" 
            sx={{ 
              height: '28px', 
              mb: 2.5,
              objectFit: 'contain'
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000', fontSize: '22px', fontFamily: 'Montserrat, sans-serif' }}>
            Login
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontSize: '13px', fontFamily: 'Montserrat, sans-serif' }}>
            Email <span style={{ color: '#D32F2F' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="example@email.com"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                height: '44px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#B0B0B0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0B3B32',
                },
              },
              '& input': {
                padding: '10px 14px',
                fontSize: '13px',
                fontFamily: 'Montserrat, sans-serif',
                height: '44px',
                boxSizing: 'border-box',
              },
              '& input::placeholder': {
                fontStyle: 'italic',
                color: '#A0A0A0',
                opacity: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontSize: '13px', fontFamily: 'Montserrat, sans-serif' }}>
            Password <span style={{ color: '#D32F2F' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Type here"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18, color: '#666' }} /> : <Visibility sx={{ fontSize: 18, color: '#666' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                height: '44px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#B0B0B0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0B3B32',
                },
              },
              '& input': {
                padding: '10px 14px',
                fontSize: '13px',
                fontFamily: 'Montserrat, sans-serif',
                height: '44px',
                boxSizing: 'border-box',
              },
              '& input::placeholder': {
                fontStyle: 'italic',
                color: '#A0A0A0',
                opacity: 1,
              },
            }}
          />
          {error && (
            <FormHelperText error sx={{ mt: 0.5, fontSize: '11px', fontFamily: 'Montserrat, sans-serif' }}>
              {error}
            </FormHelperText>
          )}
        </Box>

        <Link href="#" underline="always" sx={{ color: '#333', fontSize: '12px', fontWeight: 600, alignSelf: 'flex-start', textDecorationColor: '#333', fontFamily: 'Montserrat, sans-serif' }}>
          Forgot Password?
        </Link>

        <FormControlLabel
          control={
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              sx={{
                color: '#333',
                padding: '4px',
                '&.Mui-checked': {
                  color: '#333',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: 20,
                    borderRadius: '2px'
                }
              }}
            />
          }
          label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#333', fontFamily: 'Montserrat, sans-serif' }}>Remember me</Typography>}
          sx={{ mt: -1.5, ml: -0.5 }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={!isFormValid}
          onClick={handleLogin}
          sx={{
            height: '48px',
            borderRadius: '24px',
            backgroundColor: '#EAEAEA', 
            color: '#A0A0A0',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#d0d0d0',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: '#EAEAEA',
              color: '#A0A0A0',
            },
            ...(isFormValid && {
                backgroundColor: '#0B3B32', 
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: '#082e27',
                }
            }),
            mt: 1,
          }}
        >
          Login
        </Button>

        <Box sx={{ textAlign: 'center', mt: 0 }}>
          <Typography variant="body2" sx={{ fontSize: '12px', color: '#333', fontFamily: 'Montserrat, sans-serif' }}>
            Don't have an account?{' '}
            <Link href="#" underline="always" sx={{ color: '#333', fontWeight: 700, textDecorationColor: '#333', fontFamily: 'Montserrat, sans-serif' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '9px', color: '#333', lineHeight: 1.4, display: 'block', maxWidth: '280px', mx: 'auto', fontFamily: 'Montserrat, sans-serif' }}>
            By accessing and using this platform/website, you agree to be bound by the{' '}
            <Link href="#" sx={{ color: '#000', fontWeight: 700, textDecoration: 'underline', fontFamily: 'Montserrat, sans-serif' }}>Terms of Use</Link>
            {' '}and{' '}
            <Link href="#" sx={{ color: '#000', fontWeight: 700, textDecoration: 'underline', fontFamily: 'Montserrat, sans-serif' }}>Privacy Notice</Link>
          </Typography>
        </Box>
      </Card>

      <Box
        component="img"
        src={loginBackground}
        alt="Cityscape"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          maxHeight: '45vh',
          objectFit: 'cover',
          objectPosition: 'bottom',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default LoginPage;
