import { createAction } from "redux-actions";

export * from "./auth";
export * from './categories';
export * from "./responsive";
export * from "./subCategories";
export * from "./modalOperations";
export * from "./FoodType";
export * from "./Item";
export * from "./FilterType";
export * from "./Discount/DayDiscount";
export * from "./Discount/HourDiscount";

export const redirectTo = createAction("REDIRET_TO");

export const showLoader = createAction("SHOW_LOADER");

export const hideLoader = createAction("HIDE_LOADER");