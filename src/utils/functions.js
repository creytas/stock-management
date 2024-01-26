import ExcelJS from "exceljs";

const exportToXLSX = () => {
  const today = new Date().toLocaleDateString().replace(/\//g, "-");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`DailyInvoices_${today}`);
  worksheet.columns = [
    { header: "Date", key: "invoiceDate", width: 20 },
    { header: "Invoice Id", key: "invoiceId", width: 20 },
    { header: "Articles", key: "articles", width: 40 },
    { header: "Tax Rate", key: "taxRate", width: 15 },
    { header: "Discount", key: "discount", width: 15 },
    { header: "Total", key: "total", width: 15 },
  ];

  dailyInvoices.forEach((invoice) => {
    worksheet.addRow(invoice);
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "daily_invoices");
  });
};

export { exportToXLSX };
