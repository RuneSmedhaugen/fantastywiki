// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import CreateEntrySelector from './pages/CreateEntrySelector';
import CreateEntry from './pages/CreateEntry';
import AdminPanel from './pages/AdminPanel';
import EntryDetail from './pages/EntryDetail';
import CategoryEntries from './pages/CategoryEntries';
import EditEntry from './components/EditEntry';
import SuperAdminPanel from './pages/SuperAdminPanel';
import './App.css';


function App() {
  const handleSearch = (query) => {
    // Handle search logic here
    console.log('Search query:', query);
  };

  

  return (
    <Router>
      <Header onSearch={handleSearch} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/create-entry" element={<CreateEntrySelector />} />
          <Route path="/edit-entry/:type/:id" element={<EditEntry />} />
          <Route path="/create-entry/:type" element={<CreateEntry />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/superadmin" element={<SuperAdminPanel />} />
          <Route path="/entry/:type/:id" element={<EntryDetail />} />
          <Route path="/entries" element={<CategoryEntries />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;