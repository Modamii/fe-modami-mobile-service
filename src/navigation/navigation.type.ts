import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── Auth Stack ────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ─── Main Tab ──────────────────────────────────────────────────────────────
export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  PostListing: undefined;
  Messages: undefined;
  Profile: undefined;
};

// ─── Root Stack ────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  ProductDetail: { productId: string };
  SellerDetail: { sellerId: string };
  BlogDetail: { blogId: string };
  TrendsList: undefined;
  Notifications: undefined;
  Conversation: { conversationId: string; participantName: string };
  Membership: undefined;
  Credits: undefined;
  Dashboard: undefined;
};

// ─── Typed props helpers ────────────────────────────────────────────────────
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
