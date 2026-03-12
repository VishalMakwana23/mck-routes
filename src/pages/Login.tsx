import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const inputBaseClass =
    'h-12 w-full rounded-lg border bg-white px-4 text-sm text-ink-strong outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand-ring';
  const labelClass = 'mb-2 block text-[0.8rem] font-medium text-ink-strong';

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-[#faf9f7] px-4 py-10"
      style={{
        backgroundImage: 'url(/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]" aria-hidden />
      <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-[#e8e4de] bg-[#fcfaf6]/95 p-8 shadow-[0_8px_32px_rgba(15,94,92,0.12)] backdrop-blur">
        <div className="mb-8 text-center">
          <img
            src="/ziing-logo.png"
            alt="ziing.ai"
            className="mx-auto mb-6 h-10 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-ink-strong">Login</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputBaseClass} ${emailError ? 'border-danger' : 'border-[#d0d0d0]'}`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Password <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Type here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBaseClass} pr-12 ${passwordError ? 'border-danger' : 'border-[#d0d0d0]'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-base focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <span className="mt-2 inline-block text-xs font-medium text-danger">{error}</span>
            )}
          </div>

          <a
            href="#"
            className="block text-sm font-medium text-ink-muted hover:text-brand hover:underline"
          >
            Forgot Password?
          </a>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#333] accent-brand"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="text-sm font-medium text-ink-base">Remember me</span>
          </label>

          <button
            disabled={!isFormValid}
            onClick={handleLogin}
            className={`mt-4 h-12 w-full rounded-full text-sm font-semibold text-white transition ${
              isFormValid
                ? 'bg-[#0F5E5C] hover:bg-[#0a4a48] cursor-pointer shadow-[0_4px_14px_rgba(15,94,92,0.35)]'
                : 'cursor-not-allowed bg-[#eae8e4] text-[#9a9894]'
            }`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
