// Archivo de autenticacion para SANDO SYSTEMS
// Aqui manejo el login y registro de usuarios con Supabase

// Configuracion de Supabase
// Reemplaza estos valores con los de tu proyecto de Supabase
const SUPABASE_URL = 'https://ejuycmhqsktlrxllemny.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXljbWhxc2t0bHJ4bGxlbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMjc3OTcsImV4cCI6MjA3NDYwMzc5N30.jXDjQVogYwTtxegRWPs2hwwLSRgEBdvnXbrhLN5TUdQ';

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funcion para mostrar alertas
function showAlert(message, type = 'danger') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// Funcion para validar contraseña
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    if (!hasUpperCase) {
        return { valid: false, message: 'La contraseña debe tener al menos una mayuscula' };
    }

    if (!hasLowerCase) {
        return { valid: false, message: 'La contraseña debe tener al menos una minuscula' };
    }

    if (!hasNumbers) {
        return { valid: false, message: 'La contraseña debe tener al menos un numero' };
    }

    return { valid: true, message: 'Contraseña valida' };
}

// Funcion para mostrar fortaleza de contraseña
function updatePasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    if (!strengthDiv) return;

    const validation = validatePassword(password);

    if (password.length === 0) {
        strengthDiv.innerHTML = '';
        return;
    }

    let strength = 'weak';
    let strengthText = 'Debil';

    if (password.length >= 8 && validation.valid) {
        strength = 'strong';
        strengthText = 'Fuerte';
    } else if (password.length >= 6) {
        strength = 'medium';
        strengthText = 'Media';
    }

    strengthDiv.innerHTML = `<span class="strength-${strength}">Fortaleza: ${strengthText}</span>`;
}

// Event listener para el formulario de login
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');

    // Validacion de contraseña en tiempo real
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            updatePasswordStrength(this.value);
        });
    }

    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Intentar hacer login con Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    showAlert('Error al iniciar sesion: ' + error.message);
                    return;
                }

                // Login exitoso
                showAlert('¡Login exitoso! Redirigiendo...', 'success');

                // Guardar datos del usuario en localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('session', JSON.stringify(data.session));

                // Redirigir despues de 2 segundos
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);

            } catch (error) {
                showAlert('Error inesperado: ' + error.message);
            }
        });
    }

    // Manejar registro
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('phone').value;

            // Validar contraseñas
            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden');
                return;
            }

            // Validar fortaleza de contraseña
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                showAlert(passwordValidation.message);
                return;
            }

            try {
                // Crear usuario en Supabase
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone
                        }
                    }
                });

                if (error) {
                    showAlert('Error al crear cuenta: ' + error.message);
                    return;
                }

                // Registro exitoso
                showAlert('¡Cuenta creada exitosamente! Revisa tu email para confirmar la cuenta.', 'success');

                // Limpiar formulario
                registerForm.reset();
                document.getElementById('passwordStrength').innerHTML = '';

                // Redirigir al login despues de 3 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);

            } catch (error) {
                showAlert('Error inesperado: ' + error.message);
            }
        });
    }
});

// Funcion para cerrar sesion
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesion:', error);
            return;
        }

        // Limpiar datos locales
        localStorage.removeItem('user');
        localStorage.removeItem('session');

        // Redirigir al login
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Error inesperado al cerrar sesion:', error);
    }
}

// Funcion para verificar si el usuario esta logueado
function checkAuth() {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');

    if (!user || !session) {
        return false;
    }

    try {
        const userData = JSON.parse(user);
        const sessionData = JSON.parse(session);

        // Verificar si la sesion no ha expirado
        const now = new Date().getTime();
        const expiresAt = sessionData.expires_at * 1000;

        if (now > expiresAt) {
            // Sesion expirada
            localStorage.removeItem('user');
            localStorage.removeItem('session');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar autenticacion:', error);
        return false;
    }
}

// Funcion para obtener datos del usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
    }
}
