import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.API_PORT || 3001);
const DB_FILE = new URL("../db.json", import.meta.url);

const readStudents = async () => {
  const db = JSON.parse(await readFile(DB_FILE, "utf8"));
  return Array.isArray(db.students) ? db.students : [];
};

const writeStudents = async (students) => {
  await writeFile(DB_FILE, `${JSON.stringify({ students }, null, 2)}\n`);
};

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return sendJson(res, 204, {});
    }

    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const match = url.pathname.match(/^\/students\/?([^/]*)?$/);

    if (!match) {
      return sendJson(res, 404, { message: "Not found" });
    }

    const id = match[1];
    const students = await readStudents();

    if (req.method === "GET" && !id) {
      return sendJson(res, 200, students);
    }

    if (req.method === "POST" && !id) {
      const body = await readBody(req);
      const student = { ...body, id: randomUUID().slice(0, 8) };
      await writeStudents([...students, student]);
      return sendJson(res, 201, student);
    }

    const studentIndex = students.findIndex((student) => String(student.id) === id);
    if (studentIndex === -1) {
      return sendJson(res, 404, { message: "Student not found" });
    }

    if (req.method === "PUT") {
      const body = await readBody(req);
      const updated = { ...students[studentIndex], ...body, id };
      students[studentIndex] = updated;
      await writeStudents(students);
      return sendJson(res, 200, updated);
    }

    if (req.method === "DELETE") {
      const deleted = students[studentIndex];
      await writeStudents(students.filter((student) => String(student.id) !== id));
      return sendJson(res, 200, deleted);
    }

    return sendJson(res, 405, { message: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { message: error.message || "Server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Student API running at http://127.0.0.1:${PORT}/students`);
});
