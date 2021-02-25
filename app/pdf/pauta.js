const PDFDocument = require("pdfkit");

module.exports = (data, date) => {
    const doc = new PDFDocument();
    daysOfWeek = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]

    doc.image("app/assets/pagina-12.jpg", 70, 60, {width: 100});

    doc.text("AGENCIA OFICIAL  PAGINA/12  ROSARIO/12", { align: 'right'});
    doc.moveDown(1);
    const dia = daysOfWeek[date.getDay()];
    const fecha = (date.getDate() + 1)  + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear();
    doc.text(`LISTADO CONFIRMACION AVISOS para ${dia} ${fecha}`);
    doc.moveDown(1);
    let yPos = doc.y;
    doc .text("PAGINA", (x = 50), (y = yPos))
        .text("MEDIDA", (x = 100), (y = yPos))
        .text("SUPERFICIE", (x = 200), (y = yPos))
        .text("DETALLE", (x = 280), (y = yPos))
        .text("OBSERVACIONES", (x = 390), (y = yPos))
        .text("NRO.", (x = 510), (y = yPos));
    doc.moveDown(1);
    data.map(orden => {
        yPos = doc.y;
        doc
          .fontSize(10)
          .text(orden.avisos[0].pagina, (x = 50), (y = yPos))
          .text(`${orden.col}  Col. x ${orden.alto} Cm.`, (x = 100), (y = yPos))
          .text(`${orden.col * orden.alto}`, (x = 200), (y = yPos))
          .text(`${orden.nombre}`, (x = 280), (y = yPos))
          .text(`${orden.notas}`, (x = 390), (y = yPos))
          .text(`${orden.nro}`, (x = 510), (y = yPos));
        doc.moveDown(1);
      });

    doc.end();

    return doc;
};