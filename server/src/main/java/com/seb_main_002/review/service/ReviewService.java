package com.seb_main_002.review.service;

import com.seb_main_002.exception.BusinessLogicException;
import com.seb_main_002.exception.ExceptionCode;
import com.seb_main_002.item.entity.Item;
import com.seb_main_002.item.repository.ItemRepository;
import com.seb_main_002.member.entity.Member;
import com.seb_main_002.member.repository.MemberRepository;
import com.seb_main_002.order.entity.Order;
import com.seb_main_002.order.entity.OrderItem;
import com.seb_main_002.order.repository.OrderRepository;
import com.seb_main_002.review.dto.ReviewResponseDto;
import com.seb_main_002.review.entity.Review;
import com.seb_main_002.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         MemberRepository memberRepository,
                         ItemRepository itemRepository,
                         OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.memberRepository = memberRepository;
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
    }

    public void createReview(Review review, Long orderItemId) {

        Long memberId = review.getMember().getMemberId();
        Double reviewRating = review.getReviewRating();

        Long itemId = review.getItem().getItemId();
        Item targetItem = verifyExistsItem(itemId);
        Order findOrder = verifyExistsOrder(orderItemId);
        OrderItem findOrderItem =  verifyExistsOrderItem(orderItemId, findOrder);

        verifyPurchasingStatus(memberId, findOrderItem);
        verifyDoubleReviewWriting(findOrderItem);

        setItemRating(targetItem, reviewRating);
        setReviewWriting(findOrderItem);

        reviewRepository.save(review);
    }

    public void updateReview(Review review) {
        Review verifiedReview = verifyExistsReview(review.getReviewId());
        Long savedReviewMemberId = verifiedReview.getMember().getMemberId();
        Long requestReviewMemberId = review.getMember().getMemberId();

        if(savedReviewMemberId.equals(requestReviewMemberId)) {
            Optional.ofNullable(review.getReviewTitle()).ifPresent(reviewTitle -> verifiedReview.setReviewTitle(reviewTitle));
            Optional.ofNullable(review.getReviewContent()).ifPresent(reviewContent -> verifiedReview.setReviewContent(reviewContent));
            Optional.ofNullable(review.getReviewRating()).ifPresent(reviewRating -> verifiedReview.setReviewRating(reviewRating));

            reviewRepository.save(verifiedReview);
        }  else {
            throw new BusinessLogicException(ExceptionCode.CANNOT_MODIFY_REVIEW);
        }
    }

    public Review findReview(Long reviewId) {

        return verifyExistsReview(reviewId);
    }

    public ReviewResponseDto.ReviewItemDto findReviewItem(Long itemId, Long memberId) {
        Item verifiedItem = verifyExistsItem(itemId);
        Member verifiedMember = verifyExistsMember(memberId);


        return ReviewResponseDto.ReviewItemDto.builder()
                .itemTitle(verifiedItem.getItemTitle())
                .categoryKRName(verifiedItem.getCategoryKRName())
                .titleImageURL(verifiedItem.getTitleImageUrl())
                .tagList(verifiedItem.getTagList())
                .memberTagsList(verifiedMember.getTagList())
                .build();
    }

    public void deleteReview(Long reviewId) {
        Review verifiedReview = verifyExistsReview(reviewId);
        Item reviewedItem = verifiedReview.getItem();
        Double reviewedItemRating = reviewedItem.getRating();
        Double reviewedRating = verifiedReview.getReviewRating();
        Long reviewedCount = countReview(reviewedItem);

        Double reviewedItemTotalRating = reviewedItemRating * reviewedCount;
        final Long currentReviewCount = (long) 1;
        Long modifiedReviewedCount = reviewedCount - currentReviewCount;
        Double modifiedReviewedItemRating = (reviewedItemTotalRating - reviewedRating) / modifiedReviewedCount;
        reviewedItem.setRating(modifiedReviewedItemRating);

        reviewRepository.deleteById(reviewId);
    }

    private Review verifyExistsReview(Long reviewId) {
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);
        return optionalReview.orElseThrow(() -> new BusinessLogicException(ExceptionCode.REVIEW_NOT_FOUND));
    }

    private Item verifyExistsItem(Long itemId) {
        Optional<Item> optionalItem = itemRepository.findById(itemId);
        return optionalItem.orElseThrow(() -> new BusinessLogicException(ExceptionCode.ITEM_NOT_FOUND));
    }

    private Member verifyExistsMember(Long memberId) {
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        return optionalMember.orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
    }

    private Order verifyExistsOrder(Long orderItemId) {
        Optional<Long> optionalOrderId = orderRepository.findOrderIdByOrderItemId(orderItemId);
        Long orderId = optionalOrderId.orElseThrow(() -> new BusinessLogicException(ExceptionCode.ORDER_NOT_FOUND));
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        return optionalOrder.orElseThrow(() -> new BusinessLogicException(ExceptionCode.ORDER_NOT_FOUND));
    }

    private OrderItem verifyExistsOrderItem(Long orderItemId, Order order) {
        for(OrderItem orderItem : order.getOrderItems()) {
            if(orderItem.getOrderItemId().equals(orderItemId)) return orderItem;
        }

        throw new BusinessLogicException(ExceptionCode.ORDER_NOT_FOUND);
    }

    private void verifyPurchasingStatus(Long memberId, OrderItem findOrderItem) {
        Long findMemberId = findOrderItem.getOrder().getMember().getMemberId();
        boolean isPurchased = findMemberId.equals(memberId);
        if(!isPurchased) throw new BusinessLogicException(ExceptionCode.CANNOT_POST_REVIEW);
    }

    private void verifyDoubleReviewWriting(OrderItem findOrderItem) {
        boolean isReviewed = findOrderItem.getIsReviewed();
        if(isReviewed) throw new BusinessLogicException(ExceptionCode.CANNOT_POST_REVIEW);
    }

    private void setItemRating(Item item, Double reviewRating) {
        Double itemRating = item.getRating();
        Long itemId = item.getItemId();
        final Long currentReviewCount = (long) 1;
        Long itemReviewedCount = Long.valueOf(reviewRepository.findReviewsByItemId(itemId).size());
        item.setRating((itemRating + reviewRating) / (itemReviewedCount + currentReviewCount));
    }

    private void setReviewWriting(OrderItem orderItem) {
        orderItem.setIsReviewed(true);
    }

    private Long countReview(Item item){
        List<OrderItem> orderItems = item.getOrderItems();
        Long reviewedCount = (long) 0;

        for(OrderItem orderItem : orderItems) {
            if(orderItem.getIsReviewed()) reviewedCount++;
        }

        return reviewedCount;
    }
}
