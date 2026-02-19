export interface IMenuItem {
    path: string;
    label: string;
    description: string;
    category: 'main' | 'account' | 'system' | 'product';
    isVisible: boolean; // False for background/error routes
    icon?: string;      // Placeholder for icon library ke
}