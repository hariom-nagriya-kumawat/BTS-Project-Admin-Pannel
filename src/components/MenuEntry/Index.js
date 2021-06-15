import React, { Component } from "react";
import {
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CTabs,
  CCollapse,
  CTooltip,
} from "@coreui/react";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Item from "./Menu/Item";
import Filter from "./Filter";
import FoodType from "./FoodType";
import { getCategoriesRequest, getSubCategoriesRequest } from "../../actions";
import { connect } from "react-redux";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      active: 0,
      pannelType: "E-COM",
      categoryID: "",
      subCategoryId: "",
    };
  }
  onTabChange = (idx) => {
    if (idx === 0) {
      this.setState({ pannelType: "E-COM" });
      this.props.getCategoryData({ panel_type: "E-COM" });
      this.props.getSubCategoryData({ panel_type: "E-COM" });
    } else if (idx === 1) {
      this.setState({ pannelType: "MERCHANDISE" });
      this.props.getCategoryData({ panel_type: "MERCHANDISE" });
      this.props.getSubCategoryData({ panel_type: "MERCHANDISE" });
    } else {
      this.setState({ pannelType: "CATERING" });
      this.props.getCategoryData({ panel_type: "CATERING" });
      this.props.getSubCategoryData({ panel_type: "CATERING" });
    }
    this.setState({ active: idx, show: true });
  };
  setCId = (data) => {
    this.setState({ categoryID: data });
    this.props.getSubCategoryData({ category_id: data ? data : "" });
  };
  setSubCId = (data) => {
    this.setState({ subCategoryId: data });
  };
  render() {
    const { show, active, categoryID, pannelType, subCategoryId } = this.state;
    return (
      <>
        <Filter />
        <FoodType />
        <CRow>
          <CCol xs="12">
            <CTabs
              activeTab={active}
              onActiveTabChange={(idx) => this.onTabChange(idx)}
            >
              <CCard>
                <CNav
                  variant="tabs"
                  className="d-flex flex-row justify-content-between"
                >
                  <div className="d-flex flex-row">
                    <CNavItem>
                      <CNavLink>
                        E-Com
                        {active === 0}
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Marchindise
                        {active === 1}
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink>
                        Catering
                        {active === 2}
                      </CNavLink>
                    </CNavItem>
                  </div>
                  <div className="mt-2 mr-2">
                    {this.state.show === true ? (
                      <CTooltip content="expanded">
                        <i
                          className="fa fa-angle-down text1 ml-2"
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
                        className="fa fa-angle-right ml-2 mt-1"
                        aria-hidden="true"
                        onClick={() =>
                          this.setState({
                            show: true,
                          })
                        }
                      />
                    )}
                  </div>
                </CNav>
                <CCollapse show={show}>
                  <CCardBody>
                    <CTabContent>
                      <CTabPane>
                        <CRow>
                          <CCol xs="12">
                            <Category
                              pannelType={pannelType}
                              setCId={this.setCId}
                            />
                          </CCol>

                          <CCol xs="12">
                            <SubCategory
                              pannelType={pannelType}
                              categoryID={categoryID}
                              setSubCId={this.setSubCId}
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane>
                        <CRow>
                          <CCol xs="12">
                            <Category
                              pannelType={pannelType}
                              setCId={this.setCId}
                            />
                          </CCol>

                          <CCol xs="12">
                            <SubCategory
                              pannelType={pannelType}
                              categoryID={categoryID}
                              setSubCId={this.setSubCId}
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane>
                        <CRow>
                          <CCol xs="12">
                            <Category
                              pannelType={pannelType}
                              setCId={this.setCId}
                            />
                          </CCol>

                          <CCol xs="12">
                            <SubCategory
                              pannelType={pannelType}
                              categoryID={categoryID}
                              setSubCId={this.setSubCId}
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>
                  </CCardBody>
                </CCollapse>
              </CCard>
            </CTabs>
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <Item
              subCategoryId={subCategoryId}
              pannelType={pannelType}
              categoryID={categoryID}
            />
          </CCol>
        </CRow>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCategoryData: (data) => {
      dispatch(getCategoriesRequest(data));
    },
    getSubCategoryData: (data) => {
      dispatch(getSubCategoriesRequest(data));
    },
  };
};
export default connect(null, mapDispatchToProps)(Index);
