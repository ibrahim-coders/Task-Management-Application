import { useContext, useState } from 'react';
import {
  HomeIcon,
  InboxIcon,
  CalendarIcon,
  FolderIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../AuthContext/AuthPrvider';

const Navber = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: HomeIcon, count: 0 },
    { name: 'Inbox', icon: InboxIcon, count: 5 },
    { name: 'Today', icon: CalendarIcon, count: 3 },
    { name: 'Upcoming', icon: FolderIcon, count: 12 },
    { name: 'Projects', icon: UsersIcon, count: 7 },
  ];

  const { logout } = useContext(AuthContext);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed left-4 top-4 z-30 p-2 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="h-0.5 w-6 bg-gray-600 mb-1"></div>
        <div className="h-0.5 w-6 bg-gray-600 mb-1"></div>
        <div className="h-0.5 w-6 bg-gray-600"></div>
      </button>

      {/* Overlay for Mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-screen w-64 transform transition-transform duration-200 ease-in-out
          bg-white border-r border-gray-200
          ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 px-2">Todo App</h2>
        </div>

        <nav className="mt-4">
          {menuItems.map(item => (
            <a
              key={item.name}
              href="#"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {item.count > 0 && (
                <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </a>
          ))}
          <a
            onClick={logout}
            href="#"
            className="flex items-center px-6 py-3 text-red-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="flex-1">Logout</span>
          </a>
        </nav>

        {/* Projects Section */}
        <div className="px-6 mt-8">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Projects
          </div>
          <div className="space-y-2">
            {['Work', 'Personal', 'Shopping'].map(project => (
              <a
                key={project}
                href="#"
                className="flex items-center text-gray-700 hover:bg-gray-100 px-2 py-2 rounded transition-colors"
              >
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                {project}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navber;
