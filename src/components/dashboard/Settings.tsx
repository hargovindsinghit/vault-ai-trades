
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Shield, 
  CreditCard, 
  Settings as SettingsIcon,
  Bell,
  DollarSign
} from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  kyc_status: string;
  risk_tolerance: string;
}

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [autoWithdraw, setAutoWithdraw] = useState(true);
  const [withdrawThreshold, setWithdrawThreshold] = useState("100");
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setRiskTolerance(data.risk_tolerance || "medium");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          risk_tolerance: riskTolerance,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-600 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-400" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="risk" className="text-slate-300">Risk Tolerance</Label>
              <select
                id="risk"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="low">Low - Conservative approach</option>
                <option value="medium">Medium - Balanced strategy</option>
                <option value="high">High - Aggressive trading</option>
              </select>
            </div>
            <Button 
              onClick={updateProfile} 
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? "Saving..." : "Update Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              <span>KYC Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Verification Status</span>
              <Badge variant={profile?.kyc_status === 'approved' ? 'default' : 'secondary'}>
                {profile?.kyc_status || 'pending'}
              </Badge>
            </div>
            <p className="text-sm text-slate-400">
              {profile?.kyc_status === 'approved' 
                ? "Your account is fully verified and ready for live trading."
                : "Complete KYC verification to enable live trading and withdrawals."
              }
            </p>
            {profile?.kyc_status !== 'approved' && (
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Complete KYC Verification
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Trading Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-purple-400" />
              <span>Trading Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-300">Auto Withdrawal</span>
                <p className="text-sm text-slate-400">Automatically withdraw profits</p>
              </div>
              <Switch 
                checked={autoWithdraw} 
                onCheckedChange={setAutoWithdraw}
              />
            </div>
            
            {autoWithdraw && (
              <div>
                <Label htmlFor="threshold" className="text-slate-300">
                  Withdrawal Threshold ($)
                </Label>
                <Input
                  id="threshold"
                  value={withdrawThreshold}
                  onChange={(e) => setWithdrawThreshold(e.target.value)}
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Withdraw when profit reaches this amount
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-300">Push Notifications</span>
                <p className="text-sm text-slate-400">Get trade alerts and updates</p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-slate-400 mb-4">No payment methods configured</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Add Payment Method
              </Button>
            </div>
            <div className="text-sm text-slate-400">
              <p>Supported methods:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Bank account (ACH)</li>
                <li>Debit card</li>
                <li>PayPal</li>
                <li>Crypto wallet</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-400" />
            <span>Security & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-300">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-400">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Enable 2FA
              </Button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-300">API Access</h4>
              <p className="text-sm text-slate-400">
                Manage your trading API keys and permissions
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Manage API Keys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
