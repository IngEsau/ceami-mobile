import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/app/navigation/types';
import { configureApplicationStore } from './src/modules/applications/application/application.store';
import { LocalApplicationRepository } from './src/modules/applications/infrastructure/repositories/LocalApplicationRepository';
import { ApplicationDetailScreen } from './src/modules/applications/presentation/ApplicationDetailScreen';
import { ApplicationIntroScreen } from './src/modules/applications/presentation/ApplicationIntroScreen';
import { ApplicationSuccessScreen } from './src/modules/applications/presentation/ApplicationSuccessScreen';
import { ApplicationWizardScreen } from './src/modules/applications/presentation/ApplicationWizardScreen';
import { ApplicationsListScreen } from './src/modules/applications/presentation/ApplicationsListScreen';
import { HomeScreen } from './src/modules/applications/presentation/HomeScreen';
import { LoginScreen } from './src/modules/auth/presentation/LoginScreen';
import { CameraCaptureScreen } from './src/modules/capture/presentation/CameraCaptureScreen';
import { DocumentsScreen } from './src/modules/documents/presentation/DocumentsScreen';
import { SignatureScreen } from './src/modules/signature/presentation/SignatureScreen';
import { PlaceholderScreen } from './src/shared/ui/PlaceholderScreen';
import { configureVisitStore } from './src/modules/visits/application/visit.store';
import { LocalVisitRepository } from './src/modules/visits/infrastructure/repositories/LocalVisitRepository';
import { VisitDocumentsScreen } from './src/modules/visits/presentation/VisitDocumentsScreen';
import { VisitHousingPhotosScreen } from './src/modules/visits/presentation/VisitHousingPhotosScreen';
import { VisitSignatureScreen } from './src/modules/visits/presentation/VisitSignatureScreen';
import { VisitSuccessScreen } from './src/modules/visits/presentation/VisitSuccessScreen';
import { VisitWizardScreen } from './src/modules/visits/presentation/VisitWizardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const applicationRepository = new LocalApplicationRepository();
const visitRepository = new LocalVisitRepository();

export default function App() {
  useEffect(() => {
    configureApplicationStore(applicationRepository);
    configureVisitStore(visitRepository);
  }, []);

  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#F4F7F9' } }}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ApplicationIntro" component={ApplicationIntroScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="Wizard" component={ApplicationWizardScreen} />
        <Stack.Screen name="Signature" component={SignatureScreen} />
        <Stack.Screen name="Success" component={ApplicationSuccessScreen} />
        <Stack.Screen name="ApplicationsList" component={ApplicationsListScreen} />
        <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
        <Stack.Screen name="VisitDocuments" component={VisitDocumentsScreen} />
        <Stack.Screen name="VisitHousingPhotos" component={VisitHousingPhotosScreen} />
        <Stack.Screen name="VisitWizard" component={VisitWizardScreen} />
        <Stack.Screen name="VisitSignature" component={VisitSignatureScreen} />
        <Stack.Screen name="VisitSuccess" component={VisitSuccessScreen} />
        <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
        <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
