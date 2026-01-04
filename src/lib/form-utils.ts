export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  // Keep only digits and leading +
  const cleaned = phone.trim();
  if (cleaned.startsWith("+")) {
    return "+" + cleaned.slice(1).replace(/\D/g, "");
  }
  return cleaned.replace(/\D/g, "");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const cleaned = normalizePhone(phone);
  // Israeli phone: at least 9 digits
  return cleaned.replace(/\D/g, "").length >= 9;
}

export function validateBirthYear(year: number): boolean {
  return year >= 1940 && year <= 2010;
}
