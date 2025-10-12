export interface ISelectOption {
  name: string;

  [key: string]: unknown;
}

export interface IModalSelectData<T extends ISelectOption = ISelectOption> {
  title: string;
  label?: string;
  options: T[];
  preSelected?: T;
  placeholder?: string;
  cancel_btn_text: string;
  save_btn_text: string;
}