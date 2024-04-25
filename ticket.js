let { currentId, ticketsArray } = require("./db")

class Ticket {
  constructor(name, description) {
    currentId ++;
    this.id = currentId;
    this.name = name;
    this.description = description;
    this.status = false;
    this.created = new Date();
    ticketsArray.push(this);
  }

  get ticket() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created,
    }
  }

  get ticketFull() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      created: this.created,
    }
  }
}

module.exports = Ticket;
