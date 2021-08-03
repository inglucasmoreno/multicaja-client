// Modelo - Usuario
export class Usuario {
    constructor(
        public uid: string,
        public usuario: string,
        public apellido: string,
        public nombre: string,
        public email: string,
        public role?: string,
        public activo?: boolean,
        public password?: string,
        public createdAt?: string        
    ){}    
}