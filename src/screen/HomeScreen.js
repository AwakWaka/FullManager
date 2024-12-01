import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CustomButton = ({ onPress, iconName, title }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityLabel={`Ir para a tela de ${title}`}
    accessibilityHint={`Toque para ver suas ${title.toLowerCase()}`}
  >
    <Icon name={iconName} size={30} color="#FFFFFF" />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [currentTasks, setCurrentTasks] = useState(0);
  const [currentSales, setCurrentSales] = useState(0);
  const [totalFinance, setTotalFinance] = useState(0);

  // Carregar dados de Tarefas, Vendas e Finanças do AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const tasksData = await AsyncStorage.getItem('tasks');
      const salesData = await AsyncStorage.getItem('sales');
      const financeData = await AsyncStorage.getItem('finance');

      // Se existirem dados, atualizar o estado
      if (tasksData) {
        setCurrentTasks(JSON.parse(tasksData).length); // Número de tarefas
      }

      if (salesData) {
        setCurrentSales(JSON.parse(salesData).length); // Número de vendas
      }

      if (financeData) {
        setTotalFinance(JSON.parse(financeData).reduce((acc, sale) => acc + sale.price * sale.quantity, 0)); // Soma de todas as vendas
      }
    };

    loadData();
  }, []); // Carrega as informações ao inicializar a tela

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
        <Text style={styles.title}>Seu Gerenciador Pessoal</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1500} style={styles.buttonContainer}>
        <CustomButton onPress={() => navigation.navigate('Tarefas')} iconName="tasks" title="Tarefas" />
        <CustomButton onPress={() => navigation.navigate('Vendas')} iconName="money" title="Vendas" />
        <CustomButton onPress={() => navigation.navigate('Finanças')} iconName="line-chart" title="Finanças" />
      </Animatable.View>

      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Resumo Atual</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Tarefas Atuais:</Text>
          <Text style={styles.tableCell}>{currentTasks}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Vendas Atuais:</Text>
          <Text style={styles.tableCell}>{currentSales}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Finança Total:</Text>
          <Text style={styles.tableCell}>R$ {totalFinance.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F4F4F',
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: '#87CEFA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: width * 0.9, // 40% da largura da tela
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tableContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent : 'space-between',
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 16,
    color: '#2F4F4F',
  },
});
