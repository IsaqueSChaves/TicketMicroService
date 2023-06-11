import request from "supertest";
import { app } from "../../app";

it("can fetch a list of tickets", async () => {
  request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asldkf",
      price: 20,
    })
    .expect(201);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(1);
});
