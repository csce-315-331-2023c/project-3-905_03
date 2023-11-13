
export interface Item {
  id: number;
  name: string;
  price: number;
  quantity : number;
  category : string;
  description ?: string;
}

export class Order {
  private receipt: Item[] = [];

  addItem(id: number, name: string, price: number, quantity: number, category: string): void {
    const existingItem = this.receipt.find((item) => item.id === id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const item: Item = { id, name, price, quantity, category };
      this.receipt.push(item);
    }
  }

  removeItem(id: number): void {
    const existingItem = this.receipt.find((item) => item.id === id);
    if (existingItem) {
      existingItem.quantity -= 1;
      if (existingItem.quantity === 0) {
        this.receipt = this.receipt.filter((item) => item.id !== id);
      }
    }
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
