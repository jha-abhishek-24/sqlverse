"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { useRouter } from "next/navigation";

export default function EpisodeFour() {
  const router = useRouter();

  const [query, setQuery] = useState(`SELECT * 
FROM shipment_logs;`);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [revealHint, setRevealHint] = useState(false);

  const expectedQuery = `
SELECT
    'WH_BLR_09' AS warehouse_id,
    'S007' AS shipment_id,
    710000 AS item_value

UNION ALL

SELECT
    'WH_HYD_07' AS warehouse_id,
    'S006' AS shipment_id,
    30000 AS item_value
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

      // expected output
      const expectedResult = await conn.query(expectedQuery);

      const expectedRows = expectedResult.toArray();

      const cleanedUser = userRows.map((row: any) => ({
        warehouse_id: String(row.warehouse_id),
        shipment_id: String(row.shipment_id),
        item_value: Number(row.item_value),
      }));

      const cleanedExpected = expectedRows.map((row: any) => ({
        warehouse_id: String(row.warehouse_id),
        shipment_id: String(row.shipment_id),
        item_value: Number(row.item_value),
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
    <main className="min-h-screen bg-black text-white p-6">

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* LEFT PANEL */}
        <div className="col-span-3 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 sticky top-6">

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-green-400 font-semibold text-sm">
                EPISODE 4 / 5
              </p>
            </div>

            <div className="text-sm text-zinc-400">
              Score: {solved ? "8/10" : "6/10"}
            </div>

          </div>

          <div className="w-full bg-zinc-800 rounded-full h-3 mb-8 overflow-hidden">
            <div
              className={`h-full bg-green-500 transition-all duration-1000 ease-out ${
                solved ? "w-[80%]" : "w-[60%]"
              }`}
            ></div>
          </div>

          <h1 className="text-2xl font-bold mb-6 leading-tight">
            Phantom Inventory Trail
          </h1>

          <p className="text-zinc-300 leading-8">
            Audit teams uncovered repeated missing inventory incidents
            across multiple warehouses. Investigators now need to identify
            the single highest-value missing shipment per warehouse.
          </p>

          <div className="mt-8 bg-black border border-zinc-700 rounded-xl p-4">

            <h2 className="text-green-400 font-semibold mb-3">
              YOUR MISSION
            </h2>

            <p className="text-zinc-300 leading-7">
              Identify the highest-value missing shipment from each warehouse.
            </p>

          </div>

          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">

  <p className="text-yellow-200 text-sm leading-4">

    Investigation Note:
    String filters are case-sensitive.

    <br />

    Example:
    <span className="text-white font-mono">
      {" "}shipment_status = 'MISSING'
    </span>
    works,
    but
    <span className="text-white font-mono">
      {" "}shipment_status = 'missing'
    </span>
    does not.

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

                <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6 animate-pulse shadow-lg shadow-green-500/20">

                  <h3 className="text-green-400 text-2xl font-bold mb-3">
                    Investigation Complete
                  </h3>

                  <p className="text-zinc-300 leading-7">
                    You identified the highest-value missing shipment across each warehouse facility.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/series/supply-chain-detective/episode-5")
                    }
                    className="mt-6 animate-bounce bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-green-500/20"
                  >
                    Continue to Episode 5 →
                  </button>

                </div>

              ) : attempted ? (

                <div className="bg-red-500/10 border border-red-500 rounded-2xl p-6">

                  <h3 className="text-red-400 text-2xl font-bold mb-3">
                    Investigation Ongoing
                  </h3>

                  <p className="text-zinc-300 leading-7">
                    The inventory ranking analysis is incomplete.
                    Review your window function partitioning carefully.
                  </p>

                </div>

              ) : (

                <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-6">

                  <h3 className="text-yellow-300 text-2xl font-bold mb-3">
                    Awaiting Investigation
                  </h3>

                  <p className="text-zinc-300 leading-7">
                    Run your SQL investigation to uncover the highest-value missing shipments per warehouse.
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

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-[500px]">

            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Detective Hint
            </h2>

            {!revealHint ? (

              <div>

                <p className="text-zinc-300 leading-7 mb-6">
                  A great detective trusts observation before clues.
                  Reveal this hint only if the trail has gone cold.
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
                  Use ROW_NUMBER() to rank shipments inside each warehouse.
                  Partition the data warehouse-wise and identify the top-valued missing shipment.
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