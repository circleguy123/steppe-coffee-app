import { FlatList } from "react-native";
import { CartItemCard } from "./CartItemCard";
import { CartItemType } from "../store/cart.store";
import { useCartContext } from "../context/cart.context";

export interface CartListProps {
  cartItems: CartItemType[];
}

export const CartList: React.FC<CartListProps> = ({ cartItems }) => {
  const { addItem } = useCartContext();

  return (
    <FlatList
      contentContainerStyle={{
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      data={cartItems}
      keyExtractor={(item: CartItemType) => {
        const modifierKey = item.modifiers
          ? item.modifiers
              .map((m) => `${m.modifier.itemId}:${m.amount}`)
              .join("-")
          : "no-modifiers";
        return `${item.itemId}-${item.itemSize.sizeId}-${modifierKey}`;
      }}
      renderItem={({ item }) => (
        <CartItemCard
          onAmountChange={(amount) =>
            addItem({
              productId: item.itemId,
              amount,
              productSizeId: item.itemSize.sizeId,
              modifiers: item.modifiers?.map((modifier) => ({
                productId: modifier.modifier.itemId,
                amount: modifier.amount,
              })),
            })
          }
          item={item}
        />
      )}
    />
  );
};
