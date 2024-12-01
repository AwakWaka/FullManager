import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function AddSaleScreen({ navigation }) {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Macacões para empresas');
  const [quantity, setQuantity] = useState('');
  const [sales, setSales] = useState([]);
  const [isConcluded, setIsConcluded] = useState(false);
  const [loading, setLoading] = useState(false); // Novo estado para indicar carregamento

  useEffect(() => {
    const loadSales = async () => {
      const storedSales = await AsyncStorage.getItem('sales');
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      }
    };
    loadSales();
  }, []);

  const saveSale = async () => {
    if (!product.trim() || !price || !quantity) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity, 10);
    
    if (isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Erro', 'O preço deve ser um número válido e maior ou igual a zero.');
      return;
    }

    if (isNaN(numericQuantity) || numericQuantity < 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número válido e maior ou igual a zero.');
      return;
    }

    const newSale = { 
      id: Date.now(), // Adicionando um ID único
      product, 
      price: numericPrice.toFixed(2), 
      category, 
      quantity: numericQuantity,
      concluida: isConcluded,
      date: new Date().toISOString()
    };

    setLoading(true); try {
      const updatedSales = [...sales, newSale];
      await AsyncStorage.setItem('sales', JSON.stringify(updatedSales));
      setSales(updatedSales);
      Alert.alert('Sucesso', 'Venda salva com sucesso!');
      setProduct('');
      setPrice('');
      setQuantity('');
      setIsConcluded(false);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      Alert.alert('Erro', 'Não foi possível salvar a venda.');
    } finally {
      setLoading(false);
    }
  };

  const removeSale = async (id) => {
    const updatedSales = sales.filter(sale => sale.id !== id);

    try {
      await AsyncStorage.setItem('sales', JSON.stringify(updatedSales));
      setSales(updatedSales);
      Alert.alert('Sucesso', 'Venda removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover venda:', error);
      Alert.alert('Erro', 'Não foi possível remover a venda.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Produto/Serviço"
        value={product}
        onChangeText={setProduct}
        style={styles.input}
        accessibilityLabel="Nome do Produto ou Serviço"
      />
      <TextInput
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
        accessibilityLabel="Preço do Produto ou Serviço"
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
        accessibilityLabel="Categoria do Produto ou Serviço"
      >
        <Picker.Item label="Macacões para empresas" value="Macacões para empresas" />
        <Picker.Item label="Reparos" value="Reparos" />
        <Picker.Item label="Cortinas" value="Cortinas" />
        <Picker.Item label="Outros serviços" value="Outros serviços" />
      </Picker>
      <TextInput
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
        accessibilityLabel="Quantidade do Produto ou Serviço"
      />
      <View style={styles.checkboxContainer}>
        <Text>Venda Concluída?</Text>
        <Picker
          selectedValue={isConcluded}
          onValueChange={(itemValue) => setIsConcluded(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Não" value={false} />
          <Picker.Item label="Sim" value={true} />
        </Picker>
      </View>
      <Button title="Salvar Venda" onPress={saveSale} accessibilityLabel="Salvar Venda" />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.saleItem}>
            <Text>{item.product} - R$ {item.price} - {item.quantity} - {item.concluida ? "Concluída" : "Não concluída"}</Text>
            <Button title="Remover" onPress={() => removeSale(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});

