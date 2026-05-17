"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useRouter } from "next/navigation";

export default function EpisodeFive() {
  const router = useRouter();

  const [query, setQuery] = useState(`WITH category_losses AS (
    SELECT
        w.manager,
        w.warehouse_id,
        p.category,
        SUM(s.item_value) AS total_loss
    FROM shipment_logs s
    JOIN warehouses w
        ON s.warehouse_id = w.warehouse_id
    JOIN products p
        ON s.product_id = p.product_id
    WHERE s.shipment_status = 'MISSING'
    GROUP BY
        w.manager,
        w.warehouse_id,
        p.category
),

ranked_losses AS (
    SELECT *,
           RANK() OVER (
               ORDER BY total_loss DESC
           ) AS loss_rank
    FROM category_losses
)

SELECT
    manager,
    warehouse_id,
    category,
    total_loss
FROM ranked_losses
WHERE loss_rank = 1;`);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [revealHint, setRevealHint] = useState(false);

  const expectedQuery = `
SELECT
    'Priya Nair' AS manager,
    'WH_BLR_09' AS warehouse_id,
    'Jewelry' AS category,
    835000 AS total_loss
`;

  const runQuery = async () => {

    setAttempted(true);
    setLoading(true);
    setError("");

    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [`importScripts("${bundle.mainWorker}")`],
          { type: "text/javascript" }
        )
      )
    );

    const logger = new duckdb.ConsoleLogger();

    const db = new duckdb.AsyncDuckDB(logger, worker);

    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    const conn = await db.connect();

    // shipment_logs
    const shipmentResponse = await fetch("/datasets/shipment_logs.csv");
    const shipmentCsv = await shipmentResponse.text();

    await db.registerFileText(
      "shipment_logs.csv",
      shipmentCsv
    );

    await conn.query(`
      CREATE TABLE shipment_logs AS
      SELECT * FROM read_csv_auto('shipment_logs.csv');
    `);

    // warehouses
    const warehouseResponse = await fetch("/datasets/warehouses.csv");
    const warehouseCsv = await warehouseResponse.text();

    await db.registerFileText(
      "warehouses.csv",
      warehouseCsv
    );

    await conn.query(`
      CREATE TABLE warehouses AS
      SELECT * FROM read_csv_auto('warehouses.csv');
    `);

    // products
    const productResponse = await fetch("/datasets/products.csv");
    const productCsv = await productResponse.text();

    await db.registerFileText(
      "products.csv",
      productCsv
    );

    await conn.query(`
      CREATE TABLE products AS
      SELECT * FROM read_csv_auto('products.csv');
    `);

    try {

      const result = await conn.query(query);

      const userRows = result.toArray();

      setResults(userRows);

      const expectedResult = await conn.query(expectedQuery);

      const expectedRows = expectedResult.toArray();

     const cleanedUser = userRows.map((row: any) => ({
  manager: String(row.manager),
  warehouse_id: String(row.warehouse_id),
  category: String(row.category),
  total_loss: Number(row.total_loss),
}));

const cleanedExpected = expectedRows.map((row: any) => ({
  manager: String(row.manager),
  warehouse_id: String(row.warehouse_id),
  category: String(row.category),
  total_loss: Number(row.total_loss),
}));

      const sortedUser = [...cleanedUser].sort((a, b) =>
        a.warehouse_id.localeCompare(b.warehouse_id)
      );

      const sortedExpected = [...cleanedExpected].sort((a, b) =>
        a.warehouse_id.localeCompare(b.warehouse_id)
      );

      if (
        JSON.stringify(sortedUser) ===
        JSON.stringify(sortedExpected)
      ) {
        setSolved(true);
      } else {
        setSolved(false);
      }

    } catch (err: any) {

      setError(err.message);

      setResults([]);

      setSolved(false);

    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 overflow-hidden">

      {/* CONFETTI EFFECT */}
      {solved && (

        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">

          <div className="absolute top-0 left-[10%] text-6xl animate-bounce">
            🎉
          </div>

          <div className="absolute top-10 left-[30%] text-5xl animate-pulse">
            🎊
          </div>

          <div className="absolute top-20 left-[60%] text-6xl animate-bounce">
            🥳
          </div>

          <div className="absolute top-5 right-[10%] text-5xl animate-pulse">
            🎉
          </div>

          <div className="absolute top-32 right-[35%] text-6xl animate-bounce">
            🎊
          </div>

        </div>

      )}

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* LEFT PANEL */}
        <div className="col-span-3 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 sticky top-6">

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-green-400 font-semibold text-sm">
                EPISODE 5 / 5
              </p>
            </div>

            <div className="text-sm text-zinc-400">
              Score: {solved ? "10/10" : "8/10"}
            </div>

          </div>

          <div className="w-full bg-zinc-800 rounded-full h-3 mb-8 overflow-hidden">
            <div
              className={`h-full bg-green-500 transition-all duration-1000 ease-out ${
                solved ? "w-full" : "w-[80%]"
              }`}
            ></div>
          </div>

          <h1 className="text-2xl font-bold mb-6 leading-tight">
            Final Operational Audit
          </h1>

          <p className="text-zinc-300 leading-8">
            The executive audit team believes one warehouse manager
is connected to unusually high-value missing shipments
within a single product category.

Investigators must identify the warehouse, manager,
and product category responsible for the largest loss.
          </p>

          <div className="mt-8 bg-black border border-zinc-700 rounded-xl p-4">

            <h2 className="text-green-400 font-semibold mb-3">
              YOUR MISSION
            </h2>

            <p className="text-zinc-300 leading-7">
              Identify the warehouse manager and product category
responsible for the highest missing inventory value. Name the value column as total_loss.
            </p>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-semibold mb-4">
              Available Tables
            </h2>

            <div className="space-y-4">

              {/* shipment_logs */}
              <div className="bg-black border border-zinc-700 rounded-xl p-4">

                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-400">
                    shipment_logs
                  </h3>
                </div>

                <div className="text-sm text-zinc-400 space-y-2">

                  <p>
                    shipment_id{" "}
                    <span className="text-yellow-400">(PK)</span>
                  </p>

                  <p>
                    warehouse_id{" "}
                    <span className="text-cyan-400">(FK)</span>
                  </p>

                  <p>
                    product_id{" "}
                    <span className="text-cyan-400">(FK)</span>
                  </p>

                  <p>item_value</p>

                  <p>shipment_status</p>

                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700">

                  <p className="text-xs text-zinc-500 mb-2">
                    SAMPLE ROW
                  </p>

                  <div className="bg-zinc-950 rounded-lg p-3 text-xs text-cyan-400 font-mono overflow-x-auto whitespace-nowrap">

                    S007 | WH_BLR_09 | P1004 | 710000 | MISSING

                  </div>

                </div>

              </div>

              {/* warehouses */}
              <div className="bg-black border border-zinc-700 rounded-xl p-4">

                <h3 className="font-semibold text-green-400 mb-3">
                  warehouses
                </h3>

                <div className="text-sm text-zinc-400 space-y-2">

                  <p>
                    warehouse_id{" "}
                    <span className="text-yellow-400">(PK)</span>
                  </p>

                  <p>city</p>

                  <p>manager</p>

                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700">

                  <p className="text-xs text-zinc-500 mb-2">
                    SAMPLE ROW
                  </p>

                  <div className="bg-zinc-950 rounded-lg p-3 text-xs text-cyan-400 font-mono overflow-x-auto whitespace-nowrap">

                    WH_BLR_09 | Bangalore | Priya Nair

                  </div>

                </div>

              </div>

              {/* products */}
              <div className="bg-black border border-zinc-700 rounded-xl p-4">

                <h3 className="font-semibold text-green-400 mb-3">
                  products
                </h3>

                <div className="text-sm text-zinc-400 space-y-2">

                  <p>
                    product_id{" "}
                    <span className="text-yellow-400">(PK)</span>
                  </p>

                  <p>product_name</p>

                  <p>category</p>

                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700">

                  <p className="text-xs text-zinc-500 mb-2">
                    SAMPLE ROW
                  </p>

                  <div className="bg-zinc-950 rounded-lg p-3 text-xs text-pink-400 font-mono overflow-x-auto whitespace-nowrap">

                    P1004 | Diamond Ring | Jewelry

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="col-span-9 space-y-6">

          {/* SQL EDITOR */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Investigation Console
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Connected to QueryVerse Intelligence Engine
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={runQuery}
                  className="bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-green-500/20"
                >
                  {loading ? "Running Query..." : "Run Query"}
                </button>

                <button
                  onClick={() => setShowHint(true)}
                  className="border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:scale-105 transition-all duration-200 px-5 py-3 rounded-xl shadow-lg shadow-yellow-500/10"
                >
                  Need Hint?
                </button>

              </div>

            </div>

            <div className="bg-black border border-zinc-700 rounded-xl p-4 h-[400px]">

              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={query}
                onChange={(value) => setQuery(value || "")}
              />

            </div>

          </div>

          {/* RESULT SECTION */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Query Result
              </h2>

              <div
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  solved
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : attempted
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                }`}
              >
                {solved
                  ? "Investigation Complete"
                  : attempted
                  ? "Investigation Ongoing"
                  : "Awaiting Investigation"}
              </div>

            </div>

            <div className="flex items-center gap-4 mb-4">

              <div className="bg-black border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-300">
                Rows Returned: {results.length}
              </div>

              <div className="bg-black border border-zinc-700 rounded-lg px-4 py-2 text-sm text-green-400">
                Execution Status: Success
              </div>

            </div>

            {error && (

              <div className="mb-4 bg-red-500/10 border border-red-500 rounded-xl p-4">

                <h3 className="text-red-400 font-semibold mb-2">
                  Query Failed
                </h3>

                <p className="text-sm text-zinc-300 font-mono overflow-x-auto">
                  {error}
                </p>

              </div>

            )}

            <div className="overflow-x-auto rounded-xl overflow-hidden border border-zinc-700">

              <table className="w-full border-collapse">

                <thead className="bg-black/50">

                  <tr>

                    {results.length > 0 &&
                      Object.keys(results[0]).map((column) => (

                        <th
                          key={column}
                          className="border border-zinc-700 px-6 py-4 text-left text-zinc-300"
                        >
                          {column}
                        </th>

                      ))}

                  </tr>

                </thead>

                <tbody>

                  {results.map((row, index) => (

                    <tr
                      key={index}
                      className="hover:bg-zinc-800/40 transition-all duration-200"
                    >

                      {Object.values(row).map((value: any, idx) => (

                        <td
                          key={idx}
                          className="border border-zinc-700 px-6 py-4"
                        >
                          {String(value)}
                        </td>

                      ))}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="mt-6">

              {solved ? (

                <div className="bg-green-500/10 border border-green-500 rounded-2xl p-8 animate-pulse shadow-2xl shadow-green-500/30">

                  <h3 className="text-green-400 text-4xl font-black mb-4">
                    🎉 CASE CLOSED 🎉
                  </h3>

                  <p className="text-zinc-200 text-lg leading-8 mb-6">

                    Outstanding work, Investigator.

                    You completed all 5 operational investigations
                    and successfully uncovered the warehouse responsible
                    for the largest inventory loss in the network.

                  </p>

                  <div className="bg-black/40 border border-green-500/20 rounded-xl p-5 mb-6">

                    <p className="text-2xl font-bold text-green-400 mb-2">
                      Final Score: 10/10
                    </p>

                    <p className="text-zinc-300">
                      SQLVerse Supply Chain Investigation Series Completed Successfully.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      router.push("/series")
                    }
                    className="mt-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200 text-black font-bold px-6 py-4 rounded-xl shadow-lg shadow-green-500/30"
                  >
                    🏠 Return to SQLVerse Home
                  </button>

                </div>

              ) : attempted ? (

                <div className="bg-red-500/10 border border-red-500 rounded-2xl p-6">

                  <h3 className="text-red-400 text-2xl font-bold mb-3">
                    Investigation Ongoing
                  </h3>

                  <p className="text-zinc-300 leading-7">
                    The operational audit findings remain incomplete.
                    Review your ranking logic and missing inventory aggregation carefully.
                  </p>

                </div>

              ) : (

                <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-6">

                  <h3 className="text-yellow-300 text-2xl font-bold mb-3">
                    Awaiting Investigation
                  </h3>

                  <p className="text-zinc-300 leading-7">
                    Run your final SQL investigation to uncover the warehouse
                    responsible for the largest inventory loss.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* HINT MODAL */}
      {showHint && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-[550px]">

            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Detective Hint
            </h2>

            {!revealHint ? (

              <div>

                <p className="text-zinc-300 leading-7 mb-6">
                  Final investigations require patience.
                  Reveal this clue only if the audit trail has stalled.
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => setRevealHint(true)}
                    className="bg-yellow-500 hover:scale-105 hover:brightness-110 transition-all duration-200 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-yellow-500/20"
                  >
                    Reveal Hint
                  </button>

                  <button
                    onClick={() => setShowHint(false)}
                    className="border border-zinc-600 px-5 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <div>

                <p className="text-zinc-300 leading-7 mb-6">
                  Aggregate missing shipment values warehouse-wise first.
                  Then rank warehouses based on total inventory loss
                  to identify the highest operational risk facility.
                </p>

                <button
                  onClick={() => {
                    setShowHint(false);
                    setRevealHint(false);
                  }}
                  className="bg-green-500 hover:scale-105 hover:bg-green-400 transition-all duration-200 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-green-500/20"
                >
                  Continue Investigation
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  );
}