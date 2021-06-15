import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CBadge,
  CSwitch,
  CSelect,
} from "@coreui/react";
import { connect } from "react-redux";
import {
  modalOpenRequest,
  modalCloseRequest,
  addCategoriesRequest,
  getCategoriesRequest,
  getCategoriesSuccess,
  updateCategoriesRequest,
  addBulkCategoriesRequest,
  getFilterTypeRequest,
  getFoodTypesRequest,
} from "../../../actions";
import Loader from "../../../containers/Loader/Loader";
import BulkCategoryModal from "../ModalData/BulkCategory";
import MultiSelect from "react-multi-select-component";
import { Multiselect } from "multiselect-react-dropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
class ListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCategory: false,
      name: "",
      description: "",
      is_deleted: false,
      food_type_ids: [],
      is_web: false,
      is_tw: false,
      is_discount_applied: false,
      order: 0,
      selectRowCid: "",
      selectRowClick: 0,
      updateCategoryData: {
        name: "",
        description: "",
        is_deleted: false,
        allergy_ids: [],
        food_type_ids: [],
        is_web: false,
        is_tw: false,
        is_discount_applied: false,
        order: 0,
      },
      allergyData: [],
      allergy_ids: [],
    };
  }
  componentDidMount() {
    this.props.getCategoriesDate();
    this.props.getFilterTypeDate();
    this.props.getFoodTypesDate();
  }
  componentDidUpdate({ CategorieReducerData, FilterTypeData }) {
    if (
      FilterTypeData &&
      FilterTypeData.updateReq &&
      FilterTypeData.updateReq !== this.props.FilterTypeData.updateReq
    ) {
      const { FilterTypeData } = this.props;
      let allergyData =
        FilterTypeData &&
        FilterTypeData.data &&
        FilterTypeData.data.filter((item) => item.name === "allergy")[0];

      console.log("allergyData", allergyData, FilterTypeData.data);

      this.setState({
        allergyData: allergyData ? allergyData.filter_data : [],
      });
    }

    if (
      CategorieReducerData &&
      CategorieReducerData.updateReq &&
      CategorieReducerData.updateReq !==
        this.props.CategorieReducerData.updateReq
    ) {
      let data = this.props.CategorieReducerData.data.filter(
        (item) => item._id === this.state.selectRowCid
      )[0];
      let updateCategoryData = {
        name: data && data.name ? data.name : "",
        is_deleted: data && data.is_deleted ? data.is_deleted : false,
        description: data && data.description ? data.description : "",
      };
      this.setState({
        addCategory: false,
        name: "",
        is_deleted: false,
        description: "",
        selectRowCid: data && data._id,
        selectRowClick: this.state.addCategory ? 2 : 1,
        updateCategoryData: updateCategoryData,
      });
    }
  }
  onDragStart = (start) => {
    const id = start.draggableId;
    console.log("@@@@@@@", id);
  };

  onDragEnd = (result) => {
    const { destination, source, reason } = result;
    console.log("@@@@@destination", destination, source, reason);
    // Not a thing to do...
    if (!destination || reason === "CANCEL") {
      this.setState({
        draggingRowId: null,
      });
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const entities = Object.assign([], this.props.CategorieReducerData.data);
    const quote = this.props.CategorieReducerData.data[source.index];
    entities.splice(source.index, 1);
    entities.splice(destination.index, 0, quote);
    this.props.getCategoriesSuccess({ data: entities });
  };

  onSelect = (selectedList, selectedItem) => {
    const { updateCategoryData, selectRowCid } = this.state;
    let allergyIds = [];
    for (let i = 0; i < selectedList.length; i++) {
      allergyIds.push(selectedList[i].id);
    }
    console.log("allergyIds", allergyIds);
    this.setState(
      {
        allergy_ids: selectedList,
        updateCategoryData: {
          ...updateCategoryData,
          allergy_ids: allergyIds,
        },
      },
      () =>
        this.props.onUpdateCategories({
          cId: selectRowCid,
          allergy_ids: allergyIds,
        })
    );
    console.log("selectedList, selectedItem", selectedList, selectedItem);
  };

  onRemove = (selectedList, removedItem) => {
    console.log("selectedList, removedItem", selectedList, removedItem);
  };

  onUpdateData = () => {
    alert("!!!!!!");
    console.log("#########");
  };

  render() {
    const {
      addCategory,
      name,
      description,
      is_deleted,
      selectRowCid,
      updateCategoryData,
      selectRowClick,
      allergy_ids,
      food_type_ids,
      is_web,
      is_tw,
      is_discount_applied,
      order,
      allergyData,
    } = this.state;
    const { CategorieReducerData, FilterTypeData, FoodTypeReducerData } =
      this.props;
    let options = [];
    if (allergyData && allergyData.length) {
      allergyData.map((itm) => {
        options.push({
          name: itm.name,
          id: itm._id,
        });
        return true;
      });
    }
    return (
      <>
        <CCard>
          <CCardHeader className="d-flex  flex-row justify-content-between">
            {" "}
            <h6>
              <i class="fas fa-list-alt mr-2"></i>Category Name
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
                    addCategory: true,
                    selectRowCid: "",
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
            <DragDropContext
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}
            >
              <div className="table-responsive table1div">
                <table class="table table-bordered table-sm">
                  <thead className="table1header">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Sorting</th>
                      <th scope="col">Not For Web</th>
                      <th scope="col">Allergy Selection</th>
                      <th scope="col">Food Type Selection</th>
                      <th scope="col">Not Fot TW</th>
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
                          {addCategory ? (
                            <tr>
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
                                    this.props.onAddCategories({
                                      name,
                                      is_deleted: false,
                                      is_web: false,
                                      is_discount_applied: false,
                                      is_tw: false,
                                      order: 0,
                                      allergy_ids: [],
                                      food_type_ids: [],
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="w-100"
                                  type="text"
                                  name="description"
                                  onChange={(e) =>
                                    this.setState({
                                      [e.target.name]: e.target.value,
                                    })
                                  }
                                  onBlur={() =>
                                    this.props.onAddCategories({
                                      name,
                                      description,
                                      is_deleted,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="w-100"
                                  type="number"
                                  name="order"
                                  disabled
                                />
                              </td>

                              <td>
                                <h6>Multiple</h6>
                              </td>

                              <td>
                                <h6>Multiple</h6>
                              </td>

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

                          {CategorieReducerData &&
                          !CategorieReducerData.isLoading ? (
                            CategorieReducerData.data &&
                            CategorieReducerData.data.length ? (
                              CategorieReducerData.data.map((item, index) => {
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
                                          selectRowCid === item._id ? "bg2" : ""
                                        }
                                        onClick={() =>
                                          this.setState({
                                            selectRowCid: item._id,
                                            addCategory: false,
                                            selectRowClick:
                                              selectRowCid === item._id
                                                ? selectRowClick + 1
                                                : 1,
                                            updateCategoryData:
                                              selectRowCid === item._id
                                                ? updateCategoryData
                                                : {
                                                    name: item.name
                                                      ? item.name
                                                      : "",
                                                    description:
                                                      item.description
                                                        ? item.description
                                                        : "",
                                                    is_deleted: item.is_deleted
                                                      ? item.is_deleted
                                                      : false,
                                                  },
                                          })
                                        }
                                      >
                                        <td>
                                          {selectRowCid === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="text"
                                              name="name"
                                              value={updateCategoryData.name}
                                              onChange={(e) =>
                                                this.setState({
                                                  updateCategoryData: {
                                                    ...updateCategoryData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateCategories({
                                                  name: updateCategoryData.name,
                                                  cId: selectRowCid,
                                                })
                                              }
                                            />
                                          ) : item.name ? (
                                            item.name
                                          ) : null}
                                        </td>

                                        <td>
                                          {selectRowCid === item._id &&
                                          selectRowClick > 1 ? (
                                            <input
                                              className="w-100"
                                              type="text"
                                              name="description"
                                              value={
                                                updateCategoryData.description
                                              }
                                              onChange={(e) =>
                                                this.setState({
                                                  updateCategoryData: {
                                                    ...updateCategoryData,
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                })
                                              }
                                              onBlur={() =>
                                                this.props.onUpdateCategories({
                                                  description:
                                                    updateCategoryData.description,
                                                  cId: selectRowCid,
                                                })
                                              }
                                            />
                                          ) : (
                                            item.description
                                          )}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                          {selectRowCid === item._id &&
                                          selectRowClick > 1 ? (
                                            <Multiselect
                                              options={options}
                                              selectedValues={allergy_ids}
                                              onSelect={this.onSelect} // Function will trigger on select event
                                              onRemove={this.onRemove} // Function will trigger on remove event
                                              displayValue="name" // Property name to display in the dropdown options
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
                                              {item.allergy_ids &&
                                              item.allergy_ids.length
                                                ? item.allergy_ids.map(
                                                    (itm) => {
                                                      let allergyName =
                                                        allergyData &&
                                                        allergyData.length &&
                                                        allergyData.filter(
                                                          (abc) =>
                                                            abc._id === itm
                                                        )[0];
                                                      return (
                                                        <div>
                                                          {allergyName && allergyName.name}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </>
                                          )}
                                        </td>
                                        <td>
                                          <MultiSelect
                                            options={options}
                                            // value={selected}
                                            // onChange={setSelected}
                                            labelledBy={"Select"}
                                          />
                                        </td>

                                        <td>
                                          <CSwitch
                                            className={"mx-1"}
                                            variant={"3d"}
                                            name="is_tw"
                                            // onChange={(e) => handleChange(e)}
                                          />
                                        </td>
                                        <td>{item.order}</td>
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
                                                  this.props.onUpdateCategories(
                                                    {
                                                      is_deleted: false,
                                                      cId: selectRowCid,
                                                    }
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
                                                    : "bg-secondary"
                                                } text-white px-1 ml-1`}
                                                onClick={() =>
                                                  this.props.onUpdateCategories(
                                                    {
                                                      is_deleted: true,
                                                      cId: selectRowCid,
                                                    }
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
                                <td colspan="9">
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
                              <td colspan="10">
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
  CategorieReducerData: state.CategorieReducer,
  FilterTypeData: state.FilterTypeReducer,
  FoodTypeReducerData: state.FoodTypeReducer,
  ReducerData: state.ItemsReducer,
  ModalReducer: state.ModalReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAddCategories: (data) => {
      dispatch(addCategoriesRequest(data));
    },
    getFoodTypesDate: (data) => {
      dispatch(getFoodTypesRequest(data));
    },
    getFilterTypeDate: (data) => {
      dispatch(getFilterTypeRequest(data));
    },
    getCategoriesSuccess: (data) => {
      dispatch(getCategoriesSuccess(data));
    },
    getCategoriesDate: (data) => {
      dispatch(getCategoriesRequest(data));
    },
    onUpdateCategories: (data) => {
      dispatch(updateCategoriesRequest(data));
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
