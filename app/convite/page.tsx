// pages/convite.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import bg from "../public/convite-bg.jpeg";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Suspense } from "react";
export default function Convite() {
    const searchParams = useSearchParams();
    const nome = searchParams.get("nome");
    const [respondido, setRespondido] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const handleResposta = async (resposta: string) => {
        if (!nome) return;
        setLoading(true);
        await handleConfirmar(resposta);
        if (resposta === "sim") {
            setRespondido(true);
        } else {
            setRespondido(false);
        }
        setLoading(false);
    };

    const handleConfirmar = async (resposta: string) => {
        if (!nome || !resposta) {
            console.error("Dados inválidos");
            return;
        }

        try {
            const ref = doc(collection(db, "confirmacoes"), nome.toString());
            await setDoc(ref, { resposta });
            console.log("Resposta salva com sucesso");
        } catch (err) {
            console.error("Erro ao salvar resposta", err);
        }
    };

    return (
        <Suspense fallback={<div className="text-white text-xl">Carregando...</div>}>
            <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 text-center" style={{ backgroundImage: "url('/convite-bg.jpeg')" }}>
                {respondido === true ? (
                    <h2 className="bg-white/80 text-xl md:text-2xl font-semibold px-6 py-4 rounded-2xl shadow-md text-black">
                        Obrigado por confirmar, {nome}!
                    </h2>
                ) : respondido === false ? (
                    <h2 className="bg-white/80 text-xl md:text-2xl font-semibold px-6 py-4 rounded-2xl shadow-md text-black">
                        Tudo bem, entendemos {nome}!
                    </h2>
                ) : respondido === null ? (
                    <div className="bg-white/85 max-w-md px-6 py-8 rounded-2xl shadow-lg">
                        {loading ? (
                            <div className="text-2xl font-bold mb-2 text-black">
                                Enviando sua resposta...
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold mb-2 text-black">Olá {nome},</h1>
                                <p className="text-lg mb-6 text-black">Posso confirmar sua presença no Chá da Maria Isis?</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => handleResposta("sim")}
                                        className="bg-rose-400 hover:bg-rose-500 transition px-6 py-2 rounded-full font-semibold"
                                    >
                                        Sim ☁️⭐️
                                    </button>
                                    <button
                                        onClick={() => handleResposta("nao")}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white transition px-6 py-2 rounded-full font-semibold"
                                    >
                                        Não 😭
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : <div></div>}
            </div>
        </Suspense>
    );
}
