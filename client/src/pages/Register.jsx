import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password, formData.mobile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-lg border-none">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-teal-700 mb-2">Create Account</h1>
        <p className="text-navy-500 text-sm">Join InvestEase to manage your portfolio</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="1234567890"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center py-2.5 mt-4"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
