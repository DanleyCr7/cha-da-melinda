// pages/responder.tsx
import { db } from "@/app/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { nome, resposta } = req.query;

    if (!nome || !resposta) {
        return res.status(400).json({ error: "Dados inválidos" });
    }

    try {
        const ref = doc(collection(db, "confirmacoes"), nome.toString());
        await setDoc(ref, { resposta });
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Erro ao salvar resposta" });
    }
}
