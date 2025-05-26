const mongoose = require("mongoose");
const { Schema } = mongoose;

const LoanDetailSchema = new Schema({
  libro: { type: Schema.Types.ObjectId, ref: "Books", required: true },
  titulo_libro: { type: String, required: true }, 
});

const LoanSchema = new Schema({
  fecha_prestamo: { type: Date, default: Date.now },
  fecha_devolucion: { type: Date, required: true },
  usuario: { type:String, required: true },
  estado_prestamo: { type: String, enum: ["activo", "finalizado", "vencido"], default: "activo" },
  detalles: [LoanDetailSchema] 
});

module.exports = mongoose.model("Loans", LoanSchema);
