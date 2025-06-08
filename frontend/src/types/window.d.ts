// src/types/window.d.ts
interface Window {
  Cashfree?: any;
}

// Add Firebase Auth declaration
declare module 'firebase/auth' {
  export * from '@firebase/auth-types';
}
