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
      selectRowId: "",
      selectRowClick: 0,
      filterType: [],
      filterData: {},
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
    this.props.getItemsDate({ panel_type: "E-COM" });
  }
  componentDidUpdate({
    ItemsReducerData,
    FilterTypeData,
    FoodTypeReducerData,
  }) {
    let filterType = [];
    let filterData = {};
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
          filterData = { ...filterData, [fiterTypeName]: [] };
        }
      }
      this.setState({ filterType, filterData });
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
        selectRowClick: this.state.addItem ? 2 : 1,
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

  onSelect = (selectedList, selectedItem, filterTypeName, oldFilterData) => {
    const { selectRowId } = this.state;
    // let ids = [];
    // for (let i = 0; i < selectedList.length; i++) {
    //   ids.push(selectedList[i].id);
    // }
    this.props.onUpdateItems({
      filters: {
        ...oldFilterData,
        [filterTypeName]: oldFilterData[filterTypeName]
          ? [...oldFilterData[filterTypeName], selectedItem.id]
          : [selectedItem.id],
      },
      item_id: selectRowId,
    });
  };
  onRemove = (selectedList, removedItem, filterTypeName, oldFilterData) => {
    const { selectRowId } = this.state;
    let filterData = oldFilterData;
    let index = filterData[filterTypeName].findIndex(
      (item) => item === removedItem.id
    );
    filterData[filterTypeName].splice(index, 1);
    this.props.onUpdateItems({
      filters: filterData,
      item_id: selectRowId,
    });
  };
  onSelectFoodType = (selectedList, selectedItem, foodTypeIds) => {
    const { selectRowId } = this.state;
    // let foodTypeIds = [];
    // for (let i = 0; i < selectedList.length; i++) {
    //   foodTypeIds.push(selectedList[i].id);
    // }
    this.props.onUpdateItems({
      food_type_ids: [...foodTypeIds, selectedItem.id],
      item_id: selectRowId,
    });
    // this.setState({
    //   food_type_ids: selectedList,
    // });
  };
  onRemoveFoodType = (selectedList, removedItem, foodTypeIds) => {
    const { selectRowId } = this.state;
    let foodData = foodTypeIds;
    let index = foodData.findIndex((i) => i === removedItem.id);
    foodData.splice(index, 1);
    this.props.onUpdateItems({
      food_type_ids: foodData,
      item_id: selectRowId,
    });
  };

  getFilterName = (name, ids) => {
    const { filterType } = this.state;
    let filterName = "";
    if (filterType.length) {
      let obj = filterType.filter((i) => i.fiterTypeName === name)[0];
      let objOptions = {};
      ids.map((item, ind) => {
        objOptions = obj.options.filter((i) => i.id === item)[0];
        filterName +=
          ind === 0
            ? objOptions && objOptions.name
              ? objOptions.name
              : ""
            : objOptions && objOptions.name
            ? ", " + objOptions.name
            : "";
      });
    }
    return filterName;
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
      filterType,
      filterData,
    } = this.state;
    let food_type_ids = [];
    let filterTypeData = filterData;
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
    if (item && item.filters && filterType && filterType.length) {
      for (let i = 0; i < filterType.length; i++) {
        let ids =
          item.filters && item.filters[filterType[i].fiterTypeName]
            ? item.filters[filterType[i].fiterTypeName]
            : [];
        if (ids.length && filterType[i].options.length) {
          let optionData = [];
          let obj = {};
          ids.map((item) => {
            obj = filterType[i].options.filter((i) => i.id === item)[0];
            optionData.push({
              name: obj && obj.name ? obj.name : "",
              id: obj && obj.id ? obj.id : "",
            });
          });
          filterTypeData = {
            ...filterTypeData,
            [filterType[i].fiterTypeName]: optionData,
          };
        }else{
          filterTypeData = {
            ...filterTypeData,
            [filterType[i].fiterTypeName]: [],
          }
        }
      }
    }
    this.setState({
      selectRowId: item._id,
      addItem: false,
      selectRowClick: selectRowId === item._id ? selectRowClick + 1 : 1,
      food_type_ids,
      filterData: filterTypeData,
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
      filterData,
    } = this.state;
    const { ItemsReducerData, subCategoryId, pannelType, categoryID } =
      this.props;
    return (
      <>
        <CCard>
          <CCardHeader className="d-flex  flex-row justify-content-between">
            <h6>
              <i className="fas fa-list-alt mr-2"></i>List Of Items
            </h6>
            <div>
              <CTooltip content="remove">
                <CButton className="btn-youtube text-white mr-2" size="sm">
                  <i className="fas fa-minus text-white" />
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
                <i className="fas fa-plus" />
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
                  <i className="fas fa-file-download"></i>
                </CButton>
              </CTooltip>
            </div>
          </CCardHeader>
          <CCardBody>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <div className="table-responsive table1div">
                <table className="table table-bordered table-sm">
                  <thead className="table1header">
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Sub Category</th>
                      <th scope="col">panel_type</th>

                      <>
                        {filterType && filterType.length
                          ? filterType.map((item, index) => {
                              return <th scope="col">{item.fiterTypeName}</th>;
                            })
                          : null}
                      </>
                      <th scope="col">Food Type Selection</th>

                      <th scope="col">Options</th>
                      <th scope="col">online price</th>
                      <th scope="col">table price</th>
                      <th scope="col">tw price</th>
                      <th scope="col">BuyOne GetOne</th>
                      <th scope="col">half price</th>
                      <th scope="col">Tax</th>
                      <th scope="col">For Web</th>
                      <th scope="col">For TW</th>
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
                              <td></td>
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
                                    })
                                  }
                                />
                              </td>
                              <td>{this.getCategoryName(categoryID)}</td>
                              <td>{this.getSubCategoryName(subCategoryId)}</td>
                              <td>{pannelType && pannelType}</td>
                              <>
                                {filterType && filterType.length
                                  ? filterType.map((item, index) => {
                                      return <td></td>;
                                    })
                                  : null}
                              </>
                              <td></td>
                              <td>Regular</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={false}
                                />
                              </td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={false}
                                />
                              </td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={false}
                                />
                              </td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={true}
                                />
                              </td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={true}
                                />
                              </td>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  checked={false}
                                />
                              </td>
                              <td></td>
                              <td>
                                <div className="d-flex flex-row text-center">
                                  <CBadge
                                    className={`${
                                      !is_deleted
                                        ? "bg1"
                                        : "bg-secondary text-dark"
                                    } text-white px-1 pt-1 pb-1`}
                                  >
                                    Enable
                                  </CBadge>

                                  <CBadge
                                    className={`${
                                      is_deleted
                                        ? "btn-youtube"
                                        : "bg-secondary text-dark"
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
                                        <td>{item && item.panel_type}</td>
                                        {selectRowId === item._id &&
                                        selectRowClick > 1
                                          ? filterType.length
                                            ? filterType.map((filter) => {
                                                return (
                                                  <td>
                                                    <Multiselect
                                                      selectedValues={
                                                        filterData[
                                                          filter.fiterTypeName
                                                        ]
                                                      }
                                                      options={filter.options}
                                                      onSelect={(
                                                        selectedList,
                                                        selectedItem
                                                      ) =>
                                                        this.onSelect(
                                                          selectedList,
                                                          selectedItem,
                                                          filter.fiterTypeName,
                                                          item.filters
                                                        )
                                                      }
                                                      onRemove={(
                                                        selectedList,
                                                        removedItem
                                                      ) =>
                                                        this.onRemove(
                                                          selectedList,
                                                          removedItem,
                                                          filter.fiterTypeName,
                                                          item.filters
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
                                                          borderBottom:
                                                            "1px solid #19c133",
                                                          borderRadius: "0px",
                                                          background: "#fff",
                                                        },
                                                      }}
                                                    />
                                                  </td>
                                                );
                                              })
                                            : null
                                          : filterType.length
                                          ? filterType.map((filter) => {
                                              return (
                                                <td>
                                                  {item.filters &&
                                                  item.filters[
                                                    filter.fiterTypeName
                                                  ]
                                                    ? this.getFilterName(
                                                        filter.fiterTypeName,
                                                        item.filters[
                                                          filter.fiterTypeName
                                                        ]
                                                      )
                                                    : ""}
                                                </td>
                                              );
                                            })
                                          : null}
                                        <td>
                                          {selectRowId === item._id &&
                                          selectRowClick > 1 ? (
                                            <Multiselect
                                              options={foodTypeOptions}
                                              selectedValues={food_type_ids}
                                              onSelect={(
                                                selectedList,
                                                selectedItem
                                              ) =>
                                                this.onSelectFoodType(
                                                  selectedList,
                                                  selectedItem,
                                                  item.food_type_ids
                                                )
                                              }
                                              onRemove={(
                                                selectedList,
                                                removedItem
                                              ) =>
                                                this.onRemoveFoodType(
                                                  selectedList,
                                                  removedItem,
                                                  item.food_type_ids
                                                )
                                              }
                                              displayValue="name"
                                              showCheckbox={true}
                                              id="css_custom"
                                              style={{
                                                chips: { display: "none" },
                                                searchBox: {
                                                  border: "none",
                                                  borderBottom:
                                                    "1px solid #19c133",
                                                  borderRadius: "0px",
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    buy_one_get_one:
                                                      e.target.checked,
                                                  })
                                              )
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    half_price:
                                                      e.target.checked,
                                                  })
                                              )
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    has_tax: e.target.checked,
                                                  })
                                              )
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    is_web: e.target.checked,
                                                  })
                                              )
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    is_tw: e.target.checked,
                                                  })
                                              )
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
                                              this.setState(
                                                {
                                                  selectRowId: item._id,
                                                  selectRowClick: 1,
                                                },
                                                () =>
                                                  this.props.onUpdateItems({
                                                    item_id: item._id,
                                                    is_discount_applied:
                                                      e.target.checked,
                                                  })
                                              )
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
                                                    : "bg-secondary text-dark"
                                                } text-white px-1`}
                                                onClick={() =>
                                                  this.setState(
                                                    {
                                                      selectRowId: item._id,
                                                      selectRowClick: 1,
                                                    },
                                                    () =>
                                                      this.props.onUpdateItems({
                                                        is_deleted: false,
                                                        item_id: item._id,
                                                      })
                                                  )
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
                                                    : "bg-secondary text-dark"
                                                } text-white px-1 ml-1`}
                                                onClick={() =>
                                                  this.setState(
                                                    {
                                                      selectRowId: item._id,
                                                      selectRowClick: 1,
                                                    },
                                                    () =>
                                                      this.props.onUpdateItems({
                                                        is_deleted: true,
                                                        item_id: item._id,
                                                      })
                                                  )
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
                                <td colSpan="22">
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
                              <td colSpan="22">
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
