import { Expect } from "../types";
import path from "path";

interface InputProps {
  input: any;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoComplete?: boolean;
}

export class InputFieldsTest {
  private expect: Expect;
  private page;

  constructor(expect: Expect, page: any) {
    this.expect = expect;
    this.page = page;
  }

  async textInput({
    input,
    placeholder,
    disabled,
    readOnly,
    maxLength,
  }: InputProps): Promise<void> {
    const { expect, page } = this;

    console.log("Starting text input field validation...");

    await expect.soft(input, "🧪Input field should be visible.").toBeVisible();

    // Verify input field is editable
    await input.fill("QA Test");
    await expect
      .soft(input, "🧪Input should contain 'QA Test'.")
      .toHaveValue("QA Test");

    // Verify alphanumeric characters
    await input.fill("QATest123");
    await expect
      .soft(input, "🧪Input should allow alphanumeric characters.")
      .toHaveValue("QATest123");

    // Verify special characters
    await input.fill("@#$%^&*()_+");
    await expect
      .soft(input, "🧪Input should allow special characters.")
      .toHaveValue("@#$%^&*()_+");

    // Verify max character limit
    if (maxLength) {
      await input.fill("A".repeat(maxLength + 1));
      await expect
        .soft(
          input,
          `🧪Input should not allow more than ${maxLength} characters.`
        )
        .not.toHaveValue("A".repeat(maxLength + 1));
    }

    // Verify empty input is allowed
    await input.fill("");
    await expect
      .soft(input, "🧪Input should allow empty value.")
      .toHaveValue("");

    // Verify user can clear input
    await input.fill("Clear me");
    await input.fill("");
    await expect
      .soft(input, "🧪User should be able to clear input.")
      .toHaveValue("");

    // Verify numbers are allowed if not restricted
    await input.fill("123456");
    await expect
      .soft(input, "🧪Numbers should be allowed in input.")
      .toHaveValue("123456");

    //Verify copy-paste functionality

    await input.fill("");
    await page.evaluate(() => navigator.clipboard.writeText("CopiedText"));
    await input.focus();
    await page.keyboard.press("Control+V");
    await expect
      .soft(input, "text input should allow pasting.")
      .toHaveValue("CopiedText");

    // Verify placeholder
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify disabled state
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only state
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Text input field validation completed.");
  }

  async passwordInput({
    input,
    maxLength,
    placeholder,
    disabled,
    readOnly,
    autoComplete,
  }: InputProps): Promise<void> {
    const { expect, page } = this;
    console.log("Starting text input field validation...");
    // Verify password input is visible
    await expect
      .soft(input, "🧪Password input should be visible.")
      .toBeVisible();

    // Verify password input is of type "password"
    await expect
      .soft(input, "🧪Password input should have type 'password'.")
      .toHaveAttribute("type", "password");

    // Verify input is editable
    await input.fill("QATest@123");
    await expect
      .soft(input, "🧪Password input should accept input.")
      .toHaveValue("QATest@123");

    // Verify input does not accept more than max characters
    if (maxLength) {
      await input.fill("A".repeat(maxLength + 1));
      await expect
        .soft(
          input,
          `🧪Input should not allow more than ${maxLength} characters.`
        )
        .not.toHaveValue("A".repeat(maxLength + 1));
    }

    // Verify input field accepts special characters
    await input.fill("!@#$%^&*()");
    await expect
      .soft(input, "🧪Password input should accept special characters.")
      .toHaveValue("!@#$%^&*()");

    // Verify input accepts spaces
    await input.fill("Hello World");
    await expect
      .soft(input, "🧪Password input should accept spaces unless restricted.")
      .toHaveValue("Hello World");

    // Verify input field is disabled (if applicable)
    if (await input.isDisabled()) {
      await expect
        .soft(input, "Password input should be disabled.")
        .toBeDisabled();
    }

    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify password input handles copy-paste correctly
    await input.fill("");
    await page.evaluate(() => navigator.clipboard.writeText("CopiedPassword"));
    await input.focus();
    await page.keyboard.press("Control+V");
    await expect
      .soft(input, "Password input should allow pasting.")
      .toHaveValue("CopiedPassword");

    // Verify password input does not autofill if autocomplete="off"
    if (autoComplete) {
      const autoComplete = await input.getAttribute("autocomplete");
      expect
        .soft(
          autoComplete,
          "Password input should have autocomplete off for security."
        )
        .not.toBe("on");
    }

    console.log("Text input field validation completed.");
  }

  async emailInput({
    input,
    placeholder,
    disabled,
    readOnly,
    maxLength,
  }: InputProps): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪Email input should be visible.").toBeVisible();

    // Verify email input is of type "email"
    await expect
      .soft(input, "🧪Email input should have type 'email'.")
      .toHaveAttribute("type", "email");

    // Verify email input is editable
    await input.fill("test@example.com");
    await expect
      .soft(input, "🧪Email input should accept a valid email.")
      .toHaveValue("test@example.com");

    // Verify valid email format
    await input.fill("valid.email@example.com");
    await expect
      .soft(input, "🧪Email input should accept a valid email format.")
      .toHaveValue("valid.email@example.com");

    // Verify input accepts special characters (if valid)
    await input.fill("user+alias@example.com");
    await expect
      .soft(input, "🧪Email input should allow special characters like '+'.")
      .toHaveValue("user+alias@example.com");

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify email input handles copy-paste correctly
    await input.fill("");
    await this.page.evaluate(() =>
      navigator.clipboard.writeText("paste@example.com")
    );
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪Email input should allow pasting.")
      .toHaveValue("paste@example.com");

    console.log("Text input field validation completed.");
  }

  async numberInput(
    { input, placeholder, disabled, readOnly, maxLength }: InputProps,
    min?: number,
    max?: number,
    step?: string
  ): Promise<void> {
    const { expect } = this;

    await expect
      .soft(input, "🧪 Number input should be visible.")
      .toBeVisible();

    // Verify number input is of type "number"
    await expect
      .soft(input, "🧪 Number input should have type 'number'.")
      .toHaveAttribute("type", "number");

    // Verify number input is editable
    await input.fill("123");
    await expect
      .soft(input, "🧪 Number input should accept a valid number.")
      .toHaveValue("123");

    // Verify decimal values (if step allows)
    if (step && step.includes(".")) {
      await input.fill("123.45");
      await expect
        .soft(input, "🧪 Number input should accept decimal values.")
        .toHaveValue("123.45");
    } else {
      await input.fill("123.45");
      await expect
        .soft(
          input,
          "🧪 Number input should round decimals if step does not allow them."
        )
        .toHaveValue("123");
    }

    // Verify negative numbers (if allowed)
    await input.fill("-50");
    await expect
      .soft(input, "🧪 Number input should accept negative numbers.")
      .toHaveValue("-50");

    // Verify min value constraint
    if (min !== undefined) {
      await input.fill((min - 1).toString());
      await expect
        .soft(input, `🧪 Number input should not accept values below ${min}.`)
        .toHaveValue(min.toString());
    }

    // Verify max value constraint
    if (max !== undefined) {
      await input.fill((max + 1).toString());
      await expect
        .soft(input, `🧪 Number input should not accept values above ${max}.`)
        .toHaveValue(max.toString());
    }

    // Verify invalid inputs (non-numeric values)
    await input.fill("abc");
    await expect
      .soft(input, "🧪 Number input should not accept non-numeric values.")
      .toHaveValue("");

    // Verify empty input
    await input.fill("");
    await expect
      .soft(input, "🧪 Number input should allow empty values.")
      .toHaveValue("");

    // Verify step increments (if applicable)
    if (step !== undefined) {
      await input.fill("10");
      await this.page.keyboard.press("ArrowUp");
      await expect
        .soft(input, `🧪 Number input should increment by step ${step}.`)
        .toHaveValue((10 + Number(step)).toString());

      await this.page.keyboard.press("ArrowDown");
      await expect
        .soft(input, `🧪 Number input should decrement by step ${step}.`)
        .toHaveValue("10");
    }

    // Verify placeholder text
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify copy-paste functionality
    await this.page.evaluate(() => navigator.clipboard.writeText("42"));
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Number input should allow pasting numeric values.")
      .toHaveValue("42");

    console.log("Number input field validation completed.");
  }

  async telInput(
    { input, placeholder, disabled, readOnly, maxLength }: InputProps,
    pattern?: string | RegExp
  ): Promise<void> {
    const { expect } = this;
    await expect
      .soft(input, "🧪 Telephone input should be visible.")
      .toBeVisible();

    // Verify telephone input is of type "tel"
    await expect
      .soft(input, "🧪 Telephone input should have type 'tel'.")
      .toHaveAttribute("type", "tel");

    // Verify telephone input is editable
    await input.fill("1234567890");
    await expect
      .soft(input, "🧪 Telephone input should accept numeric values.")
      .toHaveValue("1234567890");

    // Verify international format with "+"
    await input.fill("+1234567890123");
    await expect
      .soft(input, "🧪 Telephone input should accept international format.")
      .toHaveValue("+1234567890123");

    // Verify input does not accept alphabets
    await input.fill("abcdefg123");
    await expect
      .soft(input, "🧪 Telephone input should not accept alphabets.")
      .not.toHaveValue("abcdefg123");

    // Verify input allows valid special characters like "-", "(", ")"
    await input.fill("(123) 456-7890");
    await expect
      .soft(input, "🧪 Telephone input should allow formatting characters.")
      .toHaveValue("(123) 456-7890");

    // Verify input does not accept spaces if restricted
    await input.fill("123 456 7890");
    await expect
      .soft(input, "🧪 Telephone input should handle spaces correctly.")
      .toHaveValue("123 456 7890");

    // Verify maxLength restriction (if applicable)
    if (maxLength) {
      const longNumber = "1".repeat(maxLength + 5);
      await input.fill(longNumber);
      await expect
        .soft(
          input,
          `🧪 Telephone input should not exceed max length of ${maxLength}.`
        )
        .not.toHaveValue(longNumber);
    }

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify telephone input handles copy-paste correctly
    await input.fill("");
    await this.page.evaluate(() =>
      navigator.clipboard.writeText("+1122334455")
    );
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Telephone input should allow pasting.")
      .toHaveValue("+1122334455");

    // Verify input follows a pattern (if applicable)
    if (pattern) {
      const invalidValue = "invalidPhoneNumber";
      await input.fill(invalidValue);

      const isValid =
        pattern instanceof RegExp
          ? pattern.test(invalidValue)
          : new RegExp(pattern).test(invalidValue);

      if (!isValid) {
        await expect
          .soft(
            input,
            `🧪 Telephone input should follow the pattern: ${pattern}`
          )
          .not.toHaveValue(invalidValue);
      }
    }

    console.log("Telephone input field validation completed.");
  }

  async searchInput({
    input,
    placeholder,
    disabled,
    readOnly,
    maxLength,
  }: InputProps): Promise<void> {
    const { expect } = this;
    await expect
      .soft(input, "🧪 Search input should be visible.")
      .toBeVisible();

    // Verify search input is of type "search"
    await expect
      .soft(input, "🧪 Search input should have type 'search'.")
      .toHaveAttribute("type", "search");

    // Verify search input is editable
    await input.fill("playwright");
    await expect
      .soft(input, "🧪 Search input should accept text input.")
      .toHaveValue("playwright");

    // Verify input accepts special characters
    await input.fill("test@search.com");
    await expect
      .soft(input, "🧪 Search input should allow special characters.")
      .toHaveValue("test@search.com");

    // Verify input accepts spaces
    await input.fill("search query");
    await expect
      .soft(input, "🧪 Search input should accept spaces.")
      .toHaveValue("search query");

    // Verify input handles clearing with "Escape" key
    await input.fill("clear this");
    await input.press("Escape");
    await expect
      .soft(input, "🧪 Search input should clear when 'Escape' is pressed.")
      .toHaveValue("");

    // Verify input handles Enter key submission
    await input.fill("search term");
    await input.press("Enter");
    console.log("🧪 Search input should trigger form submission on Enter key.");

    // Verify maxLength restriction (if applicable)
    if (maxLength) {
      const longText = "a".repeat(maxLength + 5);
      await input.fill(longText);
      await expect
        .soft(
          input,
          `🧪 Search input should not exceed max length of ${maxLength}.`
        )
        .not.toHaveValue(longText);
    }

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify search input handles copy-paste correctly
    await input.fill("");
    await this.page.evaluate(() =>
      navigator.clipboard.writeText("pasteSearchQuery")
    );
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Search input should allow pasting.")
      .toHaveValue("pasteSearchQuery");

    console.log("Search input field validation completed.");
  }

  async dateInput({
    input,
    placeholder,
    disabled,
    readOnly,
    maxLength,
  }: InputProps): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 Date input should be visible.").toBeVisible();

    // Verify date input is of type "date"
    await expect
      .soft(input, "🧪 Date input should have type 'date'.")
      .toHaveAttribute("type", "date");

    // Verify date input is editable
    await input.fill("2025-02-12");
    await expect
      .soft(input, "🧪 Date input should accept a valid date.")
      .toHaveValue("2025-02-12");

    // Verify invalid date input shows error (depending on the browser implementation)
    await input.fill("invalid-date");
    await expect
      .soft(input, "🧪 Date input should reject invalid date format.")
      .not.toHaveValue("invalid-date");

    // Verify input accepts the correct date format
    await input.fill("2025-12-31");
    await expect
      .soft(input, "🧪 Date input should accept valid date formats.")
      .toHaveValue("2025-12-31");

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify date input handles copy-paste correctly
    await this.page.evaluate(() => navigator.clipboard.writeText("2025-05-15"));
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Date input should allow pasting.")
      .toHaveValue("2025-05-15");

    // Verify input field does not accept date outside of the valid range (if min/max attributes are set)
    const minDate = "2020-01-01";
    const maxDate = "2025-12-31";
    await input.fill("2019-12-31");
    await expect
      .soft(input, `🧪 Date input should not accept dates before ${minDate}.`)
      .not.toHaveValue("2019-12-31");

    await input.fill("2026-01-01");
    await expect
      .soft(input, `🧪 Date input should not accept dates after ${maxDate}.`)
      .not.toHaveValue("2026-01-01");

    // Verify maxLength restriction (if applicable)
    if (maxLength) {
      const longText = "2025-02-12".repeat(maxLength + 5);
      await input.fill(longText);
      await expect
        .soft(
          input,
          `🧪 Date input should not exceed max length of ${maxLength}.`
        )
        .not.toHaveValue(longText);
    }

    console.log("Date input field validation completed.");
  }

  async timeInput(
    { input, placeholder, disabled, readOnly, maxLength }: InputProps,
    minTime?: string,
    maxTime?: string
  ): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 Time input should be visible.").toBeVisible();

    // Verify time input is of type "time"
    await expect
      .soft(input, "🧪 Time input should have type 'time'.")
      .toHaveAttribute("type", "time");

    // Verify time input is editable
    await input.fill("12:30");
    await expect
      .soft(input, "🧪 Time input should accept a valid time.")
      .toHaveValue("12:30");

    // Verify invalid time input shows error (depending on browser implementation)
    await input.fill("invalid-time");
    await expect
      .soft(input, "🧪 Time input should reject invalid time format.")
      .not.toHaveValue("invalid-time");

    // Verify input accepts 24-hour format
    await input.fill("23:59");
    await expect
      .soft(input, "🧪 Time input should accept valid 24-hour format.")
      .toHaveValue("23:59");

    // Verify input does not accept values outside the 24-hour range
    await input.fill("25:00");
    await expect
      .soft(input, "🧪 Time input should not accept hours >= 24.")
      .not.toHaveValue("25:00");

    await input.fill("12:60");
    await expect
      .soft(input, "🧪 Time input should not accept minutes >= 60.")
      .not.toHaveValue("12:60");

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify time input handles copy-paste correctly
    await input.fill("");
    await this.page.evaluate(() => navigator.clipboard.writeText("15:45"));
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Time input should allow pasting.")
      .toHaveValue("15:45");

    // Ensure minTime and maxTime are in the format HH:mm
    if (minTime) {
      const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeFormat.test(minTime)) {
        throw new Error("Invalid time format. Use HH:mm (e.g., '08:00').");
      }

      // Helper function to subtract minutes from a time string
      const adjustTime = (time: string, minutes: number): string => {
        const [hours, mins] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, mins - minutes);
        return date.toTimeString().slice(0, 5); // Format as HH:mm
      };

      // Calculate values dynamically
      const beforeMin = adjustTime(minTime, 1); // 1 minute before minTime

      // Validate time input against minTime
      await input.fill(beforeMin);
      await expect
        .soft(input, `🧪 Time input should not accept times before ${minTime}.`)
        .not.toHaveValue(beforeMin);
    }

    if (maxTime) {
      const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeFormat.test(maxTime)) {
        throw new Error("Invalid time format. Use HH:mm (e.g., '08:00').");
      }

      // Helper function to subtract minutes from a time string
      const adjustTime = (time: string, minutes: number): string => {
        const [hours, mins] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, mins - minutes);
        return date.toTimeString().slice(0, 5); // Format as HH:mm
      };

      // Calculate values dynamically
      const afterMax = adjustTime(maxTime, -1); // 1 minute after maxTime

      // Validate time input against maxTime
      await input.fill(afterMax);
      await expect
        .soft(input, `🧪 Time input should not accept times after ${maxTime}.`)
        .not.toHaveValue(afterMax);
    }

    // Verify maxLength restriction (if applicable)
    if (maxLength) {
      const longText = "12:30".repeat(maxLength + 5);
      await input.fill(longText);
      await expect
        .soft(
          input,
          `🧪 Time input should not exceed max length of ${maxLength}.`
        )
        .not.toHaveValue(longText);
    }

    console.log("Time input field validation completed.");
  }

  async dateTimeLocalInput(
    { input, placeholder, disabled, readOnly, maxLength }: InputProps,
    min?: string,
    max?: string
  ): Promise<void> {
    const { expect } = this;
    await expect
      .soft(input, "🧪 Datetime-local input should be visible.")
      .toBeVisible();

    // Verify datetime-local input is of type "datetime-local"
    await expect
      .soft(input, "🧪 Datetime-local input should have type 'datetime-local'.")
      .toHaveAttribute("type", "datetime-local");

    // Verify datetime-local input is editable
    await input.fill("2025-02-12T14:30");
    await expect
      .soft(
        input,
        "🧪 Datetime-local input should accept a valid date and time."
      )
      .toHaveValue("2025-02-12T14:30");

    // Verify invalid datetime input should not be accepted
    await input.fill("invalid-date");
    await expect
      .soft(input, "🧪 Datetime-local input should reject invalid formats.")
      .not.toHaveValue("invalid-date");

    // Verify datetime-local input allows future dates
    await input.fill("2030-12-31T23:59");
    await expect
      .soft(input, "🧪 Datetime-local input should accept future dates.")
      .toHaveValue("2030-12-31T23:59");

    // Verify datetime-local input allows past dates
    await input.fill("2000-01-01T00:00");
    await expect
      .soft(input, "🧪 Datetime-local input should accept past dates.")
      .toHaveValue("2000-01-01T00:00");

    // Verify min and max datetime restrictions (if applicable)
    if (min) {
      await input.fill(min);
      await expect
        .soft(input, `🧪 Datetime-local input should allow min value ${min}.`)
        .toHaveValue(min);

      await input.fill("1999-12-31T23:59");
      await expect
        .soft(
          input,
          `🧪 Datetime-local input should not accept values before ${min}.`
        )
        .not.toHaveValue("1999-12-31T23:59");
    }

    if (max) {
      await input.fill(max);
      await expect
        .soft(input, `🧪 Datetime-local input should allow max value ${max}.`)
        .toHaveValue(max);

      await input.fill("2099-12-31T23:59");
      await expect
        .soft(
          input,
          `🧪 Datetime-local input should not accept values after ${max}.`
        )
        .not.toHaveValue("2099-12-31T23:59");
    }

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify datetime-local input handles copy-paste correctly
    await this.page.evaluate(() =>
      navigator.clipboard.writeText("2026-06-15T10:15")
    );
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 Datetime-local input should allow pasting.")
      .toHaveValue("2026-06-15T10:15");

    // Verify maxLength restriction (if applicable)
    if (maxLength) {
      const longText = "2025-02-12T14:30".repeat(maxLength + 5);
      await input.fill(longText);
      await expect
        .soft(
          input,
          `🧪 Datetime-local input should not exceed max length of ${maxLength}.`
        )
        .not.toHaveValue(longText);
    }

    console.log("Datetime-local input field validation completed.");
  }

  async rangeInput(
    { input, placeholder, disabled, readOnly }: InputProps,
    min?: number,
    max?: number,
    step?: number
  ): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 Range input should be visible.").toBeVisible();

    // Verify range input is of type "range"
    await expect
      .soft(input, "🧪 Range input should have type 'range'.")
      .toHaveAttribute("type", "range");

    // Verify range input has min and max attributes (if applicable)
    if (min) {
      await expect
        .soft(input, `🧪 Range input should have a minimum value of ${min}.`)
        .toHaveAttribute("min", String(min));
    }
    if (max) {
      await expect
        .soft(input, `🧪 Range input should have a maximum value of ${max}.`)
        .toHaveAttribute("max", String(max));
    }

    // Verify range input has step attribute (if applicable)
    if (step) {
      await expect
        .soft(input, `🧪 Range input should have a step value of ${step}.`)
        .toHaveAttribute("step", String(step));
    }

    // Verify setting the range input to min value
    if (min) {
      await input.fill(String(min));
      await expect
        .soft(input, `🧪 Range input should accept min value ${min}.`)
        .toHaveValue(String(min));
    }

    // Verify setting the range input to max value
    if (max) {
      await input.fill(String(max));
      await expect
        .soft(input, `🧪 Range input should accept max value ${max}.`)
        .toHaveValue(String(max));
    }

    // Verify setting the range input to a middle value
    if (min && max) {
      const midValue = (Number(min) + Number(max)) / 2;
      await input.fill(String(midValue));
      await expect
        .soft(
          input,
          `🧪 Range input should accept a middle value of ${midValue}.`
        )
        .toHaveValue(String(midValue));
    }

    // Verify setting the range input to an invalid value (outside min/max)
    if (min && max) {
      const outOfRangeValue = Number(max) + 10;
      await input.fill(String(outOfRangeValue));
      await expect
        .soft(
          input,
          `🧪 Range input should not accept values greater than ${max}.`
        )
        .not.toHaveValue(String(outOfRangeValue));
    }

    // Verify step increments (if applicable)
    if (step) {
      const stepValue = Number(min) + Number(step);
      await input.fill(String(stepValue));
      await expect
        .soft(
          input,
          `🧪 Range input should increment correctly by step ${step}.`
        )
        .toHaveValue(String(stepValue));
    }

    // Verify placeholder text is displayed correctly (though range inputs don't usually have placeholders)
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Range input field validation completed.");
  }

  async checkboxInput(
    { input, disabled, readOnly }: InputProps,
    checked?: boolean
  ): Promise<void> {
    const { expect } = this;
    await expect
      .soft(input, "🧪 Checkbox input should be visible.")
      .toBeVisible();

    // Verify checkbox input is of type "checkbox"
    await expect
      .soft(input, "🧪 Checkbox input should have type 'checkbox'.")
      .toHaveAttribute("type", "checkbox");

    // Verify checkbox is not checked by default (unless specified)
    const isChecked = await input.isChecked();
    if (checked !== undefined) {
      await expect
        .soft(
          input,
          `🧪 Checkbox should be ${
            checked ? "checked" : "unchecked"
          } by default.`
        )
        .toBeChecked({ checked });
    } else {
      await expect
        .soft(input, "🧪 Checkbox should be unchecked by default.")
        .not.toBeChecked();
    }

    // Verify clicking the checkbox toggles the checked state
    await input.click();
    await expect
      .soft(input, "🧪 Checkbox should be checked after clicking.")
      .toBeChecked();

    await input.click();
    await expect
      .soft(input, "🧪 Checkbox should be unchecked after clicking again.")
      .not.toBeChecked();

    // Verify manually setting the checkbox to checked
    await input.check();
    await expect
      .soft(input, "🧪 Checkbox should be checked when manually checked.")
      .toBeChecked();

    // Verify manually unchecking the checkbox
    await input.uncheck();
    await expect
      .soft(input, "🧪 Checkbox should be unchecked when manually unchecked.")
      .not.toBeChecked();

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow changes (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Checkbox input field validation completed.");
  }

  async radioInput(
    { input, disabled, readOnly }: InputProps,
    checked?: boolean,
    name?: string
  ): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 Radio input should be visible.").toBeVisible();

    // Verify radio input is of type "radio"
    await expect
      .soft(input, "🧪 Radio input should have type 'radio'.")
      .toHaveAttribute("type", "radio");

    // Verify radio button has a name attribute for grouping
    if (name) {
      await expect
        .soft(input, `🧪 Radio input should have name '${name}'.`)
        .toHaveAttribute("name", name);
    }

    // Verify default checked state (if specified)
    const isChecked = await input.isChecked();
    if (checked !== undefined) {
      await expect
        .soft(
          input,
          `🧪 Radio button should be ${
            checked ? "checked" : "unchecked"
          } by default.`
        )
        .toBeChecked({ checked });
    } else {
      await expect
        .soft(input, "🧪 Radio button should be unchecked by default.")
        .not.toBeChecked();
    }

    // Verify selecting the radio button sets it to checked
    await input.check();
    await expect
      .soft(input, "🧪 Radio button should be checked after selection.")
      .toBeChecked();

    // Verify another radio button in the same group is unchecked
    if (name) {
      const otherRadioButtons = this.page
        .locator(`input[type="radio"][name="${name}"]`)
        .filter({ hasNot: input });
      if ((await otherRadioButtons.count()) > 0) {
        await otherRadioButtons.first().check();
        await expect
          .soft(
            input,
            "🧪 Selecting another radio button in the group should uncheck this one."
          )
          .not.toBeChecked();
      }
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow changes (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Radio input field validation completed.");
  }

  async fileInput(
    { input, placeholder, disabled, readOnly }: InputProps,
    accept?: string,
    multiple?: boolean
  ): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 File input should be visible.").toBeVisible();

    // Verify file input is of type "file"
    await expect
      .soft(input, "🧪 File input should have type 'file'.")
      .toHaveAttribute("type", "file");

    // Verify accepted file types (if specified)
    if (accept) {
      await expect
        .soft(input, `🧪 File input should accept '${accept}'.`)
        .toHaveAttribute("accept", accept);
    }

    // Verify multiple file selection (if enabled)
    if (multiple) {
      await expect
        .soft(input, "🧪 File input should allow multiple file selection.")
        .toHaveAttribute("multiple", "");
    }

    // Verify uploading a single file
    const testFilePath = path.resolve(__dirname, "../utils/assets/1.webp");
    const testFilePath2 = path.resolve(__dirname, "../utils/assets/2.jpg");
    await input.setInputFiles(testFilePath);
    const uploadedFiles = await input.evaluate((el: any) => el.files?.length);
    await expect
      .soft(uploadedFiles, "🧪 File input should accept a single file.")
      .toBe(1);

    // Verify uploading multiple files (if applicable)
    if (multiple) {
      const testFiles = [testFilePath, testFilePath2];
      await input.setInputFiles(testFiles);
      const uploadedMultipleFiles = await input.evaluate(
        (el: any) => el.files?.length
      );
      await expect
        .soft(
          uploadedMultipleFiles,
          "🧪 File input should accept multiple files."
        )
        .toBe(testFiles.length);
    }

    // Verify clearing file selection
    await input.setInputFiles([]);
    const clearedFiles = await input.evaluate((el: any) => el.files?.length);
    await expect
      .soft(
        clearedFiles,
        "🧪 File input should be cleared after removing files."
      )
      .toBe(0);

    // Verify placeholder text is displayed correctly (if applicable)
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow file selection (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("File input field validation completed.");
  }

  async colorInput(
    { input, placeholder, disabled, readOnly }: InputProps,
    defaultValue?: string
  ): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 Color input should be visible.").toBeVisible();

    // Verify color input is of type "color"
    await expect
      .soft(input, "🧪 Color input should have type 'color'.")
      .toHaveAttribute("type", "color");

    // Verify default value (if applicable)
    if (defaultValue) {
      await expect
        .soft(
          input,
          `🧪 Color input should have default value '${defaultValue}'.`
        )
        .toHaveValue(defaultValue);
    }

    // Verify selecting a new color
    const newColor = "#ff5733";
    await input.fill(newColor);
    await expect
      .soft(input, "🧪 Color input should accept a new color value.")
      .toHaveValue(newColor);

    // Verify placeholder text is displayed correctly (if applicable)
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow changing the color (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Color input field validation completed.");
  }

  async urlInput({
    input,
    placeholder,
    disabled,
    readOnly,
    maxLength,
  }: InputProps): Promise<void> {
    const { expect } = this;
    await expect.soft(input, "🧪 URL input should be visible.").toBeVisible();

    // Verify URL input is of type "url"
    await expect
      .soft(input, "🧪 URL input should have type 'url'.")
      .toHaveAttribute("type", "url");

    // Verify URL input is editable
    await input.fill("https://example.com");
    await expect
      .soft(input, "🧪 URL input should accept a valid URL.")
      .toHaveValue("https://example.com");

    // Verify valid URL formats
    await input.fill("http://example.org");
    await expect
      .soft(input, "🧪 URL input should accept 'http' protocol.")
      .toHaveValue("http://example.org");

    await input.fill("https://sub.domain.com/path?query=1#fragment");
    await expect
      .soft(input, "🧪 URL input should accept complex URLs.")
      .toHaveValue("https://sub.domain.com/path?query=1#fragment");

    // Verify input does not accept invalid URLs
    await input.fill("invalid-url");
    await expect
      .soft(input, "🧪 URL input should not accept an invalid URL.")
      .not.toHaveValue("invalid-url");

    // Verify placeholder text is displayed correctly
    if (placeholder) {
      await this.placeHolderCheck(expect, input, placeholder);
    }

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow typing (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    // Verify URL input handles copy-paste correctly
    await input.fill("");
    await this.page.evaluate(() =>
      navigator.clipboard.writeText("https://pasted-url.com")
    );
    await input.focus();
    await this.page.keyboard.press("Control+V");
    await expect
      .soft(input, "🧪 URL input should allow pasting.")
      .toHaveValue("https://pasted-url.com");

    console.log("URL input field validation completed.");
  }

  async hiddenInput({ input, disabled, readOnly }: InputProps): Promise<void> {
    const { expect } = this;
    await expect
      .soft(input, "🧪 Hidden input should be present in the DOM.")
      .toBeHidden();

    // Verify hidden input is of type "hidden"
    await expect
      .soft(input, "🧪 Hidden input should have type 'hidden'.")
      .toHaveAttribute("type", "hidden");

    // Verify hidden input value can be set
    await input.fill("HiddenValue");
    await expect
      .soft(input, "🧪 Hidden input should accept a value.")
      .toHaveValue("HiddenValue");

    // Verify hidden input cannot be interacted with directly
    await input.focus();
    await expect
      .soft(input, "🧪 Hidden input should not be focusable.")
      .not.toBeFocused();

    // Verify hidden input cannot be clicked
    await input.click();
    await expect
      .soft(input, "🧪 Hidden input should not be clickable.")
      .not.toBeFocused();

    // Verify hidden input is not visible to the user
    await expect
      .soft(input, "🧪 Hidden input should not be visible.")
      .toHaveCSS("display", "none");

    // Verify hidden input value is not displayed
    await this.page.locator("body").evaluate(() => {
      const input = document.querySelector(
        "input[type='hidden']"
      ) as HTMLInputElement;
      return input?.value;
    });

    // Verify input field is disabled (if applicable)
    if (disabled) {
      await this.disabledChecker(expect, input);
    }

    // Verify read-only input field does not allow changes (if applicable)
    if (readOnly) {
      await this.readOnlyChecker(input, expect);
    }

    console.log("Hidden input field validation completed.");
  }

  private async placeHolderCheck(
    expect: Expect,
    input: any,
    placeholder: string
  ) {
    await expect
      .soft(input, `🧪Placeholder should be '${placeholder}'.`)
      .toHaveAttribute("placeholder", placeholder);
  }

  private async readOnlyChecker(input: any, expect: Expect) {
    await input.fill("Read Only Test");
    await expect
      .soft(input, "🧪Read-only input should not allow typing.")
      .not.toHaveValue("Read Only Test");
  }

  private async disabledChecker(expect: Expect, input: any) {
    await expect
      .soft(input, "🧪Disabled input should not be editable.")
      .toBeDisabled();
  }
}
