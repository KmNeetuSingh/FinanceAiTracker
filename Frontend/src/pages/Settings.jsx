import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { Save, User, Bell, Shield, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    // { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await usersAPI.updateProfile(profileData);
      // persist updated user locally
      const stored = localStorage.getItem('user');
      const current = stored ? JSON.parse(stored) : {};
      const updatedUser = { ...current, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaveMessage({ type: 'success', text: 'Profile updated successfully! Redirecting…' });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary flex items-center"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
          </form>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white-900">Notification Preferences</h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-white-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-white-700">Email notifications</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-white-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-white-700">Monthly reports</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-white-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-white-700">Budget alerts</span>
              </label>
            </div>
          </div>
        );
    
      
      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white-900">Billing Information</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You are currently on the <strong>Free Plan</strong>. Upgrade to access premium features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <h4 className="font-semibold text-white-900 mb-2">Free Plan</h4>
                <p className="text-2xl font-bold text-white-900 mb-4">₹0</p>
                <ul className="text-sm text-white-600 space-y-2 mb-4">
                  <li>✓ 5 statement uploads/month</li>
                  <li>✓ Basic categorization</li>
                  <li>✓ 30 days history</li>
                </ul>
                <button className="btn btn-secondary w-full" disabled>Current Plan</button>
              </div>
              
              <div className="card text-center border-2 border-blue-500">
                <h4 className="font-semibold text-white-900 mb-2">Pro Plan</h4>
                <p className="text-2xl font-bold text-white-900 mb-4">₹499<span className="text-sm font-normal">/month</span></p>
                <ul className="text-sm text-white-600 space-y-2 mb-4">
                  <li>✓ Unlimited uploads</li>
                  <li>✓ AI-powered categorization</li>
                  <li>✓ 1 year history</li>
                  <li>✓ Advanced reports</li>
                </ul>
                <button className="btn btn-primary w-full">Upgrade Now</button>
              </div>
              
              <div className="card text-center">
                <h4 className="font-semibold text-white-900 mb-2">Business Plan</h4>
                <p className="text-2xl font-bold text-white-900 mb-4">₹999<span className="text-sm font-normal">/month</span></p>
                <ul className="text-sm text-white-600 space-y-2 mb-4">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Multi-user access</li>
                  <li>✓ Custom categories</li>
                  <li>✓ Priority support</li>
                </ul>
                <button className="btn btn-secondary w-full">Contact Sales</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white-900 mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-white-600 hover:bg-white-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {saveMessage && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-3" />
                )}
                {saveMessage.text}
              </div>
            )}
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;