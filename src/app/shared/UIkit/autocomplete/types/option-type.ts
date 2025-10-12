export type OptionType<T extends object> = T & { id: string | number,  name?: string, legal_name?: string; };
