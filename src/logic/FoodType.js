import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../Helpers/ApiHelper";
import { logger } from "../Helpers/Logger";
import { DefaultErrorMessage } from "../config/Constants";
import {
  showLoader,
  hideLoader,
  foodTypeActions,
  getFoodTypesSuccess,
  getFoodTypesRequest,
  modalCloseRequest,
  getFoodTypesSuccessById,
} from "../actions";
let toastId = null;

/**
 *  CRUD FoodTypes
 */
const addFoodTypesLogic = createLogic({
  type: foodTypeActions.ADD_FOODTYPE_REQUEST,
  cancelType: foodTypeActions.ADD_FOODTYPE_FAILED,
  async process({ action, getState }, dispatch, done) {
    dispatch(
      getFoodTypesSuccess({
        updateReq: "Start",
      })
    );
    let data =
      getState().FoodTypeReducer && getState().FoodTypeReducer.data
        ? getState().FoodTypeReducer.data
        : [];
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      "/food-type",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      dispatch(
        getFoodTypesSuccess({
          updateReq: "End",
          data: [result.data, ...data],
        })
      );
      done();
    }
  },
});

// getList
const getFoodTypesLogic = createLogic({
  type: foodTypeActions.GET_FOODTYPE_REQUEST,
  cancelType: foodTypeActions.GET_FOODTYPE_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(getFoodTypesSuccess({ updateReq: "Start" }));
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      "/food-type",
      "GET",
      true,
      undefined,
      undefined
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(getFoodTypesSuccess({ isLoading: false }));
      done();
      return;
    } else {
      logger(result);
      dispatch(
        getFoodTypesSuccess({
          data: result.data?result.data:[],
          isLoading: false,
          updateReq: "End",
        })
      );
      done();
      return;
    }
  },
});

// get Data by Id

const getFoodTypesByIdLogic = createLogic({
  type: foodTypeActions.GET_FOODTYPE_REQUEST_BY_ID,
  cancelType: foodTypeActions.GET_FOODTYPE_FAILED_BY_ID,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      ["/food-type/" + action.payload.food_type_id],
      "GET",
      true,
      undefined,
      undefined
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      dispatch(getFoodTypesSuccessById({ dataById: result.data }));
      dispatch(hideLoader());
      done();
      return;
    }
  },
});

// update

const updateFoodTypesLogic = createLogic({
  type: foodTypeActions.UPDATE_FOODTYPE_REQUEST,
  cancelType: foodTypeActions.UPDATE_FOODTYPE_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      ["/food-type/" + action.payload.get("food_type_id")],
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      toastId = toast.success("Updated Successfully!");
      dispatch(getFoodTypesSuccessById({ dataById: {} }));
      dispatch(getFoodTypesRequest());
      dispatch(hideLoader());
      done();
      return;
    }
  },
});

// ADD Bulk DATA

const updateFoodTypesStatusLogic = createLogic({
  type: foodTypeActions.UPDATE_FOODTYPESTATUS_REQUEST,
  cancelType: foodTypeActions.UPDATE_FOODTYPESTATUS_FAILED,
  async process({ action }, dispatch, done) {
    let food_type_id = action.payload.food_type_id;
    delete action.payload.food_type_id;
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      ["/food-type/status/" + food_type_id],
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      dispatch(getFoodTypesRequest());
      done();
      return;
    }
  },
});

const addBulkFoodTypesLogic = createLogic({
  type: foodTypeActions.ADD_BULKFOODTYPE_REQUEST,
  cancelType: foodTypeActions.ADD_BULKFOODTYPE_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "",
      "/food-type-bulk-create",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      toastId = toast.success("Add Successfully!");
      dispatch(modalCloseRequest({ bulkFoodTypeModal: false }));
      dispatch(getFoodTypesRequest());
      dispatch(hideLoader());
      done();
    }
  },
});

export const FoodTypesLogic = [
  addFoodTypesLogic,
  getFoodTypesLogic,
  updateFoodTypesLogic,
  getFoodTypesByIdLogic,
  addBulkFoodTypesLogic,
  updateFoodTypesStatusLogic,
];
