
export interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export class Order {
  private receipt: Item[] = [];

  constructor() { }

  addItem(adding: Item): void {
    this.receipt.push(adding);
  }


  removeItem(removing: Item): void {
    this.receipt = this.receipt.filter((item) => item !== removing);
  }

  getOrderTotal(): string {
    const orderTotal = this.receipt.reduce((total, item) => total + item.price, 0);
    return orderTotal.toFixed(2);
  }

  splitOrder(): string {
    const orderTotal = this.receipt.reduce((total, item) => total + item.price, 0);
    return (orderTotal / 2).toFixed(2);
  }

  cancel(): void {
    this.receipt = [];
  }

  checkout(): void {
    // implementation for checkout
  }

  getReceipt(): string {
    return JSON.stringify(this.receipt);
  }

  getReceipt2(): Item[] {
    return this.receipt;
  }

  setReceipt(receipt: Item[]): void {
    this.receipt = receipt;
  }
}
