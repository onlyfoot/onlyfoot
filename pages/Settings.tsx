import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { db } from '../services/db';
import { CURRENT_USER } from '../constants';
import { Shield, Bell, UserCheck, Lock, Eye, CreditCard, HelpCircle, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [isSubmittingKYC, setIsSubmittingKYC] = useState(false);
  const [kycStatus, setKycStatus] = useState(CURRENT_USER.kycStatus || 'none');

  const handleKYCSubmit = async () => {
    setIsSubmittingKYC(true);
    try {
      await db.requestKYC(CURRENT_USER.id, 'mock_doc_url');
      setKycStatus('pending');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingKYC(false);
    }
  };

  const sections = [
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'verification', label: 'Verification (KYC)', icon: UserCheck },
    { id: 'payments', label: 'Payments & Payouts', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen pb-20">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  activeSection === section.id 
                    ? 'bg-brand-500 text-white' 
                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-gray-600'}`} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-2 bg-dark-800 rounded-2xl border border-dark-700 p-6">
            {activeSection === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Account & Security</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-dark-700">
                    <div>
                      <p className="text-white font-medium">Email Address</p>
                      <p className="text-sm text-gray-500">{CURRENT_USER.email || 'user@example.com'}</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-dark-700">
                    <div>
                      <p className="text-white font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-dark-700">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-dark-700">
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-500">Control who can see your profile</p>
                    </div>
                    <select className="bg-dark-900 border border-dark-600 text-white text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5">
                      <option>Everyone</option>
                      <option>Subscribers Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-dark-700">
                    <div>
                      <p className="text-white font-medium">Show Activity Status</p>
                      <p className="text-sm text-gray-500">Allow others to see when you're online</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'verification' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Identity Verification</h2>
                
                {kycStatus === 'verified' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <h3 className="font-bold text-white">Verified</h3>
                      <p className="text-sm text-gray-300">Your identity has been verified. You can now earn money.</p>
                    </div>
                  </div>
                )}

                {kycStatus === 'pending' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                    <div>
                      <h3 className="font-bold text-white">Verification Pending</h3>
                      <p className="text-sm text-gray-300">We are reviewing your documents. This usually takes 24-48 hours.</p>
                    </div>
                  </div>
                )}

                {kycStatus === 'rejected' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <h3 className="font-bold text-white">Verification Failed</h3>
                      <p className="text-sm text-gray-300">Please check your documents and try again.</p>
                    </div>
                  </div>
                )}

                {kycStatus === 'none' && (
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <UserCheck className="w-6 h-6 text-brand-500 mt-1" />
                      <div>
                        <h3 className="font-bold text-white">Become a Creator</h3>
                        <p className="text-sm text-gray-300 mt-1">To start earning money, you need to verify your identity. This helps us keep the platform safe and compliant.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {kycStatus !== 'verified' && kycStatus !== 'pending' && (
                  <div className="space-y-4">
                    <div className="p-4 border border-dark-600 rounded-xl bg-dark-900/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white font-bold">1</div>
                        <h3 className="font-medium text-white">Government ID</h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-11">Upload a photo of your passport, driver's license, or national ID.</p>
                      <div className="ml-11 mt-3">
                        <Button size="sm" variant="outline">Upload Document</Button>
                      </div>
                    </div>

                    <div className="p-4 border border-dark-600 rounded-xl bg-dark-900/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white font-bold">2</div>
                        <h3 className="font-medium text-white">Selfie Verification</h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-11">Take a selfie holding your ID to confirm it's really you.</p>
                      <div className="ml-11 mt-3">
                        <Button 
                          size="sm" 
                          variant="primary" 
                          onClick={handleKYCSubmit}
                          disabled={isSubmittingKYC}
                        >
                          {isSubmittingKYC ? 'Submitting...' : 'Submit for Verification'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};