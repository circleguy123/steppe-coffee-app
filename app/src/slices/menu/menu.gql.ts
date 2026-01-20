import { gql } from "@apollo/client";

export const STEPPE_MENU_QUERY = gql(`
  query SteppeMenu {
    steppeMenu {
      id
      name
      description
      itemCategories {
        id
        name
        description
        buttonImageUrl
        headerImageUrl
        items {
          sku
          name
          description
          itemId
          modifierSchemaId
          orderItemType
          itemSizes {
            sku
            sizeCode
            sizeName
            isDefault
            portionWeightGrams
            sizeId
            buttonImageUrl
            buttonImageCroppedUrl
            prices {
              organizationId
              price
            }
            itemModifierGroups {
              name
              description
              canBeDivided
              itemGroupId
              childModifiersHaveMinMaxRestrictions
              sku
              items {
                sku
                name
                description
                buttonImage
                portionWeightGrams
                itemId
                prices {
                  organizationId
                  price
                }
                restrictions {
                  minQuantity
                  maxQuantity
                  freeQuantity
                  byDefault
                }
                allergenGroups {
                  id
                  code
                  name
                }
                nutritionPerHundredGrams {
                  placeholder
                }
              }
              restrictions {
                minQuantity
                maxQuantity
                freeQuantity
                byDefault
              }
            }
            nutritionPerHundredGrams {
              placeholder
            }
          }
          allergenGroups {
            id
            code
            name
          }
          taxCategory {
            id
            name
            percentage
          }
        }
      }
    }
}

`);

export const REWARD_MENU_QUERY = gql`
  query RewardMenu {
    rewardMenu {
      id
      name
      description
      itemCategories {
        id
        name
        description
        buttonImageUrl
        headerImageUrl
        items {
          sku
          name
          description
          itemId
          modifierSchemaId
          orderItemType
          itemSizes {
            sku
            sizeCode
            sizeName
            isDefault
            portionWeightGrams
            sizeId
            buttonImageUrl
            buttonImageCroppedUrl
            prices {
              organizationId
              price
            }
            itemModifierGroups {
              name
              description
              canBeDivided
              itemGroupId
              childModifiersHaveMinMaxRestrictions
              sku
              items {
                sku
                name
                description
                buttonImage
                portionWeightGrams
                itemId
                prices {
                  organizationId
                  price
                }
                restrictions {
                  minQuantity
                  maxQuantity
                  freeQuantity
                  byDefault
                }
                allergenGroups {
                  id
                  code
                  name
                }
                nutritionPerHundredGrams {
                  placeholder
                }
              }
              restrictions {
                minQuantity
                maxQuantity
                freeQuantity
                byDefault
              }
            }
            nutritionPerHundredGrams {
              placeholder
            }
          }
          allergenGroups {
            id
            code
            name
          }
          taxCategory {
            id
            name
            percentage
          }
        }
      }
    }
  }
`;

export const MEMBERSHIP_MENU_QUERY = gql`
  query MembershipMenu {
    membershipMenu {
      id
      name
      description
      itemCategories {
        id
        name
        description
        buttonImageUrl
        headerImageUrl
        items {
          sku
          name
          description
          itemId
          modifierSchemaId
          orderItemType
          itemSizes {
            sku
            sizeCode
            sizeName
            isDefault
            portionWeightGrams
            sizeId
            buttonImageUrl
            buttonImageCroppedUrl
            prices {
              organizationId
              price
            }
            itemModifierGroups {
              name
              description
              canBeDivided
              itemGroupId
              childModifiersHaveMinMaxRestrictions
              sku
              items {
                sku
                name
                description
                buttonImage
                portionWeightGrams
                itemId
                prices {
                  organizationId
                  price
                }
                restrictions {
                  minQuantity
                  maxQuantity
                  freeQuantity
                  byDefault
                }
                allergenGroups {
                  id
                  code
                  name
                }
                nutritionPerHundredGrams {
                  placeholder
                }
              }
              restrictions {
                minQuantity
                maxQuantity
                freeQuantity
                byDefault
              }
            }
            nutritionPerHundredGrams {
              placeholder
            }
          }
          allergenGroups {
            id
            code
            name
          }
          taxCategory {
            id
            name
            percentage
          }
        }
      }
    }
  }
`;
