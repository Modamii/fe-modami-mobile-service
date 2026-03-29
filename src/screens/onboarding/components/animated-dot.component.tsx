import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export function AnimatedDot({ active }: Readonly<{ active: boolean }>) {
  const dotWidth = useSharedValue(active ? 24 : 8);

  React.useEffect(() => {
    dotWidth.value = withSpring(active ? 24 : 8, { damping: 14, stiffness: 120 });
  }, [active, dotWidth]);

  const animStyle = useAnimatedStyle(() => ({ width: dotWidth.value }));

  return (
    <Animated.View
      className={`h-2 rounded-full ${active ? 'bg-primary' : 'bg-surface-highest'}`}
      style={animStyle}
    />
  );
}
