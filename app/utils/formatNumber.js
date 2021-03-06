module.exports = (inNumber) => {
    return Number(inNumber).toLocaleString("es-ES", {minimumFractionDigits: 2});
};