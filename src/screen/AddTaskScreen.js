import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function AddTaskScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Macacões para empresas');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };
    loadTasks();
  }, []);

  const saveTask = async () => {
    if (!description || !estimatedTime) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const newTask = { description, category, estimatedTime };
    const updatedTasks = [...tasks, newTask];

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks); // Atualiza o estado local
      Alert.alert('Sucesso', 'Tarefa salva com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    }
  };

  const removeTask = async (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks); // Atualiza o estado local
      Alert.alert('Sucesso', 'Tarefa removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      Alert.alert('Erro', 'Não foi possível remover a tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Descrição da Tarefa"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Macacões para empresas" value="Macacões para empresas" />
        <Picker.Item label="Reparos" value="Reparos" />
        <Picker.Item label="Cortinas" value="Cortinas" />
        <Picker.Item label="Outros serviços" value="Outros serviços" />
      </Picker>
      <TextInput
        placeholder="Tempo estimado (horas)"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Salvar Tarefa" onPress={saveTask} />
      
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text>{item.description} - {item.category} - {item.estimatedTime} horas</Text>
            <Button title="Remover Tarefa" onPress={() => removeTask(index)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});