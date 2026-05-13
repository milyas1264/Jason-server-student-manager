import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
      setError("");
    } catch {
      setError("Student data server is not running. Start it with npm run api.");
    }
  };

  const resetForm = () => {
    setName("");
    setMarks("");
    setEditId(null);
  };

  const addStudent = async () => {
    if (!name.trim() || !marks) return alert("Name aur marks likho!");

    await api.post("/students", {
      name: name.trim(),
      marks: Number(marks),
    });
    resetForm();
    loadStudents();
  };

  const deleteStudent = async (id) => {
    await api.delete(`/students/${id}`);
    loadStudents();
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setMarks(String(student.marks));
  };

  const updateStudent = async () => {
    if (!name.trim() || !marks) return alert("Name aur marks likho!");

    await api.put(`/students/${editId}`, {
      name: name.trim(),
      marks: Number(marks),
    });
    resetForm();
    loadStudents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Student Manager</h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xl">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 sm:w-32 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={editId ? updateStudent : addStudent}
          className={`text-white px-4 py-2 rounded-lg transition ${
            editId ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 w-full max-w-xl">
          {error}
        </p>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Students List</h2>
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li
              key={student.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3 hover:bg-blue-50 px-3 rounded-lg"
            >
              <span className="text-gray-800 font-medium">
                {student.name} - <span className="text-blue-600">{student.marks}</span> marks
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(student)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
