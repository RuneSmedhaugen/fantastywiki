import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
    onLogout(); 
    onClose();
    navigate('/');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                >
                  Settings
                </Dialog.Title>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/account-settings');
                    }}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
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
