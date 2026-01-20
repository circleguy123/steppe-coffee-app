import { useStore } from "zustand";
import { CartActions, CartState, cartStore } from "../store/cart.store";
import { createContext, useContext } from "react";

const CartContext = createContext<CartState & CartActions>({
  total: 0,
  menu: undefined,
  menuItemPrices: {},
  modifierPrices: {},
  order: {
    userOrderItem: [],
  },
  cartItems: [],
  menuItems: {},
  modifierItems: {},
  clearOrder: () => {},
  setMenu: () => {},
  addItem: () => {},
});

export const CartContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const store = useStore(cartStore);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(CartContext);
};
