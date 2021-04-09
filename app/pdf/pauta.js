const PDFDocument = require("pdfkit");
const { order } = require("../models");
const formatNumber = require('../utils/formatNumber');

module.exports = (data, date) => {
    const doc = new PDFDocument();
    daysOfWeek = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
    const breakPointNombre = 35;
    const breakPointNota = 22;
    doc.image("app/assets/pagina-12.jpg", 50, 60, {width: 100});

    doc.text("AGENCIA OFICIAL  PAGINA/12  ROSARIO/12", { align: 'right'});
    doc.moveDown(1);
    const dia = daysOfWeek[date.getDay()];
    const fecha = (date.getDate()).toString().padStart(2, '0')  + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear();
    doc.text(`LISTADO CONFIRMACION AVISOS para ${dia} ${fecha}`, (x = 50));
    doc.moveDown(1);
    var page = -1;
    var edicionNacional = false;
    let yPos = doc.y;
    doc .text("MEDIDA", (x = 50), (y = yPos))
        .text("SUP.", (x = 120), (y = yPos))
        .text("DETALLE", (x = 160), (y = yPos))
        .text("OBSERVACIONES", (x = 350), (y = yPos))
        .text("NRO.", (x = 510), (y = yPos));
    doc.moveDown(1)
    .fontSize(10);
    var paginaAviso = -1;
    var orderslist = [];
    data.map(orden => {
        
        var nombreOrdenAlternativo = '';
        orden.avisos.forEach(element => {
          if(element.fecha.getDate() == date.getDate() && element.fecha.getMonth() == date.getMonth() && element.fecha.getFullYear() == date.getFullYear()) {
            paginaAviso = element.pagina;
            nombreOrdenAlternativo = element.nombre ?? "";
          };
        }); 
        
        var nombre = nombreOrdenAlternativo.length > 0 ? nombreOrdenAlternativo : orden.nombre;
        nombre = nombre.substring(0, breakPointNombre);
        if(nombre.length > breakPointNombre) nombre += "...";
        var nota = orden.notas.substring(0, breakPointNota);
        if(orden.notas.length > breakPointNota) nota += "...";
        
        orderslist.push({
          nombre: nombre,
          notas: nota,
          medio: orden.medio,
          paginaAviso: paginaAviso,
          col: orden.col,
          alto: orden.alto,
          nro: orden.nro,
        });
      });

    orderslist.sort((a, b) => b.medio.localeCompare(a.medio) || a.paginaAviso - b.paginaAviso).map(orden => {
      if (orden.medio == 'Pagina 12' && !edicionNacional) {
        doc.text('UBICACION: EDICION NACIONAL', (x = 50));
        doc.text("-----------------------------------------------");
        doc.moveDown(1)
        edicionNacional = true;
      }else if (page !== orden.paginaAviso && !edicionNacional) {
        doc.text(`UBICACION: PAGINA ${orden.paginaAviso}`, (x = 50) );
        doc.text("-----------------------------------------------");
        page = orden.paginaAviso;
        doc.moveDown(1);
      };

      yPos = doc.y;
      doc
          .text(`${orden.col}  Col. x ${orden.alto} Cm.`, (x = 50), (y = yPos))
          .text(` ${formatNumber(orden.col * orden.alto)}`, (x = 120), (y = yPos))
          .text(`${orden.nombre}`, (x = 160), (y = yPos))
          .text(`${orden.notas}`, (x = 350), (y = yPos))
          .text(`${orden.nro}`, (x = 510), (y = yPos));
        doc.moveDown(1);
    });

    doc.end();

    return doc;
};