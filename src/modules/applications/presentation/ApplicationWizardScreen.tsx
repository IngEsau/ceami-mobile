import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, FormSelect, FormTextInput, PrimaryButton, ProgressSegments, SectionCard } from '../../../shared/ui';
import { colors, radius, spacing } from '../../../shared/theme';
import { createFamilyDataSchema, createReferencesDataSchema, generalDataSchema, workDataSchema } from '../domain/application.schemas';
import { useApplicationStore } from '../application/application.store';
import { ApplicantFamilyData, ApplicantGeneralData, ApplicantReferencesData, ApplicantWorkData } from '../domain/application.types';

type Props = NativeStackScreenProps<RootStackParamList, 'Wizard'>;

const titles = ['Datos generales', 'Datos familiares', 'Datos laborales', 'Referencias'];
const common: ApplicantGeneralData = { date: '', clientName: '', curp: '', rfc: '', phoneType: '', phone: '', address: '', housingType: '', email: '', maritalStatus: '' };

export const ApplicationWizardScreen = ({ navigation }: Props) => {
  const application = useApplicationStore((state) => state.currentApplication);
  const step = useApplicationStore((state) => state.currentStep);
  const setStep = useApplicationStore((state) => state.setStep);
  const saveGeneral = useApplicationStore((state) => state.saveGeneral);
  const saveFamily = useApplicationStore((state) => state.saveFamily);
  const saveWork = useApplicationStore((state) => state.saveWork);
  const saveReferences = useApplicationStore((state) => state.saveReferences);
  const next = () => setStep(Math.min(3, step + 1));
  const previous = () => setStep(Math.max(0, step - 1));

  return (
    <AppScreen>
      <AppHeader title="Nueva solicitud" showBack onBack={() => navigation.goBack()} />
      <SectionCard>
        <Text style={styles.eyebrow}>Paso {step + 1} de 4</Text>
        <Text style={styles.heading}>{titles[step]}</Text>
        <ProgressSegments current={step} total={4} />
      </SectionCard>
      {step === 0 && <GeneralStep data={application?.generalData} onSave={async (data) => { await saveGeneral(data); next(); }} />}
      {step === 1 && <FamilyStep data={application?.familyData} maritalStatus={application?.generalData?.maritalStatus} onSave={async (data) => { await saveFamily(data); next(); }} onBack={previous} />}
      {step === 2 && <WorkStep data={application?.workData} onSave={async (data) => { await saveWork(data); next(); }} onBack={previous} />}
      {step === 3 && <ReferencesStep data={application?.referencesData} application={application} onSave={async (data) => { await saveReferences(data); navigation.navigate('Signature'); }} onBack={previous} />}
    </AppScreen>
  );
};

const GeneralStep = ({ data, onSave }: { data?: ApplicantGeneralData; onSave: (data: ApplicantGeneralData) => Promise<void> }) => {
  const { control, handleSubmit } = useForm<ApplicantGeneralData>({ resolver: zodResolver(generalDataSchema), defaultValues: data ?? common });
  return <SectionCard>
    <FormTextInput control={control} name="date" label="Fecha" placeholder="DD/MM/AAAA" icon={<AppIcon name="clock" size={18} />} />
    <FormTextInput control={control} name="clientName" label="Nombre del cliente" placeholder="Nombre completo" icon={<AppIcon name="user" size={18} />} />
    <FormTextInput control={control} name="curp" label="CURP" placeholder="18 caracteres" autoCapitalize="characters" />
    <FormTextInput control={control} name="rfc" label="RFC" placeholder="12 o 13 caracteres" autoCapitalize="characters" />
    <FormSelect control={control} name="phoneType" label="Tipo de teléfono" options={[{ label: 'Celular', value: 'mobile' }, { label: 'Casa', value: 'home' }]} />
    <FormTextInput control={control} name="phone" label="Teléfono" placeholder="10 dígitos" keyboardType="phone-pad" icon={<AppIcon name="phone" size={18} />} />
    <FormTextInput control={control} name="address" label="Domicilio" placeholder="Calle, número, colonia" icon={<AppIcon name="house" size={18} />} />
    <FormSelect control={control} name="housingType" label="Tipo de vivienda" options={[{ label: 'Propia', value: 'owned' }, { label: 'Rentada', value: 'rented' }, { label: 'Familiar', value: 'family' }]} />
    <FormTextInput control={control} name="email" label="Email" placeholder="correo@ejemplo.com" keyboardType="email-address" icon={<AppIcon name="mail" size={18} />} />
    <FormSelect control={control} name="maritalStatus" label="Estado civil" options={[{ label: 'Soltero(a)', value: 'single' }, { label: 'Casado(a)', value: 'married' }, { label: 'Unión libre', value: 'union' }]} />
    <PrimaryButton label="Siguiente" onPress={() => void handleSubmit(onSave)()} />
  </SectionCard>;
};

const FamilyStep = ({ data, maritalStatus, onSave, onBack }: { data?: ApplicantFamilyData; maritalStatus?: string; onSave: (data: ApplicantFamilyData) => Promise<void>; onBack: () => void }) => {
  const { control, handleSubmit } = useForm<ApplicantFamilyData>({ resolver: zodResolver(createFamilyDataSchema(maritalStatus)), defaultValues: data ?? {} });
  return <SectionCard>
    <FormTextInput control={control} name="spouseName" label="Nombre del cónyuge" placeholder="Nombre completo" icon={<AppIcon name="users" size={18} />} />
    <FormTextInput control={control} name="address" label="Domicilio familiar" placeholder="Domicilio" icon={<AppIcon name="house" size={18} />} />
    <FormTextInput control={control} name="phone" label="Teléfono familiar" placeholder="10 dígitos" keyboardType="phone-pad" icon={<AppIcon name="phone" size={18} />} />
    <FormTextInput control={control} name="incomeSource" label="Fuente de ingresos" placeholder="Ej. Negocio propio" icon={<AppIcon name="wallet" size={18} />} />
    <FormTextInput control={control} name="position" label="Cargo" placeholder="Cargo o actividad" icon={<AppIcon name="briefcase" size={18} />} />
    <FormTextInput control={control} name="seniority" label="Antigüedad" placeholder="Ej. 2 años" icon={<AppIcon name="clock" size={18} />} />
    <StepActions onBack={onBack} onNext={() => void handleSubmit(onSave)()} />
  </SectionCard>;
};

const WorkStep = ({ data, onSave, onBack }: { data?: ApplicantWorkData; onSave: (data: ApplicantWorkData) => Promise<void>; onBack: () => void }) => {
  const { control, handleSubmit } = useForm<ApplicantWorkData>({ resolver: zodResolver(workDataSchema), defaultValues: data ?? { job: '', workAddress: '', seniority: '', income: 0, householdExpenses: 0, otherExpenses: 0, ownsCar: false, bankDebt: 0 } });
  return <SectionCard>
    <FormTextInput control={control} name="job" label="Trabajo" placeholder="Actividad o empresa" icon={<AppIcon name="briefcase" size={18} />} />
    <FormTextInput control={control} name="workAddress" label="Dirección laboral" placeholder="Domicilio" icon={<AppIcon name="map-pin" size={18} />} />
    <FormTextInput control={control} name="seniority" label="Antigüedad" placeholder="Ej. 3 años" icon={<AppIcon name="clock" size={18} />} />
    <FormTextInput control={control} name="income" label="Percepciones" placeholder="$0" keyboardType="numeric" icon={<AppIcon name="wallet" size={18} />} />
    <FormTextInput control={control} name="householdExpenses" label="Gastos personales hogar" placeholder="$0" keyboardType="numeric" icon={<AppIcon name="wallet" size={18} />} />
    <FormTextInput control={control} name="otherExpenses" label="Otros gastos" placeholder="$0" keyboardType="numeric" icon={<AppIcon name="wallet" size={18} />} />
    <Text style={styles.inputLabel}>¿Tienes automóvil propio?</Text>
    <Controller control={control} name="ownsCar" render={({ field: { value, onChange } }) => <View style={styles.booleanRow}>
      <Pressable accessibilityRole="button" onPress={() => onChange(true)} style={[styles.boolean, value && styles.booleanActive]}><Text style={value ? styles.booleanActiveText : styles.booleanText}>Sí</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => onChange(false)} style={[styles.boolean, value === false && styles.booleanActive]}><Text style={value === false ? styles.booleanActiveText : styles.booleanText}>No</Text></Pressable>
    </View>} />
    <FormTextInput control={control} name="bankDebt" label="Deuda bancaria" placeholder="$0" keyboardType="numeric" icon={<AppIcon name="wallet" size={18} />} />
    <StepActions onBack={onBack} onNext={() => void handleSubmit(onSave)()} />
  </SectionCard>;
};

const ReferencesStep = ({ data, application, onSave, onBack }: { data?: ApplicantReferencesData; application?: import('../domain/application.types').CreditApplication; onSave: (data: ApplicantReferencesData) => Promise<void>; onBack: () => void }) => {
  const { control, handleSubmit } = useForm<ApplicantReferencesData>({ resolver: zodResolver(createReferencesDataSchema(application?.generalData?.phone)), defaultValues: data ?? { reference1: { name: '', address: '', phone: '' }, reference2: { name: '', address: '', phone: '' } } });
  return <SectionCard>
    <Text style={styles.subheading}>Referencia 1</Text>
    <FormTextInput control={control} name="reference1.name" label="Nombre" placeholder="Nombre completo" icon={<AppIcon name="user" size={18} />} />
    <FormTextInput control={control} name="reference1.address" label="Domicilio" placeholder="Domicilio" icon={<AppIcon name="house" size={18} />} />
    <FormTextInput control={control} name="reference1.phone" label="Teléfono" placeholder="10 dígitos" keyboardType="phone-pad" icon={<AppIcon name="phone" size={18} />} />
    <Text style={styles.subheading}>Referencia 2</Text>
    <FormTextInput control={control} name="reference2.name" label="Nombre" placeholder="Nombre completo" icon={<AppIcon name="user" size={18} />} />
    <FormTextInput control={control} name="reference2.address" label="Domicilio" placeholder="Domicilio" icon={<AppIcon name="house" size={18} />} />
    <FormTextInput control={control} name="reference2.phone" label="Teléfono" placeholder="10 dígitos" keyboardType="phone-pad" icon={<AppIcon name="phone" size={18} />} />
    <StepActions onBack={onBack} label="Ir a firma" onNext={() => void handleSubmit(onSave)()} />
  </SectionCard>;
};

const StepActions = ({ onBack, onNext, label = 'Siguiente' }: { onBack: () => void; onNext: () => void; label?: string }) => (
  <View style={styles.actions}>
    <Pressable accessibilityRole="button" style={styles.backButton} onPress={onBack}><Text style={styles.backLabel}>Anterior</Text></Pressable>
    <View style={styles.actionFlex}><PrimaryButton label={label} onPress={onNext} /></View>
  </View>
);

const styles = StyleSheet.create({
  eyebrow: { color: colors.secondaryNavy, fontWeight: '700', fontSize: 16 },
  heading: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginTop: spacing.sm },
  subheading: { color: colors.textPrimary, fontSize: 21, fontWeight: '800', marginBottom: spacing.lg, marginTop: spacing.sm },
  inputLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actionFlex: { flex: 1 },
  backButton: { minHeight: 58, paddingHorizontal: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  backLabel: { color: colors.secondaryNavy, fontWeight: '800' },
  booleanRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  boolean: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  booleanActive: { backgroundColor: colors.secondaryNavy, borderColor: colors.secondaryNavy },
  booleanText: { color: colors.textSecondary, fontWeight: '700' },
  booleanActiveText: { color: colors.surface, fontWeight: '800' },
});
