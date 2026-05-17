import Link from "next/link";

export default function SupplyChainDetective() {
  return (

    <main className="min-h-screen bg-black text-white px-8 py-8">

      {/* HEADER */}
      <div className="mb-10">

        <p className="text-green-400 font-semibold tracking-wider mb-3">
          SQLVERSE INVESTIGATIONS
        </p>

        <h1 className="text-6xl font-black mb-5">
          Supply Chain Investigations
        </h1>

        <p className="text-zinc-400 text-xl max-w-4xl leading-9">

          Investigate missing shipments, warehouse fraud,
          operational anomalies, inventory mismatches,
          and logistics failures using SQL.

        </p>

      </div>

      {/* CASE CARDS */}
      <div className="grid grid-cols-3 gap-7">

        {/* CASE 01 */}
        <Link href="/series/supply-chain-detective/episode-1">

          <div className="relative group bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:border-green-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden h-full min-h-[420px]">

            <p className="text-green-400 font-semibold tracking-wide mb-4">
              CASE 01
            </p>

            <h2 className="text-4xl font-bold mb-5">
              The Missing Shipment
            </h2>

            <p className="text-zinc-400 leading-8 text-lg mb-7">

              A luxury shipment vanished between Delhi and Bangalore.
              Investigate warehouse-level inventory discrepancies
              and operational gaps.

            </p>

            <button className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-xl transition-all duration-200">

              Open Case

            </button>

            {/* HOVER PREVIEW */}
            <div className="absolute inset-0 bg-black/95 border border-green-500 rounded-3xl p-7 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-y-auto">

              <p className="text-green-400 font-semibold tracking-widest mb-4">
                CASE FILE PREVIEW
              </p>

              <h3 className="text-3xl font-bold mb-6">
                CASE 01 — The Missing Shipment
              </h3>

              <div className="space-y-4 text-zinc-300 mb-8">

                <p>
                  📁 Warehouse Discrepancy
                </p>

                <p>
                  📁 Suspicious Transit Activity
                </p>

                <p>
                  📁 Missing Scan Audit
                </p>

                <p>
                  📁 Phantom Inventory Trail
                </p>

                <p>
                  📁 Final Operational Audit
                </p>

              </div>

              <p className="text-zinc-400 leading-7 mb-5">

                SQL concepts progress from beginner aggregation
                queries to advanced multi-table investigations.

              </p>

              <div className="flex flex-wrap gap-2 mb-6">

                <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                  GROUP BY
                </span>

                <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                  JOINS
                </span>

                <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                  CASE WHEN
                </span>

                <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                  WINDOW FUNCTIONS
                </span>

              </div>

              <button className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-xl transition-all duration-200">

                Open Investigation

              </button>

            </div>

          </div>

        </Link>

        {/* CASE 02 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 opacity-60 h-full min-h-[420px]">

          <p className="text-yellow-400 font-semibold tracking-wide mb-4">
            CASE 02
          </p>

          <h2 className="text-4xl font-bold mb-5">
            The Night Shift
          </h2>

          <p className="text-zinc-400 leading-8 text-lg mb-7">

            Suspicious warehouse activity spikes after midnight.
            Analyze employee access logs and shipment movements.

          </p>

          <button className="w-full bg-zinc-700 text-zinc-400 py-3 rounded-xl cursor-not-allowed">

            Locked

          </button>

        </div>

        {/* CASE 03 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 opacity-60 h-full min-h-[420px]">

          <p className="text-cyan-400 font-semibold tracking-wide mb-4">
            CASE 03
          </p>

          <h2 className="text-4xl font-bold mb-5">
            Ghost Inventory
          </h2>

          <p className="text-zinc-400 leading-8 text-lg mb-7">

            Inventory appears in records but never physically existed.
            Trace phantom stock movement patterns across facilities.

          </p>

          <button className="w-full bg-zinc-700 text-zinc-400 py-3 rounded-xl cursor-not-allowed">

            Locked

          </button>

        </div>

      </div>

    </main>
  );
}