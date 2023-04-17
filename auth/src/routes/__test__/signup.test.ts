import request from "supertest";
import { app } from "../../app";

it("returns a 201 on sucessful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);
});

it("returns a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "@example.com", password: "password" })
    .expect(400);
});

it("returns a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "abc@example.com", password: "pas" })
    .expect(400);
});

it("returns a 400 on empty email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(400);
});

it("set a cookie after sucess signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
