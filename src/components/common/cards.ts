export interface StatCard {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'info';
}

export interface SectionBlock<T = unknown> {
  title: string;
  subtitle?: string;
  items: T[];
}

export interface ActionButton {
  label: string;
  actionKey: string;
  emphasis?: 'primary' | 'secondary' | 'text';
}
