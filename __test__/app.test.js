"use strict";
const server = require("../src/server");
const supertest = require("supertest");
const request = supertest(server.app);
const { db } = require("../src/models/index");

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe("server", () => {
  it("should get status 404", async () => {
    const response = await request.get("/foo");
    expect(response.status).toBe(404);
  });

  it("should  get status 200", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
  });
});

describe("test post requests ", () => {
  it("test sign up", async () => {
    const response = await request.post("/signup").send({
      username: "saad01",
      password: "000",
    });
    expect(response.status).toBe(201);
  });
  it("test sign in", async () => {
    const response = await request.post("/signin").auth("saad01", "000");
    expect(response.status).toBe(200);
  });
  it("test invalid password ", async () => {
    const response = await request.post("/signin").auth("saad01", "010");
    expect(response.status).toBe(500);
  });
  it("test invalid username ", async () => {
    const response = await request.post("/signin").auth("saed", "000");
    expect(response.status).toBe(500);
  });
});
