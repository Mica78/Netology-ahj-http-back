const http = require('http');
const Koa = require("koa");
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");

const Ticket = require("./ticket");
let { ticketsArray, currentId } = require("./db")

new Ticket("Тестовое название", "Тестовый текст");

const app = new Koa();

app.use(cors());

app.use(
  koaBody({
    urlencoded:true,
  })
);

app.use(async(ctx, next) => {
  // console.log(ctx)
  const { method } = ctx.request.query;

  switch (method) {

    case 'allTickets':
      const resultArrayForSend = [];
      if(ctx.request.method !== "GET") {
        ctx.response.body = { error: "Bad method"};
        return
      }
      ticketsArray.forEach((ticket) => {
        resultArrayForSend.push(ticket.ticket)
      })
      ctx.response.body = resultArrayForSend;
      // console.log("fromall", ticketsArray)
      return;

    case 'ticketById':
      if(ctx.request.method !== "GET") {
        ctx.response.body = { error: "Bad method"};
        return
      }
      const resultTicket = ticketsArray.find((ticket) => ticket.id === parseInt(ctx.request.query.id));
      ctx.response.body = resultTicket;
      return;

    case 'createTicket':
      if(ctx.request.method !== "POST") {
        ctx.response.body = { error: "Bad method"};
        return;
      }
      if (!ctx.request.body) {
        return
      }
      const ticket = new Ticket(ctx.request.body.name, ctx.request.body.description);
      // ticketsArray.push(ticket)
      ctx.response.body = ticket.ticketFull;
      console.log("new", ticketsArray)
      return;

    case 'deleteTicketById':
      if(ctx.request.method !== "DELETE") {
        ctx.response.body = { error: "Bad method"};
        return;
      }
      const idx = ticketsArray.findIndex((ticket) => ticket.id === parseInt(ctx.request.query.id));
      if(idx === -1) {
        ctx.response.body = { status: "Ticket not exists"};
        return
      }
      console.log(ticketsArray)
      ticketsArray.splice(idx, 1)
      console.log(ticketsArray)
      ctx.response.body = { status: "OK"};
      return;

    case 'patchTicketById':
      // console.log(ctx.request)
      if(ctx.request.method !== "PATCH") {
        ctx.response.body = { error: "Bad method"};
        return;
      }
      if (!ctx.request.body) {
        return
      }
      const patchedTicket = ticketsArray.find((ticket) => ticket.id === parseInt(ctx.request.query.id));
      // console.log(patchedTicket)
      // let resultsArrayForPatch = ticketsArray.filter((ticket) => ticket.id !== parseInt(ctx.request.query.id));
      if(!patchedTicket) {
        ctx.response.body = { status: "Ticket not exists"};
        return
      }

      for (const el in ctx.request.body) {
        patchedTicket[el] = ctx.request.body[el]
      }

      ctx.response.body = { status: "OK"};
      return;

    default:
      ctx.response.status = 404;
      return;
  }
})


const server = http.createServer(app.callback());

const port = 7000;

server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Server listen")

})
