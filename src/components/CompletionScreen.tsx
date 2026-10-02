interface CompletionScreenProps {
  playerName: string;
  onContinue: () => void;
}

export default function CompletionScreen({
  playerName,
  onContinue,
}: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-[#120700] text-[#ffe5a6] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl text-center">

        {/* GAME COMPLETED IMAGE */}
        <img
          src="/assets/heritage-conquest-completed.png"
          alt="Heritage Conquest Completed"
          className="w-full max-w-3xl mx-auto rounded-2xl border border-[#b88632] shadow-2xl mb-8"
        />

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#ffcf70] mb-4">
          HERITAGE CONQUEST COMPLETE!
        </h1>

        {/* PERSONALIZED MESSAGE */}
        <p className="text-xl md:text-2xl mb-3">
          Congratulations, <span className="text-[#ffcf70] font-bold">
            {playerName}
          </span>!
        </p>

        <p className="text-lg text-[#e8d5b5] max-w-2xl mx-auto mb-8">
          You successfully completed the Heritage Conquest adventure,
          collected all 10 Time Crystals, and restored the Time Machine.
        </p>

        {/* STATS */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">

          <div className="border border-[#b88632] rounded-xl px-8 py-4">
            <p className="text-[#c99b45] text-sm">MONUMENTS</p>
            <p className="text-2xl font-bold">10 / 10</p>
          </div>

          <div className="border border-[#b88632] rounded-xl px-8 py-4">
            <p className="text-[#c99b45] text-sm">TIME CRYSTALS</p>
            <p className="text-2xl font-bold">10 / 10</p>
          </div>

          <div className="border border-[#b88632] rounded-xl px-8 py-4">
            <p className="text-[#c99b45] text-sm">STATUS</p>
            <p className="text-2xl font-bold">COMPLETED</p>
          </div>

        </div>

        {/* CONTINUE */}
        <button
          onClick={onContinue}
          className="px-8 py-4 rounded-xl bg-[#ffcf70] text-black font-bold text-lg hover:bg-[#ffe5a6] transition"
        >
          Continue to Certificate
        </button>

      </div>
    </div>
  );
}
