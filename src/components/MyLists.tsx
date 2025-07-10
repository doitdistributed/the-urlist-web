import { useEffect, useState } from "react";
import { Button } from "./Button";

export function MyLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/lists")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lists");
        return res.json();
      })
      .then(setLists)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading lists...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!lists.length) return <div className="text-gray-500">No lists found.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {lists.map((list) => (
        <a
          key={list.id}
          href={`/list/${list.slug}`}
          className="block p-6 bg-white rounded-xl shadow border border-gray-200 hover:border-[#15BFAE]/40 transition-all"
        >
          <h2 className="text-xl font-semibold text-[#15BFAE] mb-2">{list.title}</h2>
          {list.description && (
            <p className="text-gray-600 mb-2">{list.description}</p>
          )}
          <div className="text-xs text-gray-400">Created {new Date(list.created_at).toLocaleString()}</div>
        </a>
      ))}
    </div>
  );
}
