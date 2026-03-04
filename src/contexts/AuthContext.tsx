import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

/* ---------- Firestore user profile ---------- */
export interface UserProfile {
  displayName: string;
  avatarBase64: string | null;
  friendCode: string;
  createdAt: unknown; // Firestore Timestamp
}

/* ---------- Context value ---------- */
interface AuthContextValue {
  /** Firebase Auth user (null = not logged in, undefined = loading) */
  user: User | null | undefined;
  /** Firestore user profile (null while loading or if not yet set up) */
  profile: UserProfile | null;
  /** true while the initial auth state is being resolved */
  loading: boolean;
  /** true if user is authenticated but has no profile yet (needs setup) */
  needsSetup: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Save or update user profile in Firestore */
  saveProfile: (data: { displayName: string; avatarBase64: string | null }) => Promise<void>;
  /** Refresh profile from Firestore */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ---------- Friend code generator ---------- */
function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude I,O,0,1 for clarity
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BGT-${code}`;
}

/* ---------- Provider ---------- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Listen to Firebase Auth state */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  /* Fetch Firestore profile when user changes */
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!cancelled) {
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  /* Auth methods */
  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutFn = async () => {
    await firebaseSignOut(auth);
  };

  const saveProfile = async (data: { displayName: string; avatarBase64: string | null }) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      // Update existing profile (keep friendCode)
      await setDoc(ref, { ...data }, { merge: true });
    } else {
      // Create new profile with friendCode
      await setDoc(ref, {
        ...data,
        friendCode: generateFriendCode(),
        createdAt: serverTimestamp(),
      });
    }
    // Refresh
    const snap = await getDoc(ref);
    setProfile(snap.data() as UserProfile);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
  };

  const needsSetup = user != null && !loading && profile === null;

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      needsSetup,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signOut: signOutFn,
      saveProfile,
      refreshProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, loading, needsSetup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
