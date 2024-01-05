import { Store } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

declare global {
  interface Window {
    store?: Store<RootState>;
  }
}