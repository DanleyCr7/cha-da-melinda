// pages/admin.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Admin() {
    const [stats, setStats] = useState({ sim: 0, nao: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const snapshot = await getDocs(collection(db, "confirmacoes"));
            let sim = 0, nao = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.resposta === "sim") sim++;
                else if (data.resposta === "nao") nao++;
            });

            setStats({ sim, nao });
        };

        fetchStats();
    }, []);

    return (
        <Suspense fallback={<div className="text-white text-xl">Carregando...</div>}>
            <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
                <h1>Confirmações</h1>
                <p>✅ Sim: {stats.sim}</p>
                <p>❌ Não: {stats.nao}</p>
            </div>
        </Suspense>
    );
}
