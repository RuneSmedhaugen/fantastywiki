import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetch("http://localhost:5000/entries")
      .then((res) => res.json())
      .then((data) => setNews(data.filter((e) => e.type === "news").slice(0, 5)))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      {/* Main left column */}
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl font-bold text-violet-300 drop-shadow-lg">
          The A.R.C-hives
        </h1>
        <p className="text-gray-300 text-lg">
          Welcome{user ? ` back, ${user.username}` : ""}! Explore the latest updates and dive into our archives.
        </p>

        {/* Latest News + Sidebar side-by-side */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Latest News */}
          <section className="flex-1">
            <details
              open
              className="group bg-gray-900/60 backdrop-blur-md border border-violet-500 rounded-lg shadow-xl"
            >
              <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-violet-400 group-open:rounded-b-none hover:text-violet-300">
                Latest News
              </summary>

              <div className="px-6 py-4 space-y-4">
                {news.map((item) => (
                  <div
                    key={item._id}
                    className="bg-black/30 border border-indigo-600 p-4 rounded-lg shadow hover:shadow-violet-500/20 transition"
                  >
                    <Link
                      to={`/entry/news/${item._id}`}
                      className="text-lg font-semibold text-indigo-400 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-gray-400 mt-1">{item.summary}</p>
                  </div>
                ))}
              </div>
            </details>
          </section>

          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <Sidebar />
          </div>
        </div>

        {/* Optional: more home page content here */}
      </div>
    </div>
  );
};

export default Home;
