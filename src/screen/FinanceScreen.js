import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FinanceScreen() {
  const [sales, setSales] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [dataVisible, setDataVisible] = useState(true); // Controle de visibilidade dos dados totais

  useEffect(() => {
    const loadSales = async () => {
      const storedSales = await AsyncStorage.getItem('sales');
      if (storedSales) {
        const parsedSales = JSON.parse(storedSales);
        setSales(parsedSales);
        calculateTotalProfit(parsedSales);
      }

      const storedHistory = await AsyncStorage.getItem('monthlyHistory');
      if (storedHistory) {
        setMonthlyHistory(JSON.parse(storedHistory));
      }
    };
    loadSales();
  }, []);

  const calculateTotalProfit = (salesData) => {
    const total = salesData.reduce((acc, sale) => {
      if (sale.concluida) {
        return acc + sale.price * sale.quantity;  // Calcula o total apenas para as vendas concluídas
      }
      return acc;
    }, 0);
    setTotalProfit(total);
  };

  const markSaleAsCompleted = async (saleId) => {
    const updatedSales = sales.map((sale) => {
      if (sale.id === saleId) {
        sale.concluida = true;
      }
      return sale;
    });
    setSales(updatedSales);
    await AsyncStorage.setItem('sales', JSON.stringify(updatedSales));
    calculateTotalProfit(updatedSales); // Atualiza o total de lucro após a conclusão da venda
    Alert.alert('Venda Concluída', 'A venda foi marcada como concluída.');
  };

  const saveTotalMonthly = async () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const existingIndex = monthlyHistory.findIndex(item => item.month === currentMonth);

    let updatedHistory = [...monthlyHistory];
    if (existingIndex !== -1) {
      updatedHistory[existingIndex].total += totalProfit;
    } else {
      updatedHistory.push({ month: currentMonth, total: totalProfit });
    }
    setMonthlyHistory(updatedHistory);
    await AsyncStorage.setItem('monthlyHistory', JSON.stringify(updatedHistory));
    Alert.alert('Total Mensal', 'Os dados deste mês foram salvos!');
  };

  const generateWeeklyReport = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  
    // Filtrando as vendas concluídas nesta semana
    const weeklySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startOfWeek && sale.concluida; // Considera apenas as vendas concluídas
    });
    setWeeklyReport(weeklySales);
    setActiveReport('weekly');
  };
  
  const generateMonthlyReport = () => {
    const currentMonth = new Date().getMonth();
    
    // Filtrando as vendas concluídas neste mês
    const monthlySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && sale.concluida; // Considera apenas as vendas concluídas
    });
    setMonthlyReport(monthlySales);
    setActiveReport('monthly');
  };

  const clearScreenData = () => {
    setSales([]);
    setTotalProfit(0);
    setWeeklyReport([]);
    setMonthlyReport([]);
    setActiveReport(null);
    setDataVisible(false); // Torna os dados invisíveis
    Alert.alert('Limpeza', 'Os dados da tela foram limpos e tornados invisíveis!');
  };

  const showData = () => {
    setDataVisible(true); // Torna os dados visíveis novamente
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório de Finanças</Text>
      
      {/* Se os dados estão visíveis, mostramos os dados totais */}
      {dataVisible && (
        <>
          <Text style={styles.totalProfit}>Lucro Total: R$ {totalProfit.toFixed(2)}</Text>

          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveTotalMonthly}>
            <Text style={styles.buttonText}>Salvar Total Mensal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={generateWeeklyReport}>
            <Text style={styles.buttonText}>Gerar Relatório Semanal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={generateMonthlyReport}>
            <Text style={styles.buttonText}>Gerar Relatório Mensal</Text>
          </TouchableOpacity>
        </>
      )}

      {activeReport === 'weekly' && dataVisible && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Relatório Semanal</Text>
          <FlatList
            data={weeklyReport}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.saleItem}>
                <Text>Data: {new Date(item.date).toLocaleDateString()}</Text>
                <Text>Produto: {item.product}</Text>
                <Text>Quantidade: {item.quantity}</Text>
                <Text>Preço: R$ {item.price}</Text>
                <Text>Total: R$ {(item.price * item.quantity).toFixed(2)}</Text>
                {/* Botão para concluir a venda */}
                {!item.concluida && (
                  <TouchableOpacity 
                    style={[styles.button, styles.completeButton]} 
                    onPress={() => markSaleAsCompleted(item.id)}
                  >
                    <Text style={styles.buttonText}>Marcar como Concluída</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noData}>Nenhuma venda nesta semana.</Text>}
          />
        </View>
      )}

      {activeReport === 'monthly' && dataVisible && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Relatório Mensal</Text>
          <FlatList
            data={monthlyReport}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.saleItem}>
                <Text>Data: {new Date(item.date).toLocaleDateString()}</Text>
                <Text>Produto: {item.product}</Text>
                <Text>Quantidade: {item.quantity}</Text>
                <Text>Preço: R$ {item.price}</Text>
                <Text>Total: R$ {(item.price * item.quantity).toFixed(2)}</Text>
                {/* Botão para concluir a venda */}
                {!item.concluida && (
                  <TouchableOpacity 
                    style={[styles.button, styles.completeButton]} 
                    onPress={() => markSaleAsCompleted(item.id)}
                  >
                    <Text style={styles.buttonText}>Marcar como Concluída</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noData}>Nenhuma venda neste mês.</Text>}
          />
        </View>
      )}

      {monthlyHistory.length > 0 && dataVisible && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Totais Mensais</Text>
          <FlatList
            data={monthlyHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.month}</Text>
                <Text style={styles.tableCell}>R$ {item.total.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Se os dados estão invisíveis, mostramos o botão de "Mostrar Dados" */}
      {!dataVisible && (
        <TouchableOpacity style={[styles.button, styles.showDataButton]} onPress={showData}>
          <Text style={styles.buttonText}>Mostrar Dados</Text>
        </TouchableOpacity>
      )}

      {/* Botão para limpar a tela */}
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearScreenData}>
        <Text style={styles.buttonText}>Limpar Dados da Tela</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalProfit: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  reportButton: {
    backgroundColor: '#17A2B8',
  },
  clearButton: {
    backgroundColor: '#DC3545',
  },
  showDataButton: {
    backgroundColor: '#FFC107',
  },
  reportContainer: {
    marginVertical: 10,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saleItem: {
    marginBottom: 15,
  },
  completeButton: {
    backgroundColor: '#28A745',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
  },
});

