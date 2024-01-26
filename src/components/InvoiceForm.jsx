// components/InvoiceForm.js
import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import {
  MdOutlineAddShoppingCart,
  MdOutlineDeleteForever,
  MdOutlinePrint,
  MdOutlineDownloading,
} from "react-icons/md";
import { InvoiceDetail } from "./form/InvoiceDetail";
// import html2pdf from "html2pdf.js";

const InvoiceForm = () => {
  const generateInvoiceId = () => {
    const prefix = "PROFACT-";
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase(); // Génère une chaîne aléatoire de 6 caractères
    return prefix + randomPart;
  };

  const [invoiceId, setInvoiceId] = useState(generateInvoiceId());
  const today = new Date();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [dateTime, setDateTime] = useState(today);
  const [invoiceDate, setInvoiceDate] = useState(formatDate(today));
  const initialArticleState = { name: "", quantity: 1, price: 0 };
  const [articles, setArticles] = useState([initialArticleState]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isPrintButtonDisabled, setPrintButtonDisabled] = useState(true);
  const [isDeleteButtonHidden, setDeleteButtonHidden] = useState(false);
  const [dailyInvoices, setDailyInvoices] = useState([]);

  const handleShowInvoice = () => {
    const invoiceData = {
      invoiceDate: dateTime,
      invoiceId,
      articles,
      taxRate,
      discount,
      subTotal: articles.reduce(
        (acc, article) => acc + article.quantity * article.price,
        0
      ),
      total: calculateTotal(),
    };
    setDailyInvoices([...dailyInvoices, invoiceData]);
    alert("IMPRESSION REUSSIE...");
    resetFields();
  };

  const exportToXLSX = () => {
    const invoiceData = [
      {
        invoiceDate: dateTime,
        invoiceId,
        articles,
        taxRate,
        discount,
        subTotal: articles.reduce(
          (acc, article) => acc + article.quantity * article.price,
          0
        ),
        total: calculateTotal(),
      },
    ];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Invoice_${invoiceId}`);
    worksheet.columns = [
      { header: "Date", key: "invoiceDate", width: 20 },
      { header: "Invoice Id", key: "invoiceId", width: 20 },
      { header: "Articles", key: "articles", width: 40 },
      { header: "Tax Rate", key: "taxRate", width: 15 },
      { header: "Discount", key: "discount", width: 15 },
      { header: "Sous-Total", key: "subTotal", width: 15 },
      { header: "Total", key: "total", width: 15 },
    ];

    invoiceData.forEach((item) => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "invoice");
    });
  };
  //   const handlePrint = () => {
  //     const element = document.getElementById("invoice-form");
  //     html2pdf(element);
  //   };
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(today.getHours(), today.getMinutes(), today.getSeconds());
    setInvoiceDate(e.target.value);
    setDateTime(newDate);
  };

  const handleAddArticle = () => {
    setArticles([...articles, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveArticle = (index) => {
    const updatedArticles = [...articles];
    updatedArticles.splice(index, 1);
    setArticles(updatedArticles);
    setDeleteButtonHidden(updatedArticles.length === 1);
    const isAnyArticleNameEmpty = updatedArticles.some(
      (article) => article.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyArticleNameEmpty);
  };

  const handleArticleChange = (index, field, value) => {
    const updatedArticles = [...articles];
    updatedArticles[index][field] = value;
    setArticles(updatedArticles);
    const isAnyArticleNameEmpty = updatedArticles.some(
      (article) => article.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyArticleNameEmpty);
  };

  const calculateTotal = () => {
    const subtotal = articles.reduce(
      (acc, article) => acc + article.quantity * article.price,
      0
    );
    const totalBeforeTaxAndDiscount = subtotal * (1 - discount / 100);
    const total = totalBeforeTaxAndDiscount * (1 + taxRate / 100);
    return total.toFixed(2);
  };

  const formatNumberInput = (value) => {
    // Enlever les zéros à gauche des nombres entiers
    const formattedValue = value.replace(/^0+(?=\d)/, "");
    return formattedValue === "" ? "0" : formattedValue; // Éviter une chaîne vide
  };

  const validateNumberInput = (value) => {
    // Vérifiez si la valeur est un nombre positif
    return /^\d*\.?\d+$/.test(value) && parseFloat(value) >= 0;
  };

  const resetFields = () => {
    setInvoiceId(generateInvoiceId());
    setInvoiceDate(formatDate(today));
    setDateTime(today);
    setArticles([initialArticleState]);
    setTaxRate(0);
    setDiscount(0);
    setDeleteButtonHidden(true);
  };

  useEffect(() => {
    // Mettre à jour la validation du bouton d'impression
    const isAnyArticleNameEmpty = articles.some(
      (article) => article.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyArticleNameEmpty);
  }, [articles]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem(today, JSON.stringify(dailyInvoices));
  }, [dailyInvoices]);

  return (
    <div className="text-gray-500">
      <form id="invoice-form">
        {/* ... autres champs de la facture */}
        <div className="grid grid-cols-4 mb-4">
          <div className="h-[44px] flex items-center space-x-2">
            <label className="font-bold">ID</label>
            <input
              value={invoiceId}
              type="text"
              readOnly
              className="w-[80%] outline-none border rounded p-[3px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-bold">Date</label>
            <input
              value={invoiceDate}
              onChange={handleDateChange}
              type="date"
              className="w-[65%] outline-none border rounded py-1"
            />
          </div>
        </div>
        <div className="flex">
          <InvoiceDetail involved="Fournisseur" />
          <InvoiceDetail involved="Client" />
        </div>
        <div className="grid grid-cols-4 gap-4 p-2 border-x-2 border-t-2 border-blue-500 bg-blue-400 text-gray-200">
          <label className="font-bold">Nom de l'article</label>
          <label className="font-bold">Quantité</label>
          <label className="font-bold">Prix unitaire</label>
        </div>
        {articles.map((article, index) => (
          <div
            key={index}
            className={`input-row grid grid-cols-4 gap-4 h-[44px] p-2 ${
              index + 1 === articles.length ? "border-b-2" : "border-y-0"
            } border-x-2 border-blue-500`}
          >
            <input
              type="text"
              value={article.name}
              onChange={(e) =>
                handleArticleChange(index, "name", e.target.value)
              }
              placeholder="Nom de l'article"
              required
              className="outline-none"
            />
            <input
              type="text"
              value={article.quantity}
              onChange={(e) =>
                handleArticleChange(
                  index,
                  "quantity",
                  validateNumberInput(e.target.value)
                    ? formatNumberInput(e.target.value)
                    : article.quantity
                )
              }
              placeholder="Quantité"
              className="outline-none"
            />
            <input
              type="text"
              value={article.price}
              onChange={(e) =>
                handleArticleChange(
                  index,
                  "price",
                  validateNumberInput(e.target.value)
                    ? formatNumberInput(e.target.value)
                    : article.price
                )
              }
              placeholder="Prix unitaire"
              className="outline-none"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveArticle(index)}
                className="flex items-center justify-center font-semibold text-red-500 text-opacity-65 hover:text-opacity-100"
              >
                <MdOutlineDeleteForever />
                Retirer
              </button>
            )}
          </div>
        ))}
        <div className="w-full py-4 flex items-center justify-center">
          <button
            className="w-[74.5%] h-[42px] flex items-center justify-center my-2 py-1 border border-dashed border-gray-500 bg-gray-200 font-semibold text-gray-600  text-opacity-65 hover:text-opacity-100"
            type="button"
            onClick={handleAddArticle}
          >
            <MdOutlineAddShoppingCart />
            Ajouter un article
          </button>
        </div>

        {/* ... autres champs de la facture */}
        <div className="flex items-center space-x-2 my-4">
          <label className="font-bold">Taux de taxe (%)</label>
          <input
            type="text"
            value={taxRate}
            onChange={(e) =>
              setTaxRate(
                validateNumberInput(e.target.value)
                  ? formatNumberInput(e.target.value)
                  : taxRate
              )
            }
            placeholder="Taux de taxe"
            className="outline-none border rounded p-[3px]"
          />
        </div>
        <div className="flex items-center space-x-12 my-4">
          <label className="font-bold">Remise (%)</label>
          <input
            type="text"
            value={discount}
            onChange={(e) =>
              setDiscount(
                validateNumberInput(e.target.value)
                  ? formatNumberInput(e.target.value)
                  : discount
              )
            }
            placeholder="Remise"
            className="outline-none border rounded p-[3px]"
          />
        </div>
        <div className="mb-4">
          <strong className="font-medium italic">
            {`Sous-Total:
            ${articles
              .reduce(
                (acc, article) => acc + article.quantity * article.price,
                0
              )
              .toFixed(2)}
            CDF`}
          </strong>
        </div>
        <div>
          <strong>Total: {calculateTotal()} CDF</strong>
        </div>
      </form>
      <div className="w-full flex items-center space-x-4">
        <button
          onClick={handleShowInvoice}
          className={`flex items-center justify-center mr-4 my-8 p-2 font-semibold ${
            isPrintButtonDisabled
              ? "bg-gray-300 text-gray-600 text-opacity-75 cursor-not-allowed"
              : "bg-blue-500 bg-opacity-75 text-white hover:bg-opacity-100"
          }`}
          disabled={isPrintButtonDisabled}
        >
          <MdOutlinePrint />
          Imprimer Facture
        </button>
        <button
          onClick={exportToXLSX}
          className={`flex items-center justify-center mr-4 my-8 p-2 font-semibold ${
            isPrintButtonDisabled
              ? "bg-gray-300 text-gray-600 text-opacity-75 cursor-not-allowed"
              : "bg-blue-500 bg-opacity-75 text-white hover:bg-opacity-100"
          }`}
          disabled={isPrintButtonDisabled}
        >
          <MdOutlineDownloading />
          Exporter Facture
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
