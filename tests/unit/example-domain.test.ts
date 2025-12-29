import { modificarUsuario } from "@/usuarios/domain/administrarUsuarios";
import { Usuario } from "@/usuarios/domain/model"
import { describe, expect, test } from "vitest"

describe.skip('usuarios', () => {
    test('usuario tiene nombre apellido y email', () => {
        const usuario: Usuario = {
            apellido: 'duran',
            nombre: 'esteban',
            email: 'esteban.duran@gmail.com'
        }
        const nuevosDatos = {
            apellido: 'lopez',
            nombre: 'gabriel',
            email: 'newEmail@outlook.com'
        }

        modificarUsuario(usuario, nuevosDatos);

        expect(usuario).toEqual({ ...nuevosDatos, email: 'esteban.duran@gmail.com' });
    });
});