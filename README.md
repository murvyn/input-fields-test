# InputFieldsTest

`InputFieldsTest` is a Playwright-based testing utility that helps automate and validate HTML input fields effortlessly.

## Installation

```sh
npm install input-fields-test
```

## Usage

Import and initialize `InputFieldsTest` in your Playwright test setup:

```ts
import { test, expect } from '@playwright/test';
import { InputFieldsTest } from 'input-fields-test';


test('Test input field', async ({ page }) => {
  const inputTest = new InputFieldsTest(expect, page);

  await inputTest.textInput({
    input: '#username',
    placeholder: 'Enter username',
    maxLength: 20,
  });
});
```

## API

### `textInput(options: InputProps): Promise<void>`

Validates a text input field based on provided properties.

#### Parameters:
- `input` (**string**) - Selector for the input field.
- `placeholder` (**string**, optional) - Expected placeholder text.
- `maxLength` (**number**, optional) - Expected max length.

### `passwordInput(input: string): Promise<void>`

Validates a password input field.

#### Parameters:
- `input` (**string**) - Selector for the password field.

### `emailInput(input: string): Promise<void>`

Validates an email input field.

#### Parameters:
- `input` (**string**) - Selector for the email field.

### `numberInput(input: string, min?: number, max?: number): Promise<void>`

Validates a number input field.

#### Parameters:
- `input` (**string**) - Selector for the number field.
- `min` (**number**, optional) - Minimum value allowed.
- `max` (**number**, optional) - Maximum value allowed.

### `dateInput(input: string): Promise<void>`

Validates a date input field.

#### Parameters:
- `input` (**string**) - Selector for the date field.

### `timeInput(input: string): Promise<void>`

Validates a time input field.

#### Parameters:
- `input` (**string**) - Selector for the time field.

### `dateTimeLocalInput(input: string): Promise<void>`

Validates a date-time input field.

#### Parameters:
- `input` (**string**) - Selector for the date-time field.

### `checkboxInput(input: string): Promise<void>`

Validates a checkbox input field.

#### Parameters:
- `input` (**string**) - Selector for the checkbox field.

### `radioInput(input: string): Promise<void>`

Validates a radio button input field.

#### Parameters:
- `input` (**string**) - Selector for the radio button field.

### `colorInput(input: string): Promise<void>`

Validates a color input field.

#### Parameters:
- `input` (**string**) - Selector for the color input field.

### `fileInput(input: string): Promise<void>`

Validates a file input field.

#### Parameters:
- `input` (**string**) - Selector for the file input field.

### `searchInput(input: string): Promise<void>`

Validates a search input field.

#### Parameters:
- `input` (**string**) - Selector for the search input field.

### `telInput(input: string): Promise<void>`

Validates a telephone input field.

#### Parameters:
- `input` (**string**) - Selector for the telephone input field.

### `urlInput(input: string): Promise<void>`

Validates a URL input field.

#### Parameters:
- `input` (**string**) - Selector for the URL input field.

### `rangeInput(input: string, min?: number, max?: number): Promise<void>`

Validates a range slider input field.

#### Parameters:
- `input` (**string**) - Selector for the range input field.
- `min` (**number**, optional) - Minimum value allowed.
- `max` (**number**, optional) - Maximum value allowed.

## License
MIT

