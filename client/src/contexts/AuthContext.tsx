import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface AuthContextValue {
  user: { uid: string; phoneNumber: string | null } | null;
  isAuthenticated: boolean;
  requireAuth: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; phoneNumber: string | null } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, phoneNumber: firebaseUser.phoneNumber });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
      }
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (e) {
      setError("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const requireAuth = useCallback(async () => {
    if (auth.currentUser) return true;
    setIsDialogOpen(true);
    return new Promise<boolean>((resolve) => {
      const onClose = async () => {
        setIsDialogOpen(false);
        resolve(!!auth.currentUser);
      };
      // Resolve when user signs in
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          unsub();
          resolve(true);
        }
      });
      // Fallback close handler if needed; consumer can close dialog
      (window as any).__authClose = onClose;
    });
  }, []);

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    requireAuth,
    signOutUser,
  }), [user, requireAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-sm p-4">
            <div className="flex justify-center gap-2 mb-3">
              <button className={`px-3 py-1 rounded ${mode==='signin'?'bg-gray-900 text-white':'border'}`} onClick={() => { setMode('signin'); setError(''); }}>
                Sign In
              </button>
              <button className={`px-3 py-1 rounded ${mode==='signup'?'bg-gray-900 text-white':'border'}`} onClick={() => { setMode('signup'); setError(''); }}>
                Sign Up
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input className="border rounded w-full px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="border rounded w-full px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input className="border rounded w-full px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>{loading ? (mode==='signin'?'Signing in…':'Creating…') : (mode==='signin'?'Sign In':'Create Account')}</button>
              <button type="button" className="w-full mt-2 border py-2 rounded" onClick={() => setIsDialogOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


