package com.seb_main_002.exception;

import lombok.Getter;

public enum ExceptionCode {
    MEMBER_NOT_FOUND(404, "Member not found"),
    MEMBER_EXISTS(409, "Member exists"),
    ITEM_NOT_FOUND(404, "Item not found"),
    ORDER_NOT_FOUND(404, "Order not found"),
    CANNOT_POST_ORDER(400, "Can not Post Order"),
    CANNOT_CANCEL_ORDER(403, "Order can not change"),
    NOT_IMPLEMENTATION(501, "Not Implementation"),
    UNAUTHORIZED(401,"Unauthorized"),
    CANNOT_CHANGE_SUBSCRIBE(403,"Subscription can not be changed"),
    EMAIL_EXISTS(409, "Email exists"),
    BANNER_IMAGE_NOT_FOUND(404, "BannerImage not found"),
    ACCOUNTID_EXISTS(409,"AccountId exists"),
    ADDRESS_EXISTS(409,"Address exists"),
    ADDRESS_NOT_FOUND(404,"Address not found"),
    REVIEW_NOT_FOUND(404,"Review not found"),
    CANNOT_MODIFY_REVIEW(403,"No permission to modify Review"),
    CART_ITEM_NOT_FOUND(404,"CartItem not found"),
    CANNOT_POST_REVIEW(400, "Can not Post review, already exists"),
    EVENT_NOT_FOUND(404,"Event not found"),
    EMAIL_NOT_FOUND(404, "Email not found"),
    SAME_PASSWORD(409, "Password is same as before");


    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}
