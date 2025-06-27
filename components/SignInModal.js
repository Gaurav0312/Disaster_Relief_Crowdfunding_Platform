import { useState, useEffect } from 'react';
import { Users, Mail, Lock, X, AlertCircle } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

const GitHubIcon = () => <FaGithub size={20} className="mr-2" />;

const SignInModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('login');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    } else {
      // Set the tab when modal opens
      setActiveTab(initialTab);
    }

  }, [isOpen, initialTab]);

  const handleTabChange = (tab) => {
    // Clear form data when switching tabs
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'login') {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          setError('Invalid credentials.');
        } else {
          onClose();
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        // Handle user registration
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Registration failed.');
        } else {
          const loginResult = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (loginResult?.error) {
            setError('Registration successful! Please sign in.');
            setActiveTab('login');
          } else {
            onClose();
          }
        }
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed.');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      alert('GitHub sign-in failed.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            key={activeTab}
          >
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </div>
              )}

              <div className="flex border-b mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2 font-medium transition-colors ${
                    activeTab === 'login' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleTabChange('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 font-medium transition-colors ${
                    activeTab === 'register' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleTabChange('register')}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} key={`form-${activeTab}`}>
                <div className="space-y-4">
                  {activeTab === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-black mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Users size={18} className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full Name"
                          required={activeTab === 'register'}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-black mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Mail size={18} className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-black mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Lock size={18} className="text-gray-500" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="******"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {activeTab === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-black mb-2">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Lock size={18} className="text-gray-500" />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-3 py-3 border ${
                            confirmPassword && confirmPassword !== password 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 ${
                            confirmPassword && confirmPassword !== password 
                              ? 'focus:ring-red-500' 
                              : 'focus:ring-blue-500'
                          }`}
                          placeholder="******"
                          required
                          minLength={6}
                        />
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      'Processing...'
                    ) : activeTab === 'login' ? (
                      'Sign In'
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGitHubSignIn}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-900 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 "
                >
                  <GitHubIcon /> Sign in with GitHub
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="inline-flex h-10 w-full items-center justify-center gap-4 rounded border border-slate-900 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"
                    className="h-[18px] w-[18px] "
                  />
                  Sign in with Google
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => handleTabChange('register')}
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => handleTabChange('login')}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;