export const registerUser = async (userData) => {
  const response = await fetch("http://localhost:5001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (data.done) {
    return true;
  } else {
    return false;
  }
};

export const loginUser = async (userData) => {
  const response = await fetch("http://localhost:5001/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (data.done) {
    return true;
  } else {
    return false;
  }
};
