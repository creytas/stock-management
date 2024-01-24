// components/InvoiceForm.js
import React, { useState } from 'react';
import { html2pdf } from 'html2pdf.js';

const InvoiceForm = () => {
  const [articles, setArticles] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handlePrint = () => {
    const element = document.getElementById('invoice-form');
    html2pdf(element);
  };

  const handleAddArticle = () => {
    setArticles([...articles, { name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveArticle = (index) => {
    const updatedArticles = [...articles];
    updatedArticles.splice(index, 1);
    setArticles(updatedArticles);
  };

  const handleArticleChange = (index, field, value) => {
    const updatedArticles = [...articles];
    updatedArticles[index][field] = value;
    setArticles(updatedArticles);
  };

  const calculateTotal = () => {
    const subtotal = articles.reduce((acc, article) => acc + article.quantity * article.price, 0);
    const totalBeforeTaxAndDiscount = subtotal * (1 - discount / 100);
    const total = totalBeforeTaxAndDiscount * (1 + taxRate / 100);
    return total.toFixed(2);
  };

  return (
    <div>
      <form id="invoice-form">
        {/* ... autres champs de la facture */}
        <h2>Articles</h2>
        {articles.map((article, index) => (
          <div key={index}>
            <input
              type="text"
              value={article.name}
              onChange={(e) => handleArticleChange(index, 'name', e.target.value)}
              placeholder="Nom de l'article"
            />
            <input
              type="number"
              value={article.quantity}
              onChange={(e) => handleArticleChange(index, 'quantity', e.target.value)}
              placeholder="Quantité"
            />
            <input
              type="number"
              value={article.price}
              onChange={(e) => handleArticleChange(index, 'price', e.target.value)}
              placeholder="Prix unitaire"
            />
            <button type="button" onClick={() => handleRemoveArticle(index)}>
              Supprimer
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddArticle}>
          Ajouter un article
        </button>
        {/* ... autres champs de la facture */}
        <div>
          <label>Taux de taxe (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            placeholder="Taux de taxe"
          />
        </div>
        <div>
          <label>Remise (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Remise"
          />
        </div>
        <div>
          <strong>Total: {calculateTotal()} €</strong>
        </div>
      </form>
      <button onClick={handlePrint}>Imprimer en PDF</button>
    </div>
  );
};

export default InvoiceForm;
