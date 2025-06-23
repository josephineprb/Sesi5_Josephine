const assert = require("assert");

describe("Login", function () {

  it("GET list", async function () {
    const response = await fetch("https://reqres.in/api/users?page=2");
    const data = await response.json();

    assert.strictEqual(response.status, 200);
  });

  it("POST Create", async function () {
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "x-api-key": "reqres-free-v1", // optional
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "morpheus",
        job: "leader",
      }),
    });

    const data = await response.json();
    console.log(data);

    assert.strictEqual(data.job, "leader");
  });

  it("PATCH Update", async function () {
    const response = await fetch("https://reqres.in/api/users/2", {
      method: "PATCH",
      headers: {
        "x-api-key": "reqres-free-v1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "morpheus",
        job: "zion resident",
      }),
    });

    const data = await response.json();
    console.log(data);

    assert.strictEqual(data.name, "morpheus");
  });

  it("DELETE Del", async function () {
    const response = await fetch("https://reqres.in/api/users/2", {
      method: "DELETE",
      headers: {
        "x-api-key": "reqres-free-v1",
        "Content-Type": "application/json",
      },
    });

    assert.strictEqual(response.status, 204);
  });
});
