import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CBadge,
  CSwitch,
} from "@coreui/react";
import { connect } from "react-redux";
import {
  modalOpenRequest,
  modalCloseRequest,
  getListItemsRequest,
  getListItemsSuccess,
  updateListItemsRequest,
  addBulkCategoriesRequest,
  getFilterTypeRequest,
  getFoodTypesRequest,
  addListItemsRequest,
  updateListItemsOrderRequest,
} from "../../../actions";
import Loader from "../../../containers/Loader/Loader";
import BulkCategoryModal from "../ModalData/BulkCategory";
import { Multiselect } from "multiselect-react-dropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
class ListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addItem: false,
      name: "",
      description: "",
      is_deleted: false,
      food_type_ids: [],
      is_web: false,
      is_tw: false,
      is_discount_applied: false,
      order: 0,
      online_price: 0,
      table_price: 0,
      selectRowId: "",
      selectRowClick: 0,
      filterType: [],
      updateItemData: {
        name: "",
        category_id: "",
        sub_category_id: "",
        panel_type: "",
        filters: {},
        food_type_ids: [],
        description: "",
        online_price: 0,
        table_price: 0,
        tw_price: 0,
        is_web: true,
        is_tw: true,
        is_discount_applied: true,
        auto_discount: true,
        is_deleted: true,
        is_removed: true,
        buy_one_get_one: true,
        half_price: true,
        has_tax: true,
        item_type: "",
        options: {},
        order: 0,
        filters: {},
      },
      foodTypeData: [],
      foodTypeOptions: [],
      food_type_ids: [],
    };
  }
  componentDidMount() {
    this.props.getItemsDate();
    // this.props.getFilterTypeDate();
    // this.props.getFoodTypesDate();
  }
  componentDidUpdate({
    ItemsReducerData,
    FilterTypeData,
    FoodTypeReducerData,
  }) {
    let filterType = [];
    if (
      FilterTypeData &&
      FilterTypeData.updateReq &&
      FilterTypeData.updateReq !== this.props.FilterTypeData.updateReq
    ) {
      const { FilterTypeData } = this.props;
      if (FilterTypeData && FilterTypeData.data && FilterTypeData.data.length) {
        for (let i = 0; i < FilterTypeData.data.length; i++) {
          let id = FilterTypeData.data[i]._id;
          let fiterTypeName = FilterTypeData.data[i].name;
          let options = [];
          if (
            FilterTypeData.data[i] &&
            FilterTypeData.data[i].filter_data &&
            FilterTypeData.data[i].filter_data.length
          ) {
            for (
              let j = 0;
              j < FilterTypeData.data[i].filter_data.length;
              j++
            ) {
              options.push({
                name: FilterTypeData.data[i].filter_data[j].name,
                id: FilterTypeData.data[i].filter_data[j]._id,
              });
            }
          }
          filterType.push({ id, fiterTypeName, options });
        }
      }
      // let allergyData =
      //   FilterTypeData &&
      //   FilterTypeData.data &&
      //   FilterTypeData.data.filter((item) => item.name === "allergy")[0];

      // console.log("allergyData", allergyData, FilterTypeData.data);

      // this.setState({
      //   allergyData: allergyData ? allergyData.filter_data : [],
      // });
      this.setState({ filterType });
    }
    if (
      FoodTypeReducerData &&
      FoodTypeReducerData.updateReq &&
      FoodTypeReducerData.updateReq !== this.props.FoodTypeReducerData.updateReq
    ) {
      const { FoodTypeReducerData } = this.props;
      let foodTypeOptions = [];
      let foodTypeData =
        FoodTypeReducerData &&
        FoodTypeReducerData.data &&
        FoodTypeReducerData.data.length
          ? FoodTypeReducerData.data
          : [];
      if (foodTypeData && foodTypeData.length) {
        foodTypeData
          .filter((itm) => !itm.is_deleted)
          .map((item) => {
            foodTypeOptions.push({ name: item.name, id: item._id });
            return true;
          });
      }
      this.setState({ foodTypeData, foodTypeOptions });
    }

    if (
      ItemsReducerData &&
      ItemsReducerData.updateReq &&
      ItemsReducerData.updateReq !== this.props.ItemsReducerData.updateReq
    ) {
      let data = this.props.ItemsReducerData.data.filter(
        (item) => item._id === this.state.selectRowId
      )[0];
      let updateItemData = {
        name: data && data.name ? data.name : "",
        is_deleted: data && data.is_deleted ? data.is_deleted : false,
        description: data && data.description ? data.description : "",
      };
      this.setState({
        addItem: false,
        name: "",
        is_deleted: false,
        description: "",
        selectRowId: data && data._id,
        selectRowClick: this.state.addCategory ? 2 : 1,
        updateItemData: updateItemData,
      });
    }
  }

  onDragEnd = (result) => {
    const { pannelType } = this.props;
    const { destination, source, reason, draggableId } = result;
    // Not a thing to do...
    if (!destination || reason === "CANCEL") {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    this.props.onUpdateItemsOrder({
      start_index: source.index + 1,
      end_index: destination.index + 1,
      start_index_id: draggableId,
      panel_type: pannelType,
    });
  };

  onSelect = (selectedList, filterTypeName) => {
    const { updateItemData, selectRowId } = this.state;
    let ids = [];
    for (let i = 0; i < selectedList.length; i++) {
      ids.push(selectedList[i].id);
    }
    this.props.onUpdateItems({
      filters: { [filterTypeName]: ids },
      item_id: selectRowId,
    });
    console.log("selectedList, selectedItem", selectedList, filterTypeName);
  };
  onSelectFoodType = (selectedList, name) => {
    const { selectRowId } = this.state;
    let foodTypeIds = [];
    for (let i = 0; i < selectedList.length; i++) {
      foodTypeIds.push(selectedList[i].id);
    }
    this.props.onUpdateItems({
      food_type_ids: foodTypeIds,
      item_id: selectRowId,
    });
    this.setState({
      food_type_ids: selectedList,
    });
  };

  onRemove = (selectedList, removedItem) => {
    console.log("selectedList, removedItem", selectedList, removedItem);
  };

  getFilterName = (data) => {
    console.log("data", data);
    return true;
  };
  getFoodTypeName = (foodTypeIds) => {
    const { foodTypeData } = this.state;
    let foodTypeDataName = "";
    if (foodTypeData && foodTypeData.length) {
      let data = "";
      foodTypeIds.map((itm, ind) => {
        data = foodTypeData.filter((i) => i._id === itm)[0];
        foodTypeDataName +=
          ind === 0
            ? data && data.name
              ? data.name
              : ""
            : data && data.name
            ? ", " + data.name
            : "";
      });
    }
    return foodTypeDataName;
  };
  getCategoryName = (cId) => {
    const { CategorieReducerData } = this.props;
    let data = "";
    if (
      CategorieReducerData &&
      CategorieReducerData.data &&
      CategorieReducerData.data.length
    ) {
      data = CategorieReducerData.data.filter((itm) => itm._id === cId)[0];
    }
    return data && data.name ? data.name : "";
  };
  getSubCategoryName = (SubId) => {
    const { subCategorieReducerData } = this.props;
    let data = "";
    if (
      subCategorieReducerData &&
      subCategorieReducerData.data &&
      subCategorieReducerData.data.length
    ) {
      data = subCategorieReducerData.data.filter((itm) => itm._id === SubId)[0];
    }
    return data && data.name ? data.name : "";
  };

  onRowClick = (item) => {
    const {
      selectRowId,
      selectRowClick,
      updateItemData,
      foodTypeData,
    } = this.state;
    let food_type_ids = [];
    if (
      item &&
      item.food_type_ids &&
      item.food_type_ids.length &&
      foodTypeData &&
      foodTypeData.length
    ) {
      let data = "";
      item.food_type_ids.map((itm) => {
        data = foodTypeData.filter((i) => i._id === itm)[0];
        food_type_ids.push({
          name: data && data.name ? data.name : "",
          id: data && data._id ? data._id : "",
        });
      });
    }
    this.setState({
      selectRowId: item._id,
      addCategory: false,
      selectRowClick: selectRowId === item._id ? selectRowClick + 1 : 1,
      food_type_ids,
      updateItemData:
        selectRowId === item._id
          ? updateItemData
          : {
              name: item.name ? item.name : "",
              description: item.description ? item.description : "",
              is_deleted: item.is_deleted ? item.is_deleted : false,
            },
    });
  };

  render() {
    const {
      addItem,
      name,
      description,
      is_deleted,
      selectRowId,
      updateItemData,
      selectRowClick,
      foodTypeOptions,
      food_type_ids,
      filterType,
    } = this.state;
    const {
      ItemsReducerData,
      FilterTypeData,
      FoodTypeReducerData,
      subCategoryId,
      pannelType,
      categoryID,
    } = this.props;

    console.log("filterType", filterType);
    return (
      <>
        <CCard>
          <CCardHeader className="d-flex  flex-row justify-content-between">
            {" "}
            <h6>
              <i class="fas fa-list-alt mr-2"></i>List Of Items
            </h6>
            <div>
              <CTooltip content="remove">
                <CButton className="btn-youtube text-white mr-2" size="sm">
                  <i class="fas fa-minus text-white" />
                </CButton>
              </CTooltip>
              <CButton
                className="bg1 text-white"
                size="sm"
                onClick={() =>
                  this.setState({
                    addItem: true,
                    selectRowId: "",
                    name: "",
                    description: "",
                    is_deleted: false,
                  })
                }
              >
                <i class="fas fa-plus" />
              </CButton>

              <CTooltip content="Add Bulk">
                <CButton
                  color="info"
                  size="sm"
                  className="ml-2"
                  onClick={() =>
                    this.props.modalOpenRequest({ bulkCategoryModalOpen: true })
                  }
                >
                  <i class="fas fa-file-download"></i>
                </CButton>
              </CTooltip>
            </div>
          </CCardHeader>
          <CCardBody>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <div className="table-responsive table1div">
                <table class="table table-bordered table-sm">
                  <thead className="table1header">
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Sub Category</th>
                      <th scope="col">panel_type</th>

                      <>
                        {FilterTypeData &&
                        FilterTypeData.data &&
                        FilterTypeData.data.length
                          ? FilterTypeData.data.map((item, index) => {
                              return <th scope="col">{item.name}</th>;
                            })
                          : null}
                      </>
                      <th scope="col">Food Type Selection</th>

                      <th scope="col">Type</th>
                      <th scope="col">online price</th>
                      <th scope="col">table price</th>
                      <th scope="col">tw price</th>
                      <th scope="col">BuyOne GetOne</th>
                      <th scope="col">half price</th>
                      <th scope="col">Tax</th>
                      <th scope="col">Not For Web</th>

                      <th scope="col">Not For TW</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <Droppable droppableId="table">
                    {(provided, snapshot) => (
                      <tbody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <>
                          {addItem ? (
                            <tr>
                              <td>
                                <input
                                  className="w-100"
                                  type="number"
                                  name="order"
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="w-100"
                                  type="text"
                                  name="name"
                                  value={name}
                                  onChange={(e) =>
                                    this.setState({
                                      [e.target.name]: e.target.value,
                                    })
                                  }
                                  onBlur={() =>
                                    this.props.onAddItems({
                                      name,
                                      category_id: categoryID,
                                      sub_category_id: subCategoryId,
                                      panel_type: pannelType,
                                      filters: {},
                                      food_type_ids: [],
                                      description: "",
                                      online_price: 0,
                                      table_price: 0,
                                      tw_price: 0,
                                      is_web: true,
                                      is_tw: true,
                                      is_discount_applied: true,
                                      auto_discount: true,
                                      is_deleted: true,
                                      is_removed: true,
                                      buy_one_get_one: true,
                                      half_price: true,
                                      has_tax: true,
                                      item_type: "Regular",
                                      options: {},
                                      order: 0,
                                    })
                                  }
                                />
                              </td>
                              <td>{this.getCategoryName(categoryID)}</td>

                              <td>{this.getSubCategoryName(subCategoryId)}</td>

                              <td>{pannelType && pannelType}</td>
                              <td></td>

                              <td></td>

                              <td></td>

                              <td></td>

                              <td></td>
                              <td></td>

                              <td></td>

                              <td></td>

                              <td></td>
                              <td></td>
                              <td></td>

                              <td></td>

                              <td></td>
                              <td></td>

                              <td></td>
                              <td>
                                <div className="d-flex flex-row text-center">
                                  <CBadge
                                    className={`${
                                      !is_deleted ? "bg1" : "bg-secondary"
                                    } text-white px-1 pt-1 pb-1`}
                                  >
                                    Enable
                                  </CBadge>

                                  <CBadge
                                    className={`${
                                      is_deleted
                                        ? "btn-youtube"
                                        : "bg-secondary"
                                    } text-white px-1 pt-1 pb-1 ml-1`}
                                  >
                                    Disable
                                  </CBadge>
                                </div>
                              </td>
                            </tr>
                          ) : null}

                          {ItemsReducerData && !ItemsReducerData.isLoading ? (
                            ItemsReducerData.data &&
                            ItemsReducerData.data.length ? (
                              ItemsReducerData.data.map((item, index) => {
                                return (
                                  <Draggable
                                    draggableId={item._id}
                                    index={index}
                                    key={item._id}
                                  >
                                    {(provided, snapshot) => (
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        key={index}
                                        className={
                                          selectRowId === item._id ? "bg2" : ""
                                        }
                                        onClick={() => this.onRowClick(item)}
                                      >
                                        <td>{index + 1}</td>
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="text"
                                              name="name"
                                              value={updateItemData.name}
                                              onChange={(e) =>
                                                this.setState({
                                                  updateItemData: {
                                                    ...updateItemData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateItems({
                                                  name: updateItemData.name,
                                                  item_id: selectRowId,
                                                })
                                              }
                                            />
                                          ) : item.name ? (
                                            item.name
                                          ) : null}
                                        </td>

                                        <td>
                                          {this.getCategoryName(
                                            item.category_id
                                          )}
                                        </td>
                                        <td>
                                          {this.getSubCategoryName(
                                            item.sub_category_id
                                          )}
                                        </td>
                                        <td>{pannelType && pannelType}</td>
                                        {selectRowId === item._id &&
                                        selectRowClick > 1 ? (
                                          filterType.length ? (
                                            filterType.map((filter) => {
                                              return (
                                                <td>
                                                  <Multiselect
                                                    options={filter.options}
                                                    onSelect={(selectedList) =>
                                                      this.onSelect(
                                                        selectedList,
                                                        filter.fiterTypeName
                                                      )
                                                    }
                                                    displayValue="name"
                                                    showCheckbox={true}
                                                    id="css_custom"
                                                    style={{
                                                      chips: {
                                                        display: "none",
                                                      },
                                                      searchBox: {
                                                        border: "none",
                                                        "border-bottom":
                                                          "1px solid #19c133",
                                                        "border-radius": "0px",
                                                        background: "#fff",
                                                      },
                                                    }}
                                                  />
                                                </td>
                                              );
                                            })
                                          ) : (
                                            <td></td>
                                          )
                                        ) : filterType.length ? (
                                          filterType.map((filter) => {
                                            return (
                                              <td>
                                                {item.filters &&
                                                item.filters[
                                                  filter.fiterTypeName
                                                ]
                                                  ? this.getFilterName(
                                                      item.filters[
                                                        filter.fiterTypeName
                                                      ]
                                                    )
                                                  : ""}
                                              </td>
                                            );
                                          })
                                        ) : (
                                          <td></td>
                                        )}
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <Multiselect
                                              options={foodTypeOptions}
                                              selectedValues={food_type_ids}
                                              onSelect={(selectedList) =>
                                                this.onSelectFoodType(
                                                  selectedList,
                                                  "foodTypeData"
                                                )
                                              }
                                              onRemove={(selectedList) =>
                                                this.onRemove(
                                                  selectedList,
                                                  "foodTypeData"
                                                )
                                              }
                                              displayValue="name"
                                              showCheckbox={true}
                                              id="css_custom"
                                              style={{
                                                chips: { display: "none" },
                                                searchBox: {
                                                  border: "none",
                                                  "border-bottom":
                                                    "1px solid #19c133",
                                                  "border-radius": "0px",
                                                  background: "#fff",
                                                },
                                              }}
                                            />
                                          ) : (
                                            <>
                                              {item.food_type_ids &&
                                              item.food_type_ids.length
                                                ? this.getFoodTypeName(
                                                    item.food_type_ids
                                                  )
                                                : null}
                                            </>
                                          )}
                                        </td>

                                        <td>
                                          <select
                                            name="item_type"
                                            className="mt-2 select1"
                                          >
                                            <option value="0">
                                              Please One
                                            </option>
                                            <option value="Regular">
                                              Regular
                                            </option>
                                            <option value="Set-Item">
                                              Set-Item
                                            </option>
                                            <option value="Relevant">
                                              Relevant
                                            </option>
                                            <option value="Option">
                                              Option
                                            </option>
                                          </select>
                                        </td>
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="umber"
                                              name="online_price"
                                              value={
                                                updateItemData.online_price
                                              }
                                              onChange={(e) =>
                                                this.setState({
                                                  updateItemData: {
                                                    ...updateItemData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateItems({
                                                  online_price: parseInt(
                                                    updateItemData.online_price
                                                  ),
                                                  item_id: selectRowId,
                                                })
                                              }
                                            />
                                          ) : item.online_price ? (
                                            item.online_price
                                          ) : null}
                                        </td>
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="number"
                                              name="table_price"
                                              value={updateItemData.table_price}
                                              onChange={(e) =>
                                                this.setState({
                                                  updateItemData: {
                                                    ...updateItemData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateItems({
                                                  table_price: parseInt(
                                                    updateItemData.table_price
                                                  ),
                                                  item_id: selectRowId,
                                                })
                                              }
                                            />
                                          ) : item.table_price ? (
                                            item.table_price
                                          ) : null}
                                        </td>
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="number"
                                              name="tw_price"
                                              value={updateItemData.tw_price}
                                              onChange={(e) =>
                                                this.setState({
                                                  updateItemData: {
                                                    ...updateItemData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateItems({
                                                  tw_price: parseInt(
                                                    updateItemData.tw_price
                                                  ),
                                                  item_id: selectRowId,
                                                })
                                              }
                                            />
                                          ) : item.tw_price ? (
                                            item.tw_price
                                          ) : null}
                                        </td>
                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="buy_one_get_one"
                                            checked={item.buy_one_get_one}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                buy_one_get_one:
                                                  e.target.checked,
                                              })
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="half_price"
                                            checked={item.half_price}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                half_price: e.target.checked,
                                              })
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="has_tax"
                                            checked={item.has_tax}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                has_tax: e.target.checked,
                                              })
                                            }
                                          />
                                        </td>

                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="is_web"
                                            checked={item.is_web}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                is_web: e.target.checked,
                                              })
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="is_tw"
                                            checked={item.is_tw}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                is_tw: e.target.checked,
                                              })
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="is_discount_applied"
                                            checked={item.is_discount_applied}
                                            onChange={(e) =>
                                              this.props.onUpdateItems({
                                                item_id: selectRowId,
                                                is_discount_applied:
                                                  e.target.checked,
                                              })
                                            }
                                          />
                                        </td>
                                        <td>
                                          <div className="d-flex flex-row">
                                            <CTooltip content="Change Status">
                                              <CBadge
                                                className={`${
                                                  !item.is_deleted
                                                    ? "bg1"
                                                    : "bg-secondary"
                                                } text-white px-1`}
                                                onClick={() =>
                                                  this.props.onUpdateItems({
                                                    is_deleted: false,
                                                    item_id: selectRowId,
                                                  })
                                                }
                                              >
                                                Enable
                                              </CBadge>
                                            </CTooltip>
                                            <CTooltip content="Change Status">
                                              <CBadge
                                                className={`${
                                                  item.is_deleted
                                                    ? "btn-youtube"
                                                    : "bg-secondary"
                                                } text-white px-1 ml-1`}
                                                onClick={() =>
                                                  this.props.onUpdateItems({
                                                    is_deleted: true,
                                                    item_id: selectRowId,
                                                  })
                                                }
                                              >
                                                Disable
                                              </CBadge>
                                            </CTooltip>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </Draggable>
                                );
                              })
                            ) : (
                              <tr>
                                <td colspan="22">
                                  <h6>
                                    {" "}
                                    <i class="fas fa-exclamation-triangle text-danger mr-2" />
                                    Not Found
                                  </h6>
                                </td>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <td colspan="22">
                                <Loader />
                              </td>
                            </tr>
                          )}
                        </>
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </div>
            </DragDropContext>{" "}
          </CCardBody>
        </CCard>

        <BulkCategoryModal
          isShow={this.props.ModalReducer.bulkCategoryModalOpen}
          onClose={() =>
            this.props.modalCloseRequest({ bulkCategoryModalOpen: false })
          }
          onSaveBulkData={(data) => this.props.onSaveBulkData(data)}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  ItemsReducerData: state.ItemsReducer,
  FilterTypeData: state.FilterTypeReducer,
  FoodTypeReducerData: state.FoodTypeReducer,
  CategorieReducerData: state.CategorieReducer,

  subCategorieReducerData: state.SubCategorieReducer,
  ReducerData: state.ItemsReducer,
  ModalReducer: state.ModalReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAddItems: (data) => {
      dispatch(addListItemsRequest(data));
    },
    getFilterTypeDate: (data) => {
      dispatch(getFilterTypeRequest(data));
    },

    getFoodTypesDate: (data) => {
      dispatch(getFoodTypesRequest(data));
    },
    getFilterTypeDate: (data) => {
      dispatch(getFilterTypeRequest(data));
    },
    getListItemsSuccess: (data) => {
      dispatch(getListItemsSuccess(data));
    },
    getItemsDate: (data) => {
      dispatch(getListItemsRequest(data));
    },
    onUpdateItems: (data) => {
      dispatch(updateListItemsRequest(data));
    },
    onUpdateItemsOrder: (data) => {
      dispatch(updateListItemsOrderRequest(data));
    },
    onSaveBulkData: (data) => {
      dispatch(addBulkCategoriesRequest(data));
    },
    modalOpenRequest: (data) => {
      dispatch(modalOpenRequest(data));
    },
    modalCloseRequest: (data) => {
      dispatch(modalCloseRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListItems);
