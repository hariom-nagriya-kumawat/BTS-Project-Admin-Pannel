import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { ResponsiveReducer } from "./responsive";
import { AuthReducer } from "./auth";
import { CategorieReducer } from "./categories";
import { SubCategorieReducer } from "./subCategories";
import { ModalReducer } from "./modalOperations";
import {FoodTypeReducer} from './FoodType';
import {FilterTypeReducer} from './FilterTypeReduser'
import {ItemsReducer} from './ItemReducer';
import {DayDiscountReducer} from './Discount/ReducerDay';
import {HourDiscountReducer} from './Discount/ReducerHour';
export const mainReducer = handleActions(
  {
    SHOW_LOADER: (state, action) => ({
      showLoader: true,
    }),
    HIDE_LOADER: (state, action) => ({
      showLoader: false,
    }),
  },
  {
    showLoader: false,
  }
);

const AppReducer = combineReducers({
  mainReducer,
  ResponsiveReducer,
  AuthReducer,
  CategorieReducer,
  SubCategorieReducer,
  ModalReducer,
  FoodTypeReducer,
  FilterTypeReducer,
  ItemsReducer,
  HourDiscountReducer,
  DayDiscountReducer,
  routing: routerReducer,
});

export default AppReducer;
