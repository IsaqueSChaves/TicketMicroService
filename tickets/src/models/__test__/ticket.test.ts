import { Ticket } from "../ticket";

it("implements optimist concurrency control", async () => {
  const ticket = Ticket.build({
    title: "Artic Monkeys",
    price: 1000,
    userId: "AFASG465312",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 1500 });
  secondInstance!.set({ price: 2000 });
  await firstInstance!.save();

  await expect(secondInstance!.save()).rejects.toThrow();
});

it("implements optimist concurrency control", async () => {
  const ticket = Ticket.build({
    title: "Artic Monkeys",
    price: 1000,
    userId: "AFASG465312",
  });

  await ticket.save();

  const instance = await Ticket.findById(ticket.id);
  expect(instance!.version === 0);

  instance!.set({ price: 1500 });
  await instance!.save();

  const firstIncrementTicket = await Ticket.findById(ticket.id);
  expect(firstIncrementTicket!.version === 1);

  const secondInstance = await Ticket.findById(ticket.id);

  secondInstance!.set({ price: 2000 });
  await secondInstance!.save();

  const secondIncrementTicket = await Ticket.findById(ticket.id);
  expect(secondIncrementTicket!.version === 2);
});
