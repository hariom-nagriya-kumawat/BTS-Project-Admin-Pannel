import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTooltip,
  CBadge,
  CCollapse,
} from "@coreui/react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import {
  addFoodTypesRequest,
  getFoodTypesRequest,
  updateFoodTypesRequest,
  updateFoodTypesStatusRequest,
  addBulkFoodTypesRequest,
  modalOpenRequest,
  modalCloseRequest,
} from "../../actions";
import Loader from "../../containers/Loader/Loader";
import BulkFoodTypeModal from "./ModalData/BulkFood";

class FoodType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      is_deleted: false,
      selectRowId: "",
      selectRowClick: 0,
      food_type_id: "",
      show: false,
      openFilterId: "",
      newRow: false,
      avatar_url: "",
      imageUrl: "",
      updateData: {
        food_type_id: "",
        food_type_icon: "",
        food_type_name: "",
        is_deleted: false,
      },
    };
  }
  async componentDidMount() {
    this.props.getFoodTypesDate();
  }
  componentDidUpdate({ ReducerData }) {
    if (
      ReducerData &&
      ReducerData.updateReq &&
      this.props.ReducerData &&
      this.props.ReducerData.updateReq &&
      this.props.ReducerData.updateReq !== ReducerData.updateReq
    ) {
      this.setState({
        food_type_id: "",
        newRow: false,
        name: "",
        updateData: {
          food_type_id: "",
          food_type_icon: "",
          food_type_name: "",
          is_deleted: false,
        },
        avatar_url: "",
        imageUrlL: "",
        selectRowClick: this.state.newRow ? 2 : 1,
      });
    }
  }
  onSelectFile = async (file) => {
    file.map(async (data, i) => {
      let picReader = new FileReader();
      let scope = this;
      await picReader.addEventListener("load", async (event) => {
        var image = new Image();
        image.src = event.target.result;
        image.onload = async function () {
          let dataURL = picReader.result;
          scope.setState({ avatar_url: file[0], imageUrl: dataURL });
        };
      });
      await picReader.readAsDataURL(data);
    });
  };
  onDeleteImg = () => {
    this.setState({ avatar_url: "", imageUrl: "" });
  };

  addFoodTypeData = () => {
    const { avatar_url, name } = this.state;
    let data = new FormData();
    data.append("food_type_name", name);
    data.append("food_type_icon", avatar_url);
    this.props.onAddFoodTypes(data);
  };
  onRowClick = (data) => {
    const { selectRowId, selectRowClick, updateData } = this.state;
    const { _id, name, is_deleted, avatar_url } = data;
    this.setState({
      updateData:
        selectRowId === _id
          ? updateData
          : {
              food_type_name: name,
              is_deleted: is_deleted,
              food_type_id: _id,
              food_type_icon: avatar_url,
            },
      selectRowId: _id,
      selectRowClick: selectRowId === _id ? selectRowClick + 1 : 1,
    });
  };
  handelUpdated = async (event) => {
    const { updateData } = this.state;
    let data = new FormData();
    data.append("food_type_name", updateData.food_type_name);
    // data.append("food_type_icon", updateData.food_type_icon);
    // data.append("food_type_id", updateData.food_type_id);
    console.log("updateData", updateData);
    this.props.onUpdateFoodTypes(data);
  };

  render() {
    const {
      newRow,
      show,
      name,
      imageUrl,
      avatar_url,
      selectRowId,
      selectRowClick,
      updateData,
    } = this.state;
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader className="d-flex  flex-row justify-content-between">
                {" "}
                <h6>
                  <i class="fas fa-list-alt mr-2"></i>List Of FoodTypes
                </h6>
                <div>
                  <CTooltip content="remove FoodType">
                    <CButton
                      className="btn-youtube text-white mr-1"
                      size="sm"
                      onClick={() =>
                        this.setState({
                          newRow: true,
                          show: true,
                        })
                      }
                    >
                      <i class="fas fa-minus text-white" />
                    </CButton>
                  </CTooltip>
                  <CTooltip content="Add New FoodTypes">
                    <CButton
                      className="bg1 text-white"
                      size="sm"
                      onClick={() =>
                        this.setState({
                          newRow: true,
                          show: true,
                        })
                      }
                    >
                      <i class="fas fa-plus text-white" />
                    </CButton>
                  </CTooltip>

                  <CTooltip content="Add Bulk Data">
                    <CButton
                      color="info"
                      size="sm"
                      className="ml-1"
                      onClick={() =>
                        this.props.modalOpenRequest({ bulkFoodTypeModal: true })
                      }
                    >
                      <i class="fas fa-file-download" />
                    </CButton>
                  </CTooltip>
                  {this.state.show === true ? (
                    <i
                      className="fa fa-angle-down text1 ml-2"
                      onClick={() =>
                        this.setState({
                          show: !show,
                        })
                      }
                    />
                  ) : (
                    <i
                      className="fa fa-angle-right ml-2"
                      aria-hidden="true"
                      onClick={() =>
                        this.setState({
                          show: !show,
                        })
                      }
                    />
                  )}
                </div>
              </CCardHeader>

              <CCollapse show={show}>
                <CCardBody>
                  <div className="table-responsive table1div">
                    <table class="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Image</th>
                          <th scope="col">Name</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newRow ? (
                          <tr>
                            <td></td>
                            <td className="text-center">
                              {imageUrl ? (
                                <div className="home-img-span mr-3">
                                  <i
                                    className="far fa-times-circle text-danger"
                                    onClick={() => this.onDeleteImg()}
                                  />
                                  <img
                                    src={imageUrl ? imageUrl : null}
                                    alt=""
                                    className="zoom"
                                  />
                                </div>
                              ) : (
                                <Dropzone
                                  multiple={false}
                                  onDrop={(e) => this.onSelectFile(e)}
                                  onBlur={() => this.addFoodTypeData()}
                                >
                                  {({ getRootProps, getInputProps }) => {
                                    return (
                                      <div className="welcome-image-select-background w-100">
                                        <div
                                          className="text-center"
                                          {...getRootProps()}
                                        >
                                          <input
                                            {...getInputProps()}
                                            accept="image/png, image/jpeg"
                                          />
                                          {
                                            <>
                                              {/* <i className="far fa-file-image welcome-image-icon" /> */}
                                              <div className="text-center welcome-image-text">
                                                image
                                              </div>
                                            </>
                                          }
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Dropzone>
                              )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) =>
                                  this.setState({
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                onBlur={() => this.addFoodTypeData()}
                              />
                            </td>
                            <td></td>
                          </tr>
                        ) : null}
                        {this.props.ReducerData &&
                        !this.props.ReducerData.isLoading ? (
                          this.props.ReducerData.data &&
                          this.props.ReducerData.data.length ? (
                            this.props.ReducerData.data.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() => this.onRowClick(item)}
                                >
                                  <td>{index + 1}</td>
                                  <td>
                                    {item.avatar_url ? (
                                      <img
                                        src={item.avatar_url}
                                        className="zoom"
                                      />
                                    ) : null}
                                  </td>
                                  <td>
                                    {selectRowId === item._id &&
                                    selectRowClick > 1 ? (
                                      <input
                                        className="w-100"
                                        type="text"
                                        name="food_type_name"
                                        value={updateData.food_type_name}
                                        onChange={(e) =>
                                          this.setState({
                                            updateData: {
                                              ...updateData,
                                              [e.target.name]: e.target.value,
                                            },
                                          })
                                        }
                                        onBlur={() => this.handelUpdated()}
                                      />
                                    ) : item.name ? (
                                      item.name
                                    ) : null}
                                  </td>

                                  <td>
                                    <div className="d-flex flex-row justify-content-center mt-3">
                                      <CTooltip content="Change Status">
                                        <CBadge
                                          className={`${
                                            !item.is_deleted
                                              ? "bg1"
                                              : "bg-secondary"
                                          } text-white px-1`}
                                          onClick={() =>
                                            this.props.updateFoodStatus({
                                              is_deleted: false,
                                              food_type_id: item._id,
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
                                            this.props.updateFoodStatus({
                                              is_deleted: true,
                                              food_type_id: item._id,
                                            })
                                          }
                                        >
                                          Disable
                                        </CBadge>
                                      </CTooltip>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colspan="5">
                                <h1>Not Found</h1>
                              </td>
                            </tr>
                          )
                        ) : (
                          <tr>
                            <td colspan="5">
                              <Loader />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CCardBody>
              </CCollapse>
            </CCard>
          </CCol>
        </CRow>

        <BulkFoodTypeModal
          isShow={this.props.ModalReducer.bulkFoodTypeModal}
          onClose={() =>
            this.props.modalCloseRequest({ bulkFoodTypeModal: false })
          }
          onSaveBulkData={(data) => this.props.onSaveBulkData(data)}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ReducerData: state.FoodTypeReducer,
  ModalReducer: state.ModalReducer,
});
const mapDispatchToProps = (dispatch) => {
  return {
    onAddFoodTypes: (data) => {
      dispatch(addFoodTypesRequest(data));
    },
    onSaveBulkData: (data) => {
      dispatch(addBulkFoodTypesRequest(data));
    },
    getFoodTypesDate: (data) => {
      dispatch(getFoodTypesRequest(data));
    },
    onUpdateFoodTypes: (data) => {
      dispatch(updateFoodTypesRequest(data));
    },
    updateFoodStatus: (data) => {
      dispatch(updateFoodTypesStatusRequest(data));
    },
    modalOpenRequest: (data) => {
      dispatch(modalOpenRequest(data));
    },
    modalCloseRequest: (data) => {
      dispatch(modalCloseRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FoodType);
