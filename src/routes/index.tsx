import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, Users, Shuffle, Eye, EyeOff, Trash2, Plus, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amigo Oculto — Véspera de Natal" },
      {
        name: "description",
        content:
          "Sorteio de amigo oculto para a véspera de Natal: adiciona participantes, faz o sorteio secreto e revela a cada pessoa o seu amigo oculto.",
      },
      { property: "og:title", content: "Amigo Oculto — Véspera de Natal" },
      {
        property: "og:description",
        content:
          "Sorteio secreto de amigo oculto para a véspera de Natal. Adiciona os participantes e descobre quem te saiu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Pair = { giver: string; receiver: string };

const STORAGE_KEY = "amigo-oculto-natal";

function shuffleDraw(names: string[]): Pair[] {
  // Derangement: garante que ninguém tira a si próprio
  for (let attempt = 0; attempt < 200; attempt++) {
    const receivers = [...names];
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [receivers[i], receivers[j]] = [receivers[j]!, receivers[i]!];
    }
    if (names.every((n, i) => receivers[i] !== n)) {
      return names.map((giver, i) => ({ giver, receiver: receivers[i]! }));
    }
  }
  // Fallback por rotação
  return names.map((giver, i) => ({ giver, receiver: names[(i + 1) % names.length]! }));
}

function Index() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [name, setName] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { participants: string[]; pairs: Pair[] };
        setParticipants(data.participants ?? []);
        setPairs(data.pairs ?? []);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ participants, pairs }));
  }, [participants, pairs, hydrated]);

  const addParticipant = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (participants.some((p) => p.toLowerCase() === trimmed.toLowerCase())) return;
    setParticipants((prev) => [...prev, trimmed]);
    setPairs([]);
    setRevealed(null);
    setName("");
  };

  const removeParticipant = (p: string) => {
    setParticipants((prev) => prev.filter((x) => x !== p));
    setPairs([]);
    setRevealed(null);
  };

  const draw = () => {
    if (participants.length < 2) return;
    setPairs(shuffleDraw(participants));
    setRevealed(null);
  };

  const resetAll = () => {
    setParticipants([]);
    setPairs([]);
    setRevealed(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Faixa decorativa */}
      <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Gift className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Amigo Oculto
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sorteio secreto para a véspera de Natal 🎄
          </p>
        </header>

        {/* Adicionar participantes */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <Users className="h-5 w-5 text-primary" />
            Participantes
          </h2>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addParticipant();
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do participante"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </form>

          {participants.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Ainda não há participantes. Adiciona pelo menos 2 pessoas para fazer o sorteio.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {participants.map((p) => (
                <li
                  key={p}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">{p}</span>
                  <button
                    onClick={() => removeParticipant(p)}
                    aria-label={`Remover ${p}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={draw}
              disabled={participants.length < 2}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Shuffle className="h-4 w-4" />
              {pairs.length > 0 ? "Refazer sorteio" : "Fazer sorteio"}
            </button>
            {(participants.length > 0 || pairs.length > 0) && (
              <button
                onClick={resetAll}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                Recomeçar
              </button>
            )}
          </div>
        </section>

        {/* Revelação secreta */}
        {pairs.length > 0 && (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
              <PartyPopper className="h-5 w-5 text-primary" />
              Descobre o teu amigo oculto
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada pessoa toca no seu nome para revelar — em segredo! 🤫
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {pairs.map(({ giver, receiver }) => {
                const isRevealed = revealed === giver;
                return (
                  <li key={giver}>
                    <button
                      onClick={() => setRevealed(isRevealed ? null : giver)}
                      className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <span className="text-sm font-medium text-foreground">{giver}</span>
                      {isRevealed ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {receiver}
                          <EyeOff className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          Revelar
                          <Eye className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Feito com carinho para a véspera de Natal 🎁
        </footer>
      </main>
    </div>
  );
}
