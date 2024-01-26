import React from "react";

export const InvoiceDetail = ({ involved, setData }) => {
  return (
    <div className="w-1/2">
      <label className="font-bold">{involved}</label>
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nom complet"
            className="outline-none border rounded p-[3px]"
          />
          <input
            type="text"
            placeholder="Entreprise"
            className="outline-none border rounded p-[3px]"
          />
        </div>
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="text"
            placeholder="Adresse"
            className="w-[92c%] outline-none border rounded p-[3px]"
          />
        </div>
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="email"
            placeholder="E-mail"
            className="outline-none border rounded p-[3px]"
          />
          <input
            type="tel"
            placeholder="Tel."
            className="outline-none border rounded p-[3px]"
          />
        </div>
      </div>
    </div>
  );
};
