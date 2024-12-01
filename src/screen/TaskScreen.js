import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, CheckBox } from 'react-native';

const TaskScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Função para adicionar a tarefa
  const handleAddTask = () => {
    const newTask = { description, category, estimatedTime, isChecked: false };
    setTasks([...tasks, newTask]);
    setDescription('');
    setCategory('');
    setEstimatedTime(0);
  };

  // Função para alternar o estado do checkbox de uma tarefa
  const toggleCheck = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isChecked = !updatedTasks[index].isChecked;
    setTasks(updatedTasks);
    updateSelectedTasks(updatedTasks);
  };

  // Atualiza o array selectedTasks com base nos checkboxes
  const updateSelectedTasks = (tasks) => {
    const selected = tasks.filter((task) => task.isChecked);
    setSelectedTasks(selected);
  };

  // Função para remover as tarefas selecionadas
  const removeSelectedTasks = () => {
    const remainingTasks = tasks.filter((task) => !task.isChecked);
    setTasks(remainingTasks);
    setSelectedTasks([]);  // Limpa a seleção após remoção
  };

  return (
    <View style={styles.container}>
      <Text>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text>Categoria:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text>Tempo estimado (horas):</Text>
      <TextInput
        style={styles.input}
        value={String(estimatedTime)}
        keyboardType="numeric"
        onChangeText={(text) => setEstimatedTime(Number(text))}
      />

      <Button title="Adicionar Tarefa" onPress={handleAddTask} />

      {/* Exibe a lista de tarefas */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <CheckBox
              value={item.isChecked}
              onValueChange={() => toggleCheck(index)}
            />
            <Text style={[styles.itemText, item.isChecked && styles.checked]}>
              {item.description} - {item.category} - {item.estimatedTime} horas
            </Text>
          </View>
        )}
      />

      {/* Exibe o botão para remover tarefas selecionadas */}
      {selectedTasks.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.removeButton} onPress={removeSelectedTasks}>
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
  addTaskButton: {
    backgroundColor: '#87CEFA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addTaskButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default TaskScreen;





