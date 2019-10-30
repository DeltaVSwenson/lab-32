import { useContext } from 'react';
import { SettingsContext } from './settings';

export default function useSettings() {
  return useContext(SettingsContext);
}
