import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureApplicationStore } from './src/modules/applications/application/application.store';
import { LocalApplicationRepository } from './src/modules/applications/infrastructure/repositories/LocalApplicationRepository';
import { RootStackParamList } from './src/app/navigation/types';
import { LoginScreen } from './src/modules/auth/presentation/LoginScreen';
import { HomeScreen } from './src/modules/applications/presentation/HomeScreen';
import { ApplicationIntroScreen } from './src/modules/applications/presentation/ApplicationIntroScreen';
import { DocumentsScreen } from './src/modules/documents/presentation/DocumentsScreen';
import { ApplicationWizardScreen } from './src/modules/applications/presentation/ApplicationWizardScreen';
import { SignatureScreen } from './src/modules/signature/presentation/SignatureScreen';
import { ApplicationSuccessScreen } from './src/modules/applications/presentation/ApplicationSuccessScreen';
import { ApplicationsListScreen } from './src/modules/applications/presentation/ApplicationsListScreen';
import { ApplicationDetailScreen } from './src/modules/applications/presentation/ApplicationDetailScreen';
import { PlaceholderScreen } from './src/shared/ui/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const repository = new LocalApplicationRepository();
export default function App() { useEffect(() => { configureApplicationStore(repository); }, []); return <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#F4F7F9' } }}><Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}><Stack.Screen name="Login" component={LoginScreen} /><Stack.Screen name="Home" component={HomeScreen} /><Stack.Screen name="ApplicationIntro" component={ApplicationIntroScreen} /><Stack.Screen name="Documents" component={DocumentsScreen} /><Stack.Screen name="Wizard" component={ApplicationWizardScreen} /><Stack.Screen name="Signature" component={SignatureScreen} /><Stack.Screen name="Success" component={ApplicationSuccessScreen} /><Stack.Screen name="ApplicationsList" component={ApplicationsListScreen} /><Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} /><Stack.Screen name="Placeholder" component={PlaceholderScreen} /></Stack.Navigator></NavigationContainer>; }
