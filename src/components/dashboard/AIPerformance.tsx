
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";

const AIPerformance = () => {
  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', profit: 0, trades: 0 },
    { time: '04:00', profit: 150, trades: 3 },
    { time: '08:00', profit: 320, trades: 7 },
    { time: '12:00', profit: 480, trades: 12 },
    { time: '16:00', profit: 720, trades: 18 },
    { time: '20:00', profit: 890, trades: 24 },
    { time: '24:00', profit: 1200, trades: 30 },
  ]);

  const [aiMetrics, setAiMetrics] = useState({
    accuracy: 73,
    totalTrades: 156,
    winRate: 68,
    avgProfitPerTrade: 24.50,
    bestPerformingSymbol: 'AAPL',
    riskScore: 'Medium',
    confidenceLevel: 82
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">AI Performance Analytics</h2>

      {/* AI Status Card */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-400" />
            <span>AI Trading Engine Status</span>
            <Badge className="bg-emerald-600">ACTIVE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{aiMetrics.accuracy}%</div>
              <div className="text-sm text-slate-400">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{aiMetrics.winRate}%</div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{aiMetrics.confidenceLevel}%</div>
              <div className="text-sm text-slate-400">Confidence Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{aiMetrics.riskScore}</div>
              <div className="text-sm text-slate-400">Risk Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span>Hourly Profit Progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-400" />
              <span>Trading Volume</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Bar dataKey="trades" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Trades
            </CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {aiMetrics.totalTrades}
            </div>
            <p className="text-xs text-slate-400">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Avg Profit/Trade
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              ${aiMetrics.avgProfitPerTrade}
            </div>
            <p className="text-xs text-slate-400">
              +8% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Best Symbol
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {aiMetrics.bestPerformingSymbol}
            </div>
            <p className="text-xs text-slate-400">
              85% win rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              AI Learning
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              Active
            </div>
            <p className="text-xs text-slate-400">
              Adapting strategies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategy Insights */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>AI Strategy Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-emerald-400 mb-2">Current Market Sentiment</h4>
              <p className="text-slate-300 text-sm">
                AI has detected bullish momentum in tech stocks with high confidence. 
                Recommended focus on FAANG stocks with moderate risk allocation.
              </p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Risk Management</h4>
              <p className="text-slate-300 text-sm">
                Current portfolio risk is within acceptable parameters. 
                Stop-loss mechanisms are actively protecting capital with 2% maximum exposure per trade.
              </p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-purple-400 mb-2">Learning Adaptation</h4>
              <p className="text-slate-300 text-sm">
                AI model has adapted to recent market volatility, improving prediction accuracy by 15% 
                over the past week through reinforcement learning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformance;
