!function (e, a) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = a() : "function" == typeof define && define.amd ? define(a) : ((e = e || self).Quasar = e.Quasar || {},
    e.Quasar.lang = e.Quasar.lang || {},
    e.Quasar.lang.es = a())
}(this, function () {
  "use strict";
  return {
    isoName: "es",
    nativeName: "Español",
    label: {
      clear: "Borrar",
      ok: "OK",
      cancel: "Cancelar",
      close: "Cerrar",
      set: "Establecer",
      select: "Seleccionar",
      reset: "Restablecer",
      remove: "Eliminar",
      update: "Actualizar",
      create: "Crear",
      search: "Buscar",
      filter: "Filtrar",
      refresh: "Actualizar"
    },
    date: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1,
      format24h: !0
    },
    table: {
      noData: "Sin datos disponibles",
      noResults: "No se encontraron resultados",
      loading: "Cargando...",
      selectedRecords: function (e) {
        return e > 1 ? e + " filas seleccionadas." : (0 === e ? "Sin" : "1") + " fila seleccionada."
      },
      recordsPerPage: "Filas por página:",
      allRows: "Todas",
      pagination: function (e, a, r) {
        return e + "-" + a + " de " + r
      },
      columns: "Columnas"
    },
    editor: {
      url: "URL",
      bold: "Negrita",
      italic: "Itálico",
      strikethrough: "Tachado",
      underline: "Subrayado",
      unorderedList: "Lista Desordenada",
      orderedList: "Lista Ordenada",
      subscript: "Subíndice",
      superscript: "Superíndice",
      hyperlink: "Hipervínculo",
      toggleFullscreen: "Alternar pantalla completa",
      quote: "Cita",
      left: "Alineación izquierda",
      center: "Alineación centro",
      right: "Alineación derecha",
      justify: "Justificar alineación",
      print: "Imprimir",
      outdent: "Disminuir indentación",
      indent: "Aumentar indentación",
      removeFormat: "Eliminar formato",
      formatting: "Formato",
      fontSize: "Tamaño de Fuente",
      align: "Alinear",
      hr: "Insertar línea horizontal",
      undo: "Deshacer",
      redo: "Rehacer",
      header1: "Encabezado 1",
      header2: "Encabezado 2",
      header3: "Encabezado 3",
      header4: "Encabezado 4",
      header5: "Encabezado 5",
      header6: "Encabezado 6",
      paragraph: "Párrafo",
      code: "Código",
      size1: "Muy pequeño",
      size2: "Pequeño",
      size3: "Normal",
      size4: "Mediano",
      size5: "Grande",
      size6: "Muy grande",
      size7: "Máximo",
      defaultFont: "Fuente por defecto"
    },
    tree: {
      noNodes: "Sin nodos disponibles",
      noResults: "No se encontraron nodos correspondientes",
    },
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
  }

});