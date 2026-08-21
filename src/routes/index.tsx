import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cryptex · Theory of RSA & Hill Cipher — NSC Project" },
      { name: "description", content: "Foundational theory, comparison and significance of the RSA public-key cryptosystem and the Hill matrix cipher." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-8">
      {/* HERO */}
      <section className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="label-eyebrow">Volume I</span>
            <span className="h-px w-16 bg-[color:var(--ink)]" />
            <span className="label-eyebrow">Foundations of Cryptography</span>
          </div>
          <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
            Two ciphers,<br />
            <span className="italic font-normal">one </span>
            <span className="text-accent">secret</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            A study of the <em>RSA</em> public-key cryptosystem and the <em>Hill</em> polygraphic
            substitution cipher — one born in 1977, the other in 1929. Together they map the
            terrain between classical linear algebra and modern number-theoretic security.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/rsa" className="group inline-flex items-center gap-3 bg-[color:var(--ink)] text-[color:var(--paper)] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest">
              Try RSA <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/hill" className="inline-flex items-center gap-3 border-2 border-[color:var(--ink)] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest">
              Try Hill cipher →
            </Link>
          </div>
        </div>
        <aside className="lg:col-span-4 relative">
          <div className="paper-card p-6 relative overflow-hidden scanline">
            <div className="flex justify-between items-start mb-4">
              <span className="label-eyebrow">Specimen · 001</span>
              <span className="stamp">Classified</span>
            </div>
            <div className="font-mono text-xs leading-relaxed text-ink-soft">
              <div>PLAINTEXT  →  HELLO WORLD</div>
              <div className="mt-2 text-cipher break-all">
                CIPHER ▒ 4f8a 2c91 17de a004<br />
                ▒ b3c2 0099 88ff a51a 7e22<br />
                ▒ 6d11 9c4e 1b88 d3f0 e0a2
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="border border-[color:var(--rule)] p-2"><div className="num-marker text-lg">e</div><div>65537</div></div>
                <div className="border border-[color:var(--rule)] p-2"><div className="num-marker text-lg">K</div><div>[3 3; 2 5]</div></div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full border border-[color:var(--ink)] rounded-sm" />
        </aside>
      </section>

      {/* WHY THIS MATTERS */}
      <section className="mt-24">
        <div className="rule-double pt-6 grid md:grid-cols-3 gap-8">
          <div>
            <p className="label-eyebrow">Why it matters</p>
            <h2 className="font-display text-3xl mt-2">The grammar of secrecy.</h2>
          </div>
          <div className="md:col-span-2 text-ink-soft leading-relaxed">
            <p>
              Cryptography is the discipline of communicating in the presence of adversaries.
              Every banking transaction, every encrypted message, every signed software update
              traces its lineage back to ideas first formalised in the schemes you will study
              on this site. RSA underwrites the modern web; Hill, though obsolete, remains the
              cleanest illustration of how linear algebra became a weapon of information.
            </p>
          </div>
        </div>
      </section>

      {/* METHODS — Two columns */}
      <section className="mt-24 grid lg:grid-cols-2 gap-px bg-[color:var(--rule)] border border-[color:var(--rule)]">
        {/* RSA */}
        <article className="bg-[color:var(--paper)] p-8 lg:p-10">
          <div className="flex items-baseline justify-between">
            <span className="num-marker text-5xl">02</span>
            <span className="label-eyebrow">Asymmetric · Public-Key</span>
          </div>
          <h3 className="font-display text-4xl mt-4">RSA</h3>
          <p className="font-mono text-xs text-ink-soft mt-1">Rivest · Shamir · Adleman, 1977</p>

          <p className="mt-6 leading-relaxed text-ink-soft">
            RSA is the cornerstone of asymmetric cryptography. Its security rests on the
            <strong className="text-ink"> computational difficulty of factoring</strong> the
            product of two large primes — a problem no efficient classical algorithm is
            known to solve.
          </p>

          <div className="mt-6 rule-h pt-5">
            <p className="label-eyebrow mb-3">Key Generation</p>
            <ol className="space-y-2 text-sm">
              <li><span className="num-marker">i.</span> Choose two large primes <code className="font-mono">p, q</code>.</li>
              <li><span className="num-marker">ii.</span> Compute <code className="font-mono">n = p·q</code> and <code className="font-mono">φ(n) = (p−1)(q−1)</code>.</li>
              <li><span className="num-marker">iii.</span> Choose <code className="font-mono">e</code> with <code className="font-mono">gcd(e, φ(n)) = 1</code>.</li>
              <li><span className="num-marker">iv.</span> Compute <code className="font-mono">d ≡ e⁻¹ (mod φ(n))</code>.</li>
              <li><span className="num-marker">v.</span> Public key <code className="font-mono">(e, n)</code>, private key <code className="font-mono">(d, n)</code>.</li>
            </ol>
          </div>

          <div className="mt-6 rule-h pt-5">
            <p className="label-eyebrow mb-3">Encrypt / Decrypt</p>
            <div className="font-mono text-sm bg-[color:var(--ink)] text-[color:var(--paper)] p-4 rounded-sm leading-loose">
              <div>c = mᵉ mod n</div>
              <div>m = cᵈ mod n</div>
            </div>
          </div>

          <Link to="/rsa" className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            Open RSA workbench →
          </Link>
        </article>

        {/* HILL */}
        <article className="bg-[color:var(--paper)] p-8 lg:p-10">
          <div className="flex items-baseline justify-between">
            <span className="num-marker text-5xl">03</span>
            <span className="label-eyebrow">Symmetric · Polygraphic</span>
          </div>
          <h3 className="font-display text-4xl mt-4">Hill Cipher</h3>
          <p className="font-mono text-xs text-ink-soft mt-1">Lester S. Hill, 1929</p>

          <p className="mt-6 leading-relaxed text-ink-soft">
            The Hill cipher was the first cryptosystem to operate on blocks of letters using
            <strong className="text-ink"> linear algebra over modular arithmetic</strong>.
            Plaintext is partitioned into vectors and multiplied by an invertible key matrix
            modulo 26.
          </p>

          <div className="mt-6 rule-h pt-5">
            <p className="label-eyebrow mb-3">Mechanism</p>
            <ol className="space-y-2 text-sm">
              <li><span className="num-marker">i.</span> Choose an <code className="font-mono">n×n</code> key matrix <code className="font-mono">K</code>.</li>
              <li><span className="num-marker">ii.</span> Ensure <code className="font-mono">gcd(det K, 26) = 1</code>.</li>
              <li><span className="num-marker">iii.</span> Encode letters: A=0, B=1, … Z=25.</li>
              <li><span className="num-marker">iv.</span> Split plaintext into vectors of length <code className="font-mono">n</code>.</li>
              <li><span className="num-marker">v.</span> Decrypt with <code className="font-mono">K⁻¹ (mod 26)</code>.</li>
            </ol>
          </div>

          <div className="mt-6 rule-h pt-5">
            <p className="label-eyebrow mb-3">Encrypt / Decrypt</p>
            <div className="font-mono text-sm bg-[color:var(--ink)] text-[color:var(--paper)] p-4 rounded-sm leading-loose">
              <div>C = K · P  (mod 26)</div>
              <div>P = K⁻¹ · C (mod 26)</div>
            </div>
          </div>

          <Link to="/hill" className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            Open Hill workbench →
          </Link>
        </article>
      </section>

      {/* COMPARISON TABLE */}
      <section className="mt-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="label-eyebrow">Comparative Table</p>
            <h2 className="font-display text-4xl mt-2">A side-by-side reading.</h2>
          </div>
          <span className="stamp hidden md:inline-flex">Exhibit A</span>
        </div>
        <div className="overflow-x-auto paper-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-[color:var(--ink)] text-[color:var(--paper)] font-mono text-xs uppercase tracking-widest">
                <th className="px-5 py-3 font-medium">Attribute</th>
                <th className="px-5 py-3 font-medium">RSA</th>
                <th className="px-5 py-3 font-medium">Hill Cipher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--rule)]">
              {[
                ["Type", "Asymmetric (public-key)", "Symmetric (single shared key)"],
                ["Year", "1977", "1929"],
                ["Mathematical basis", "Number theory · modular exponentiation", "Linear algebra · modular matrices"],
                ["Security relies on", "Difficulty of integer factorisation", "Secrecy of the key matrix"],
                ["Operates on", "Numeric blocks (large integers)", "Letter vectors of length n"],
                ["Key size", "2048–4096 bits (modern)", "n × n matrix, typically 2×2 or 3×3"],
                ["Diffusion", "High (full-block exponentiation)", "Good within a block, weak across blocks"],
                ["Known-plaintext attack", "Resistant", "Completely broken (linear system)"],
                ["Used today", "TLS, SSH, PGP, digital signatures", "Educational / historical"],
                ["Speed", "Slow (heavy modular exponentiation)", "Very fast (matrix multiplication)"],
              ].map(([k, a, b]) => (
                <tr key={k} className="hover:bg-[color:var(--muted)]/50">
                  <td className="px-5 py-3 font-medium">{k}</td>
                  <td className="px-5 py-3 text-ink-soft">{a}</td>
                  <td className="px-5 py-3 text-ink-soft">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* IMPORTANCE */}
      <section className="mt-24 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <p className="label-eyebrow">Significance</p>
          <h2 className="font-display text-4xl mt-2 leading-tight">Why study both, side by side?</h2>
        </div>
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {[
            { n: "01", t: "Historical arc", d: "Hill marks the entry of algebra into cryptanalysis; RSA marks the entry of complexity theory. Together they trace cryptography's transformation from craft to science." },
            { n: "02", t: "Conceptual contrast", d: "Hill is symmetric and reversible by the same key. RSA splits the key into encryption and decryption halves — the conceptual leap that made the open Internet possible." },
            { n: "03", t: "Pedagogical clarity", d: "Hill teaches modular arithmetic and matrix invertibility. RSA teaches Euler's theorem, primality and one-way functions. The pair forms a complete primer." },
            { n: "04", t: "Modern relevance", d: "While RSA secures TLS today, post-quantum work studies why Hill-style linear systems fail — guiding the design of lattice-based replacements for RSA itself." },
          ].map(({ n, t, d }) => (
            <div key={n} className="paper-card p-6">
              <div className="num-marker text-3xl">{n}</div>
              <h4 className="font-display text-xl mt-2">{t}</h4>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 rule-double pt-12 text-center">
        <p className="label-eyebrow">Begin the experiment</p>
        <h2 className="font-display text-5xl mt-3">From theory to ciphertext.</h2>
        <p className="mt-3 text-ink-soft max-w-xl mx-auto">Each method has its own workbench. Type a message, watch it transform, and read the math as it happens.</p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link to="/rsa" className="bg-[color:var(--ink)] text-[color:var(--paper)] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest">→ RSA workbench</Link>
          <Link to="/hill" className="border-2 border-[color:var(--ink)] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest">→ Hill workbench</Link>
        </div>
      </section>
    </div>
  );
}
