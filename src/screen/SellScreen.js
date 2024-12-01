import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, CheckBox } from 'react-native';

const SalesManager = () => {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState(0);
  const [service, setService] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [selectedSales, setSelectedSales] = useState([]);

  const handleSubmit = () => {
    const newSale = { product, price, service, quantity, isChecked: false };
    setSalesData([...salesData, newSale]);
    setProduct('');
    setPrice(0);
    setService('');
    setQuantity(0);
  };

  // Função para alternar o estado do checkbox de uma venda
  const toggleCheck = (index) => {
    const updatedSales = [...salesData];
    updatedSales[index].isChecked = !updatedSales[index].isChecked;
    setSalesData(updatedSales);
    updateSelectedSales(updatedSales);
  };

  // Atualiza o array selectedSales com base nos checkboxes
  const updateSelectedSales = (sales) => {
    const selected = sales.filter((sale) => sale.isChecked);
    setSelectedSales(selected);
  };

  // Função para remover as vendas selecionadas
  const removeSelectedSales = () => {
    const remainingSales = salesData.filter((sale) => !sale.isChecked);
    setSalesData(remainingSales);
    setSelectedSales([]);  // Limpa a seleção após remoção
  };

  return (
    <View style={styles.container}>
      <Text>Produto:</Text>
      <TextInput
        style={styles.input}
        value={product}
        onChangeText={setProduct}
      />

      <Text>Preço:</Text>
      <TextInput
        style={styles.input}
        value={String(price)}
        keyboardType="numeric"
        onChangeText={(text) => setPrice(Number(text))}
      />

      <Text>Serviço:</Text>
      <TextInput
        style={styles.input}
        value={service}
        onChangeText={setService}
      />

      <Text>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={String(quantity)}
        keyboardType="numeric"
        onChangeText={(text) => setQuantity(Number(text))}
      />

      <Button title="Adicionar" onPress={handleSubmit} />

      <FlatList
        data={salesData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <CheckBox
              value={item.isChecked}
              onValueChange={() => toggleCheck(index)}
            />
            <Text style={[styles.itemText, item.isChecked && styles.checked]}>
              {item.product} - R$ {item.price} - {item.service} - {item.quantity} unidades
            </Text>
          </View>
        )}
      />

      {selectedSales.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.removeButton} onPress={removeSelectedSales}>
            <Text style={styles.buttonText}>Remover Selecionados</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  checked: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SalesManager;
