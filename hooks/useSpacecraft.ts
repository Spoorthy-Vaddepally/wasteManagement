
import { useContext } from 'react';
import { SpacecraftContext } from '../context/SpacecraftContext';

export const useSpacecraft = () => {
  const context = useContext(SpacecraftContext);
  if (context === undefined) {
    throw new Error('useSpacecraft must be used within a SpacecraftProvider');
  }
  return context;
};
