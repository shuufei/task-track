import { v4 as uuidv4 } from 'uuid';

export type Section = {
  id: string;
  title: string;
};

export const generateSection = (): Section => ({
  id: uuidv4(),
  title: ''
});
