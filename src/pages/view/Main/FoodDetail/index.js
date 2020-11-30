import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Input,
  List,
  notification,
  Row,
  Table
} from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import confirm from "antd/lib/modal/confirm";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../../../redux/Action/cartAction";
import {
  addToping,
  deleteAllCart,
  removeToCart
} from "../../../../redux/Action/toppinngAction";
import Cart from "../Cart";
import ProductItem from "../Product/ProductItem";
import "./index.css";

const FoodDetail = ({
  cart,
  AddToCart,
  AddToTopping,
  topping,
  DeleteToTopping,
  DeleteAllTopping,
}) => {
  const id = useParams().id;
  const [foodDetail, setFoodDetail] = useState({});
  const [visible, setVisible] = useState(false);
  const [product, setProduct] = useState([]);
  const [idCate, setIdCate] = useState();
  const [quantity, setQuantity] = useState(1);
  const [showTopping, setShowTopping] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const handleAddTopping = (toping) => {
    AddToTopping(toping);
  };
  useEffect(() => {
    DeleteAllTopping([]);
  }, [id]);
  const onClose = () => {
    setVisible(false);
  };
  const findProductCart = (cart, topping) => {
    var index = -1;
    if (cart.length > 0) {
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].toping.id === topping.id) {
          index = i;
          break;
        }
      }
    }
    return index;
  };

  useEffect(() => {
    fetch(`https://website-fpoly-food.herokuapp.com/product/${id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "*/*",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setFoodDetail(response.body);
        console.log(response.body);
        if (response.body.toppingList.length !== 0) {
          setShowTopping(true);
        }

        setIdCate(response.body.categoryEntity.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    fetch(
      `https://website-fpoly-food.herokuapp.com/product/?productName=&status=&categoryId=1&size=4&page=0`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "*/*",
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setProduct(response.body.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [idCate]);

  //showTotalCart
  const showQuantity = (cart) => {
    var quantity = 0;
    if (cart.length > 0) {
      for (var i = 0; i < cart.length; i++) {
        quantity += cart[i].quantity;
      }
      return quantity;
    }
  };
  const onHandleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setQuantity(Number(value));
    // console.log("changed", value);
  };
  //addtopping
  const onChange = (e, topping) => {
    console.log(e.target.checked,topping)
    if (e.target.checked) {
      const price = foodDetail.price + topping.price;
      handleAddTopping(topping);
      setFoodDetail({ ...foodDetail, price });
    }
    if (e.target.checked === false) {
      DeleteToTopping(topping);
      const price = foodDetail.price - topping.price;

      setFoodDetail({ ...foodDetail, price });
    }
  };
  const onAddToCart = (product, quantity, topping) => {
    if (quantity !== 0) {
      confirm({
        title: "Bạn muốn thêm sản phẩm vào giỏ hàng?",

        content: `Sản phẩm :${product.productName} x ${quantity}`,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          AddToCart(product, quantity, topping);
          notification["success"]({
            message: "",
            duration: 2,
            description: "Thêm sản phẩm thành công",
          });
        },
        onCancel() {},
      });
    } else {
      notification["success"]({
        message: "",
        duration: 2,
        description: "Vui lòng chọn số lượng",
      });
    }
  };

  const checkTopping = (record) =>{

  }

  const columns = [
    {
      title: "Image",
      dataIndex: "",
      width: 120,
      render: (text) => (
        <img
          width="80%"
          src="https://tse4.mm.bing.net/th?id=OIP.Pd_SHEfWBTat_af-uSgppAHaJ4&pid=Api&P=0&w=300&h=300"
        />
      ),
    },
    {
      title: "Tên ",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text) => <span>{text} đ</span>,
    },
    {
      title: "",
      dataIndex: "",
      render: (record) => (
        // <Input type='checkbox'/>
        <Checkbox onChange={(e) => onChange(e, record)} autoFocus={false} defaultChecked={false}></Checkbox>
      ),
    },
  ];

  return (
    <>
      <Row
        className="row-food-detail-container"
        justify="center"
        style={{ marginTop: "30px" }}
      >
        <Badge count={showQuantity(cart)} id="myBtn" overflowCount={10}>
          <Button
            shape="circle"
            style={{ background: "none", border: "none" }}
            onClick={showDrawer}
          >
            {" "}
            <ShoppingCartOutlined
              style={{ fontSize: "30px", color: "#fff", margin: 0 }}
            />
          </Button>
        </Badge>
        <Col span={21}>
          <Row>
            <Col xs={24} md={8} className="col-img-food-detail">
              <div
                className="imageDetailItem"
                style={{ backgroundImage: `url(${foodDetail.image})` }}
              ></div>
              <div className="itemDetailImgListWrapped">
                <img className="itemDetailImg" src={foodDetail.image} />
                <img className="itemDetailImg" src={foodDetail.image} />
                <img className="itemDetailImg" src={foodDetail.image} />
                <img className="itemDetailImg" src={foodDetail.image} />
              </div>
            </Col>
            <Col xs={24} md={9} className="colInfoDetailItem">
              <div className="itemDetailInfo">
                <span className="span-name-shop">Món ngón Fpoly</span>
                <span className="span-name-food-detail">
                  {" "}
                  - {foodDetail.productName}{" "}
                </span>
              </div>
              <h2 className="nameDetailItem"> {foodDetail.productName}</h2>
              <span className="span-id-food">
                Mã sản phẩm : {foodDetail.id}{" "}
              </span>
              <p>
                <strong>{foodDetail.productName}</strong>{" "}
                {foodDetail.description}
              </p>

              <>
                {showTopping ? (
                  <Row className="tableTopping">
                    <Col span={24}>
                      <Table
                        columns={columns}
                        dataSource={foodDetail.toppingList}
                        pagination={false}
                        scroll={{ y: 200 }}
                      />
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
              </>
            </Col>
            <Col xs={24} md={7} className="colCartDetailItem">
              <div className="itemDetailCartQuantity">
                <div style={{ marginTop: "10px" }}>
                  <Row type="flex" className="rowCartChangeQuantity">
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span className="span-id-food">Số lượng</span>
                    </Col>
                    <Col span={12} style={{ textAlign: "end" }}>
                      <span className="spanShowQuantity">
                        <Input
                          className="inputShowQuantity"
                          inputMode="numeric"
                          defaultValue={quantity}
                          pattern="[0-9]*"
                          type="number"
                          min={1}
                          max={99}
                          // value={quantity}
                          onChange={onHandleChange}
                        />
                      </span>
                    </Col>
                  </Row>
                  <Row className="ant-row rowCartChangeQuantity">
                    {topping.length !== 0 && (
                      <>
                      
                          <Col span={12} tex>
                            <span className="spanPriceDetailItem">
                              Order thêm
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{ textAlign: "end", paddingRight: "10px" }}
                          >
                            {" "}
                            <List
                            style={{textAlign:'center'}}
                              size="small"
                              bordered
                              dataSource={topping}
                              renderItem={(item) => (
                                <List.Item>{item.topping.name} </List.Item>
                              )}
                            />
                          </Col>
                      
                      </>
                    )}
                  </Row>
                  <div style={{ margin: "20px 0" }}>
                    <Row>
                      <Col span={12}>
                        <span className="spanPriceDetailItem"> Giá:</span>
                      </Col>
                      <Col
                        span={12}
                        style={{ textAlign: "end", paddingRight: "10px" }}
                      >
                        <span className="spanPriceDetailItem">
                          {foodDetail.price} VNĐ
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <Row className="cart__button">
                    <span
                      className="btn__label"
                      onClick={() => onAddToCart(foodDetail, quantity, topping)}
                    >
                      Đặt món
                    </span>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row style={{ marginLeft: "25px" }}>
                <Col flex={4}>
                  <h4 style={{ fontSize: "36px" }}>Gợi ý món ăn</h4>
                </Col>
                <Col flex={1} style={{ textAlign: "right" }}>
                  {" "}
                </Col>
              </Row>
              <Row style={{ margin: 0 }}>
                {product.map((food, index) => (
                  <ProductItem
                    product={food}
                    key={index}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
        <Cart visible={visible} onClose={onClose} />
      </Row>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    cart: state.cartData,
    topping: state.toppingData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    AddToCart: (product, quantity, topping) => {
      dispatch(addToCart(product, quantity, topping));
    },
    AddToTopping: (topping) => {
      dispatch(addToping(topping));
    },
    DeleteToTopping: (topping) => {
      dispatch(removeToCart(topping));
    },
    DeleteAllTopping: (topping) => {
      dispatch(deleteAllCart(topping));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodDetail);
