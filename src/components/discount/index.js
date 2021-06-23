import React, { Component } from "react";
import {
  CCol,
  CRow,
  CCardHeader,
  CCard,
  CCollapse,
  CTooltip,
} from "@coreui/react";
import HappyHourse from "./discountItems/HappyHourse";
import SpecialDis from "./discountItems/SpecialDis";
import LoyaltyCard from "./discountItems/LoyaltyCard";
import GiftCard from "./discountItems/GiftCard";
import Voucher from "./discountItems/Voucher";
import Coupon from "./discountItems/Coupon";
import Pickup from "./conditionItems/DiscountPickup";
import Delivery from "./conditionItems/DiscountDelivery";
import DiscountService from "./conditionItems/DiscountService";
import DeliveryCharges from "./conditionItems/DeliveryCharges";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show1: true,
    };
  }

  render() {
    const { show, show1 } = this.state;
    return (
      <>
        <CCard>
          <CCardHeader className="d-flex flex-row justify-content-between pr-0">
            <h6 className="pt-1">
              <i className="fas fa-list-alt mr-2"></i>Charges & Conditions
            </h6>
            <div>
              {this.state.show1 === true ? (
                <CTooltip content="expanded">
                  <i
                    className="fas fa-caret-down text1 mr-2 fa-2x"
                    onClick={() =>
                      this.setState({
                        show1: false,
                      })
                    }
                  />
                </CTooltip>
              ) : (
                <i
                  className="fas fa-caret-right mr-2 fa-2x"
                  aria-hidden="true"
                  onClick={() =>
                    this.setState({
                      show1: true,
                    })
                  }
                />
              )}
            </div>
          </CCardHeader>
        </CCard>

        <CCollapse show={show1}>
          <CRow>
            <CCol xs="12" sm="6">
              <Pickup {...this.props} />
            </CCol>
            <CCol xs="12" sm="6">
              <Delivery {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <DiscountService {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <DeliveryCharges {...this.props} />
            </CCol>
          </CRow>
        </CCollapse>

        <CCard>
          <CCardHeader className="d-flex flex-row justify-content-between pr-0">
            <h6 className="pt-1">
              <i className="fas fa-list-alt mr-2"></i>Other Discount
            </h6>
            <div>
              {this.state.show === true ? (
                <CTooltip content="expanded">
                  <i
                    className="fas fa-caret-down text1 mr-2 fa-2x"
                    onClick={() =>
                      this.setState({
                        show: false,
                        openFilterId: "",
                      })
                    }
                  />
                </CTooltip>
              ) : (
                <i
                  className="fas fa-caret-right mr-2 fa-2x"
                  aria-hidden="true"
                  onClick={() =>
                    this.setState({
                      show: true,
                    })
                  }
                />
              )}
            </div>
          </CCardHeader>
        </CCard>

        <CCollapse show={show}>
          <CRow>
            <CCol xs="12" sm="6">
              <HappyHourse {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <SpecialDis {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <LoyaltyCard {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <GiftCard {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <Voucher {...this.props} />
            </CCol>

            <CCol xs="12" sm="6">
              <Coupon {...this.props} />
            </CCol>
          </CRow>
        </CCollapse>
      </>
    );
  }
}

export default Index;
