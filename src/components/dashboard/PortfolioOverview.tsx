
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Play,
  Pause,
  Zap
} from "lucide-react";

interface TradingAccount {
  id: string;
  account_type: string;
  broker: string;
  balance: number;
  total_profit_loss: number;
  is_active: boolean;
}

interface Trade {
  id: string;
  symbol: string;
  side: string;
  profit_loss: number;
  status: string;
  executed_at: string;
  confidence_score: number;
}

const PortfolioOverview = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [aiStatus, setAiStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch trading accounts
      const { data: accountsData } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (accountsData) {
        setAccounts(accountsData);
        setAiStatus(accountsData.some(acc => acc.is_active));
      }

      // Fetch recent trades
      const { data: tradesData } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false })
        .limit(5);

      if (tradesData) setRecentTrades(tradesData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAiTrading = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For demo purposes, we'll create a demo account if none exists
      if (accounts.length === 0) {
        const { error } = await supabase
          .from("trading_accounts")
          .insert({
            user_id: user.id,
            account_type: "demo",
            broker: "demo_broker",
            balance: 10000,
            is_active: true,
          });

        if (error) throw error;
        fetchData();
        setAiStatus(true);
      } else {
        // Toggle existing account
        const { error } = await supabase
          .from("trading_accounts")
          .update({ is_active: !aiStatus })
          .eq("user_id", user.id);

        if (error) throw error;
        setAiStatus(!aiStatus);
      }

      toast({
        title: aiStatus ? "AI Trading Paused" : "AI Trading Activated",
        description: aiStatus 
          ? "AI will stop making new trades"
          : "AI is now actively scanning for trading opportunities",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalProfitLoss = accounts.reduce((sum, acc) => sum + acc.total_profit_loss, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-600 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-600 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Portfolio Overview</h2>
        <Button
          onClick={toggleAiTrading}
          variant={aiStatus ? "destructive" : "default"}
          className={aiStatus ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
        >
          {aiStatus ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause AI Trading
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start AI Trading
            </>
          )}
        </Button>
      </div>

      {/* AI Status */}
      <Card className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            <span>AI Trading Status</span>
            <Badge variant={aiStatus ? "default" : "secondary"} className={aiStatus ? "bg-emerald-600" : ""}>
              {aiStatus ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            {aiStatus 
              ? "AI is actively monitoring markets and executing trades based on your risk preferences."
              : "AI trading is currently paused. Click 'Start AI Trading' to begin automated trading."}
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              ${totalBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total P&L
            </CardTitle>
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Trades
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {recentTrades.filter(trade => trade.status === 'open').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {recentTrades.length > 0 
                ? `${Math.round((recentTrades.filter(trade => trade.profit_loss > 0).length / recentTrades.length) * 100)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No trades yet. Start AI trading to see your trades here.
            </p>
          ) : (
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                      {trade.side.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge variant={trade.status === 'open' ? 'outline' : 'secondary'}>
                      {trade.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-slate-400">
                      Confidence: {((trade.confidence_score || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
