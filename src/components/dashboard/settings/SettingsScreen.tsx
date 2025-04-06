import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, User, Bell, Shield, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SettingsScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Logout</h3>
                  <p className="text-sm text-gray-400">Sign out of your account</p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Additional settings sections for future implementation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Settings</h3>
                <p className="text-sm text-gray-400">Update your personal information</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-gray-400">Configure notification preferences</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm text-gray-400">Manage security settings</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Moon className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold">Appearance</h3>
                <p className="text-sm text-gray-400">Customize the interface</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}