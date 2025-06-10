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
import Footer from './components/Footer';
import Contact from './pages/Contact';
import AdminContact from './pages/AdminContact';
import HandleContact from './pages/HandleContact';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TOS from './pages/TOS';


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
          <Route path="/contact" element={<Contact />} />
          <Route path="/adminContact" element={<AdminContact />} />
          <Route path="/handlecontact/:id" element={<HandleContact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/entries" element={<CategoryEntries />} />
        </Routes>
      </main>
    <Footer />
    </Router>
  );
}

export default App;