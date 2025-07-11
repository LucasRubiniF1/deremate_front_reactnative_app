export function validateEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email.trim()) ? null : 'El correo no es válido.';
}

export function validateName(name, isName = true) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
  const text = isName ? 'nombre' : 'apellido';

  if (!name.trim()) return `El ${text} es obligatorio.`;

  return regex.test(name.trim()) ? null : `El ${text} no puede contener números ni símbolos.`;
}

export function validatePasswordStrength(password) {
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasMinLength || !hasUppercase || !hasNumber) {
    return 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número';
  }

  return null;
}

export function validatePasswordsMatch(password, confirmPassword) {
  return password === confirmPassword ? null : 'Las contraseñas no coinciden.';
}
