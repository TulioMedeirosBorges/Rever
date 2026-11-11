import { createContext, useContext, useState } from 'react';
import { habitos as habitosIniciais } from '../data/habitos';

const HabitosContexto = createContext(null);

export function HabitosProvider({ children }) {
  const [habitos, setHabitos] = useState(habitosIniciais);

  const alternarConcluido = (id) => {
    setHabitos((atuais) =>
      atuais.map((habito) =>
        habito.id === id ? { ...habito, concluido: !habito.concluido } : habito,
      ),
    );
  };

  const adicionarHabito = (dados) => {
    setHabitos((atuais) => {
      const proximoId = atuais.reduce((maior, { id }) => Math.max(maior, id), 0) + 1;
      return [...atuais, { ...dados, id: proximoId, concluido: false, feitosNaSemana: 0 }];
    });
  };

  const editarHabito = (id, dados) => {
    setHabitos((atuais) =>
      atuais.map((habito) => (habito.id === id ? { ...habito, ...dados } : habito)),
    );
  };

  const excluirHabito = (id) => {
    setHabitos((atuais) => atuais.filter((habito) => habito.id !== id));
  };

  return (
    <HabitosContexto.Provider
      value={{ habitos, alternarConcluido, adicionarHabito, editarHabito, excluirHabito }}
    >
      {children}
    </HabitosContexto.Provider>
  );
}

export const useHabitos = () => useContext(HabitosContexto);
