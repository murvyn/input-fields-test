export interface Expect {
  soft: {
    (locator: any, message?: string): {
      toBeVisible: () => Promise<void>;
      toHaveValue: (value: string) => Promise<void>;
      toBe: (value: string | number) => Promise<void>;
      toBeFocused: () => Promise<void>;
      toHaveAttribute: (name: string, value: string | RegExp) => Promise<void>;
      toHaveCSS: (name: string, value: string | RegExp) => Promise<void>;
      toBeDisabled: () => Promise<void>;
      toBeHidden: () => Promise<void>;
      toBeChecked: (value?: { checked?: boolean }) => Promise<void>;
      not: {
        toBeChecked: () => Promise<void>;
        toBeFocused: () => Promise<void>;
        toBe: (value: string) => Promise<void>;
        toHaveValue: (value: string) => Promise<void>;
      };
    };
  };
}

export type InputProps = {
  input: any;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoComplete?: boolean;
};
