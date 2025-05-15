export function validateEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email.trim()) ? null : 'El correo no es válido.';
}

export function validateName(name, isName = true) {
  const regex = /^[^\d]+$/;
  const text = (isName) ? "nombre" : "apellido";
  if (!name.trim()) return `El ${text} es obligatorio.`;
  return regex.test(name.trim()) ? null : `El ${text} no puede contener números.`;
}

export function validatePasswordStrength(password) {
  return password.length >= 6 ? null : 'La contraseña debe tener al menos 6 caracteres.';
}

export function validatePasswordsMatch(password, confirmPassword) {
  return password === confirmPassword ? null : 'Las contraseñas no coinciden.';
}
