import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import logo from '@/assets/logos/modami-logo-text.webp';

interface AuthBrandProps {
  tagline?: string;
  compact?: boolean;
}

export function AuthBrand({ tagline, compact = false }: AuthBrandProps) {
  return (
    <View>
      <Image
        source={logo}
        style={compact ? styles.logoCompact : styles.logo}
        resizeMode="contain"
      />
      {tagline && (
        <Text className="text-base text-secondary mt-3">{tagline}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 200, height: 60 },
  logoCompact: { width: 160, height: 48 },
});
