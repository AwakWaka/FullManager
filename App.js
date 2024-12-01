import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';  // Importando ícones

// Importação das telas
import HomeScreen from './src/screen/HomeScreen';
import SellScreen from './src/screen/SellScreen';
import TaskScreen from './src/screen/TaskScreen';
import AddTaskScreen from './src/screen/AddTaskScreen';
import AddSaleScreen from './src/screen/AddSalesScreen';
import FinancesScreen from './src/screen/FinanceScreen';

// Criando os navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tarefas" 
        component={TaskScreen} 
        options={{ 
          headerShown: true, 
          title: 'Minhas Tarefas', // Título personalizado
        }} 
      />
      <Stack.Screen 
        name="Adicionar Tarefa" 
        component={AddTaskScreen} 
        options={{ 
          headerShown: true, 
          title: 'Nova Tarefa', // Título personalizado
        }} 
      />
    </Stack.Navigator>
  );
}

function SalesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Vendas" 
        component={SellScreen} 
        options={{ 
          headerShown: true, 
          title: 'Minhas Vendas', // Título personalizado
        }} 
      />
      <Stack.Screen 
        name="Adicionar Venda" 
        component={AddSaleScreen} 
        options={{ 
          headerShown: true, 
          title: 'Nova Venda', // Título personalizado
        }} 
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Vendas') {
              iconName = 'cash';
            } else if (route.name === 'Tarefas') {
              iconName = 'checkmark-circle';
            } else if (route.name === 'Finanças') {
              iconName = 'bar-chart';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Vendas" 
          component={SalesStack} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Tarefas" 
          component={TaskStack} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Finanças" 
          component={FinancesScreen} 
          options={{ headerShown: false }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;