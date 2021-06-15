import React, { Component } from "react";
import {
  CCol,
  CRow,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CBadge,
  CCollapse,
} from "@coreui/react";

import { connect } from "react-redux";
import {
  addDayDiscountRequest,
  getDayDiscountRequest,
  updateDayDiscountRequest,
} from "../../../actions";
class SpecialDis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: "",
      type: "FLAT",
      day_time: {},
      min_order_value: 0,
      is_deleted: true,
      is_removed: true,
      newRow: false,
      selectRowId: "",
      selectRowClick: 0,
      updateData: {
        discount: 0,
        type: "",
        day_time: {},
        min_order_value: 0,
      }
    };

  }
  componentDidMount() {
    this.props.getHoursDiscountData();
  }

  onRowClick = (item) => {
    const {
      selectRowId,
      selectRowClick,
    } = this.state;

    this.setState({
      selectRowId: item._id,
      newRow: false,
      selectRowClick: selectRowId === item._id ? selectRowClick + 1 : 1,
    });
  };
  handleChange = (e) => {
    const {
      selectRowId,
    } = this.state;
    const { target } = e;
    const { value, name } = target;
    this.props.onUpdateData({
      [name]: value,
      discount_id: selectRowId,
    })
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: false,
      },
    });
  };


  render() {


    const { DiscountReducerData } = this.props;

    const {
      discount,
      type,
      day_time,
      min_order_value,
      is_deleted,
      is_removed,
      newRow,
      updateData, selectRowId, selectRowClick

    } = this.state;
    return (
      <>
        <CCard>
          <CCardHeader className="d-flex flex-row justify-content-between">
            {" "}
            <h6>
              Special Discount
            </h6>
            <div>
              <CTooltip content="remove">
                <CButton
                  className="btn-youtube text-white ml-2"
                  size="sm"
                  onClick={() =>
                    this.props.onUpdateData(
                      {
                        is_removed: true,
                        discount_id: selectRowId,
                      }
                    )
                  }
                >
                  <i class="fas fa-minus text-white" />
                </CButton>
              </CTooltip>
              <CTooltip content="Add New">
                <CButton
                  className="bg1 text-white ml-2"
                  size="sm"
                  onClick={() => this.setState({ newRow: true })}
                >
                  <i class="fas fa-plus" />
                </CButton></CTooltip>
            </div>
          </CCardHeader>

          <CCardBody>
            <div className="table-responsive table1div">
              <table className="table table-bordered table-sm">
                <thead className="table1header">
                  <tr>
                    <th scope="col">Discount</th>
                    <th scope="col">Type</th>
                    <th scope="col">Date, Day & Time</th>
                    <th scope="col">Minimum Order Value</th>
                    <th scope="col">Discount Type</th>
                    <th scope="col">Payment Type</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newRow ? (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="discount"
                          value={discount}
                          onChange={(e) =>
                            this.setState({
                              [e.target.name]:
                                e.target.value,
                            })
                          }
                          onBlur={() =>
                            this.props.onAddHoursDiscount({
                              discount: parseFloat(discount),
                              type: "FLAT",
                              discount_type: "ONE_TIME_SUBSCRIBER",
                              payment_type: "CARD",
                              min_order_value: 0.0,
                              is_deleted: false,
                              is_removed: false,
                            })
                          }
                        />
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      
                      <td></td>
                      <td></td>
                      <td>
                        <div className="d-flex flex-row justify-content-center">
                          <CBadge
                            className={`${!is_deleted
                              ? "bg1"
                              : "bg-secondary"
                              } text-white px-1 pt-1 pb-1`}
                          >
                            Enable
                          </CBadge>

                          <CBadge
                            className={`${is_deleted
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
                  {DiscountReducerData && DiscountReducerData.data &&
                    DiscountReducerData.data.length ? (
                    DiscountReducerData.data.map((itm, ind) => {
                      return (
                        <tr
                          key={ind}
                          onClick={() =>
                            this.onRowClick(itm)
                          }
                          className={
                            selectRowId === itm._id ? "bg2" : ""
                          }
                        >
                          <td >
                            {selectRowId === itm._id &&
                              selectRowClick > 1 ? (

                              <input
                                className="w-100"
                                type="text"
                                name="discount"
                                value={updateData.discount}
                                onChange={(e) =>
                                  this.setState({
                                    updateData: {
                                      ...updateData,
                                      [e.target.name]:
                                        e.target.value,
                                    },
                                  })
                                }
                                onBlur={() =>
                                  this.props.onUpdateData({
                                    discount: parseInt(updateData.discount),
                                    discount_id: selectRowId,
                                  })
                                }
                              />
                            ) : itm.discount ? (
                              itm.discount
                            ) : null}
                          </td>
                          <td >
                            {selectRowId === itm._id &&
                              selectRowClick > 1 ? (
                              <select onChange={(e) => {
                                this.handleChange(e);
                              }}
                                name="type"
                                value={type}
                              >
                                <option value={null} className="bg1">
                                  Select One
                                </option>

                                <option value="PERCENTAGE" className="bg1">
                                  PERCENTAGE
                                </option>

                                <option value="FLAT" className="bg1">
                                  FLAT
                                </option>
                              </select>
                            ) : itm.type ? (
                              itm.type
                            ) : null}
                          </td>

                          <td></td>
                          <td >
                            {selectRowId === itm._id &&
                              selectRowClick > 1 ? (
                              <input
                                type="text"
                                name="min_order_value"
                                value={updateData.min_order_value}
                                onChange={(e) =>
                                  this.setState({
                                    updateData: {
                                      ...updateData,
                                      [e.target.name]:
                                        e.target.value,
                                    },
                                  })
                                }
                                onBlur={() =>
                                  this.props.onUpdateData({
                                    min_order_value: parseInt(updateData.min_order_value),
                                    discount_id: selectRowId,
                                  })
                                }
                              />
                            ) : itm.min_order_value ? (
                              itm.min_order_value
                            ) : null}
                          </td>
                          <td>
                            {selectRowId === itm._id &&
                              selectRowClick > 1 ? (
                              <select onChange={(e) => {
                                this.handleChange(e);
                              }}
                                name="discount_type"
                              >
                                <option value={null} className="bg1">
                                  Select One
                                </option>

                                <option value="ONE_TIME_SUBSCRIBER" className="bg1">
                                  ONE TIME SUBSCRIBER
                                </option>

                                <option value="PAYMENT_TYPE" className="bg1">
                                  PAYMENT TYPE
                                </option>

                                <option value="REDUNDANT_CART" className="bg1">
                                  REDUNDANT CART
                                </option>
                              </select>
                            ) : itm.discount_type ? (
                              itm.discount_type
                            ) : null}
                          </td>


                          <td>
                            {selectRowId === itm._id &&
                              selectRowClick > 1 ? (
                              <select onChange={(e) => {
                                this.handleChange(e);
                              }}
                                name="payment_type"
                              >
                                <option value={null} className="bg1">
                                  Select One
                                </option>

                                <option value="CARD" className="bg1">
                                  CARD
                                </option>

                                <option value="WALLET" className="bg1">
                                  WALLET
                                </option>

                                <option value="CASH" className="bg1">
                                  CASH
                                </option>
                              </select>
                            ) : itm.payment_type ? (
                              itm.payment_type
                            ) : null}
                          </td>
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <CTooltip content="Change Status">
                                <CBadge
                                  className={`${!itm.is_deleted
                                    ? "bg1"
                                    : "bg-secondary"
                                    } text-white px-1`}
                                  onClick={() =>
                                    this.props.onUpdateData(
                                      {
                                        is_deleted: false,
                                        discount_id: selectRowId,
                                      }
                                    )
                                  }
                                >
                                  Enable
                                </CBadge>
                              </CTooltip>
                              <CTooltip content="Change Status">
                                <CBadge
                                  className={`${itm.is_deleted
                                    ? "btn-youtube"
                                    : "bg-secondary"
                                    } text-white px-1 ml-1`}
                                  onClick={() =>
                                    this.props.onUpdateData(
                                      {
                                        is_deleted: true,
                                        discount_id: selectRowId,
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colspan="8">
                        <h6>
                          {" "}
                          <i class="fas fa-exclamation-triangle text-danger mr-2" />
                          Not Found
                        </h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CCardBody>
        </CCard>

      </>
    );
  }
}
const mapStateToProps = (state) => ({
  DiscountReducerData: state.DayDiscountReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAddHoursDiscount: (data) => {
      dispatch(addDayDiscountRequest(data));
    },
    getHoursDiscountData: (data) => {
      dispatch(getDayDiscountRequest(data));
    },
    onUpdateData: (data) => {
      dispatch(updateDayDiscountRequest(data));
    }

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialDis);