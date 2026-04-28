-- ============================================================
-- FinanTeck — Setup do Banco de Dados no Supabase
-- Execute este script no SQL Editor do painel Supabase
-- ============================================================

-- 1. Criar tabela de transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category    TEXT NOT NULL CHECK (category IN (
                'alimentacao', 'transporte', 'moradia', 'saude',
                'lazer', 'educacao', 'salario', 'freelance',
                'investimento', 'outros'
              )),
  description TEXT NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para acelerar consultas por usuário + data
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON public.transactions (user_id, date DESC);

-- ============================================================
-- 2. Habilitar Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Policies — cada usuário acessa apenas suas transações
-- ============================================================

-- SELECT: usuário vê somente as próprias transações
CREATE POLICY "transactions_select_own"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: usuário só cria transações com seu próprio user_id
CREATE POLICY "transactions_insert_own"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: usuário só edita as próprias transações
CREATE POLICY "transactions_update_own"
  ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: usuário só apaga as próprias transações
CREATE POLICY "transactions_delete_own"
  ON public.transactions
  FOR DELETE
  USING (auth.uid() = user_id);
