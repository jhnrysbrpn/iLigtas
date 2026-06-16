import React, { useState } from 'react';
import { X, Shield, Lock, UserPlus, KeyRound, CheckCircle } from 'lucide-react';
import { translations, Language } from '../data/translations';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  usersList,
  setUsersList,
  language,
  t
}) {
  const [activeTab, setActiveTab] = useState('login');
  
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
    } else {
      setRegRole('Admin');
      if (value === 'Volunteer') {
        setRegDepartment('volunteers');
      } else if (value === 'Rescue') {
        setRegDepartment('rescue');
      } else if (value === 'Official') {
        setRegDepartment('rescue');
      } else {
        setRegDepartment('bfp');
      }
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername || !loginPassword) {
      setLoginError(language === 'ph' ? 'Pakisulat po ang lahat ng impormasyon.' : 'Please enter both username and password.');
      return;
    }

    // Lookup user from state
    const matched = usersList.find(
      u => u && u.username && u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.password === loginPassword
    );

    if (matched) {
      // Elevated roles that are not yet approved only get logged in as a "Resident" session
      const activeRole = (matched.approved || matched.role === 'Resident') ? matched.role : 'Resident';
      onAuthSuccess(matched.username, matched.name, activeRole, matched.email, matched.phone);
      onClose();
    } else {
      setLoginError(
        language === 'ph' 
          ? 'Maling credentials. Maaari kang mag-register ng bagong account o gamitin ang "admin" o "fire" para mag-login.' 
          : 'Invalid credentials. You can register a new account on the Create Account tab, or use "admin" (Official) or "fire" (Admin) to log in instantly.'
      );
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    const trimmedName = regFullName.trim();
    const trimmedEmail = regEmail.trim();
    const trimmedPhone = regPhone.trim();
    const trimmedUsername = regUsername.trim();
    const trimmedPassword = regPassword;

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedUsername || !trimmedPassword) {
      setRegError(language === 'ph' ? 'Pakisulat po ang lahat ng nilalaman.' : 'All fields are mandatory.');
      return;
    }

    if (trimmedName.length < 3) {
      setRegError(language === 'ph' ? 'Ang Buong Pangalan ay dapat may hindi bababa sa 3 karakter.' : 'Full Name must be at least 3 characters long.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setRegError(language === 'ph' ? 'Mangyaring maglagay ng valid na email address (hal: juan@gmail.com).' : 'Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // Phone format validation (PH: 09 / +639 / 639 followed by 9 digits)
    const phoneRegex = /^(09|\+639|639)\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setRegError(language === 'ph' ? 'Magpasok ng valid na numerong nagsisimula sa 09 (Halimbawa: 09171234567).' : 'Please enter a valid Philippine mobile number starting with 09 (e.g. 09171234567).');
      return;
    }

    if (trimmedUsername.length < 3) {
      setRegError(language === 'ph' ? 'Ang Username ay dapat may hindi bababa sa 3 karakter.' : 'Username must be at least 3 characters long.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setRegError(language === 'ph' ? 'Ang Password ay dapat may hindi bababa sa 6 na karakter.' : 'Password must be at least 6 characters long.');
      return;
    }

    const isElevated = selectedAccessType !== 'Resident';

    if (isElevated) {
      if (!regDepartmentId.trim()) {
        setRegError(language === 'ph' ? 'Kailangan ang Department ID para sa elevated account.' : 'Department Verification ID is required for elevated accounts.');
        return;
      }
    }

    // Check if username taken
    const exists = usersList.some(u => u && u.username && u.username.toLowerCase() === trimmedUsername.toLowerCase());
    if (exists) {
      setRegError(language === 'ph' ? 'May gumagamit na ng username na ito.' : 'Username already registered.');
      return;
    }

    // Create user: elevated requests are parked as 'Resident' and approved = false
    const newUser = {
      name: trimmedName,
      username: trimmedUsername.toLowerCase(),
      email: trimmedEmail.toLowerCase(),
      phone: trimmedPhone,
      password: trimmedPassword,
      role: 'Resident', // without permission the users can only be a resident initially
      requestedRole: isElevated ? regRole : undefined,
      department: isElevated ? regDepartment : undefined,
      departmentId: isElevated ? regDepartmentId.trim() : undefined,
      approved: !isElevated // Residents auto-approved, staff require approval
    };

    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);
    localStorage.setItem('_users_list', JSON.stringify(updatedList));

    setRegSuccess(true);
    
    // Automatically login user after registration delay
    setTimeout(() => {
      // They log in as 'Resident' since they are not approved yet!
      onAuthSuccess(newUser.username, newUser.name, 'Resident', newUser.email, newUser.phone);
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
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in select-none">
      <div className="bg-[#EFF2FE] border-2 border-slate-900/15 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden">
        
        {/* Modal Top Branding */}
        <div className="bg-linear-to-r from-red-50 to-[#EAEDFC] duration-150 p-6 border-b border-slate-900/10">
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
                {t('authModalTitle')}
              </h3>
              <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold font-mono tracking-wider">
                Brgy 35 Maypajo, Caloocan City
              </p>
            </div>
          </div>
        </div>

        {/* Success Splash Screen */}
        {regSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-75">
            <CheckCircle className="w-16 h-16 text-emerald-600 animate-bounce mb-4" />
            <h4 className="text-lg font-black text-emerald-800 uppercase font-mono">{t('registerSuccessLabel')}!</h4>
            <p className="text-xs text-slate-700 mt-2 max-w-xs">
              {language === 'ph' 
                ? 'Nagawa na ang inyong portal staff account. Awtomatiko ka naming ilo-log in ngayon...'
                : 'Account constructed. Preparing system session credentials...'
              }
            </p>
          </div>
        ) : (
          <div className="p-6">
            
            {/* Modal Tabs Switching */}
            <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300 mb-5 text-center">
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
                <span>{t('loginTab')}</span>
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
                <span>{t('registerTab')}</span>
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
                    {t('usernameInput')} *
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
                    {t('passwordInput')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="e.g., admin"
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="bg-blue-50/95 p-3 rounded-xl border border-blue-200">
                  <p className="text-[10px] leading-relaxed text-blue-900">
                    💡 <strong>Quick simulation demo access:</strong><br />
                    • Super Admin: <code className="text-indigo-800 font-black">admin</code> | Pass: <code className="text-indigo-800 font-black">admin</code><br />
                    • BFP Admin: <code className="text-indigo-800 font-black">bfpadmin</code> | Pass: <code className="text-indigo-800 font-black">bfpadmin</code> (Locked to Fire Dept)<br />
                    • PNP Admin: <code className="text-indigo-800 font-black">pnpadmin</code> | Pass: <code className="text-indigo-800 font-black">pnpadmin</code> (Locked to Police / PNP)<br />
                    • Health Admin: <code className="text-indigo-800 font-black">healthadmin</code> | Pass: <code className="text-indigo-800 font-black">healthadmin</code> (Locked to Medics/Health)<br />
                    • Respondents: <code className="text-indigo-800 font-black">fire</code> | Pass: <code className="text-indigo-800 font-black">fire</code>
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 py-2.5 text-xs font-semibold rounded bg-slate-300 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    {t('residentToggleBtn')}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 text-xs font-black rounded bg-red-650 hover:bg-red-700 text-white shadow-md active:scale-97 transition-all uppercase tracking-wider font-mono cursor-pointer"
                  >
                    {t('signInAction')}
                  </button>
                </div>

              </form>
            )}

            {/* TAB B: REGISTER ADMIN ACCOUNT */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                
                {regError && (
                  <div className="p-3 text-[11px] leading-relaxed bg-red-100 border border-red-300 text-red-900 rounded-lg font-bold">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                    {t('fullnameInput')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Kagawad Maria Santos"
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
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
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
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
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 09171234567"
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                    {t('usernameInput')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. mariasantos"
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                    {t('passwordInput')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                 {/* Role selection dropdown */}
                 <div>
                   <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-mono">
                     {t('selectRole')} *
                   </label>
                   <select
                     value={selectedAccessType}
                     onChange={(e) => {
                       handleAccessTypeChange(e.target.value);
                       setRegError('');
                     }}
                     className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-red-500 font-mono font-bold cursor-pointer"
                   >
                     <option value="Resident">{language === 'ph' ? 'Mamamayan (Resident)' : 'Resident'}</option>
                      <option value="Volunteer">{language === 'ph' ? 'Barangay Volunteer (BDRRMC Support)' : 'Barangay Volunteer'}</option>
                      <option value="Rescue">{language === 'ph' ? 'Barangay Rescue Squad' : 'Barangay Rescue Squad'}</option>
                      <option value="Official">{language === 'ph' ? 'Barangay Admin / Officials' : 'Barangay Admin & Officials'}</option>
                      <option value="External">{language === 'ph' ? 'External Agency (BFP/PNP/Medics)' : 'External Public Agency (BFP/PNP)'}</option>
                     
                     
                   </select>
                 </div>

                 {selectedAccessType !== 'Resident' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-1.5 font-mono">
                        Requested Account Role *
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="w-full text-[#0f172a] text-xs p-2.5 rounded border border-slate-300 bg-white focus:outline-none focus:border-red-500 font-mono font-bold cursor-pointer mb-3.5"
                      >
                        <option value="Admin">Admin / Officer (Handles operations and status updates)</option>
                        <option value="Responder">Responder / Field Personnel</option>
                      </select>
                    </div>
                  )}

                  {selectedAccessType !== 'Resident' && (
                   <div className="space-y-3.5 p-3.5 rounded-xl bg-orange-50 border-2 border-orange-300 shadow-xs">
                     <div>
                       <label className="block text-[10px] font-bold text-orange-800 tracking-wider uppercase mb-1 font-mono">
                         Identify Department *
                       </label>
                       <select
                         value={regDepartment}
                         onChange={(e) => setRegDepartment(e.target.value)}
                         className="w-full text-xs p-2.5 rounded border border-orange-200 bg-white text-slate-950 focus:outline-none focus:border-red-500 font-bold cursor-pointer"
                       >
                         <option value="bfp">Bureau of Fire Protection (BFP) Maypajo</option>
                          <option value="pnp">Philippine National Police (PNP) Maypajo</option>
                         <option value="volunteers">Barangay 35 Fire Volunteer Brigade</option>
                         <option value="medics">Maypajo Health & Red Cross Medic Unit</option>
                         <option value="rescue">Barangay Rescue & Evacuation Squad</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-[10px] font-bold text-orange-850 tracking-wider uppercase mb-1 font-mono">
                         Department ID / Card Code *
                       </label>
                       <input
                         type="text"
                         required
                         value={regDepartmentId}
                         onChange={(e) => setRegDepartmentId(e.target.value)}
                         placeholder={selectedAccessType === 'Official' ? 'e.g. BDRRMC-35, OFFICIAL-01' : selectedAccessType === 'Volunteer' ? 'e.g. VOL-35-001' : selectedAccessType === 'Rescue' ? 'e.g. RES-35-001' : 'e.g. BFP-4015, RES-201'}
                         className="w-full text-xs p-2.5 rounded border border-orange-200 bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono"
                       />
                     </div>
                   </div>
                 )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 py-2.5 text-xs font-semibold rounded bg-slate-300 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    {t('cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 text-xs font-black rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-97 transition-all uppercase tracking-wider font-mono cursor-pointer"
                  >
                    {t('signUpAction')}
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
