import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    ...(Platform.OS === 'ios' && { iosClientId: GOOGLE_IOS_CLIENT_ID }),
    offlineAccess: false,
  });
}

export interface GoogleUserInfo {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
}

export async function signInWithGoogle(): Promise<GoogleUserInfo> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (response.type !== 'success') {
    throw new Error('Google Sign-In bị hủy');
  }

  const { user } = response.data;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  };
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore sign out errors
  }
}

export { statusCodes };
