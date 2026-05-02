export type OrderedItem = {
  orderIndex: number;
};

export function getNextOrderIndex(items: OrderedItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  return Math.max(...items.map((item) => item.orderIndex)) + 1;
}
