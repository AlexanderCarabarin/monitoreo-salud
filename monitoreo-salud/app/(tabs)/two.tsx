import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../_layout';

// TDA (Tipos de Datos Abstractos)
interface DetallePerfil {
  nombre: string;
  rol: string;
  departamento: string;
}

export default function TabTwoScreen() {
  // Declaración de variables
  const { perfil } = useAuth();
  let detallesActuales: DetallePerfil;
  let esFamiliar: boolean;

  // Lógica del programa (Asignación de detalles del perfil según el usuario actual)
  if (perfil === 'encargado') {
    esFamiliar = false;
    detallesActuales = {
      nombre: 'Médico Encargado',
      rol: 'Administrador de Salud',
      departamento: 'Unidad de Cuidados Intensivos',
    };
  } else {
    esFamiliar = true;
    detallesActuales = {
      nombre: 'Familiar Autorizado',
      rol: 'Familiar / Visitante',
      departamento: 'Asignado a: Paciente 1 (Juan Pérez)',
    };
  }

  // Salida de datos
  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeaderBar}>
          <FontAwesome name="user-circle" size={46} color="#0284c7" style={styles.cardIcon} />
          <View>
            <Text style={styles.cardTitle}>{detallesActuales.nombre}</Text>
            <Text style={styles.rolBadge}>{detallesActuales.rol}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.sectionLabel}>INFORMACIÓN DEL PERFIL</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nivel de Acceso:</Text>
            <Text style={styles.infoValue}>{esFamiliar ? 'Solo Lectura' : 'Editor Total'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Asignación:</Text>
            <Text style={styles.infoValue}>{detallesActuales.departamento}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={[styles.infoValue, { color: '#22c55e' }]}>Activo y Conectado</Text>
          </View>
        </View>
      </View>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  rolBadge: {
    fontSize: 14,
    color: '#0284c7',
    marginTop: 4,
    fontWeight: '600',
  },
  cardContent: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
});
