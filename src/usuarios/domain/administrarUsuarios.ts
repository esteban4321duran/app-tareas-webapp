import { Usuario } from "@/usuarios/domain/model";

export function modificarUsuario(
    usuario: Usuario,
    nuevosDatos: { nombre: string, apellido: string }): Usuario {

    usuario.apellido = nuevosDatos.apellido;
    usuario.nombre = nuevosDatos.nombre;

    return usuario;
}