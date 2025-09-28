-- Script SQL para crear tabla de usuarios en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad
-- Permitir que cualquier usuario autenticado vea todos los perfiles (para el panel de admin)
CREATE POLICY "Allow authenticated users to view all profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir que los usuarios inserten su propio perfil
CREATE POLICY "Allow users to insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil
CREATE POLICY "Allow users to update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Crear función para insertar perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear trigger para insertar perfil cuando se registra un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Insertar datos de usuarios existentes (si los hay)
INSERT INTO user_profiles (id, email, full_name, phone, created_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', ''),
    COALESCE(raw_user_meta_data->>'phone', ''),
    created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;
