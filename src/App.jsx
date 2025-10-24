import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await axios.get("http://localhost:3000/students");
    setStudents(res.data);
  };

  const addStudent = async () => {
    if (!name || !marks) return alert("Name aur marks likho!");
    await axios.post("http://localhost:3000/students", {
      name,
      marks: Number(marks),
    });
    setName("");
    setMarks("");
    loadStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:3000/students/${id}`);
    loadStudents();
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setMarks(student.marks);
  };

  const updateStudent = async () => {
    await axios.put(`http://localhost:3000/students/${editId}`, {
      name,
      marks: Number(marks),
    });
    setEditId(null);
    setName("");
    setMarks("");
    loadStudents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10">
      {/* 🔹 Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🎓 Student Manager</h1>

      {/* 🔹 Form */}
      <div className="bg-white p-6 rounded-2xl shadow-xl flex gap-4 mb-8 w-[90%] max-w-xl">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        {editId ? (
          <button
            onClick={updateStudent}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Update
          </button>
        ) : (
          <button
            onClick={addStudent}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        )}
      </div>

      {/* 🔹 Students List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-xl">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Students List</h2>
        <ul className="divide-y divide-gray-200">
          {students.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center py-3 hover:bg-blue-50 px-3 rounded-lg"
            >
              <span className="text-gray-800 font-medium">
                {s.name} — <span className="text-blue-600">{s.marks}</span> marks
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(s)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(s.id)}
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
