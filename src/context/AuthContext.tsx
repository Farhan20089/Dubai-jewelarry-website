import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser, AdminSession, CustomerAddress } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../services/storage';
import { DEMO_ADMIN_CONFIG, INITIAL_CUSTOMERS } from '../data/seedData';

interface AuthContextType {
  // Customer Auth
  currentUser: CustomerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Admin Auth
  adminSession: AdminSession | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() =>
    getStorageItem<CustomerUser | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_CUSTOMERS[0]) // Pre-authenticated demo customer for seamless testing
  );

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() =>
    getStorageItem<AdminSession | null>(STORAGE_KEYS.ADMIN_SESSION, null)
  );

  useEffect(() => {
    if (currentUser) {
      setStorageItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      removeStorageItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminSession) {
      setStorageItem(STORAGE_KEYS.ADMIN_SESSION, adminSession);
    } else {
      removeStorageItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  }, [adminSession]);

  // Customer Login (Demo LocalStorage)
  const login = useCallback(async (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedCustomers = getStorageItem<CustomerUser[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const found = storedCustomers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (found) {
      setCurrentUser(found);
      return { success: true };
    } else {
      // Create guest demo account automatically
      const newGuest: CustomerUser = {
        id: 'cust-' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+971 50 000 0000',
        registeredAt: new Date().toISOString().split('T')[0],
        addresses: [],
      };
      const updatedList = [newGuest, ...storedCustomers];
      setStorageItem(STORAGE_KEYS.CUSTOMERS, updatedList);
      setCurrentUser(newGuest);
      return { success: true };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedCustomers = getStorageItem<CustomerUser[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const existing = storedCustomers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: CustomerUser = {
      id: 'cust-' + Date.now(),
      name,
      email: cleanEmail,
      phone,
      registeredAt: new Date().toISOString().split('T')[0],
      addresses: [],
    };

    const updated = [newUser, ...storedCustomers];
    setStorageItem(STORAGE_KEYS.CUSTOMERS, updated);
    setCurrentUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updatedData: Partial<CustomerUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);

    // Update in customers list
    const stored = getStorageItem<CustomerUser[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStorageItem(
      STORAGE_KEYS.CUSTOMERS,
      stored.map((c) => (c.id === updated.id ? updated : c))
    );
  }, [currentUser]);

  const addAddress = useCallback((addrData: Omit<CustomerAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: CustomerAddress = {
      ...addrData,
      id: 'addr-' + Date.now(),
    };
    const updatedAddresses = addrData.isDefault
      ? currentUser.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...currentUser.addresses, newAddr];

    updateProfile({ addresses: updatedAddresses });
  }, [currentUser, updateProfile]);

  const deleteAddress = useCallback((id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.filter((a) => a.id !== id);
    updateProfile({ addresses: updated });
  }, [currentUser, updateProfile]);

  const setDefaultAddress = useCallback((id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateProfile({ addresses: updated });
  }, [currentUser, updateProfile]);

  // Admin Auth
  const adminLogin = useCallback(async (email: string, pass: string) => {
    if (
      email.trim().toLowerCase() === DEMO_ADMIN_CONFIG.email.toLowerCase() &&
      pass === DEMO_ADMIN_CONFIG.password
    ) {
      const session: AdminSession = {
        isAuthenticated: true,
        username: DEMO_ADMIN_CONFIG.name,
        role: DEMO_ADMIN_CONFIG.role,
        loggedInAt: new Date().toISOString(),
      };
      setAdminSession(session);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Use demo email: admin@dubaigold.com & password: admin123' };
  }, []);

  const adminLogout = useCallback(() => {
    setAdminSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,

        adminSession,
        isAdminAuthenticated: !!adminSession?.isAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
