import { Platform } from 'react-native';
import { COLORS } from '@/constants/app.constants';

export const CONDITION_LABEL: Record<string, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Tốt',
  fair: 'Khá tốt',
};

export const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

export const IMAGE_HEIGHT = 400;
export const THUMB_SIZE = 56;
