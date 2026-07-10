import React from 'react';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Briefcase from 'lucide-react-native/icons/briefcase';
import Camera from 'lucide-react-native/icons/camera';
import Car from 'lucide-react-native/icons/car';
import Check from 'lucide-react-native/icons/check';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import Clock from 'lucide-react-native/icons/clock';
import CreditCard from 'lucide-react-native/icons/credit-card';
import FilePlus from 'lucide-react-native/icons/file-plus';
import Flashlight from 'lucide-react-native/icons/flashlight';
import FlashlightOff from 'lucide-react-native/icons/flashlight-off';
import House from 'lucide-react-native/icons/house';
import Image from 'lucide-react-native/icons/image';
import ImagePlus from 'lucide-react-native/icons/image-plus';
import Info from 'lucide-react-native/icons/info';
import Mail from 'lucide-react-native/icons/mail';
import MapPin from 'lucide-react-native/icons/map-pin';
import Phone from 'lucide-react-native/icons/phone';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import Signature from 'lucide-react-native/icons/signature';
import SwitchCamera from 'lucide-react-native/icons/switch-camera';
import User from 'lucide-react-native/icons/user';
import Users from 'lucide-react-native/icons/users';
import Wallet from 'lucide-react-native/icons/wallet';
import X from 'lucide-react-native/icons/x';
import { colors } from '../theme';

export type AppIconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'camera'
  | 'camera-switch'
  | 'file-plus'
  | 'credit-card'
  | 'user'
  | 'users'
  | 'map-pin'
  | 'phone'
  | 'mail'
  | 'house'
  | 'briefcase'
  | 'clock'
  | 'wallet'
  | 'car'
  | 'image'
  | 'image-plus'
  | 'signature'
  | 'check'
  | 'check-circle'
  | 'rotate-ccw'
  | 'x'
  | 'flashlight'
  | 'flashlight-off'
  | 'chevron-down'
  | 'info';

export type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  accessibilityLabel?: string;
};

const icons = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  camera: Camera,
  'camera-switch': SwitchCamera,
  'file-plus': FilePlus,
  'credit-card': CreditCard,
  user: User,
  users: Users,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  house: House,
  briefcase: Briefcase,
  clock: Clock,
  wallet: Wallet,
  car: Car,
  image: Image,
  'image-plus': ImagePlus,
  signature: Signature,
  check: Check,
  'check-circle': CircleCheck,
  'rotate-ccw': RotateCcw,
  x: X,
  flashlight: Flashlight,
  'flashlight-off': FlashlightOff,
  'chevron-down': ChevronDown,
  info: Info,
} as const;

export const AppIcon = ({ name, size = 20, color = colors.royalBlue, strokeWidth = 2, accessibilityLabel }: AppIconProps) => {
  const Icon = icons[name];
  return <Icon size={size} color={color} strokeWidth={strokeWidth} accessibilityLabel={accessibilityLabel} accessible={Boolean(accessibilityLabel)} />;
};
