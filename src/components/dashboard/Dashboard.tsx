
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import PortfolioOverview from "./PortfolioOverview";
import TradingHistory from "./TradingHistory";
import AIPerformance from "./AIPerformance";
import Settings from "./Settings";
import { LogOut } from "lucide-react";

interface DashboardProps {
  session: Session;
}

const Dashboard = ({ session }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "portfolio":
        return <PortfolioOverview />;
      case "trades":
        return <TradingHistory />;
      case "performance":
        return <AIPerformance />;
      case "settings":
        return <Settings />;
      default:
        return <PortfolioOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          {/* Header */}
          <header className="bg-slate-800 border-b border-slate-700 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-emerald-400">
                AI Trader Vault
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">
                  Welcome, {session.user.user_metadata.full_name || session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
