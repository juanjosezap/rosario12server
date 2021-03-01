const PDFDocument = require("pdfkit");

module.exports = (data, date) => {
    const doc = new PDFDocument();
    daysOfWeek = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]

    doc.image("app/assets/pagina-12.jpg", 50, 60, {width: 100});

    doc.text("AGENCIA OFICIAL  PAGINA/12  ROSARIO/12", { align: 'right'});
    doc.moveDown(1);
    const dia = daysOfWeek[date.getDay()+1];
    const fecha = (date.getDate() + 1)  + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear();
    doc.text(`LISTADO CONFIRMACION AVISOS para ${dia} ${fecha}`, (x = 50));
    doc.moveDown(1);
    var page = -1;
    var edicionNacional = false;
    let yPos = doc.y;
    doc .text("MEDIDA", (x = 50), (y = yPos))
        .text("SUP.", (x = 130), (y = yPos))
        .text("DETALLE", (x = 160), (y = yPos))
        .text("OBSERVACIONES", (x = 300), (y = yPos))
        .text("NRO.", (x = 510), (y = yPos));
    doc.moveDown(1)
    .fontSize(10);
    var paginaAviso = -1;
    data.map(orden => {
        
        orden.avisos.forEach(element => {
          if(element.fecha.getDate() == date.getDate() && element.fecha.getMonth() == date.getMonth() && element.fecha.getFullYear() == date.getFullYear()) {
            paginaAviso = element.pagina;
          };
        }); 
        if (orden.medio == 'Pagina 12' && !edicionNacional) {
          doc.text('UBICACION: EDICION NACIONAL', (x = 50));
          doc.text("-----------------------------------------------");
          doc.moveDown(1)
          edicionNacional = true;
        }else if (page !== paginaAviso && !edicionNacional) {
          doc.text(`UBICACION: PAGINA ${paginaAviso}`, (x = 50) );
          doc.text("-----------------------------------------------");
          page = paginaAviso;
          doc.moveDown(1);
        };
        yPos = doc.y;
        var nombre = orden.nombre.substring(0, 25);
        if(orden.nombre.length > 25) nombre += "...";
        doc
          .text(`${orden.col}  Col. x ${orden.alto} Cm.`, (x = 50), (y = yPos))
          .text(`${orden.col * orden.alto}`, (x = 130), (y = yPos))
          .text(`${nombre}`, (x = 160), (y = yPos))
          .text(`${orden.notas}`, (x = 300), (y = yPos))
          .text(`${orden.nro}`, (x = 510), (y = yPos));
        doc.moveDown(1);
      });

    doc.end();

    return doc;
};