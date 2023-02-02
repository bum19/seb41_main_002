import { ItemType, OrderType } from "../../API/MemberPage/MemberPageAPI";
import CustomButton from "../Commons/Buttons";
import { useState } from "react";
import { Link } from "react-router-dom";

const OrderHistoryItem = ({ order }: { order: OrderType }) => {
  const [isActive, setIsActive] = useState(false);
  const openAccordion = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <div className="Profile_History_Item">
        <div className="History_Product_Info">
          <span className="History_Detail_Indicator">주문 일자</span>
          <div>{order.orderCreatedAt}</div>
        </div>
        <div className="History_Product_Info">
          <span className="History_Detail_Indicator">주문 금액</span>
          <div>{order.totalPrice} 원</div>
        </div>
        <div className="History_Product_Info">
          <span className="History_Detail_Indicator">배송 현황</span>
          <div>{order.orderStatus}</div>
        </div>
        <div className="Order_Detail_Button_Wrapper" onClick={openAccordion}>
          <CustomButton
            bgColor="transparent"
            content={isActive ? "접기" : "자세히"}
            fontColor="var(--indicatorColor1)"
            padding="10px"
            width="100px"
            border="none"
            fontsize="21px"
            hoverColor="white"
          />
        </div>
      </div>
      {isActive ? (
        <div>
          {order.orderItems.map((item: ItemType) => {
            return (
              <div
                className="Profile_History_Content"
                key={`order${order.orderId}Item${item.orderItemId}`}
              >
                <div className="History_Image_Container">
                  <img src={item.itemImageURL} alt="item image" />
                </div>
                <div className="History_Product_Name">
                  <span className="History_Detail_Indicator">상품명</span>
                  <Link to={`/itemDetail/${item.itemId}`}>
                    <div className="History_Product_Title">
                      {item.itemTitle}{" "}
                    </div>
                  </Link>
                </div>
                <div className="History_Product_Info">
                  <span className="History_Detail_Indicator">상품 개수</span>
                  <div>{item.count}</div>
                </div>
                <div className="History_Product_Info">
                  <span className="History_Detail_Indicator">가격</span>
                  <div>{item.itemTotalPrice}</div>
                </div>
                {item.isReviewed ? (
                  <div className="Review_Done">리뷰 완료</div>
                ) : (
                  <div className="History_Review_Button">
                    <Link
                      to={`/reviews/item/${item.itemId}?orderItemId=${item.orderItemId}`}
                    >
                      <CustomButton
                        bgColor="transparent"
                        content="리뷰 작성"
                        width="125px"
                        padding="10px"
                        fontColor="var(--indicatorColor1)"
                        border="none"
                        fontsize="21px"
                        hoverColor="white"
                      />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default OrderHistoryItem;
