import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import App from './pages/App';
import Tela1 from './pages/Tela1';
import Tela2 from './pages/Tela2';
import Tela3 from './pages/Tela3';

const Tab = createMaterialTopTabNavigator();

export default function RotaInterna() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: { backgroundColor: '#e91e63' },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'white' },
      }}
    >
      <Tab.Screen name="App" component={App} />
      <Tab.Screen name="Tela1" component={Tela1} />
      <Tab.Screen name="Tela2" component={Tela2} />
      <Tab.Screen name="Tela3" component={Tela3} />
    </Tab.Navigator>
  );
}
