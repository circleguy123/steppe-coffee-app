import { createContext, useContext } from "react";
import { useStore } from "zustand";
import {
  RewardActions,
  rewardsStore,
  RewardStore,
} from "../store/reward.store";

const RewardsContext = createContext<RewardStore & RewardActions>({
  rewards: undefined,
  selectedReward: undefined,
  setRewards: () => {},
  selectReward: () => {},
  clearReward: () => {},
});

export const RewardsContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const store = useStore(rewardsStore);

  return (
    <RewardsContext.Provider value={store}>{children}</RewardsContext.Provider>
  );
};

export const useRewardsContext = () => {
  return useContext(RewardsContext);
};
