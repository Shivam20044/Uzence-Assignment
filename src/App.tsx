import React, { useMemo, useState } from 'react';
import InputField from './components/InputField/InputField';
import DataTable, { Column } from './components/DataTable/DataTable';
import './index.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialData: User[] = [
  { id: 1, name: 'Shivam Kumar', email: 'shivamkumar23302@gmail.com', role: 'Admin' },
  { id: 2, name: 'Shashank', email: 'shashank1234@gmail.com', role: 'User' },
  { id: 3, name: 'Lohia', email: 'lohia1234@gmail.com', role: 'Admin' },
];

function App() {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  const columns: Column<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
    { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
  ];

  const handleSearch = (term?: string) => {
    if (isLoading) return;
    const q = term ?? query;
    setIsLoading(true);
    window.setTimeout(() => {
      setAppliedQuery(q);
      setIsLoading(false);
    }, 900);
  };

  const resetSearch = () => {
    if (isLoading) return;
    setQuery('');
    setAppliedQuery('');
  };

  const toggleDarkMode = () => {
    setDarkMode((s) => !s);
    document.documentElement.classList.toggle('dark');
  };

  const filtered = useMemo(() => {
    const q = (appliedQuery || query).trim().toLowerCase();
    if (!q) return initialData;
    return initialData.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [query, appliedQuery]);

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">React Components Assignment — Demo</h1>

        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 bg-indigo-700 text-white rounded hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-pressed={darkMode}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Search users</h2>

        <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="w-full flex flex-col md:flex-row md:items-stretch gap-3 mb-6"
>
  <div className="flex-1">
    <InputField
      label="Search by name, email, or role"
      placeholder="Type to search..."
      showClearButton
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onEnter={() => handleSearch()}
      helperText="Press Enter or click Search"
      size="md"
      variant="outlined"
    />
  </div>

  <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 md:ml-3">
    <button
      type="submit"
      onClick={() => handleSearch()}
      className={`flex items-center justify-center gap-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-300
        ${isLoading ? 'bg-indigo-400 text-white cursor-not-allowed h-10' : 'bg-indigo-600 text-white hover:bg-indigo-700 h-10'}`}
      aria-label="Search"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
          </svg>
          <span className="font-medium">Searching…</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <span className="font-medium">Search</span>
        </>
      )}
    </button>

    <button
      type="button"
      onClick={() => resetSearch()}
      className="flex items-center justify-center gap-2 px-3 h-10 bg-white text-indigo-700 border border-indigo-300 rounded shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      aria-label="Reset search"
      disabled={isLoading}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M6 18a8 8 0 1112 0" />
      </svg>
      <span className="text-sm">Reset</span>
    </button>
  </div>
</form>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowEmptyState((s) => !s)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {showEmptyState ? 'Show Data' : 'Show Empty State'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Users</h2>

        <DataTable
          data={showEmptyState ? [] : filtered}
          columns={columns}
          loading={isLoading}
          selectable
          selectMode="multiple"
          onRowSelect={(rows: User[]) => setSelectedRows(rows)}
        />

        <div className="mt-4">
          <p>Selected {selectedRows.length} rows</p>
          {selectedRows.length > 0 && (
            <ul className="mt-2 list-disc ml-6">
              {selectedRows.map((r) => (
                <li key={r.id}>
                  {r.name} ({r.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
