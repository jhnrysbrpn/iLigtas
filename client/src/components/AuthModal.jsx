import React, { useState } from 'react';
import { X, Shield, Lock, UserPlus, KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../api/client';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  usersList,
  setUsersList
}) {
  const [activeTab, setActiveTab] = useState('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Resident');
  const [selectedAccessType, setSelectedAccessType] = useState('Resident');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regDepartment, setRegDepartment] = useState('bfp');
  const [regDepartmentId, setRegDepartmentId] = useState('');

  const handleAccessTypeChange = (value) => {
    setSelectedAccessType(value);
    setRegError('');
    if (value === 'Resident') {
      setRegRole('Resident');
    } else if (value === 'Volunteer') {
      setRegRole('Responder');
      setRegDepartment('volunteers');
    } else if (value === 'Rescue') {
      setRegRole('Responder');
      setRegDepartment('rescue');
    } else if (value === 'Official') {
      setRegRole('Admin');
      setRegDepartment('rescue');
    } else {
      setRegRole('Responder');
      setRegDepartment('bfp');
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername || !loginPassword) {
      setLoginError('Please enter both username and password.');
      return;
    }

    try {
      // 1. Try local simulated authentication check first for near-instant demo access
      const localUser = (usersList || []).find(
        u => u && u.username && u.username.toLowerCase() === loginUsername.trim().toLowerCase()
      );
      if (localUser) {
        if (localUser.password === loginPassword) {
          localStorage.setItem('bdrrmc_token', 'local-simulated-token');
          onAuthSuccess(localUser.username, localUser.name, localUser.role, localUser.email, localUser.phone);
          onClose();
          return;
        } else {
          throw new Error('Password incorrect (local database check).');
        }
      }

      // 2. Fall back to fetch API if not a simulated account or local check failed
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data.data;
      localStorage.setItem('bdrrmc_token', token);
      
      // Call parent success handler
      onAuthSuccess(user.username, user.name, user.role, user.email, user.phone);
      onClose();
    } catch (err) {
      // If it failed to fetch, and we already tried local simulation inside, show explicit error or try one last dynamic check
      if (err.message && err.message.includes('Failed to fetch')) {
        const localUser = (usersList || []).find(
          u => u && u.username && u.username.toLowerCase() === loginUsername.trim().toLowerCase()
        );
        if (localUser && localUser.password === loginPassword) {
          localStorage.setItem('bdrrmc_token', 'local-simulated-token');
          onAuthSuccess(localUser.username, localUser.name, localUser.role, localUser.email, localUser.phone);
          onClose();
        } else {
          setLoginError(`Authentication failed: Account not matching local simulation list.`);
        }
      } else {
        setLoginError(`Invalid credentials: ${err.message}`);
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    const trimmedName = regFullName.trim();
    const trimmedEmail = regEmail.trim();
    const trimmedPhone = regPhone.trim();
    const trimmedUsername = regUsername.trim();
    const trimmedPassword = regPassword;

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedUsername || !trimmedPassword) {
      setRegError('All fields are mandatory.');
      return;
    }

    // Email validation: must contain "@" and "." and follow a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.') || !emailRegex.test(trimmedEmail)) {
      setRegError('Please enter a complete and valid email address (must contain "@", "." and follow standard name@email.com format).');
      return;
    }

    // Cellphone number validation: must be exactly 11 digits, must start with "09", contain only digits (positive and no "-")
    const isExactlyElevenDigits = trimmedPhone.length === 11 && /^\d+$/.test(trimmedPhone);
    const startsWith09 = trimmedPhone.startsWith('09');
    if (!isExactlyElevenDigits || !startsWith09) {
      setRegError('Cellphone number must be exactly 11 digits starting with "09" and positive (no "-" sign or other symbols).');
      return;
    }

    // Strong Password validation: at least 6 characters long, contains letters (with both upper & letters/numbers) and special characters
    const isAtLeast6 = trimmedPassword.length >= 6;
    const hasLetters = /[a-zA-Z]/.test(trimmedPassword);
    const hasNumbers = /[0-9]/.test(trimmedPassword);
    const hasUppercase = /[A-Z]/.test(trimmedPassword);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(trimmedPassword);

    if (!isAtLeast6 || !hasLetters || !hasNumbers || !hasUppercase || !hasSpecialChar) {
      setRegError('Password must be at least 6 characters long and contain letters, numbers, at least one uppercase letter (A-Z), and at least one special character.');
      return;
    }

    const isElevated = selectedAccessType !== 'Resident';

    if (isElevated) {
      if (!regDepartmentId.trim()) {
        setRegError('Department Verification ID is required for elevated accounts.');
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          username: trimmedUsername,
          password: trimmedPassword,
          requestedRole: isElevated ? regRole : undefined,
          department: isElevated ? regDepartment : undefined,
          departmentId: isElevated ? regDepartmentId.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        if (data.errors && Array.isArray(data.errors)) {
          // If Zod validation errors exist, format and display them
          const errorMsgs = data.errors.map(err => err.message).join(', ');
          throw new Error(errorMsgs);
        }
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data.data;
      localStorage.setItem('bdrrmc_token', token);

      setRegSuccess(true);
      
      // Automatically login user after registration delay
      setTimeout(() => {
        onAuthSuccess(user.username, user.name, user.role, user.email, user.phone);
        setRegSuccess(false);
        // Reset inputs
        setRegFullName('');
        setRegEmail('');
        setRegPhone('');
        setRegUsername('');
        setRegPassword('');
        setRegDepartment('bfp');
        setRegDepartmentId('');
        onClose();
      }, 1800);
    } catch (err) {
      // Offline / Local Simulation signup fallback
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        if (usersList.some(u => u && u.username && u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
          setRegError('Username already taken in local database.');
          return;
        }

        const roleToSet = isElevated ? regRole : 'Resident';
        const newUser = {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          username: trimmedUsername,
          password: trimmedPassword,
          role: roleToSet === 'Admin' ? 'Admin' : roleToSet === 'SuperAdmin' ? 'SuperAdmin' : 'Resident',
          department: isElevated ? regDepartment : undefined,
          departmentId: isElevated ? regDepartmentId.trim() : undefined,
          approved: true
        };

        const updatedUsersList = [...usersList, newUser];
        setUsersList(updatedUsersList);
        localStorage.setItem('_users_list', JSON.stringify(updatedUsersList));
        localStorage.setItem('bdrrmc_token', 'local-simulated-token');

        setRegSuccess(true);
        setTimeout(() => {
          onAuthSuccess(newUser.username, newUser.name, newUser.role, newUser.email, newUser.phone);
          setRegSuccess(false);
          // Reset inputs
          setRegFullName('');
          setRegEmail('');
          setRegPhone('');
          setRegUsername('');
          setRegPassword('');
          setRegDepartment('bfp');
          setRegDepartmentId('');
          onClose();
        }, 1800);
      } else {
        setRegError(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in select-none">
      <div className={`bg-[#EFF2FE] border-2 border-slate-900/15 rounded-2xl ${activeTab === 'register' ? 'max-w-3xl' : 'max-w-md'} w-full shadow-2xl relative flex flex-col max-h-[92vh] transition-all duration-350`}>
        
        {/* Modal Top Branding */}
        <div className="bg-linear-to-r from-red-50 to-[#EAEDFC] duration-150 p-6 border-b border-slate-900/10 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 p-1 rounded-lg hover:bg-slate-300/50 transition-all cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 border border-red-300 rounded-lg">
              <Shield className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wide font-mono">
                Barangay 35 Securing Portal
              </h3>
              <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold font-mono tracking-wider">
                Brgy 35 Maypajo, Caloocan City
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Container if too much content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Success Splash Screen */}
          {regSuccess ? (
            <div className="p-8 text-center flex flex-col items-center justify-center min-h-75">
              <CheckCircle className="w-16 h-16 text-emerald-600 animate-bounce mb-4" />
              <h4 className="text-lg font-black text-emerald-800 uppercase font-mono">Registration Successful!</h4>
              <p className="text-xs text-slate-700 mt-2 max-w-xs">
                Account constructed. Preparing system session credentials...
              </p>
            </div>
          ) : (
            <div>
              
              {/* Modal Tabs Switching */}
              <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300 mb-5 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginError('');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-950 border border-slate-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegError('');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-slate-950 border border-slate-300 shadow-xs'
                      : 'text-slate-600 hover:text-[#EAEDFC]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Resident</span>
                </button>
              </div>

              {/* TAB A: SIGN IN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {loginError && (
                    <div className="p-3 text-[11px] leading-relaxed bg-red-50 border border-red-300 text-red-900 rounded-lg">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1.5 font-mono">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g., admin"
                      className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1.5 font-mono">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="e.g., admin"
                        className="w-full text-xs p-2.5 pr-10 rounded border border-slate-300 bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
                        title={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50/95 p-3 rounded-xl border border-blue-200">
                    <p className="text-[10px] leading-relaxed text-blue-900">
                      💡 <strong>Quick simulation demo access:</strong><br />
                      • Barangay Admin (admin): <code className="text-indigo-850 font-black">admin</code> | Pass: <code className="text-indigo-800 font-black">admin</code><br />
                      • BFP Admin (admin): <code className="text-indigo-850 font-black">bfpadmin</code> | Pass: <code className="text-indigo-800 font-black">bfpadmin</code> (Bureau of Fire Protection)<br />
                      • Health Admin (admin): <code className="text-indigo-850 font-black">healthadmin</code> | Pass: <code className="text-indigo-800 font-black">healthadmin</code> (Medics / Red Cross)<br />
                      • Super Admin (developer): <code className="text-indigo-850 font-black">supadmin</code> | Pass: <code className="text-indigo-800 font-black">supadmin</code>
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/2 py-2.5 text-xs font-semibold rounded bg-slate-300 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      Sign in as Barangay Resident / Public
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 text-xs font-black rounded bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-97 transition-all uppercase tracking-wider font-mono cursor-pointer"
                    >
                      Secure Log In
                    </button>
                  </div>

                </form>
              )}

              {/* TAB B: REGISTER ADMIN ACCOUNT */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {regError && (
                    <div className="p-3 text-[11px] leading-relaxed bg-red-100 border border-red-300 text-red-900 rounded-lg font-bold">
                      {regError}
                    </div>
                  )}

                  {/* 2-Column fields Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Full Name (Middle, Last) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Kagawad Maria Santos"
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. maria@gmail.com"
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Cellphone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 11) {
                            setRegPhone(val);
                          }
                        }}
                        placeholder="e.g. 09171234567"
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="e.g. mariasantos"
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs p-2.5 pr-10 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
                          title={showRegPassword ? "Hide password" : "Show password"}
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Role selection dropdown */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                        Official Clearance / Role *
                      </label>
                      <select
                        value={selectedAccessType}
                        onChange={(e) => {
                          handleAccessTypeChange(e.target.value);
                        }}
                        className="w-fit max-w-full text-xs py-2.5 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-red-500 font-mono font-bold cursor-pointer"
                        style={{
                          width: `calc(${
                            ({
                              "Resident": "Resident",
                              "Volunteer": "Barangay Volunteer",
                              "Rescue": "Barangay Rescue Squad",
                              "Official": "Barangay Admin & Officials",
                              "External": "External Public Agency (BFP/PNP)"
                            }[selectedAccessType] || selectedAccessType || '').length
                          }ch + 3.5rem)`
                        }}
                      >
                        <option value="Resident">Resident</option>
                        <option value="Volunteer">Barangay Volunteer</option>
                        <option value="Rescue">Barangay Rescue Squad</option>
                        <option value="Official">Barangay Admin & Officials</option>
                        <option value="External">External Public Agency (BFP/PNP)</option>
                      </select>
                    </div>

                    {/* Requested Account Role: Only shown for External per requirements */}
                    {selectedAccessType === 'External' && (
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1.5 font-mono">
                          Requested Account Role *
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          className="w-fit max-w-full text-[#0f172a] text-xs py-2.5 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-white focus:outline-none focus:border-red-500 font-mono font-bold cursor-pointer mb-2"
                          style={{
                            width: `calc(${
                              ({
                                "Admin": "Admin / Officer (Handles operations and status updates)",
                                "Responder": "Responder / Field Personnel"
                              }[regRole] || regRole || '').length
                            }ch + 3.5rem)`
                          }}
                        >
                          <option value="Admin">Admin / Officer (Handles operations and status updates)</option>
                          <option value="Responder">Responder / Field Personnel</option>
                        </select>
                      </div>
                    )}

                    {/* Department Context block: displayed for and tailored to elevated categories */}
                    {selectedAccessType !== 'Resident' && (
                      <div className="space-y-3.5 p-3.5 rounded-xl bg-orange-50/70 border border-orange-300 shadow-xs md:col-span-2">
                        {/* Identify Department Dropdown: ONLY visible for External Agency */}
                        {selectedAccessType === 'External' && (
                          <div>
                            <label className="block text-[10px] font-bold text-orange-800 tracking-wider uppercase mb-1 font-mono">
                              Identify Department *
                            </label>
                            <select
                              value={regDepartment}
                              onChange={(e) => setRegDepartment(e.target.value)}
                              className="w-fit max-w-full text-xs py-2.5 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-orange-200 bg-white text-slate-950 focus:outline-none focus:border-emerald-500 font-bold cursor-pointer"
                              style={{
                                width: `calc(${
                                  ({
                                    "bfp": "Bureau of Fire Protection (BFP) Maypajo",
                                    "pnp": "Philippine National Police (PNP) Maypajo",
                                    "volunteers": "Barangay 35 Fire Volunteer Brigade",
                                    "medics": "Maypajo Health & Red Cross Medic Unit",
                                    "rescue": "Barangay Rescue & Evacuation Squad"
                                  }[regDepartment] || regDepartment || '').length
                                }ch + 3.5rem)`
                              }}
                            >
                              <option value="bfp">Bureau of Fire Protection (BFP) Maypajo</option>
                              <option value="pnp">Philippine National Police (PNP) Maypajo</option>
                              <option value="volunteers">Barangay 35 Fire Volunteer Brigade</option>
                              <option value="medics">Maypajo Health & Red Cross Medic Unit</option>
                              <option value="rescue">Barangay Rescue & Evacuation Squad</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-orange-850 tracking-wider uppercase mb-1 font-mono">
                            Department ID / Card Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={regDepartmentId}
                            onChange={(e) => setRegDepartmentId(e.target.value)}
                            placeholder={
                              selectedAccessType === 'Official' 
                                ? 'e.g. BDRRMC-35, OFFICIAL-01' 
                                : selectedAccessType === 'Volunteer' 
                                ? 'e.g. VOL-35-001' 
                                : selectedAccessType === 'Rescue' 
                                ? 'e.g. RES-35-001' 
                                : 'e.g. BFP-4015, RES-201'
                            }
                            className="w-full text-xs p-2.5 rounded border border-orange-200 bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="flex gap-2 pt-2 md:col-span-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/2 py-2.5 text-xs font-semibold rounded bg-slate-300 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 text-xs font-black rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-97 transition-all uppercase tracking-wider font-mono cursor-pointer"
                    >
                      Submit Registration
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
