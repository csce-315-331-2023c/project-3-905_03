
interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export class Order {
  private receipt: Item[] = [];

  addItem(id: number, name: string, price: number, quantity: number): void {
    const item: Item = { id, name, price, quantity };
    this.receipt.push(item);
  }

  removeItem(id: number): void {
    this.receipt = this.receipt.filter((item) => item.id !== id);
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
}
