const PDFDocument = require("pdfkit");

module.exports = (data) => {
    const doc = new PDFDocument();
        
    doc.image("app/assets/pagina-12.jpg", 70, 60, {width: 100});
    doc.text("AGENCIA OFICIAL  PAGINA/12  ROSARIO/12", { align: 'right'});
    doc.moveDown(1);
    const fecha = data.createdAt.getDate() + '/' + (data.createdAt.getMonth() + 1).toString().padStart(2, '0') + '/' +  data.createdAt.getFullYear();
    doc.text(`ORDEN DE PUBLICIDAD No. ${data.nro}                                                                   ${fecha}`);
    doc.moveDown(1);
    doc.text(`Sres. de ${data.client.nombre} Rogamos se sirvan publicar por nuestra cuenta y orden los siguientes avisos:`);
    doc.moveDown(1);
    doc.text(`CLIENTE  : ${data.client.nombre}`);
    doc.text(`DOMICILIO: ${data.client.dir}`);
    doc.text(`TELEFONOS: ${data.client.tel}`);
    doc.text(`CUIT     : ${data.client.cuit}                              IVA: ${data.client.iva}`);
    doc.moveDown(1);
    doc.text(`PRODUCTO : ${data.nombre}`);
    doc.text(`MEDIO    : ${data.medio}`);
    doc.text(`MEDIDA   : ${data.col},0 Col. x   ${data.alto},0 Cm.`);
    const totalCmXCol = data.col * data.alto;
    doc.text(`CANTIDAD DE AVISOS:  ${data.avisos.length}           TOTAL Cm. x Col.:  ${totalCmXCol}`);
    doc.text(`TARIFA   : $ ${data.tarifa}`);
    doc.moveDown(1);
    doc.text("FECHAS DE PUBLICACION:");
    data.avisos.map(function(aviso){
        let fechaAviso = aviso.fecha.getDate() + '/' + (aviso.fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +  aviso.fecha.getFullYear();
        let pagina =  aviso.pagina !== null ? `PAGINA ${aviso.pagina}` : "";
        doc.text(`${fechaAviso}     ${pagina}`);
    });
    doc.moveDown(1);
    const total = data.col * data.alto * data.tarifa;
    const color = data.color ? "Y COLOR INCLUIDOS" : "INCLUIDO";
    doc.text(`*TOTAL A FACTURAR: $${total} - IVA ${color}`);
    doc.end();

    return doc;
};