export default ({
  // MENU
  menu: {
    Recibos: "Recibos",
    Polizas: "Polizas",
    Clientes: "Clientes",
    Siniestros: "Siniestros",
    Usuarios: "Usuarios",
    Registros: "Registros"
  },
  // BASE DATOS
  db: {
    Usuario: "Usuario",
    Nombre: "Nombre",
    Correo: "Correo",
    Oficina: "Oficina",
    AClientes: "Acceso Clientes",
    ARecibos: "Acceso Recibos",
    APolizas: "Acceso Polizas",
    ASiniestros: "Acceso Siniestros",
    AUsuarios: "Acceso Usuarios",
    Filtro: "Filtro",
    SM: "SubMediador",
    Mensajes: "Mensajes",
    // RECIBOS
    Estado: "Estado",
    FechaEfecto: "Fecha Efecto",
    Gestion: "Gestión",
    FechaGestion: "Fecha Gestion",
    NombreTomador: "Nombre",
    CodigoPoliza: "Poliza",
    Importe: "Importe",
    Cobrado: "Cobrado",
    CodigoRecibo: "Recibo",
    CodigoRamo: "Ramo",
    Situacion: "Fecha Situación",
    CodigoMediador: "Mediador",
    CodigoGestor: "Gestor",
    FechaVencimiento: "Fecha Vencimiento",
    ImporteBonificacion: "Importe Bonificación",
    ImporteNeto: "Importe Neto",
    FormaPago: "Forma Pago",
    CIA: "Compañia",
    BitManual: "Bit Manual",
    // POLIZAS
    FechaAlta: "Fecha Alta",
    FechaBaja: "Fecha Baja",
    FechaVencimientoSuplemento: "Fecha Vencimiento",
    Documento: "NIF",
    Apellidos: "Apellidos",
    Nombre: "Nombre",
    Ramo: "Ramo",
    Modalidad: "Modalidad",
    CodigoModelo: "Modelo",
    Matricula: "Matrícula",
    SubCodigoMediador: "SM",
    TipoInformacion: "Tipo",
    // CONFIGURACION
    DiasUrgentes: "Días Urgentes",
    Oficina: "Oficina",
    ActRecibos: "Fecha Act. Recibos",
    ActPolizas: "Fecha Act. Polizas",
    // CLIENTES
    NombreCompleto: "Nombre Completo",
    Correo: "Correo",
    Telefono: "Teléfono",
    Direccion: "Dirección",
    Ciudad: "Ciudad",
    Provincia: "Provincia",
    CP: "CP",
    NIF: "NIF",
    CuentaCorriente: "Cuenta Corriente",
    Tipo: "Tipo",
    Aviso: "Aviso",
    Idioma: "Idioma",
    // RECIBOS GESTION
    FechaGestion: "Fecha Gestión",
    Cliente: "Cliente",
    Comentarios: "Comentarios",
    FechaAviso: "Fecha Aviso",
    Fecha: "Fecha",
    Operacion: "Operacion"
  },
  // GESTION
  gestion: [{
    value: "PEPE",
    label: "PENDIENTE (Pendiente)"
  }, {
    value: "PEAS",
    label: "PENDIENTE (Asesoría)"
  }, {
    value: "PERJ",
    label: "PENDIENTE (RJ)"
  }, {
    value: "COME",
    label: "COBRADO (Metálico)"
  }, {
    value: "COTA",
    label: "COBRADO (Tarjeta)"
  }, {
    value: "COTR",
    label: "COBRADO (Transferencia)"
  }, {
    value: "COBA",
    label: "COBRADO (Banco)"
  }, {
    value: "ANAJ",
    label: "ANULADO (Ajuste)"
  }, {
    value: "ANBA",
    label: "ANULADO (Baja)"
  }],
  // ESTADOS
  estados: [{
    value: "PENDIENTE",
    label: "PENDIENTE"
  }, {
    value: "DEVUELTO",
    label: "DEVUELTO"
  }, {
    value: "COBRADO",
    label: "COBRADO"
  }, {
    value: "ANULADO",
    label: "ANULADO"
  }, {
    value: "EMITIDO",
    label: "EMITIDO"
  }],
  // FILTER BY USER
  userby: [{
    value: "NombreTomador",
    label: "Cliente"
  }, {
    value: "CodigoRecibo",
    label: "Recibo"
  }, {
    value: "CodigoPoliza",
    label: "Poliza"
  },],
  ayuda: ["Recibos sin tratamiento", "Recibos Pendientes y en curso", "Recibos anulados por Reale u Oficina", "Recibos cobrados por Reale u Oficina", "Recibos Urgentes con más de 25 días sin resolver", "Recibos que tienen un error de gestión"],
  // PAGINA PRINCIPAL
  InicioSesion: "Inicio de sesión",
  Usuario: "Usuario",
  Clave: "Clave",
  UsuarioClaveIncorrecta: "Usuario o clave incorrecta",
  Bienvenido: "Bienvenid@ ",
  Desconectado: "Desconectado correctamente",
  ErrorRed: "Error de Red",
  CerrarSesion: "Cerrar Sesion",
  // GENERAL
  NuevoRecibo: "Nuevo Recibo",
  EliminarRecibo: "Eliminar Recibo",
  NuevaGestion: "Nueva Gestión",
  EditarGestion: "Editar",
  EliminarGestion: "Eliminar Gestión",
  EliminarGestionT: "Eliminar gestión del recibo",
  FiltroRapido: "Filtro Rápido",
  FiltrosDeEstado: "Filtros de Estado",
  HistorialUsuario: "Historial de recibos por:",
  TodosLosRegistrosT: "Por defecto se filtran los últimos 13 meses",
  TodosLosRegistros: "Mostrar Todos los Recibos",
  Gestion: "Gestión",
  Altas: "Altas",
  Bajas: "Bajas",
  BajasPendientes: "Bajas pendientes",
  ano: "Año",
  mes: "Mes",
  semana: "Semana",
  Liquidacion: "Liquidación",
  SinAutorizacion: "Sin Autorización",
  //REGISTROS
  Nuevo: "Nuevo",
  Editar: "Editar",
  Guardar: "Guardar",
  Cerrar: "Cerrar",
  DatosGuardados: "Datos Guardados",
  ErrorOperacion: "Error en la operación",
  EliminarRegistro: "¿Desea eliminar este registro?",
  CampoObligatorio: "Campo obligatorio"
});