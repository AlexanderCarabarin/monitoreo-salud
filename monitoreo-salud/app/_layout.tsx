import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, createContext, useContext, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login', // Inicialmente ir a login
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// TDA (Tipo de Dato Abstracto) para el contexto
type Perfil = 'encargado' | 'familiar' | null;

interface AuthState {
  isAuthenticated: boolean;
  perfil: Perfil;
  login: (p: Perfil) => void;
  logout: () => void;
}

// Inicialización de la "Estructura Global" (Context)
const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  perfil: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Función auxiliar de envoltura
function AuthProvider({ children }: { children: React.ReactNode }) {
  // Declaración de variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<Perfil>(null);

  // Captura / Mutación
  const login = (p: Perfil) => {
    setPerfil(p);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setPerfil(null);
    setIsAuthenticated(false);
  };

  // Salida
  return (
    <AuthContext.Provider value={{ isAuthenticated, perfil, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  // Declaración de variables
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Lógica del programa
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Salida de datos
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  // Declaración de variables
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Lógica del programa (Selección múltiple / IF)
  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && segments.length === 0) {
      router.replace('/login');
    }
  }, [isAuthenticated, segments]);

  // Salida de datos
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
