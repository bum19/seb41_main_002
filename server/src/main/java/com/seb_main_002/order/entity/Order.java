package com.seb_main_002.order.entity;

import com.seb_main_002.audit.Auditable;
import com.seb_main_002.delivery.entity.Delivery;
import com.seb_main_002.member.entity.Member;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "ORDERS")
public class Order extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @OneToOne(mappedBy = "order", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY)
    private Delivery delivery;

    private Integer reserve;

    private Integer totalPrice;

    @Enumerated(value=EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.ORDER_COMPLETE;

    @OneToMany(mappedBy = "order", cascade={CascadeType.ALL})
    private List<OrderItem> orderItems = new ArrayList<>();

    public void setDelivery(Delivery delivery) {
        this.delivery = delivery;
        if(delivery.getOrder() != this) {
            delivery.setOrder(this);
        }
    }
    public void addOrderItems(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        if(orderItem.getOrder() != this) {
            orderItem.setOrder(this);
        }
    }


    public enum OrderStatus {
        ORDER_CONFIRM(1, "주문 확정"),
        ORDER_COMPLETE(2, "주문 처리 완료"),
        ORDER_CANCEL(3, "주문 취소");

        @Getter
        private int stepNumber;

        @Getter
        private String stepDescription;

        OrderStatus(int stepNumber, String stepDescription) {
            this.stepNumber = stepNumber;
            this.stepDescription = stepDescription;
        }
    }
}
