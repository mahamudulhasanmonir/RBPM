import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Smartphone, 
  Save,
  User,
  Lock,
  Database,
  Palette,
  Volume2,
  Eye,
  Clock,
  Download,
  Upload
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Appearance
    theme: isDarkMode ? 'dark' : 'light',
    language: 'en',
    timezone: 'UTC',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    weeklyReports: true,
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    dataSharing: false,
    activityLogging: true,
    
    // Performance
    autoSave: true,
    animationsEnabled: true,
    soundEnabled: true,
    
    // Profile
    showOnlineStatus: true,
    allowDirectMessages: true,
    profileVisibility: 'team'
  });

  const [activeTab, setActiveTab] = useState('appearance');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    if (key === 'theme') {
      if ((value === 'dark' && !isDarkMode) || (value === 'light' && isDarkMode)) {
        toggleTheme();
      }
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    // Show success message
  };

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
  }> = ({ icon, title, description, children }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'data', label: 'Data', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance Settings</h3>
              
              <SettingItem
                icon={<Sun className="w-5 h-5 text-blue-600" />}
                title="Theme"
                description="Choose your preferred theme"
              >
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </SettingItem>

              <SettingItem
                icon={<Globe className="w-5 h-5 text-blue-600" />}
                title="Language"
                description="Select your preferred language"
              >
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </SettingItem>

              <SettingItem
                icon={<Clock className="w-5 h-5 text-blue-600" />}
                title="Timezone"
                description="Set your local timezone"
              >
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </SettingItem>

              <SettingItem
                icon={<Eye className="w-5 h-5 text-blue-600" />}
                title="Animations"
                description="Enable or disable UI animations"
              >
                <Toggle
                  checked={settings.animationsEnabled}
                  onChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Volume2 className="w-5 h-5 text-blue-600" />}
                title="Sound Effects"
                description="Enable notification sounds"
              >
                <Toggle
                  checked={settings.soundEnabled}
                  onChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </SettingItem>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
              
              <SettingItem
                icon={<Mail className="w-5 h-5 text-blue-600" />}
                title="Email Notifications"
                description="Receive notifications via email"
              >
                <Toggle
                  checked={settings.emailNotifications}
                  onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Smartphone className="w-5 h-5 text-blue-600" />}
                title="Push Notifications"
                description="Receive push notifications on your device"
              >
                <Toggle
                  checked={settings.pushNotifications}
                  onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Bell className="w-5 h-5 text-blue-600" />}
                title="Task Reminders"
                description="Get reminded about upcoming task deadlines"
              >
                <Toggle
                  checked={settings.taskReminders}
                  onChange={(checked) => handleSettingChange('taskReminders', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Bell className="w-5 h-5 text-blue-600" />}
                title="Project Updates"
                description="Notifications for project status changes"
              >
                <Toggle
                  checked={settings.projectUpdates}
                  onChange={(checked) => handleSettingChange('projectUpdates', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Mail className="w-5 h-5 text-blue-600" />}
                title="Weekly Reports"
                description="Receive weekly progress reports"
              >
                <Toggle
                  checked={settings.weeklyReports}
                  onChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </SettingItem>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security & Privacy</h3>
              
              <SettingItem
                icon={<Shield className="w-5 h-5 text-blue-600" />}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              >
                <Toggle
                  checked={settings.twoFactorAuth}
                  onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Clock className="w-5 h-5 text-blue-600" />}
                title="Session Timeout"
                description="Automatically log out after inactivity"
              >
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </SettingItem>

              <SettingItem
                icon={<Database className="w-5 h-5 text-blue-600" />}
                title="Data Sharing"
                description="Allow anonymous usage data collection"
              >
                <Toggle
                  checked={settings.dataSharing}
                  onChange={(checked) => handleSettingChange('dataSharing', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Eye className="w-5 h-5 text-blue-600" />}
                title="Activity Logging"
                description="Keep a log of your account activity"
              >
                <Toggle
                  checked={settings.activityLogging}
                  onChange={(checked) => handleSettingChange('activityLogging', checked)}
                />
              </SettingItem>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
              
              <SettingItem
                icon={<User className="w-5 h-5 text-blue-600" />}
                title="Online Status"
                description="Show when you're online to team members"
              >
                <Toggle
                  checked={settings.showOnlineStatus}
                  onChange={(checked) => handleSettingChange('showOnlineStatus', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Mail className="w-5 h-5 text-blue-600" />}
                title="Direct Messages"
                description="Allow team members to send you direct messages"
              >
                <Toggle
                  checked={settings.allowDirectMessages}
                  onChange={(checked) => handleSettingChange('allowDirectMessages', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={<Eye className="w-5 h-5 text-blue-600" />}
                title="Profile Visibility"
                description="Who can see your profile information"
              >
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="public">Everyone</option>
                  <option value="team">Team Members Only</option>
                  <option value="managers">Managers Only</option>
                  <option value="private">Private</option>
                </select>
              </SettingItem>

              <SettingItem
                icon={<Save className="w-5 h-5 text-blue-600" />}
                title="Auto-save"
                description="Automatically save your work"
              >
                <Toggle
                  checked={settings.autoSave}
                  onChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </SettingItem>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Download className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Export Data</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Download all your data in JSON format
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Export Data
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Upload className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Import Data</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Import data from a backup file
                  </p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Import Data
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 dark:text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    These actions cannot be undone. Please be careful.
                  </p>
                  <div className="space-y-3">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Clear All Data
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ml-3">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};