import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { STEPPE_MENU_QUERY } from "@/src/slices/menu/menu.gql";
import { ExternalMenuPreset } from "@/__generated__/graphql";

import { Colors } from "@/constants/Colors";
import { MenuList } from "@/src/slices/menu/components/MenuList";
import { MenuCategories } from "@/src/slices/menu/components/MenuCategories";
import MenuHeader from "@/src/slices/menu/components/MenuHeader";
import SteppeLoading from "@/src/components/SteppeLoading";
import { SaigakHeader } from "@/src/components/SaigakHeader";
import { AntDesign } from "@expo/vector-icons";
import { SteppeText } from "@/src/components/SteppeText";
import { CartSummaryPopup } from "@/src/slices/cart/components/СartSummaryPopup";
import { router } from "expo-router";
import { useMenuFlatList } from "@/src/slices/menu/hooks/useMenuFlatList.hook";
import { useCartContext } from "@/src/slices/cart/context/cart.context";
import { useSession } from "@/context/AuthContext";

export default function Index() {
  const { setMenu, order, addItem, total, cartItems } = useCartContext();
  const { session } = useSession();
  const menuQuery = useQuery<{ steppeMenu: ExternalMenuPreset }>(
    STEPPE_MENU_QUERY,
    {
      onCompleted: (data) => setMenu(data.steppeMenu),
      onError: (err) => console.log(err),
    }
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(
    undefined
  );

  const menuScrollRef = useRef<FlatList>(null);

  const [_, menuCategoryIndices] = useMenuFlatList(menuQuery.data?.steppeMenu);

  useEffect(() => {
    if (
      menuQuery.data &&
      menuQuery.data?.steppeMenu.itemCategories.length > 0
    ) {
      setActiveCategoryId(menuQuery.data?.steppeMenu.itemCategories[0].id);
    }
  }, [menuQuery]);

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <SaigakHeader title="Zheltoqsan" animHeaderValue={scrollOffsetY}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AntDesign name="enviromento" color={Colors.green} size={20} />
          <SteppeText style={{ fontSize: 16 }}>Zheltoqsan</SteppeText>
        </View>
      </SaigakHeader>
      <View style={{ flex: 1 }}>
        <MenuHeader animHeaderValue={scrollOffsetY} />

        {!menuQuery.data && <SteppeLoading />}

        {menuQuery.data && (
          <MenuCategories
            onCategoryClick={(_categoryId, idx) => {
              menuScrollRef.current?.scrollToIndex({
                index: menuCategoryIndices[idx] + 1,
                viewOffset: 60,
              });
            }}
            activeCategoryId={activeCategoryId}
            categories={menuQuery.data?.steppeMenu.itemCategories}
          />
        )}

        <MenuList
          ref={menuScrollRef}
          order={order}
          onAddItem={addItem}
          menu={menuQuery.data?.steppeMenu}
          isLoading={menuQuery.loading}
          onRefresh={menuQuery.refetch}
          onCategoryIdChange={setActiveCategoryId}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
        />
      </View>

      <CartSummaryPopup
        total={total}
        onPress={() => {
          !!session ? router.push("/(app)/cart") : router.push("/login");
        }}
        cartItems={cartItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
