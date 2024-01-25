// components/InvoiceForm.js
import React, { useState, useEffect } from "react";
// import html2pdf from "html2pdf.js";

const InvoiceForm = () => {
  const [articles, setArticles] = useState([
    { name: "", quantity: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isPrintButtonDisabled, setPrintButtonDisabled] = useState(true);
  const [isDeleteButtonHidden, setDeleteButtonHidden] = useState(false);

  const handleShowInvoice = () => {
    const invoiceData = {
      articles,
      taxRate,
      discount,
      total: calculateTotal(),
    };

    // Affiche les données JSON dans une boîte de dialogue
    alert(JSON.stringify(invoiceData, null, 2));
  };

  //   const handlePrint = () => {
  //     const element = document.getElementById("invoice-form");
  //     html2pdf(element);
  //   };

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

  useEffect(() => {
    // Mettre à jour la validation du bouton d'impression
    const isAnyArticleNameEmpty = articles.some(
      (article) => article.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyArticleNameEmpty);
  }, [articles]);

  return (
    <div>
      <form id="invoice-form">
        {/* ... autres champs de la facture */}
        <h2>Articles</h2>
        {/* <div className="grid grid-cols-4 gap-4">
          <div className="font-bold">Nom de l'article</div>
          <div className="font-bold">Quantité</div>
          <div className="font-bold">Prix unitaire</div>
          <div className="font-bold">Actions</div>
        </div> */}
        {articles.map((article, index) => (
          <div key={index}>
            <input
              type="text"
              value={article.name}
              onChange={(e) =>
                handleArticleChange(index, "name", e.target.value)
              }
              placeholder="Nom de l'article"
              required
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
            />
            {index > 0 && (
              <button type="button" onClick={() => handleRemoveArticle(index)}>
                Supprimer
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddArticle}>
          Ajouter un article
        </button>
        {/* ... autres champs de la facture */}
        <div>
          <label>Taux de taxe (%)</label>
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
          />
        </div>
        <div>
          <label>Remise (%)</label>
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
          />
        </div>
        <div>
          <strong>Total: {calculateTotal()} €</strong>
        </div>
      </form>
      <button
        onClick={handleShowInvoice}
        className={`mr-4 p-2 ${
          isPrintButtonDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        disabled={isPrintButtonDisabled}
      >
        Imprimer en PDF
      </button>
    </div>
  );
};

export default InvoiceForm;
