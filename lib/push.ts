import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { create } from 'zustand';

/** Foreground presentation: banners + list entries, no sound by default. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface PushState {
  token: string | null;
  status: 'idle' | 'granted' | 'denied' | 'unsupported';
  setToken: (token: string | null) => void;
  setStatus: (status: PushState['status']) => void;
}

export const usePushStore = create<PushState>((set) => ({
  token: null,
  status: 'idle',
  setToken: (token) => set({ token }),
  setStatus: (status) => set({ status }),
}));

/** Remote push needs a dev build or a store build; Expo Go can't receive it. */
function remotePushSupported(): boolean {
  if (Platform.OS === 'web') return false;
  if (!Device.isDevice) return false;
  return Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
}

/**
 * Registers the device for push notifications and routes notification taps.
 * Notification payloads may carry `data.href` (e.g. `/orders/1024`).
 */
export function usePushNotifications() {
  const setToken = usePushStore((s) => s.setToken);
  const setStatus = usePushStore((s) => s.setStatus);

  useEffect(() => {
    if (!remotePushSupported()) {
      setStatus('unsupported');
      return;
    }

    void (async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: '一般通知',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const existing = await Notifications.getPermissionsAsync();
        const granted = existing.granted || (await Notifications.requestPermissionsAsync()).granted;

        if (!granted) {
          setStatus('denied');
          return;
        }

        setStatus('granted');

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        const { data } = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined,
        );
        setToken(data);
      } catch {
        // Push is an enhancement: never block app start on it.
        setStatus('unsupported');
      }
    })();
  }, [setStatus, setToken]);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const href = response.notification.request.content.data?.href;
      if (typeof href === 'string' && href.startsWith('/')) {
        router.push(href as unknown as Href);
      }
    });

    return () => subscription.remove();
  }, []);
}
