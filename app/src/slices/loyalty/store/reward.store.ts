import { ExternalMenuPreset } from "@/__generated__/graphql";
import { createStore } from "zustand";

export type RewardItem = {
  itemId: string;
  itemSizeId: string | null | undefined;
  amount: 1;
};

export interface RewardStore {
  rewards?: ExternalMenuPreset;
  selectedReward?: {
    itemId: string;
    itemSizeId: string | null | undefined;
    amount: 1;
  };
}

export interface RewardActions {
  setRewards: (rewards: ExternalMenuPreset) => void;
  selectReward: (rewrd: RewardItem) => void;
  clearReward: () => void;
}

export const rewardsStore = createStore<RewardStore & RewardActions>()(
  (set) => ({
    rewards: undefined,
    selectedReward: undefined,
    setRewards: (rewards: ExternalMenuPreset) =>
      set(() => {
        return {
          rewards,
        };
      }),
    selectReward: (selectedReward: RewardItem) =>
      set(() => ({ selectedReward })),
    clearReward: () => set(() => ({ selectedReward: undefined })),
  })
);
