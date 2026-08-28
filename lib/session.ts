import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  /** Everything this account is allowed to do. Every account is a buyer. */
  roles: UserRole[];
  /** Which side of the app the UI is currently showing. */
  activeRole: UserRole;
}

interface SessionState {
  user: SessionUser | null;
  /** False until the stored session has been read from disk. */
  hydrated: boolean;
  init: () => void;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  updateUser: (patch: Partial<SessionUser>) => void;
  setActiveRole: (role: UserRole) => void;
}

const STORAGE_KEY = 'jihuo.session.v1';

function persist(user: SessionUser | null) {
  if (user) {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    void AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  hydrated: false,

  /**
   * Reads the persisted session once. Safe to call from an effect on every
   * mount — repeat calls after hydration are ignored.
   */
  init: () => {
    if (get().hydrated) return;

    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const user = raw ? (JSON.parse(raw) as SessionUser) : null;
        set({ user, hydrated: true });
      } catch {
        // A corrupted record must not lock the user out of the app.
        set({ user: null, hydrated: true });
      }
    })();
  },

  signIn: (user) => {
    persist(user);
    set({ user });
  },

  signOut: () => {
    persist(null);
    set({ user: null });
  },

  updateUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const next = { ...current, ...patch };
    persist(next);
    set({ user: next });
  },

  setActiveRole: (role) => {
    const current = get().user;
    if (!current || !current.roles.includes(role)) return;
    const next = { ...current, activeRole: role };
    persist(next);
    set({ user: next });
  },
}));

export function hasRole(user: SessionUser | null, role: UserRole): boolean {
  return user?.roles.includes(role) ?? false;
}
