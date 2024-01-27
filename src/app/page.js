"use client"

import Image from "next/image";
import InvoiceForm from "@/components/InvoiceForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div>
        <h1>Facturation de marchandises</h1>
        <InvoiceForm />
      </div>
    </main>
  );
}
