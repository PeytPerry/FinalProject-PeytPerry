function logRequest(method, url, status, data = null) {
  document.getElementById("lastRequest").textContent = `${method} ${url}`;
  document.getElementById("lastResponse").textContent = `Status: ${status}`;
  console.log(`${method} ${url} - Status: ${status}`, data ? data : "");
}

function showStatus(elementId, message, isError = false) {
  const statusElement = document.getElementById(elementId);
  statusElement.textContent = message;
  statusElement.className = `status-message ${isError ? "error" : "success"}`;

  setTimeout(() => {
    statusElement.textContent = "";
    statusElement.className = "status-message";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("upsertForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      upsertStudent();
    });

  document
    .getElementById("loadAllStudents")
    .addEventListener("click", loadAllStudents);

  loadAllStudents();
});

async function loadAllStudents() {
  try {
    const studentsList = document.getElementById("studentsList");
    studentsList.innerHTML = "<p>Loading students...</p>";

    const response = await fetch(`/api/upsertStudent`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let students = [];
    if (response.ok) {
      try {
        students = await response.json();
      } catch (e) {
        console.error("Error parsing student data:", e);
      }
    }

    logRequest("GET", "/api/upsertStudent", response.status);
    displayStudents(students);
  } catch (error) {
    console.error("Error loading students:", error);
    showStatus(
      "studentsList",
      `Error loading students: ${error.message}`,
      true
    );
  }
}

function displayStudents(students) {
  const listElement = document.getElementById("studentsList");

  if (!students || students.length === 0) {
    listElement.innerHTML = "<p>No students found.</p>";
    return;
  }

  listElement.innerHTML = "";
  students.forEach((student) => {
    const studentElement = document.createElement("div");
    studentElement.className = "student-item";

    const studentInfo = document.createElement("div");
    studentInfo.className = "student-info";
    studentInfo.textContent = `ID: ${student.id} | Name: ${student.name} | Age: ${student.age}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
      deleteStudent(student.id);
    };

    studentElement.appendChild(studentInfo);
    studentElement.appendChild(deleteButton);
    listElement.appendChild(studentElement);
  });
}

async function upsertStudent() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (!name || !age) {
    showStatus("upsertStatus", "Name and age are required!", true);
    return;
  }

  const data = { name, age: parseInt(age) };
  if (id) data.id = parseInt(id);

  try {
    const response = await fetch("/api/upsertStudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    logRequest("POST", "/api/upsertStudent", response.status, data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    showStatus(
      "upsertStatus",
      `Student ${id ? "updated" : "created"} successfully!`
    );

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";

    loadAllStudents();
  } catch (error) {
    showStatus("upsertStatus", `Error: ${error.message}`, true);
  }
}

async function getStudent() {
  const id = document.getElementById("getId").value;
  const resultElement = document.getElementById("getResult");

  if (!id) {
    resultElement.innerText = "Please enter a student ID";
    return;
  }

  try {
    const response = await fetch(`/api/getStudent/${id}`);
    logRequest("GET", `/api/getStudent/${id}`, response.status);

    if (response.status === 404) {
      resultElement.innerText = "Student not found";
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    resultElement.innerText = JSON.stringify(result, null, 2);
  } catch (error) {
    resultElement.innerText = "Error: " + error.message;
  }
}

async function deleteStudent(id = null) {
  if (!id) {
    id = document.getElementById("deleteId").value;
  }

  if (!id) {
    showStatus("deleteStatus", "Please enter a student ID", true);
    return;
  }

  try {
    const response = await fetch(`/api/deleteStudent/${id}`, {
      method: "DELETE",
    });

    logRequest("DELETE", `/api/deleteStudent/${id}`, response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    showStatus(
      "deleteStatus",
      result.message || "Student deleted successfully"
    );

    if (!id) {
      document.getElementById("deleteId").value = "";
    }

    loadAllStudents();
  } catch (error) {
    showStatus("deleteStatus", `Error: ${error.message}`, true);
  }
}
