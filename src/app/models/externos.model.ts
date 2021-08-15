// Modelo - Externos
export class Externo {
    constructor(
        public _id: string,
        public descripcion: string,
        public telefono: string,
        public direccion: string,
        public dni_cuit: string,
        public activo?: boolean,
        public createdAt?: string        
    ){}    
}