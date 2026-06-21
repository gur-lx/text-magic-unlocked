import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/hill")({
  head: () => ({
    meta: [
      { title: "Hill Cipher Workbench · Cryptex" },
      { name: "description", content: "Interactive Hill cipher — encrypt and decrypt text with a 2×2 key matrix over Z/26." },
    ],
  }),
  component: HillPage,
});

/* ---------------- math ---------------- */
const mod = (a: number, m: number) => ((a % m) + m) % m;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
function modInv(a: number, m: number): number | null {
  a = mod(a, m);
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}
function det2(K: number[][]) { return K[0][0] * K[1][1] - K[0][1] * K[1][0]; }
function inv2(K: number[][], m = 26): number[][] | null {
  const d = mod(det2(K), m);
  const di = modInv(d, m);
  if (di === null) return null;
  return [
    [mod(K[1][1] * di, m), mod(-K[0][1] * di, m)],
    [mod(-K[1][0] * di, m), mod(K[0][0] * di, m)],
  ];
}
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const toNum = (c: string) => A.indexOf(c.toUpperCase());
const toChar = (n: number) => A[mod(n, 26)];

function hillProcess(text: string, K: number[][]): { pairs: [string, string, number[], number[]][]; out: string } {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const padded = clean.length % 2 === 0 ? clean : clean + "X";
  const pairs: [string, string, number[], number[]][] = [];
  let out = "";
  for (let i = 0; i < padded.length; i += 2) {
    const p1 = toNum(padded[i]), p2 = toNum(padded[i + 1]);
    const c1 = mod(K[0][0] * p1 + K[0][1] * p2, 26);
    const c2 = mod(K[1][0] * p1 + K[1][1] * p2, 26);
    pairs.push([padded[i] + padded[i + 1], toChar(c1) + toChar(c2), [p1, p2], [c1, c2]]);
    out += toChar(c1) + toChar(c2);
  }
  return { pairs, out };
}

/* ---------------- component ---------------- */
function HillPage() {
  const [k00, setK00] = useState("3");
  const [k01, setK01] = useState("3");
  const [k10, setK10] = useState("2");
  const [k11, setK11] = useState("5");
  const [plaintext, setPlaintext] = useState("HELLO");

  const result = useMemo(() => {
    const K = [
      [parseInt(k00) || 0, parseInt(k01) || 0],
      [parseInt(k10) || 0, parseInt(k11) || 0],
    ];
    const d = mod(det2(K), 26);
    if (gcd(d, 26) !== 1) {
      return { error: `det(K) mod 26 = ${d}. Must be coprime with 26 (no factors of 2 or 13).`, K };
    }
    const Kinv = inv2(K)!;
    const enc = hillProcess(plaintext, K);
    const dec = hillProcess(enc.out, Kinv);
    return { error: null, K, Kinv, det: d, enc, dec };
  }, [k00, k01, k10, k11, plaintext]);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="num-marker text-3xl">03</span>
            <span className="label-eyebrow">Symmetric · Polygraphic</span>
          </div>
          <h1 className="font-display text-6xl font-semibold leading-none">Hill Cipher Workbench</h1>
          <p className="mt-3 text-ink-soft max-w-xl">Encrypt pairs of letters with a 2×2 matrix over <span className="font-mono">ℤ/26ℤ</span>. Watch each step of the matrix multiplication.</p>
        </div>
        <span className="stamp">Specimen · 03</span>
      </div>

      <div className="mt-10 grid lg:grid-cols-12 gap-8">
        {/* INPUTS */}
        <section className="lg:col-span-5 paper-card p-7">
          <p className="label-eyebrow mb-5">Key matrix K (2×2)</p>
          <div className="inline-grid grid-cols-[auto_repeat(2,5rem)_auto] items-center gap-3">
            <div className="text-5xl font-display">[</div>
            <MInput value={k00} onChange={setK00} />
            <MInput value={k01} onChange={setK01} />
            <div className="text-5xl font-display row-span-2">]</div>
            <div />
            <MInput value={k10} onChange={setK10} />
            <MInput value={k11} onChange={setK11} />
          </div>

          <div className="mt-6 font-mono text-sm text-ink-soft">
            det(K) mod 26 = <span className={result.error ? "text-destructive" : "text-cipher"}>{mod(det2(result.K), 26)}</span>
          </div>

          <div className="mt-8">
            <label className="block">
              <span className="label-eyebrow">Plaintext (letters only)</span>
              <input
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                className="mt-2 w-full bg-transparent border-b-2 border-[color:var(--ink)] px-1 py-2 text-lg uppercase tracking-widest focus:outline-none focus:border-accent"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { K: ["3","3","2","5"], t: "HELLO", l: "classic" },
              { K: ["6","24","1","13"], t: "ACT", l: "wikipedia" },
              { K: ["2","3","1","4"], t: "CIPHER", l: "simple" },
            ].map((pr, i) => (
              <button key={i} onClick={() => { setK00(pr.K[0]); setK01(pr.K[1]); setK10(pr.K[2]); setK11(pr.K[3]); setPlaintext(pr.t); }}
                className="font-mono text-[11px] uppercase tracking-wider border border-[color:var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors">
                preset ▸ {pr.l}
              </button>
            ))}
          </div>
        </section>

        {/* OUTPUTS */}
        <section className="lg:col-span-7 space-y-6">
          {result.error ? (
            <div className="border-2 border-destructive text-destructive p-5 rounded-sm font-mono text-sm">⚠ {result.error}</div>
          ) : (
            <>
              <div className="paper-card p-6">
                <p className="label-eyebrow mb-3">Inverse key K⁻¹ (mod 26)</p>
                <div className="font-mono text-lg">
                  <div className="inline-grid grid-cols-2 gap-x-6 gap-y-1 border-l-2 border-r-2 border-[color:var(--ink)] px-4 py-2">
                    <span>{result.Kinv![0][0]}</span><span>{result.Kinv![0][1]}</span>
                    <span>{result.Kinv![1][0]}</span><span>{result.Kinv![1][1]}</span>
                  </div>
                </div>
              </div>

              <div className="paper-card p-6 relative overflow-hidden scanline">
                <p className="label-eyebrow mb-3">Ciphertext  C = K·P (mod 26)</p>
                <div className="cipher-text text-2xl tracking-[0.3em] font-semibold">{result.enc!.out}</div>
              </div>

              <div className="paper-card p-6">
                <p className="label-eyebrow mb-3">Decrypted  P = K⁻¹·C (mod 26)</p>
                <div className="font-mono text-2xl font-semibold tracking-[0.3em]">{result.dec!.out}</div>
              </div>

              <div className="paper-card p-6">
                <p className="label-eyebrow mb-4">Block-by-block trace</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono">
                    <thead>
                      <tr className="text-left border-b border-[color:var(--rule)]">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">P (pair)</th>
                        <th className="py-2 pr-4">vector</th>
                        <th className="py-2 pr-4">K·P mod 26</th>
                        <th className="py-2">C (pair)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.enc!.pairs.map(([p, c, pv, cv], i) => (
                        <tr key={i} className="border-b border-[color:var(--rule)]/50">
                          <td className="py-1.5 pr-4 text-ink-soft">{i + 1}</td>
                          <td className="py-1.5 pr-4">{p}</td>
                          <td className="py-1.5 pr-4">[{pv[0]}, {pv[1]}]</td>
                          <td className="py-1.5 pr-4">[{cv[0]}, {cv[1]}]</td>
                          <td className="py-1.5 text-cipher">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-16 rule-double pt-8 flex justify-between items-center flex-wrap gap-4">
        <Link to="/rsa" className="font-mono text-xs uppercase tracking-widest">← previous · RSA</Link>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-accent">back to theory →</Link>
      </div>
    </div>
  );
}

function MInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^-0-9]/g, ""))}
      className="w-20 h-14 text-center font-mono text-2xl bg-transparent border-2 border-[color:var(--ink)] rounded-sm focus:outline-none focus:border-accent focus:bg-[color:var(--muted)]"
    />
  );
}
