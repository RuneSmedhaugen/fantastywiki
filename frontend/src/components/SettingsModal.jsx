import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
    onLogout();
    onClose();
    navigate('/');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-gray-900 border border-indigo-500 px-6 py-6 text-left shadow-xl transition-all w-full max-w-sm text-white backdrop-blur-md">
                <Dialog.Title className="text-lg font-bold text-indigo-300 mb-6">
                  Settings
                </Dialog.Title>

                <div className="space-y-4 text-sm">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 bg-indigo-700/40 border border-indigo-400 rounded hover:bg-indigo-600/60 transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      navigate('/account-settings');
                    }}
                    className="w-full text-left px-4 py-2 bg-cyan-700/30 border border-cyan-400 rounded hover:bg-cyan-600/50 transition"
                  >
                    Account Settings
                  </button>

                  {user && (user.role === 'admin' || user.role === 'superadmin') && (
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 bg-yellow-100/10 text-yellow-300 border border-yellow-500 rounded hover:bg-yellow-200/10 transition"
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 bg-red-500/10 text-red-400 border border-red-500 rounded hover:bg-red-500/20 transition"
                  >
                    Log Out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SettingsModal;
