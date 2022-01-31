// Modelo - Usuario Online
export class UsuarioOnline {
    constructor(
        public uid: string,
        public usuario: string,
        public nombre: string,
        public apellido: string,
        public role: string,
        public createdAt: Date
    ){}   
}