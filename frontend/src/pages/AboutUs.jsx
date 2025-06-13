import React from "react";

const AboutUs = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 text-white">
    <h1 className="text-4xl font-bold text-violet-300 mb-6 drop-shadow-lg">About Us</h1>
    <p className="mb-8 text-lg text-gray-300">
      Welcome to FantastyWiki, where sarcasm is our native tongue, caffeine is our lifeblood, and fantasy is our full-time job (unpaid, of course). Meet the trio behind the curtain:
    </p>

    {/* Swoyer */}
    <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-900/60 border border-violet-700 rounded-lg p-6 shadow-lg">
      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-5xl text-violet-400 font-bold">
        {/* PLACEHOLDER: Swoyer's Image */}
        [Swo]
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-violet-200 mb-1">Swoyer</h2>
        <p className="text-gray-400 mb-1">35 years old • Norway • Male</p>
        <p className="text-gray-300">
          Chill, fun ginger with a heart for cats and a history of being a (washed up) gamer. Swoyer is the original owner of this fantasy world’s idea and the mastermind behind the website. If you spot a bug, he probably named it after a League of Legends champion. Sarcasm level: 9001.
        </p>
      </div>
    </div>

    {/* Orbilo */}
    <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-900/60 border border-cyan-700 rounded-lg p-6 shadow-lg">
      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-5xl text-cyan-400 font-bold">
        {/* PLACEHOLDER: Orbilo's Image */}
        [Orb]
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-cyan-200 mb-1">Orbilo</h2>
        <p className="text-gray-400 mb-1">29 years old • Austria/Poland • Male</p>
        <p className="text-gray-300">
          The CEO (Chief Entry Officer) and creative director, Orbilo brings the banter, the stories, and the “what if we did this?” energy. Gamer, planner, and the only person who can out-sarcasm Swoyer. If you see a wild plot twist, blame him. He's also bad.
        </p>
      </div>
    </div>

    {/* CharityCase */}
    <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-900/60 border border-pink-700 rounded-lg p-6 shadow-lg">
      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-5xl text-pink-400 font-bold">
        {/* PLACEHOLDER: CharityCase's Image */}
        [CCE]
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-pink-200 mb-1">CharityCase</h2>
        <p className="text-gray-400 mb-1">37 years old • Norway • Female</p>
        <p className="text-gray-300">
          Designer, hobby collector, and the only person here with enough ADHD to multitask in four dimensions. From painting and modelling to Photoshop wizardry, she brings the color and the chaos. If it looks good, she did it. If it sparkles, she probably added glitter.
        </p>
      </div>
    </div>

    <div className="text-center text-gray-400 mt-8 italic">
      FantastyWiki: Where fantasy meets fun, and the staff meetings are 80% memes, 20% productivity.
    </div>
  </div>
);

export default AboutUs;