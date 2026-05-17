export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            QueryVerse
          </h1>

          <p className="text-zinc-400 mt-2 text-lg">
            Learn SQL through stories.
          </p>
        </div>

        <button className="bg-green-500 hover:bg-green-400 text-black px-5 py-3 rounded-xl font-semibold">
          Start Playing
        </button>
      </div>

      {/* SERIES SECTION */}
      <div>
        <h2 className="text-3xl font-bold mb-6">
          Featured Series
        </h2>

        <div className="grid grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-green-500 transition-all">

            <div className="h-52 bg-gradient-to-br from-green-500/20 to-black p-6 flex flex-col justify-end">
              <p className="text-green-400 font-semibold mb-2">
                THRILLER • INTERMEDIATE
              </p>

              <h3 className="text-3xl font-bold">
                Supply Chain Detective
              </h3>
            </div>

            <div className="p-6">
              <p className="text-zinc-400 leading-7">
                Investigate missing shipments, warehouse fraud,
                return scams, and operational anomalies using SQL.
              </p>

              <button className="mt-6 w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-xl">
                Continue Investigation
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-500 transition-all">

            <div className="h-52 bg-gradient-to-br from-yellow-500/20 to-black p-6 flex flex-col justify-end">
              <p className="text-yellow-400 font-semibold mb-2">
                COMEDY • BEGINNER
              </p>

              <h3 className="text-3xl font-bold">
                Startup Chaos
              </h3>
            </div>

            <div className="p-6">
              <p className="text-zinc-400 leading-7">
                Debug hilarious startup disasters, broken dashboards,
                duplicate users, and accidental production incidents.
              </p>

              <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl">
                Start Chaos
              </button>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500 transition-all">

            <div className="h-52 bg-gradient-to-br from-cyan-500/20 to-black p-6 flex flex-col justify-end">
              <p className="text-cyan-400 font-semibold mb-2">
                CYBER CRIME • ADVANCED
              </p>

              <h3 className="text-3xl font-bold">
                Cyber Crime Unit
              </h3>
            </div>

            <div className="p-6">
              <p className="text-zinc-400 leading-7">
                Analyze suspicious logins, data breaches,
                malware attacks, and hidden intrusion patterns.
              </p>

              <button className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl">
                Enter Unit
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
} 