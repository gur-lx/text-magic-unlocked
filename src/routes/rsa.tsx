import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/rsa")({
  head: () => ({
    meta: [
      { title: "RSA Workbench · Cryptex" },
      { name: "description", content: "Interactive RSA encryption and decryption — generate keys, encrypt characters, and inspect the math." },
    ],
  }),
  component: RSAPage,
});

/* ---------------- math helpers (BigInt) ---------------- */
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
function egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}
function modInverse(a: bigint, m: bigint): bigint {
  const [g, x] = egcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error("No modular inverse — e and φ(n) are not coprime.");
  return ((x % m) + m) % m;
}
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let r = 1n; base = base % mod;
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return r;
}
function isPrime(n: bigint): boolean {
  if (n < 2n) return false;
  if (n % 2n === 0n) return n === 2n;
  for (let i = 3n; i * i <= n; i += 2n) if (n % i === 0n) return false;
  return true;
}

/* ---------------- component ---------------- */
function RSAPage() {
  const [p, setP] = useState("61");
  const [q, setQ] = useState("53");
  const [e, setE] = useState("17");
  const [plaintext, setPlaintext] = useState("HELLO");

  const computed = useMemo(() => {
    try {
      const P = BigInt(p), Q = BigInt(q), E = BigInt(e);
      if (!isPrime(P)) return { error: `p = ${p} is not prime.` };
      if (!isPrime(Q)) return { error: `q = ${q} is not prime.` };
      if (P === Q) return { error: "p and q must be distinct primes." };
      const n = P * Q;
      const phi = (P - 1n) * (Q - 1n);
      if (E <= 1n || E >= phi) return { error: `e must satisfy 1 < e < φ(n) = ${phi}` };
      if (gcd(E, phi) !== 1n) return { error: `e = ${e} is not coprime with φ(n) = ${phi}` };
      const d = modInverse(E, phi);
      const cipher = [...plaintext].map((ch) => {
        const m = BigInt(ch.charCodeAt(0));
        if (m >= n) throw new Error(`Character "${ch}" (code ${m}) ≥ n = ${n}. Choose larger primes.`);
        return modPow(m, E, n);
      });
      const decrypted = cipher.map((c) => Number(modPow(c, d, n))).map((x) => String.fromCharCode(x)).join("");
      return { error: null, n, phi, d, cipher, decrypted };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Unknown error" };
    }
  }, [p, q, e, plaintext]);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
      {/* header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="num-marker text-3xl">02</span>
            <span className="label-eyebrow">Asymmetric · Public-Key</span>
          </div>
          <h1 className="font-display text-6xl font-semibold leading-none">RSA Workbench</h1>
          <p className="mt-3 text-ink-soft max-w-xl">Generate a keypair from two primes and watch each character of your message turn into ciphertext.</p>
        </div>
        <span className="stamp">Specimen · 02</span>
      </div>

      <div className="mt-10 grid lg:grid-cols-12 gap-8">
        {/* INPUTS */}
        <section className="lg:col-span-5 paper-card p-7">
          <p className="label-eyebrow mb-5">Inputs</p>
          <div className="space-y-5">
            <Field label="Prime p" value={p} setValue={setP} mono />
            <Field label="Prime q" value={q} setValue={setQ} mono />
            <Field label="Public exponent e" value={e} setValue={setE} mono />
            <Field label="Plaintext message" value={plaintext} setValue={setPlaintext} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["61", "53", "17", "HELLO"],
              ["101", "103", "7", "RSA"],
              ["211", "223", "13", "ATTACK AT DAWN"],
            ].map(([pp, qq, ee, msg]) => (
              <button key={pp} onClick={() => { setP(pp); setQ(qq); setE(ee); setPlaintext(msg); }}
                className="font-mono text-[11px] uppercase tracking-wider border border-[color:var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors">
                preset ▸ p={pp}, q={qq}
              </button>
            ))}
          </div>
        </section>

        {/* OUTPUTS */}
        <section className="lg:col-span-7 space-y-6">
          {computed.error ? (
            <div className="border-2 border-destructive text-destructive p-5 rounded-sm font-mono text-sm">
              ⚠ {computed.error}
            </div>
          ) : (
            <>
              <div className="paper-card p-6">
                <p className="label-eyebrow mb-3">Derived parameters</p>
                <div className="grid sm:grid-cols-3 gap-3 font-mono text-sm">
                  <Stat k="n = p·q" v={String(computed.n)} />
                  <Stat k="φ(n) = (p−1)(q−1)" v={String(computed.phi)} />
                  <Stat k="d ≡ e⁻¹ mod φ(n)" v={String(computed.d)} />
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div className="border-2 border-[color:var(--ink)] p-3 rounded-sm">
                    <div className="label-eyebrow">Public key</div>
                    <div className="font-mono text-sm mt-1">(e, n) = ({e}, {String(computed.n)})</div>
                  </div>
                  <div className="border-2 border-accent p-3 rounded-sm">
                    <div className="label-eyebrow !text-accent">Private key</div>
                    <div className="font-mono text-sm mt-1">(d, n) = ({String(computed.d)}, {String(computed.n)})</div>
                  </div>
                </div>
              </div>

              <div className="paper-card p-6 relative overflow-hidden scanline">
                <div className="flex justify-between items-baseline mb-3">
                  <p className="label-eyebrow">Ciphertext  c = mᵉ mod n</p>
                  <span className="font-mono text-[10px] text-ink-soft">{computed.cipher!.length} blocks</span>
                </div>
                <div className="cipher-text text-sm leading-relaxed">
                  {computed.cipher!.map((c, i) => (
                    <span key={i} className="inline-block mr-2 mb-1 border-b border-[color:var(--cipher)]/40">{String(c)}</span>
                  ))}
                </div>
              </div>

              <div className="paper-card p-6">
                <p className="label-eyebrow mb-3">Decrypted  m = cᵈ mod n</p>
                <div className="font-mono text-2xl font-semibold tracking-wider">{computed.decrypted}</div>
                {computed.decrypted === plaintext ? (
                  <div className="mt-3 inline-block stamp !text-cipher !border-cipher !rotate-0">✓ Roundtrip verified</div>
                ) : (
                  <div className="mt-3 text-warn font-mono text-xs">Roundtrip mismatch — choose larger primes so that n &gt; max(charCode).</div>
                )}
              </div>

              <details className="paper-card p-6">
                <summary className="cursor-pointer label-eyebrow">Per-character trace ▸</summary>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm font-mono">
                    <thead>
                      <tr className="text-left border-b border-[color:var(--rule)]">
                        <th className="py-2 pr-4">char</th>
                        <th className="py-2 pr-4">m</th>
                        <th className="py-2 pr-4">c = mᵉ mod n</th>
                        <th className="py-2">cᵈ mod n</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...plaintext].map((ch, i) => (
                        <tr key={i} className="border-b border-[color:var(--rule)]/50">
                          <td className="py-1.5 pr-4">{ch === " " ? "␣" : ch}</td>
                          <td className="py-1.5 pr-4">{ch.charCodeAt(0)}</td>
                          <td className="py-1.5 pr-4 text-cipher">{String(computed.cipher![i])}</td>
                          <td className="py-1.5">{ch.charCodeAt(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </section>
      </div>

      <div className="mt-16 rule-double pt-8 flex justify-between items-center flex-wrap gap-4">
        <Link to="/" className="font-mono text-xs uppercase tracking-widest">← back to theory</Link>
        <Link to="/hill" className="font-mono text-xs uppercase tracking-widest text-accent">next · Hill cipher →</Link>
      </div>
    </div>
  );
}

function Field({ label, value, setValue, mono }: { label: string; value: string; setValue: (v: string) => void; mono?: boolean }) {
  return (
    <label className="block">
      <span className="label-eyebrow">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`mt-2 w-full bg-transparent border-b-2 border-[color:var(--ink)] px-1 py-2 text-lg focus:outline-none focus:border-accent ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-[color:var(--rule)] p-3 rounded-sm">
      <div className="label-eyebrow !text-[9px]">{k}</div>
      <div className="font-mono text-sm mt-1 break-all">{v}</div>
    </div>
  );
}
