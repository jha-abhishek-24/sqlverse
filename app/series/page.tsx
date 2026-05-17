import Link from "next/link";

export default function SeriesHomePage() {
  return (

    <main className="min-h-screen bg-black text-white px-10 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="mb-14 flex justify-between items-start gap-10">

          {/* LEFT HERO */}
          <div className="max-w-5xl">

            {/* LOGO + BRAND */}
       
            <div className="flex items-center gap-5 mb-8">

              <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-black text-3xl font-black shadow-lg shadow-green-500/30">

                SQL

              </div>

              <div>

                <p className="text-5xl font-black tracking-tight">
                  SQLVerse
                </p>

                <p className="text-zinc-500 text-lg mt-1">
                  Interactive SQL Learning Platform
                </p>

              </div>

            </div>

            {/* HERO TEXT */}
            <h1 className="text-6xl font-black leading-tight mb-6 max-w-6xl">

              Learn SQL Through Real Business Investigations

            </h1>

            <p className="text-zinc-400 text-xl max-w-5xl leading-9">

              Master SQL through immersive operational simulations,
              analytical investigations, and real-world business scenarios.

            </p>

          </div>

          {/* CONTACT */}
          <div className="text-right text-sm text-zinc-400 space-y-3 pt-3 min-w-fit">

            <p>
              Contact:
              {" "}
              <span className="text-white">
                abhishekjha2277@gmail.com
              </span>
            </p>

            <p>
              LinkedIn:
              {" "}
              <a
                href="http://www.linkedin.com/in/abhishek-kumar-jha-9a022319b/"
                target="_blank"
                className="text-green-400 hover:text-green-300"
              >
                Abhishek Kumar Jha
              </a>
            </p>

          </div>

        </div>

        {/* GENRE CARDS */}
        <div className="grid grid-cols-3 gap-8">

          {/* SUPPLY CHAIN */}
          <Link href="/series/supply-chain-detective">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full">

              <p className="text-green-400 font-semibold tracking-wide mb-4">
                SUPPLY CHAIN
              </p>

              <h2 className="text-4xl font-bold mb-6">
                Supply Chain
                <br />
                Investigations
              </h2>

              <p className="text-zinc-400 leading-8 text-lg">
                Investigate missing shipments, warehouse fraud,
                inventory mismatches, logistics anomalies,
                and operational breakdowns using SQL.
              </p>

            </div>

          </Link>

          {/* BANKING */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 opacity-60 h-full">

            <p className="text-yellow-400 font-semibold tracking-wide mb-4">
              LAUNCHING SOON
            </p>

            <h2 className="text-4xl font-bold mb-6">
              Banking Fraud
              <br />
              Investigations
            </h2>

            <p className="text-zinc-500 leading-8 text-lg">
              Analyze suspicious transactions, AML alerts,
              fraud rings, and financial anomalies
              using SQL investigations.
            </p>

          </div>

          {/* CATALOG */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 opacity-60 h-full">

            <p className="text-cyan-400 font-semibold tracking-wide mb-4">
              LAUNCHING SOON
            </p>

            <h2 className="text-4xl font-bold mb-6">
              Catalog Quality
              <br />
              Investigations
            </h2>

            <p className="text-zinc-500 leading-8 text-lg">
              Solve duplicate listings, broken catalogs,
              marketplace corruption, and listing quality
              investigations using SQL.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}