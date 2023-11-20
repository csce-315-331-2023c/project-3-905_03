import axios from "axios";

export interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  note?: string;
}

export class Order {
  public receipt: Item[] = [];
  public total: number = 0;
  public sender_id: number = 0;
  public split: boolean = false;
  public dineIn: boolean = false;
  private tax = 0.07;

  constructor(order?: Order) {
    if (order) {
      this.sender_id = order.sender_id;
      this.receipt = [...order.receipt];
      this.total = order.total;
      this.split = order.split;
      this.dineIn = order.dineIn;
      this.tax = order.tax;
    }
  }
  // 

  // change object

  addItem(adding: Item): this {
    this.receipt.push(adding);
    this.total += adding.price;
    // add price of add ons
    return this;
  }

  removeItem(removing: Item): this {
    
    for (let i = 0; i < this.receipt.length; i++) {
      if (this.receipt[i] === removing) {
        this.receipt.splice(i, 1);
        break;
      }
    }

    this.total -= removing.price;
    // remove price of add ons
    return this;
  }

  undo(): this {
    return this.removeItem(this.receipt[this.receipt.length - 1]);
  }

  setDineIn(isDineIn: boolean): this {
    this.dineIn = isDineIn;
    return this;
  }

  // get info

  getOrderTotal(): string {
    return this.total.toFixed(2);
  }

  splitOrder(): string {
    return (this.total / 2).toFixed(2);
  }

  getReceiptString(): string {
    return JSON.stringify(this.receipt);
  }

  setReceipt(receipt: Item[]): void {
    this.receipt = receipt;
  }

  // complete order

  cancel(): void {
    this.receipt = [];
  }

  checkout(): void {
    // implementation for checkout
    console.log("checkout ! ! !");
    console.log(this);

    axios.post('/submitOrder', this)
      .catch(err => console.log(err));
  }
}
