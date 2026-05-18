import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserStats {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  achievements: string[];
  lastLogin?: string;
}

interface FirebaseContextType {
  user: User | null;
  stats: UserStats | null;
  loading: boolean;
  updateStats: (newStats: Partial<UserStats>) => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Initial fetch and setup listener
        const userDocRef = doc(db, 'users', user.uid);
        
        // Setup snapshot listener for real-time updates
        const unsubSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setStats(docSnap.data() as UserStats);
          } else {
            // First time user initialization
            const initialStats: UserStats = {
              xp: 0,
              coins: 0,
              level: 1,
              streak: 1,
              achievements: [],
              lastLogin: new Date().toISOString()
            };
            setDoc(userDocRef, initialStats);
            setStats(initialStats);
          }
        }, (error) => {
          console.error("Firestore listener error:", error);
        });

        return () => unsubSnapshot();
      } else {
        setStats(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStats = async (newStats: Partial<UserStats>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, { ...stats, ...newStats }, { merge: true });
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };

  const signIn = async () => {
    const { signInWithGoogle } = await import('../lib/firebase');
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const signOut = async () => {
    const { auth } = await import('../lib/firebase');
    await auth.signOut();
  };

  return (
    <FirebaseContext.Provider value={{ user, stats, loading, updateStats, signIn, signOut }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
