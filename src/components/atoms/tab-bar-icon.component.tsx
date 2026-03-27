import React from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconSolid,
  UserIcon as UserIconSolid,
} from 'react-native-heroicons/solid';

type TabIconName = 'home' | 'search' | 'plus-circle' | 'message-circle' | 'user';

interface TabBarIconProps {
  name: TabIconName;
  color: string;
  focused: boolean;
  size?: number;
}

const OUTLINE_ICONS: Record<TabIconName, React.ElementType> = {
  home: HomeIcon,
  search: MagnifyingGlassIcon,
  'plus-circle': PlusCircleIcon,
  'message-circle': ChatBubbleOvalLeftIcon,
  user: UserIcon,
};

const SOLID_ICONS: Record<TabIconName, React.ElementType> = {
  home: HomeIconSolid,
  search: MagnifyingGlassIconSolid,
  'plus-circle': PlusCircleIconSolid,
  'message-circle': ChatBubbleOvalLeftIconSolid,
  user: UserIconSolid,
};

export function TabBarIcon({ name, color, focused, size = 22 }: TabBarIconProps) {
  const Icon = focused ? SOLID_ICONS[name] : OUTLINE_ICONS[name];
  return <Icon size={size} color={color} />;
}
