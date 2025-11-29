

# **Biblioteca Digital – Backend**

Backend desarrollado en **Node.js + Express + MongoDB** para gestionar:

* Usuarios
* Libros
* Reservas
* Historial de préstamos
* Autenticación JWT
* Sistema de permisos dinámicos
* Soft Delete
* Filtros y paginación

---

## **Tecnologías**

* Node.js
* Express.js
* MongoDB / Azure Cosmos DB (API Mongo)
* JSON Web Tokens (JWT)
* bcryptjs
* Mongoose

---

# **Estructura del proyecto**

```
src/
 ├── config/
 │    └── db.js
 ├── controllers/
 │    ├── usuarioController.js
 │    ├── libroController.js
 │    └── reservaController.js
 ├── middleware/
 │    └── auth.js
 ├── models/
 │    ├── usuarioModel.js
 │    ├── libroModel.js
 │    └── reservaModel.js
 └── routes/
      ├── usuarioRoutes.js
      ├── libroRoutes.js
      └── reservaRoutes.js

app.js
server.js
.gitignore
.env
```

---

# **Autenticación**

La app usa **JWT**.
Para iniciar sesión el usuario recibe:

```json
{
  "token": "xxxx.yyyy.zzzz",
  "usuario": { ... }
}
```

Para acceder a cualquier endpoint protegido:

```
Authorization: Bearer TU_TOKEN
```

---

##  **ENDPOINTS DE USUARIO**

### Crear usuario (NO requiere autenticación)

```
POST /api/usuarios
```

---

### Login

```
POST /api/usuarios/login
```

---

### Obtener perfil (requiere token)

```
GET /api/usuarios/perfil
```

---

### Actualizar usuario

```
PUT /api/usuarios/:id
```

Solo él mismo o un usuario con
`permisos.modificar_usuarios === true`

---

### Historial de reservas del usuario

```
GET /api/usuarios/:id/historial
```

* El usuario solo puede ver su propio historial
* Un usuario con `modificar_usuarios` puede ver cualquier historial

---

## **ENDPOINTS DE LIBROS**

### Crear libro (requiere permisos)

```
POST /api/libros
```

Requiere:

```
permisos.crear_libros === true
```

---

### Obtener libro por ID (público)

```
GET /api/libros/:id
```

Excluye libros inhabilitados.

---

### Obtener libros con filtros (público)

```
GET /api/libros
```

### Actualizar libro (requiere permisos)

```
PUT /api/libros/:id
```

### Historial de reservas de un libro (requiere login)

```
GET /api/libros/:id/historial
```

---

###  Soft delete libro

```
DELETE /api/libros/:id
```

---

## **ENDPOINTS DE RESERVAS**

### Crear reserva

```
POST /api/reservas
```

Cualquier usuario autenticado puede reservar un libro.

---

### Devolver libro

```
PUT /api/reservas/devolver/:id
```

* Cierra la reserva
* Marca libro como disponible

---

### Historial de reservas del usuario

```
GET /api/usuarios/:id/historial
```

### ✔ Historial de reservas del libro

```
GET /api/libros/:id/historial
```

### ✔ Obtener mis reservas

```
GET /api/reservas/mis-reservas
```

---

### Obtener TODAS las reservas (requiere permisos de admin)

```
GET /api/reservas
```

---

# **Soft Delete**

### Usuarios

```
DELETE /api/usuarios/:id
```

### Libros

```
DELETE /api/libros/:id
```

PD: profe gg materia easy.

