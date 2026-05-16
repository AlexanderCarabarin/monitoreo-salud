import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../_layout';

// TDA (Tipos de Datos Abstractos)
interface SignosVitales {
  temperatura: number;
  ritmoCardiaco: number;
}

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface RangosConfig {
  tempMin: string;
  tempMax: string;
  ritmoMin: string;
  ritmoMax: string;
}

interface Paciente {
  id: number;
  nombre: string;
  signos: SignosVitales;
  rangos: RangosConfig;
  ubicacion: Coordenadas;
  padecimiento: string;
  alerta: string | null;
}

export default function TabOneScreen() {
  // Declaración de variables
  const { logout, perfil } = useAuth();
  const esEncargado = perfil === 'encargado';

  const [pacientes, setPacientes] = useState<Paciente[]>([
    {
      id: 1,
      nombre: 'Paciente 1: Juan Pérez',
      signos: { temperatura: 98.6, ritmoCardiaco: 72 },
      rangos: { tempMin: '97', tempMax: '100', ritmoMin: '60', ritmoMax: '100' },
      ubicacion: { latitud: 33.607038, longitud: 115.073767 },
      padecimiento: 'Hipertensión en observación. Estable.',
      alerta: null
    },
    {
      id: 2,
      nombre: 'Paciente 2: María López',
      signos: { temperatura: 99.1, ritmoCardiaco: 85 },
      rangos: { tempMin: '97', tempMax: '99', ritmoMin: '65', ritmoMax: '95' },
      ubicacion: { latitud: 33.608512, longitud: 115.071243 },
      padecimiento: 'Recuperación post-operatoria.',
      alerta: null
    }
  ]);

  // Captura de datos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setPacientes(prevPacientes => {
        return prevPacientes.map(p => {
          // Fluctuación aleatoria
          let nuevaTemp = Number((p.signos.temperatura + (Math.random() - 0.5) * 0.4).toFixed(1));
          let nuevoRitmo = p.signos.ritmoCardiaco + Math.floor((Math.random() - 0.5) * 4);
          let nuevaLat = p.ubicacion.latitud + (Math.random() - 0.5) * 0.00001;
          let nuevaLon = p.ubicacion.longitud + (Math.random() - 0.5) * 0.00001;

          // Lógica del programa (Motor de Alertas)
          let mensajeAlerta = null;
          const tMin = Number(p.rangos.tempMin);
          const tMax = Number(p.rangos.tempMax);
          const rMin = Number(p.rangos.ritmoMin);
          const rMax = Number(p.rangos.ritmoMax);

          if (!isNaN(tMin) && nuevaTemp < tMin) {
            mensajeAlerta = `¡ALERTA! Temperatura baja (${nuevaTemp}°F)`;
          } else if (!isNaN(tMax) && nuevaTemp > tMax) {
            mensajeAlerta = `¡ALERTA! Temperatura alta (${nuevaTemp}°F)`;
          } else if (!isNaN(rMin) && nuevoRitmo < rMin) {
            mensajeAlerta = `¡ALERTA! Ritmo cardíaco bajo (${nuevoRitmo} bpm)`;
          } else if (!isNaN(rMax) && nuevoRitmo > rMax) {
            mensajeAlerta = `¡ALERTA! Ritmo cardíaco alto (${nuevoRitmo} bpm)`;
          }

          return {
            ...p,
            signos: { temperatura: nuevaTemp, ritmoCardiaco: nuevoRitmo },
            ubicacion: { latitud: nuevaLat, longitud: nuevaLon },
            alerta: mensajeAlerta
          };
        });
      });
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  const manejarRango = (idPaciente: number, campo: keyof RangosConfig, valor: string) => {
    setPacientes(prev => prev.map(p => p.id === idPaciente ? { ...p, rangos: { ...p.rangos, [campo]: valor } } : p));
  };

  const manejarPadecimiento = (idPaciente: number, valor: string) => {
    setPacientes(prev => prev.map(p => p.id === idPaciente ? { ...p, padecimiento: valor } : p));
  };

  const CerrarSesion = () => {
    // Pausa en pantalla
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar la sesión y salir del sistema?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: logout }
      ]
    );
  };

  // Lógica del programa (Filtro por Rol)
  const pacientesFiltrados = esEncargado ? pacientes : pacientes.filter(p => p.id === 1);

  // Salida de datos
  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>

      {pacientesFiltrados.map((paciente) => {
        // Cálculos locales para UI
        let tempProgressValue = ((paciente.signos.temperatura - 95) / 10) * 100;
        let ritmoProgressValue = ((paciente.signos.ritmoCardiaco - 50) / 80) * 100;

        if (tempProgressValue > 100) tempProgressValue = 100;
        if (tempProgressValue < 0) tempProgressValue = 0;
        if (ritmoProgressValue > 100) ritmoProgressValue = 100;
        if (ritmoProgressValue < 0) ritmoProgressValue = 0;

        const tempProgress = `${tempProgressValue}%` as any;
        const ritmoProgress = `${ritmoProgressValue}%` as any;

        return (
          <View key={paciente.id} style={styles.pacienteContainer}>
            <View style={styles.pacienteHeader}>
              <FontAwesome name="user-md" size={24} color="#0369a1" style={{ marginRight: 12 }} />
              <Text style={styles.pacienteTitle}>{paciente.nombre}</Text>
            </View>

            {/* Banner de Alerta */}
            {paciente.alerta && (
              <View style={styles.alertaBanner}>
                <FontAwesome name="warning" size={20} color="#ffffff" style={{ marginRight: 10 }} />
                <Text style={styles.alertaText}>{paciente.alerta}</Text>
              </View>
            )}

            {/* Configuración de Rangos */}
            <View style={styles.card}>
              <View style={styles.cardHeaderBar}>
                <FontAwesome name="gear" size={18} color="#0284c7" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Configuración de Rangos {esEncargado ? '(Editor)' : '(Solo lectura)'}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Temp. mínima (°F)</Text>
                    <TextInput style={[styles.textInput, !esEncargado && styles.textInputDisabled]} value={paciente.rangos.tempMin} onChangeText={(v) => manejarRango(paciente.id, 'tempMin', v)} keyboardType="numeric" editable={esEncargado} />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Temp. máxima (°F)</Text>
                    <TextInput style={[styles.textInput, !esEncargado && styles.textInputDisabled]} value={paciente.rangos.tempMax} onChangeText={(v) => manejarRango(paciente.id, 'tempMax', v)} keyboardType="numeric" editable={esEncargado} />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Ritmo mínimo (bpm)</Text>
                    <TextInput style={[styles.textInput, !esEncargado && styles.textInputDisabled]} value={paciente.rangos.ritmoMin} onChangeText={(v) => manejarRango(paciente.id, 'ritmoMin', v)} keyboardType="numeric" editable={esEncargado} />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Ritmo máximo (bpm)</Text>
                    <TextInput style={[styles.textInput, !esEncargado && styles.textInputDisabled]} value={paciente.rangos.ritmoMax} onChangeText={(v) => manejarRango(paciente.id, 'ritmoMax', v)} keyboardType="numeric" editable={esEncargado} />
                  </View>
                </View>
              </View>
            </View>

            {/* Signos Vitales */}
            <View style={styles.row}>
              <View style={[styles.card, styles.vitalCard]}>
                <Text style={styles.vitalLabel}>TEMPERATURA</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { backgroundColor: '#ef4444', width: tempProgress }]} />
                </View>
                <Text style={styles.vitalValue}>{paciente.signos.temperatura.toFixed(1)} °F</Text>
              </View>

              <View style={[styles.card, styles.vitalCard]}>
                <Text style={styles.vitalLabel}>RITMO CARDÍACO</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { backgroundColor: '#22c55e', width: ritmoProgress }]} />
                </View>
                <Text style={styles.vitalValue}>{paciente.signos.ritmoCardiaco} bpm</Text>
              </View>
            </View>

            {/* Padecimiento */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.sectionLabel}>PADECIMIENTO</Text>
                <TextInput
                  style={[styles.textArea, !esEncargado && styles.textInputDisabled]}
                  placeholder="Escribe aquí..."
                  placeholderTextColor="#94a3b8"
                  value={paciente.padecimiento}
                  onChangeText={(v) => manejarPadecimiento(paciente.id, v)}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  editable={esEncargado}
                />
              </View>
            </View>

            {/* Ubicación */}
            <View style={styles.row}>
              <View style={[styles.card, styles.locationCard]}>
                <View style={styles.cardContent}>
                  <Text style={styles.locationLabel}>LONGITUD</Text>
                  <Text style={styles.locationValue}>{paciente.ubicacion.longitud.toFixed(6)}</Text>
                </View>
              </View>
              <View style={[styles.card, styles.locationCard]}>
                <View style={styles.cardContent}>
                  <Text style={styles.locationLabel}>LATITUD</Text>
                  <Text style={styles.locationValue}>{paciente.ubicacion.latitud.toFixed(6)}</Text>
                </View>
              </View>
            </View>

          </View>
        );
      })}

      <TouchableOpacity style={styles.logoutButton} onPress={CerrarSesion}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pacienteContainer: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#bae6fd',
    paddingBottom: 16,
  },
  pacienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  pacienteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  alertaBanner: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertaText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    overflow: 'hidden',
  },
  cardHeaderBar: {
    backgroundColor: '#e0f2fe',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
  },
  cardContent: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 0,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#0284c7',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  textInputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    borderColor: '#e2e8f0',
  },
  vitalCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  vitalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#0f172a',
    minHeight: 100,
  },
  locationCard: {
    flex: 1,
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284c7',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
