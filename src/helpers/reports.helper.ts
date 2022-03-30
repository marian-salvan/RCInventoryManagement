import { InventoryReport, PacakagesReport } from "../models/reports.models";

const dowloadReport = (tableId: string, 
                       inventoryReport: InventoryReport | null, 
                       packagesReport: PacakagesReport | null,
                       category: string | null) => {
    var XLSX = require("xlsx");
    var workbook = XLSX.utils.book_new();

    var sheet1 = XLSX.utils.table_to_sheet(document.getElementById(tableId));
    XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");

    delete (sheet1['H1']);
    delete (sheet1['I1']);

    const avgQty = packagesReport && packagesReport.packages.quantity > 0 && packagesReport.packages.totalPackages > 0 ?
                  (Math.round((packagesReport.packages.quantity / packagesReport.packages.totalPackages) * 100) / 100).toFixed(2) :
                  "0.00";

    var sheet2 = XLSX.utils.aoa_to_sheet([
      ["Data de început", inventoryReport?.fromDate.toDate().toLocaleDateString()],
      ["Data de final", inventoryReport?.toDate ? inventoryReport?.toDate.toDate().toLocaleDateString() : (new Date()).toLocaleDateString()],
      ["Total pachete", packagesReport?.packages.totalPackages],
      ["Cantitate pachete (KG)", packagesReport?.packages.quantity],
      ["Cantitatea medie per pachet (KG)", avgQty]
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet2, "Sheet2");

    const workbookTitle = category ? `${inventoryReport?.name}_${category}.xlsx` :
                                     `${inventoryReport?.name}.xlsx`

    XLSX.writeFile(workbook, workbookTitle);
}

export { dowloadReport };