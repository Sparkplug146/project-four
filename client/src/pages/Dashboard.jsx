import { useEffect, useState } from "react";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid black",
          padding: "10px",
          overflowY: "auto"
        }}
      >
        <h3>Categories</h3>

        {categories.map((cat) => (
          <p key={cat.id}>{cat.name}</p>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Select a Category to view its questions</h2>
      </div>
    </div>
  );
}