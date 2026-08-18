'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FieldsState {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

const defaultFieldsState: FieldsState = {
  priority: true,
  members: true,
  dueDate: true,
  labels: true,
  status: true,
  reporter: true,
};

type FieldsContextType = {
  visibleFields: FieldsState;
  toggleField: (key: keyof FieldsState) => void;
};

const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

export function FieldsProvider({ children }: { children: React.ReactNode }) {
  const [visibleFields, setVisibleFields] = useState<FieldsState>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pyramid-visible-fields');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultFieldsState;
        }
      }
    }
    return defaultFieldsState;
  });

  useEffect(() => {
    localStorage.setItem('pyramid-visible-fields', JSON.stringify(visibleFields));
  }, [visibleFields]);

  const toggleField = (key: keyof FieldsState) => {
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <FieldsContext.Provider value={{ visibleFields, toggleField }}>
      {children}
    </FieldsContext.Provider>
  );
}

export function useFields() {
  const ctx = useContext(FieldsContext);
  if (!ctx) throw new Error('useFields must be used within FieldsProvider');
  return ctx;
}
