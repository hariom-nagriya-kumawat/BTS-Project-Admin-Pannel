import { push } from "react-router-redux";
import { createLogic } from "redux-logic";

import { AuthLogic } from "./auth";
import { CategoriesLogic } from "./categories";
import {SubCategoriesLogic} from './listSubCategories';
import {FoodTypesLogic} from './FoodType';
import {FilterTypeLogic} from './FilterType';
import{ListItemsLogic} from './LIstItem';
import {DayDiscountLogic} from './Discount/DayDiscount';
import {HoureDiscountLogic} from './Discount/hourDiscount';

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  },
});

export default [
  ...AuthLogic,
  ...CategoriesLogic,
  ...SubCategoriesLogic,
  ...FoodTypesLogic,
  ...FilterTypeLogic,
  ...ListItemsLogic,
  ...HoureDiscountLogic,
  ...DayDiscountLogic,
  redirectToLogic,
];
