import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { TransportMenuCategoryDto } from "@/__generated__/graphql";
import { MenuCategoryButton } from "./MenuCategoryButton";

export interface MenuCategoriesProps {
  categories: TransportMenuCategoryDto[];
  activeCategoryId?: string;
  onCategoryClick: (categoryId: string, categoryIdx: number) => void;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  activeCategoryId,
  categories,
  onCategoryClick,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [categoryXPositions, setCategoryXPositions] =
    useState<Record<string, number>>();

  useEffect(() => {
    if (
      categoryXPositions &&
      activeCategoryId &&
      categoryXPositions[activeCategoryId]
    ) {
      scrollRef.current?.scrollTo({
        x: categoryXPositions[activeCategoryId] - 16,
        animated: true,
      });
    }
  }, [activeCategoryId]);

  return (
    <ScrollView
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{ paddingHorizontal: 16, marginVertical: 8 }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {categories?.map((category, idx) => (
          <MenuCategoryButton
            key={`category-${category.id}`}
            isActive={activeCategoryId === category.id}
            category={category}
            onPress={(id) => onCategoryClick(id, idx)}
            onMeasureComplete={(categoryId, { x }) => {
              setCategoryXPositions((positions) => ({
                ...positions,
                [categoryId]: x,
              }));
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};
