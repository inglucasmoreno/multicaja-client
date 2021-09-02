// Modelo - Cheque
export class Cheque {
    constructor(
        public _id: string,
        public nro_cheque: string,
        public concepto: string,
        public emisor: string,
        public cuit: string,
        public cliente: string,
        public destino: string,
        public importe: number,
        public activo?: boolean,
        public createdAt?: string        
    ){}    
}