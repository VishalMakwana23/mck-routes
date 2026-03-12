import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ziingLogo from '../assets/ziingLogo.png';
import loginBackground from '../assets/loginBackground.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
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

    // Supabase Auth
    const result = await login(email, password);

    if (result.success) {
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const isFormValid = email && password && validateEmail(email);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-['Montserrat',sans-serif]">
      {/* Login Card */}
      <div className="w-[400px] px-[32px] py-[40px] rounded-[8px] bg-[#FCEFE5] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[20px] z-10 relative top-[-20px]">
        
        {/* Header */}
        <div className="text-center mb-1">
          <img 
            src={ziingLogo} 
            alt="ziing.ai" 
            className="h-[28px] object-contain mx-auto mb-2.5" 
          />
          <h1 className="font-bold text-[#000000] text-[22px]">
            Login
          </h1>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-[6.4px]">
          <label className="font-medium text-[#333] text-[13px]">
            Email <span className="text-[#D32F2F]">*</span>
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-white rounded flex h-[44px] px-[14px] text-[13px] border ${
              emailError ? 'border-[#D32F2F]' : 'border-[#E0E0E0] hover:border-[#B0B0B0] focus:border-[#0B3B32]'
            } outline-none placeholder:italic placeholder:text-[#A0A0A0] transition-colors`}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-[6.4px]">
          <label className="font-medium text-[#333] text-[13px]">
            Password <span className="text-[#D32F2F]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Type here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white rounded flex h-[44px] pl-[14px] pr-10 text-[13px] border ${
                passwordError ? 'border-[#D32F2F]' : 'border-[#E0E0E0] hover:border-[#B0B0B0] focus:border-[#0B3B32]'
              } outline-none placeholder:italic placeholder:text-[#A0A0A0] transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <span className="text-[#D32F2F] text-[11px] mt-0.5">
              {error}
            </span>
          )}
        </div>

        {/* Forgot Password */}
        <a href="#" className="text-[#333] text-[12px] font-semibold self-start underline decoration-[#333] hover:text-black">
          Forgot Password?
        </a>

        {/* Remember me */}
        <label className="flex items-center gap-[4px] cursor-pointer mt-[-12px] ml-[-4px]">
          <div className="relative flex items-center p-[4px]">
            <input
              type="checkbox"
              className="peer h-[20px] w-[20px] cursor-pointer appearance-none rounded-[2px] border-[1px] border-[#333] checked:bg-[#333] checked:border-[#333] transition-all"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </div>
          <span className="text-[13px] font-medium text-[#333]">Remember me</span>
        </label>

        {/* Login Button */}
        <button
          disabled={!isFormValid}
          onClick={handleLogin}
          className={`w-full h-[48px] rounded-[24px] text-[14px] font-medium transition-colors mt-[8px] ${
            isFormValid 
              ? 'bg-[#0B3B32] text-white hover:bg-[#082e27] cursor-pointer' 
              : 'bg-[#EAEAEA] text-[#A0A0A0] cursor-not-allowed'
          }`}
        >
          Login
        </button>

      </div>

      {/* Background Image */}
      <img
        src={loginBackground}
        alt="Cityscape"
        className="absolute bottom-0 left-0 w-full h-auto max-h-[45vh] object-cover object-bottom z-0 pointer-events-none"
      />
    </div>
  );
};

export default LoginPage;
