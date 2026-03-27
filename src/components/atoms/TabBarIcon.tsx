import React from 'react';
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  User,
} from 'lucide-react-native';

type IconName = 'home' | 'search' | 'plus-circle' | 'message-circle' | 'user';

interface TabBarIconProps {
  name: IconName;
  color: string;
  focused: boolean;
  size?: number;
}

const icons: Record<IconName, React.ElementType> = {
  home: Home,
  search: Search,
  'plus-circle': PlusCircle,
  'message-circle': MessageCircle,
  user: User,
};

export function TabBarIcon({ name, color, size = 22 }: TabBarIconProps) {
  const Icon = icons[name];
  return <Icon color={color} size={size} strokeWidth={2} />;
}
