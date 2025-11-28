import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useSpends } from '@/context/SpendContext';
import { useAuth } from '@/context/AuthContext';
import { InterestRateSlider } from '@/components/InterestRateSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Moon, Sun, User, LogOut, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { interestRate, setInterestRate, spends } = useSpends();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Account */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Logged in</p>
              </div>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Dark Mode
              </Label>
              <Switch 
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Settings */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-base">Investment Assumptions</CardTitle>
            <CardDescription>Set your expected annual return rate</CardDescription>
          </CardHeader>
          <CardContent>
            <InterestRateSlider 
              value={interestRate}
              onChange={setInterestRate}
            />
            <p className="text-xs text-muted-foreground mt-3">
              This rate is used to calculate the future value of your spending. 
              Index funds historically return 10-12% annually.
            </p>
          </CardContent>
        </Card>

        {/* Data Stats */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-base">Your Data</CardTitle>
            <CardDescription>Overview of your spending history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Records</p>
                <p className="text-xs text-muted-foreground">{spends.length} spends logged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-2xl">💰</p>
              <h3 className="font-semibold">Regret Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Building better money habits, one regret at a time.
              </p>
              <p className="text-xs text-muted-foreground">
                Your spending data is securely stored in the cloud.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fun Footer */}
        <div className="text-center py-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-muted-foreground">
            Made with 💚 for your financial wellbeing
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            "The best time to save was yesterday. The second best time is now."
          </p>
        </div>
      </main>
    </div>
  );
}
