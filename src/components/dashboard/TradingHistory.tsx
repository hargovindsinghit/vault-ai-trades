
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Trade {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number | null;
  confidence_score: number | null;
  risk_level: string | null;
  status: string;
  executed_at: string;
  closed_at: string | null;
  ai_reasoning: any;
}

const TradingHistory = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTrades();
  }, [filter]);

  const fetchTrades = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTrades(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch trading history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDemoTrade = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create a trading account
      let { data: accounts } = await supabase
        .from("trading_accounts")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (!accounts || accounts.length === 0) {
        const { data: newAccount, error: accountError } = await supabase
          .from("trading_accounts")
          .insert({
            user_id: user.id,
            account_type: "demo",
            broker: "demo_broker",
            balance: 10000,
            is_active: true,
          })
          .select()
          .single();

        if (accountError) throw accountError;
        accounts = [newAccount];
      }

      // Create a demo trade
      const symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const quantity = Math.floor(Math.random() * 100) + 1;
      const entryPrice = Math.random() * 500 + 50;
      const isWinning = Math.random() > 0.3; // 70% winning rate
      const priceChange = isWinning ? Math.random() * 20 + 5 : -(Math.random() * 15 + 2);
      const exitPrice = entryPrice + priceChange;
      const profitLoss = (exitPrice - entryPrice) * quantity * (side === 'buy' ? 1 : -1);

      const { error } = await supabase
        .from("trades")
        .insert({
          user_id: user.id,
          trading_account_id: accounts[0].id,
          symbol,
          side,
          quantity,
          entry_price: entryPrice,
          exit_price: exitPrice,
          profit_loss: profitLoss,
          confidence_score: Math.random() * 0.4 + 0.6, // 60-100%
          risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: 'closed',
          executed_at: new Date().toISOString(),
          closed_at: new Date().toISOString(),
          ai_reasoning: {
            indicators: ['RSI oversold', 'Moving average crossover'],
            market_sentiment: 'bullish',
            risk_assessment: 'moderate'
          }
        });

      if (error) throw error;

      toast({
        title: "Demo Trade Added",
        description: `Added a ${side} trade for ${symbol}`,
      });

      fetchTrades();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Trading History</h2>
        <Button onClick={addDemoTrade} className="bg-emerald-600 hover:bg-emerald-700">
          Add Demo Trade
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'open', 'closed'] as const).map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? "default" : "outline"}
            onClick={() => setFilter(filterOption)}
            className={filter === filterOption ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </Button>
        ))}
      </div>

      {/* Trades List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All Trades' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Trades`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No trades found</p>
              <Button onClick={addDemoTrade} className="bg-emerald-600 hover:bg-emerald-700">
                Add Demo Trade
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => (
                <div key={trade.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                        {trade.side.toUpperCase()}
                      </Badge>
                      <span className="font-bold text-lg">{trade.symbol}</span>
                      <Badge variant={trade.status === 'open' ? 'outline' : 'secondary'}>
                        {trade.status}
                      </Badge>
                      {trade.risk_level && (
                        <Badge variant="outline" className={
                          trade.risk_level === 'high' ? 'border-red-400 text-red-400' :
                          trade.risk_level === 'medium' ? 'border-yellow-400 text-yellow-400' :
                          'border-green-400 text-green-400'
                        }>
                          {trade.risk_level} risk
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss?.toFixed(2) || '0.00'}
                      </div>
                      {trade.confidence_score && (
                        <div className="text-sm text-slate-400">
                          AI Confidence: {(trade.confidence_score * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
                    <div>
                      <span className="text-slate-400">Quantity:</span>
                      <div className="font-medium">{trade.quantity}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Entry Price:</span>
                      <div className="font-medium">${trade.entry_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Exit Price:</span>
                      <div className="font-medium">
                        {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Date:</span>
                      <div className="font-medium">
                        {format(new Date(trade.executed_at), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>

                  {trade.ai_reasoning && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded">
                      <div className="text-sm text-slate-400 mb-1">AI Reasoning:</div>
                      <div className="text-sm text-slate-300">
                        {trade.ai_reasoning.indicators?.join(', ') || 'No specific indicators'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingHistory;
