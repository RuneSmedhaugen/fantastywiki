// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    // fetch latest news
    fetch('http://localhost:5000/entries')
      .then(res => res.json())
      .then(data => setNews(data.filter(e => e.type === 'news').slice(0, 5)))
      .catch(console.error);

    // fetch categories
    fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(data => setCategories(data.map(c => c.name)))
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold">The A.R.C-hives</h1>
          <p className="text-gray-700">Welcome{user ? ` back, ${user.username}` : ''}! Explore the latest updates and dive into our archives.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
            <ul className="space-y-3">
              {news.map(item => (
                <li key={item._id} className="p-4 bg-white shadow rounded-lg">
                  <Link to={`/entry/news/${item._id}`} className="text-lg font-medium text-blue-600 hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Side panel */}
        <aside className="w-full md:w-1/4 space-y-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Browse by Category</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/entries?category=${cat}`} className="text-gray-700 hover:text-blue-600 hover:underline">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Home;