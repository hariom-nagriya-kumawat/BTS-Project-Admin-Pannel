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
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show1: false,
    }
  }

  render() {
    const { show, show1 } = this.state;
    return (

      <>

        <CCard className="w-100">
          <CCardHeader className="d-flex flex-row justify-content-between w-100 bg1">
            <h6 className ="text-white mt-1">
              CHARGES & CONDITIONS
            </h6>
            <div>

              {this.state.show === true ? (
                <CTooltip content="expanded">
                  <i
                    className="fa fa-angle-down text-white fa-2x"
                    onClick={() =>
                      this.setState({
                        show1: false,
                      })
                    }
                  />
                </CTooltip>
              ) : (
                <i
                  className="fa fa-angle-right fa-2x  text-white mt-1"
                  aria-hidden="true"
                  onClick={() =>
                    this.setState({
                      show1: true,
                    })
                  }
                />
              )}
            </div>
          </CCardHeader></CCard>

        <CCollapse show={show1}>
          <CRow>

            <CCol xs="12" sm="12">
              
              <h5 className="text-center">Comming Soon</h5>
            </CCol>

          </CRow>
        </CCollapse>
        <CCard className="w-100">
          <CCardHeader className="d-flex flex-row justify-content-between w-100 bg1">
            <h6 className ="text-white">
              OTHER DISCOUNT
            </h6>
            <div>

              {this.state.show === true ? (
                <CTooltip content="expanded">
                  <i
                    className="fa fa-angle-down text-white fa-2x"
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
                  className="fa fa-angle-right text-white fa-2x mt-1"
                  aria-hidden="true"
                  onClick={() =>
                    this.setState({
                      show: true,
                    })
                  }
                />
              )}
            </div>
          </CCardHeader></CCard>

        <CCollapse show={show}>
          <CRow>

            <CCol xs="12" sm="6">
              <HappyHourse />
            </CCol>

            <CCol xs="12" sm="6">
              <SpecialDis />
            </CCol>

            <CCol xs="12" sm="6">
              <LoyaltyCard />
            </CCol>

            <CCol xs="12" sm="6">
              <GiftCard />
            </CCol>

            <CCol xs="12" sm="6">
              <Voucher />
            </CCol>
            <CCol xs="12" sm="6">
              <Coupon />
            </CCol>
          </CRow>
        </CCollapse>

      </>
    );
  }
}


export default Index;
