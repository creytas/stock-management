import ExcelJS from "exceljs";

const exportToXLSX = (data, title) => {
  const today = new Date().toLocaleDateString().replace(/\//g, "-");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
    `${
      title === "DailyInvoices"
        ? `DailyInvoices_${today}`
        : `Invoice_${invoiceId}`
    }`
  );
  worksheet.columns = [
    { header: "Date", key: "invoiceDate", width: 20 },
    { header: "Invoice Id", key: "invoiceId", width: 20 },
    { header: "Fournisseur", key: "supplier", width: 40 },
    { header: "Client", key: "customer", width: 40 },
    { header: "Articles", key: "articles", width: 40 },
    { header: "Tax Rate", key: "taxRate", width: 15 },
    { header: "Discount", key: "discount", width: 15 },
    { header: "Sous-Total", key: "subTotal", width: 15 },
    { header: "Total", key: "total", width: 15 },
  ];

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "daily_invoices");
  });
};

export { exportToXLSX };
