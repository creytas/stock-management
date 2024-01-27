import React, { useEffect } from "react";

export const InvoiceDetail = ({ involved, data, setData, setPrintButtonDisabled }) => {
  const handleInvolvedChange = (index, field, value) => {
    const updatedInvolved = [...data];
    updatedInvolved[index][field] = value;
    setData(updatedInvolved);
    const isAnyInvolvedNameEmpty = updatedInvolved.some(
      (involved) => involved.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyInvolvedNameEmpty);
  };
  useEffect(() => {
    // Mettre à jour la validation du bouton d'impression
    const isAnyInvolvedNameEmpty = data.some(
      (involved) => involved.name.trim() === ""
    );
    setPrintButtonDisabled(isAnyInvolvedNameEmpty);
  }, [data]);

  return data.map((involvedData, index) => (
    <div key={index} className="w-1/2">
      <label className="font-bold">{involved}</label>
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="text"
            value={involvedData.name}
            onChange={(e) =>
              handleInvolvedChange(index, "name", e.target.value)
            }
            placeholder={`Nom complet ${involved}`}
            required
            className="outline-none border rounded p-[3px]"
          />
          <input
            type="text"
            value={involvedData.company}
            onChange={(e) =>
              handleInvolvedChange(index, "company", e.target.value)
            }
            placeholder={`Entreprise ${involved}`}
            className="outline-none border rounded p-[3px]"
          />
        </div>
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="text"
            value={involvedData.adress}
            onChange={(e) =>
              handleInvolvedChange(index, "adress", e.target.value)
            }
            placeholder={`Adresse ${involved}`}
            className="w-[92%] outline-none border rounded p-[3px]"
          />
        </div>
        <div className="h-[44px] flex items-center space-x-2">
          <input
            type="email"
            value={involvedData.email}
            onChange={(e) =>
              handleInvolvedChange(index, "email", e.target.value)
            }
            placeholder={`E-mail ${involved}`}
            className="outline-none border rounded p-[3px]"
          />
          <input
            type="tel"
            value={involvedData.tel}
            onChange={(e) => handleInvolvedChange(index, "tel", e.target.value)}
            placeholder={`Tel. ${involved}`}
            className="outline-none border rounded p-[3px]"
          />
        </div>
      </div>
    </div>
  ));
};
