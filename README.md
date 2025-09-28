# SANDO SYSTEMS - Sistema de Login

Este es un sistema de autenticacion completo para SANDO SYSTEMS con base de datos y despliegue en produccion.

## 🚀 Caracteristicas

- ✅ Login y registro de usuarios
- ✅ Base de datos con Supabase (gratuita)
- ✅ Validacion de contraseñas
- ✅ Dashboard de usuario
- ✅ Despliegue en Vercel
- ✅ Responsive design con Bootstrap

## 📋 Configuracion Paso a Paso

### 1. Configurar Supabase (Base de Datos Gratuita)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Ve a Settings > API
5. Copia la URL y la clave anonima

### 2. Configurar las Credenciales

1. Abre el archivo `js/auth.js`
2. Reemplaza estas lineas:
```javascript
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';
```
3. Con tus credenciales reales de Supabase

### 3. Configurar Supabase para Autenticacion

1. En tu proyecto de Supabase, ve a Authentication > Settings
2. En "Site URL" pon: `https://tu-proyecto.vercel.app`
3. En "Redirect URLs" añade: `https://tu-proyecto.vercel.app/dashboard.html`

### 4. Desplegar en Vercel

#### Opcion A: Desde GitHub (Recomendado)
1. Sube tu codigo a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu cuenta de GitHub
4. Importa tu repositorio
5. Vercel detectara automaticamente que es un proyecto estatico
6. Haz clic en "Deploy"

#### Opcion B: Desde Vercel CLI
1. Instala Vercel CLI: `npm i -g vercel`
2. En tu carpeta del proyecto ejecuta: `vercel`
3. Sigue las instrucciones

### 5. Configurar Variables de Entorno (Opcional)

Si quieres usar variables de entorno:
1. En Vercel, ve a tu proyecto > Settings > Environment Variables
2. Añade:
   - `SUPABASE_URL`: tu URL de Supabase
   - `SUPABASE_ANON_KEY`: tu clave anonima

## 📁 Estructura del Proyecto

```
donnats/
├── index.html          # Pagina principal
├── login.html          # Pagina de login
├── register.html       # Pagina de registro
├── dashboard.html      # Dashboard de usuario
├── js/
│   └── auth.js        # Logica de autenticacion
├── img/               # Imagenes
├── bootstrap-5.3.8-dist/
└── vercel.json        # Configuracion de Vercel
```

## 🔧 Funcionalidades

### Login
- Validacion de email y contraseña
- Manejo de errores
- Redireccion al dashboard

### Registro
- Validacion de contraseña fuerte
- Confirmacion de contraseña
- Campos opcionales (telefono)
- Verificacion por email

### Dashboard
- Informacion del usuario
- Estadisticas
- Servicios disponibles
- Acciones rapidas
- Cerrar sesion

## 🎨 Personalizacion

### Colores
Los colores principales estan definidos en `styles.css`:
- Morado: `#7c3aed`
- Azul: `#3b82f6`

### Estilos
Todos los estilos estan en archivos CSS separados para facil mantenimiento.

## 🚨 Solucion de Problemas

### Error de CORS
Si tienes problemas de CORS, verifica que las URLs en Supabase esten configuradas correctamente.

### Error de Autenticacion
Verifica que las credenciales de Supabase esten correctas en `auth.js`.

### Error de Despliegue
Asegurate de que todos los archivos esten en la raiz del proyecto.

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola del navegador (F12)
2. Revisa la configuracion de Supabase
3. Verifica las URLs en Vercel

## 🎯 Próximos Pasos

- [ ] Añadir recuperacion de contraseña
- [ ] Implementar roles de usuario
- [ ] Añadir notificaciones
- [ ] Crear API para servicios
- [ ] Añadir chat en vivo

---

**¡Listo para desplegar!** 🚀

Sigue estos pasos y tendras un sistema de login funcionando en produccion con base de datos gratuita.
