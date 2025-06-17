import React from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';
import './src/global.css';
import AppNavigation from './src/navigation/AppNavigation';

import { StatusBar } from "react-native";



const App: React.FC = () => {
  return (
   
      <AppNavigation />
  );
};

export default App;
