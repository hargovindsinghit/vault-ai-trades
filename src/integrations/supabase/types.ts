export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      market_data: {
        Row: {
          change_24h: number | null
          id: string
          last_updated: string | null
          market_cap: number | null
          price: number
          symbol: string
          volume: number | null
        }
        Insert: {
          change_24h?: number | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          price: number
          symbol: string
          volume?: number | null
        }
        Update: {
          change_24h?: number | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          price?: number
          symbol?: string
          volume?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          kyc_documents: Json | null
          kyc_status: string | null
          phone: string | null
          risk_tolerance: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          kyc_documents?: Json | null
          kyc_status?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          kyc_documents?: Json | null
          kyc_status?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          ai_reasoning: Json | null
          closed_at: string | null
          confidence_score: number | null
          created_at: string | null
          entry_price: number
          executed_at: string | null
          exit_price: number | null
          id: string
          profit_loss: number | null
          quantity: number
          risk_level: string | null
          side: string
          status: string | null
          symbol: string
          trading_account_id: string
          user_id: string
        }
        Insert: {
          ai_reasoning?: Json | null
          closed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          entry_price: number
          executed_at?: string | null
          exit_price?: number | null
          id?: string
          profit_loss?: number | null
          quantity: number
          risk_level?: string | null
          side: string
          status?: string | null
          symbol: string
          trading_account_id: string
          user_id: string
        }
        Update: {
          ai_reasoning?: Json | null
          closed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          entry_price?: number
          executed_at?: string | null
          exit_price?: number | null
          id?: string
          profit_loss?: number | null
          quantity?: number
          risk_level?: string | null
          side?: string
          status?: string | null
          symbol?: string
          trading_account_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_accounts: {
        Row: {
          account_type: string
          api_key_encrypted: string | null
          balance: number | null
          broker: string
          created_at: string | null
          id: string
          is_active: boolean | null
          total_profit_loss: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type: string
          api_key_encrypted?: string | null
          balance?: number | null
          broker: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_profit_loss?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string
          api_key_encrypted?: string | null
          balance?: number | null
          broker?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_profit_loss?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trading_strategies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters: Json
          performance_metrics: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters?: Json
          performance_metrics?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters?: Json
          performance_metrics?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: Json
          processed_at: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method: Json
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: Json
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
