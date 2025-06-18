
-- Create users profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  kyc_documents JSONB DEFAULT '{}',
  risk_tolerance TEXT DEFAULT 'medium' CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trading accounts table
CREATE TABLE public.trading_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('demo', 'live')),
  broker TEXT NOT NULL,
  api_key_encrypted TEXT,
  balance DECIMAL(15,2) DEFAULT 0.00,
  total_profit_loss DECIMAL(15,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trades table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trading_account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity DECIMAL(15,8) NOT NULL,
  entry_price DECIMAL(15,8) NOT NULL,
  exit_price DECIMAL(15,8),
  profit_loss DECIMAL(15,2),
  confidence_score DECIMAL(3,2), -- AI confidence (0.00 to 1.00)
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  ai_reasoning JSONB, -- Store AI decision reasoning
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trading strategies table
CREATE TABLE public.trading_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parameters JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method JSONB NOT NULL,
  transaction_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market data table for caching
CREATE TABLE public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  price DECIMAL(15,8) NOT NULL,
  volume DECIMAL(20,8),
  change_24h DECIMAL(5,2),
  market_cap DECIMAL(20,2),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for trading accounts
CREATE POLICY "Users can view their own trading accounts" ON public.trading_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own trading accounts" ON public.trading_accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trading accounts" ON public.trading_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trades
CREATE POLICY "Users can view their own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trading strategies
CREATE POLICY "Users can view their own strategies" ON public.trading_strategies
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own strategies" ON public.trading_strategies
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own strategies" ON public.trading_strategies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for withdrawal requests
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawal_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own withdrawals" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for market data (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market data" ON public.market_data
  FOR SELECT TO authenticated USING (true);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_status ON public.trades(status);
CREATE INDEX idx_trades_executed_at ON public.trades(executed_at);
CREATE INDEX idx_trading_accounts_user_id ON public.trading_accounts(user_id);
CREATE INDEX idx_market_data_symbol ON public.market_data(symbol);
