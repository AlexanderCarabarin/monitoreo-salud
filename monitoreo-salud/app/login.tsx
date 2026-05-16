import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from './_layout';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// TDA (Tipo de Datos Abstractos)
interface Credenciales {
  usuario: string;
  clave: string;
}

export default function LoginScreen() {
  // Declaración de variables
  const { login } = useAuth();
  const [credenciales, setCredenciales] = useState<Credenciales>({ usuario: '', clave: '' });
  const [errorMensaje, setErrorMensaje] = useState<string>('');

  // Captura de datos
  const manejarUsuario = (texto: string) => {
    setCredenciales(prev => ({ ...prev, usuario: texto }));
  };

  const manejarClave = (texto: string) => {
    setCredenciales(prev => ({ ...prev, clave: texto }));
  };

  const intentarIngreso = () => {
    // Lógica del programa
    let estadoAcceso: number;
    let perfilDetectado: 'encargado' | 'familiar' | null = null;
    
    // Validación básica harcodeada
    if (credenciales.usuario === 'encargado' && credenciales.clave === '1234') {
      estadoAcceso = 1; // Éxito
      perfilDetectado = 'encargado';
    } else if (credenciales.usuario === 'familiar' && credenciales.clave === '1234') {
      estadoAcceso = 1; // Éxito
      perfilDetectado = 'familiar';
    } else if (credenciales.usuario === '' || credenciales.clave === '') {
      estadoAcceso = 2; // Vacío
    } else {
      estadoAcceso = 0; // Fallo
    }

    // Estructura de selección múltiple (Switch)
    switch (estadoAcceso) {
      case 1:
        setErrorMensaje('');
        login(perfilDetectado);
        break;
      case 2:
        setErrorMensaje('Por favor, ingresa todos los campos.');
        break;
      case 0:
      default:
        setErrorMensaje('Credenciales incorrectas.');
        break;
    }
  };

  // Salida de datos
  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <View style={styles.cabecera}>
          <FontAwesome name="hospital-o" size={40} color="#0284c7" style={styles.icono} />
          <Text style={styles.titulo}>Geo Rescue Login</Text>
        </View>

        <View style={styles.cuerpo}>
          <Text style={styles.etiqueta}>Usuario</Text>
          <TextInput
            style={styles.entrada}
            placeholder="Ej. encargado o familiar"
            value={credenciales.usuario}
            onChangeText={manejarUsuario}
            autoCapitalize="none"
          />

          <Text style={styles.etiqueta}>Contraseña</Text>
          <TextInput
            style={styles.entrada}
            placeholder="Ej. 1234"
            value={credenciales.clave}
            onChangeText={manejarClave}
            secureTextEntry
          />

          {errorMensaje ? <Text style={styles.error}>{errorMensaje}</Text> : null}

          <TouchableOpacity style={styles.boton} onPress={intentarIngreso}>
            <Text style={styles.botonTexto}>Ingresar al Sistema</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    overflow: 'hidden',
  },
  cabecera: {
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
  },
  icono: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  cuerpo: {
    padding: 24,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 8,
  },
  entrada: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
  },
  boton: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
