import request from "supertest";
import { app } from "../../app";

it("response with details about the current user", async () => {
  const signUpResponse = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);

  const cookie = signUpResponse.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  console.log(response.body.currentUser.email);

  expect(response.body.currentUser.email === "test@example.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser === null);
});
