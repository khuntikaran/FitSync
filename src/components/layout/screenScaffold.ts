import { ActionButton, SectionBlock } from '../common/cards';

export interface ScreenScaffold {
  title: string;
  description?: string;
  sections: SectionBlock[];
  actions?: ActionButton[];
}
