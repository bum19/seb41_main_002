import {
  AddressType,
  cancelSubscription,
  deleteAddress,
  getMemberData,
  MemberPageDataType,
  updateAddress,
  updateMemberData,
} from "../API/MemberPageEdit/MemberPageEditAPI";
import CustomButton from "../Components/Commons/Buttons";
import Modal from "../Components/Commons/Modal";
import NewAddressModal from "../Components/MemberPageEdit/NewAddressModal";
import EditAddressModal from "../Components/MemberPageEdit/EditAddressModal";
import { subscriptionCalculation } from "../Function/memberEditPage";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./Style/memberPageEdit.css";

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 75px;
  background-color: var(--dark3);
  border-bottom: 1px solid white;

  &:last-child {
    border: none;
  }
`;

const memberId = Number(sessionStorage.getItem("memberId"));

export default function MemberPageEdit() {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<boolean>(false);
  const [isNewAddressModalOn, setIsNewAddressModalOn] =
    useState<boolean>(false);
  const [isEditAddressModalOn, setIsEditAddressModalOn] =
    useState<boolean>(false);

  const [memberAddressData, setMemberAddressData] =
    useState<MemberPageDataType>();

  const [memberName, setMemberName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

  const [render, setRender] = useState<boolean>(false);

  const [newAddressId, setNewAddressId] = useState<number>(
    memberAddressData?.addressList.length as number
  );
  const [editingAddress, setEditingAddress] = useState<AddressType>(
    memberAddressData?.addressList[0] as AddressType
  );
  const calcMonth = subscriptionCalculation(
    memberAddressData?.subscribedDate as string
  );

  useEffect(() => {
    if (modalState === false) {
      setIsEditAddressModalOn(false);
      setIsNewAddressModalOn(false);
    }
  }, [modalState]);

  useEffect(() => {
    try {
      getMemberData(memberId).then((res) => {
        setRender(true);
        setMemberAddressData(res);
        setMemberName(res?.memberName as string);
        setEmail(res?.email as string);
        setPhoneNumber(res?.phoneNumber as string);
        setTagList(res?.tagList as string[]);
      });
    } catch (err) {
      console.error(err);
    }
  }, [render]);

  const toResetPW = () => {
    if (window.confirm("비밀번호를 변경하시겠습니까?")) {
      navigate("/resetPw");
    }
  };

  const handleMemberName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMemberName(e.target.value);
  };

  const handleEmail: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumber: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPhoneNumber(
      e.target.value
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
        .replace(/(\-{1,2})$/g, "")
    );
  };

  const editSkinType: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const sebumType = ["건성", "복합성", "지성"];
    const skinType = ["일반피부", "여드름성 피부"];

    if (sebumType.includes(e.target.value) && tagList) {
      tagList[0] = e.target.value;
    }
    if (skinType.includes(e.target.value) && tagList) {
      tagList[1] = e.target.value;
    }
  };

  const editSkinTag: React.MouseEventHandler<HTMLInputElement> = (e) => {
    const currentTag = e.currentTarget.name;

    if (tagList && tagList.includes(currentTag) === false) {
      tagList.push(currentTag);
    } else if (tagList && tagList.includes(currentTag)) {
      const index = tagList.indexOf(currentTag);
      if (index > -1) {
        tagList.splice(index, 1);
      }
    }
  };

  const setPrimaryAddress: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const addressId = Number(e.currentTarget.name);
    const addressListIndex = Number(e.currentTarget.id);

    const addressData = {
      isPrimary: true,
      addressTitle: memberAddressData?.addressList[addressListIndex]
        .addressTitle as string,
      zipcode: memberAddressData?.addressList[addressListIndex]
        .zipcode as string,
      address: memberAddressData?.addressList[addressListIndex]
        .address as string,
    };
    if (window.confirm("대표 주소로 변경하시겠습니까?")) {
      updateAddress(addressId, addressData);
      setRender(!render);
      alert("대표주소로 변경 완료");
    }
  };

  const addNewAddress: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const addressListIndex = Number(e.currentTarget.id);
    setNewAddressId(addressListIndex);
    setIsNewAddressModalOn(true);
    setModalState(true);
  };

  const editAddress: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const addressListIndex = Number(e.currentTarget.id);
    setEditingAddress(
      memberAddressData?.addressList[addressListIndex] as AddressType
    );
    setIsEditAddressModalOn(true);
    setModalState(true);
  };

  const removeAddress: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const addressId = Number(e.currentTarget.name);

    if (window.confirm("해당 주소지를 삭제하시겠습니까?")) {
      deleteAddress(addressId);
      setRender(!render);
      alert("삭제가 완료되었습니다.");
    }
  };

  const submitEdit = () => {
    const reqBody = {
      memberName: memberName as string,
      email: email as string,
      phoneNumber: phoneNumber as string,
      tagList: tagList as string[],
    };

    if (window.confirm("수정하시겠습니까?")) {
      if (email?.includes("@") === false) {
        alert("이메일은 도메인(@)을 포함해야 합니다.");
      } else if (phoneNumber?.slice(0, 3) !== "010") {
        alert("핸드폰 번호는 010으로 시작해야 합니다.");
      } else if (phoneNumber?.length !== 13) {
        alert("핸드폰 번호는 010을 포함한 총 11자리가 되어야 합니다.");
      } else {
        updateMemberData(memberId, reqBody).then(() => {
          setRender(!render);
          alert("수정 완료");
          navigate(`/memberPage/${memberId}`);
        });
      }
    }
  };

  const stopSubscription = () => {
    if (window.confirm("정말 구독을 취소하시겠습니까?")) {
      cancelSubscription(memberId);
      setIsSubscribed(false);
      setRender(!render);
      sessionStorage.setItem("isSubscribed", "false");
      sessionStorage.removeItem("regularPayment");
      alert("구독이 취소되었습니다.");
    }
  };

  return (
    <>
      {isNewAddressModalOn
        ? modalState && (
            <Modal
              modalState={modalState}
              setModalState={setModalState}
              element={
                <NewAddressModal
                  setModalState={setModalState}
                  currentAddressIndex={
                    memberAddressData?.addressList.length as number
                  }
                  render={render}
                  setRender={setRender}
                  setIsNewAddressModalOn={setIsNewAddressModalOn}
                  memberAddressData={memberAddressData as MemberPageDataType}
                />
              }
            />
          )
        : null}
      {isEditAddressModalOn
        ? modalState && (
            <Modal
              modalState={modalState}
              setModalState={setModalState}
              element={
                <EditAddressModal
                  setModalState={setModalState}
                  editingAddress={editingAddress}
                  render={render}
                  setRender={setRender}
                  setIsEditAddressModalOn={setIsEditAddressModalOn}
                  memberAddressData={memberAddressData as MemberPageDataType}
                />
              }
            />
          )
        : null}

      <section className="Edit_Page_Container">
        <h1 className="Edit_Page_Title">회원정보 수정</h1>
        <div className="Member_Information_Wrapper">
          <InfoWrapper>
            <div className="Info_Label">ID</div>
            <div className="Info_Content">
              {memberAddressData && memberAddressData.accountId}
            </div>
          </InfoWrapper>
          <InfoWrapper>
            <div className="Info_Label">PW</div>
            <div className="Info_Content">
              <CustomButton
                bgColor="transparent"
                content="비밀번호 변경"
                fontColor="var(--indicatorColor1)"
                padding="10px"
                width="150px"
                border="none"
                onClick={toResetPW}
                hoverColor="var(--hoverColor3)"
                fontsize="21px"
              />
            </div>
          </InfoWrapper>
          <InfoWrapper>
            <div className="Info_Label">이름</div>
            <div className="Info_Content">
              <input
                className="Info_Input"
                type="text"
                value={memberName}
                onChange={handleMemberName}
              />
            </div>
          </InfoWrapper>
          <InfoWrapper>
            <div className="Info_Label">생년월일</div>
            <div className="Info_Content">
              {memberAddressData && memberAddressData.birthdate}
            </div>
          </InfoWrapper>
          <InfoWrapper>
            <div className="Info_Label">이메일</div>
            <div className="Info_Content">
              <input
                className="Info_Input"
                type="text"
                value={email}
                onChange={handleEmail}
              />
            </div>
          </InfoWrapper>
          <InfoWrapper>
            <div className="Info_Label">핸드폰 번호</div>
            <div className="Info_Content">
              <input
                className="Info_Input"
                type="text"
                maxLength={13}
                value={phoneNumber}
                onChange={handlePhoneNumber}
                required
              />
            </div>
          </InfoWrapper>
          <ul className="Member_Information_Addresses">
            <h2 className="Info_Title">내 배송지</h2>

            {memberAddressData &&
            memberAddressData?.addressList.length === 0 ? (
              <div className="No_Addresses"> 배송지 없음 </div>
            ) : (
              <div className="Addresses_Container">
                {memberAddressData &&
                  memberAddressData.addressList.map((address, idx) => {
                    return (
                      <li className="Address_List_Item" key={`address${idx}`}>
                        <div className="Address_List_Address">
                          <div>
                            {address.isPrimary ? (
                              <span className="Addrress_Primary">
                                (대표주소)
                              </span>
                            ) : null}
                            {` ${address.addressTitle} : ${address.address} (${address.zipcode})`}
                          </div>
                        </div>
                        <div className="Address_List_Button">
                          {address.isPrimary ? null : (
                            <CustomButton
                              bgColor="transparent"
                              content="대표주소 변경"
                              fontColor="var(--indicatorColor1)"
                              padding="5px"
                              width="125px"
                              border="none"
                              buttonId={idx.toString()}
                              idx={address.addressId.toString()}
                              onClick={setPrimaryAddress}
                              hoverColor="var(--hoverColor3)"
                            />
                          )}
                          <CustomButton
                            bgColor="transparent"
                            content="수정"
                            fontColor="var(--indicatorColor1)"
                            padding="5px"
                            border="none"
                            width="50px"
                            buttonId={idx.toString()}
                            idx={address.addressId.toString()}
                            onClick={editAddress}
                            hoverColor="var(--hoverColor3)"
                          />
                          <CustomButton
                            bgColor="transparent"
                            content="삭제"
                            fontColor="var(--indicatorColor1)"
                            padding="5px"
                            border="none"
                            width="50px"
                            buttonId={idx.toString()}
                            idx={address.addressId.toString()}
                            onClick={removeAddress}
                            hoverColor="var(--hoverColor3)"
                          />
                        </div>
                      </li>
                    );
                  })}
              </div>
            )}

            <CustomButton
              bgColor="transparent"
              content="배송지 추가"
              fontColor="var(--indicatorColor1)"
              padding="10px"
              width="125px"
              border="none"
              onClick={addNewAddress}
              hoverColor="var(--hoverColor3)"
              fontsize="21px"
            />
          </ul>

          {memberAddressData && memberAddressData.tagList.length === 0 ? (
            <div className="My_Type_Wrapper Recommend_Survey">
              <p>피부 타입 검사를 실행하지 않았습니다.</p>
              <div>
                <Link to={`/skin-test/${memberId}`}>
                  <CustomButton
                    bgColor="transparent"
                    content="나의 피부타입은?"
                    fontColor="var(--indicatorColor1)"
                    padding="10px"
                    fontsize="19px"
                    border="none"
                    width="200px"
                    hoverColor="var(--hoverColor3)"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="My_Type_Wrapper">
              <h2 className="Info_Title">내 맞춤 설정</h2>
              <InfoWrapper>
                <div className="Info_Label">피지 타입</div>
                <div className="Info_Content">
                  <select className="Type_Dropdown" onChange={editSkinType}>
                    {tagList && tagList[0] === "건성" ? (
                      <option value="건성" selected>
                        건성
                      </option>
                    ) : (
                      <option value="건성">건성</option>
                    )}
                    {tagList && tagList[0] === "지성" ? (
                      <option value="지성" selected>
                        지성
                      </option>
                    ) : (
                      <option value="지성">지성</option>
                    )}
                    {tagList && tagList[0] === "복합성" ? (
                      <option value="복합성" selected>
                        복합성
                      </option>
                    ) : (
                      <option value="복합성">복합성</option>
                    )}
                  </select>
                </div>
              </InfoWrapper>
              <InfoWrapper>
                <div className="Info_Label">피부 타입</div>
                <div className="Info_Content">
                  <select className="Type_Dropdown" onChange={editSkinType}>
                    {tagList && tagList[1] === "일반피부" ? (
                      <option value="일반피부" selected>
                        일반피부
                      </option>
                    ) : (
                      <option value="일반피부">일반피부</option>
                    )}
                    {tagList && tagList[1] === "여드름성 피부" ? (
                      <option value="여드름성 피부" selected>
                        여드름성 피부
                      </option>
                    ) : (
                      <option value="여드름성 피부">여드름성 피부</option>
                    )}
                  </select>
                </div>
              </InfoWrapper>
              <InfoWrapper>
                <div className="Info_Label">관심 분야</div>
                <div className="Info_Content">
                  <ul className="Checkbox_Wrapper">
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">미백</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("미백") ? (
                        <input
                          type="checkbox"
                          name="미백"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="미백"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">주름</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("주름") ? (
                        <input
                          type="checkbox"
                          name="주름"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="주름"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">보습</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("보습") ? (
                        <input
                          type="checkbox"
                          name="보습"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="보습"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">모공</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("모공") ? (
                        <input
                          type="checkbox"
                          name="모공"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="모공"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">수분</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("수분") ? (
                        <input
                          type="checkbox"
                          name="수분"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="수분"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                    <li className="Checkbox_List_Item">
                      <span className="Checkbox_Tag">탄력</span>
                      {memberAddressData &&
                      memberAddressData.tagList.includes("탄력") ? (
                        <input
                          type="checkbox"
                          name="탄력"
                          onClick={editSkinTag}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="탄력"
                          onClick={editSkinTag}
                        />
                      )}
                    </li>
                  </ul>
                </div>
              </InfoWrapper>
            </div>
          )}
        </div>
        <div className="Edit_Button_Wrap">
          <CustomButton
            bgColor="white"
            content="수정 완료"
            fontColor="black"
            padding="10px"
            fontsize="19px"
            width="125px"
            onClick={submitEdit}
            type="submit"
            hoverColor="var(--hoverColor1)"
          />
        </div>
        <div className="Subscribe_Edit_Container">
          <h2 className="Info_Title">구독 여부</h2>
          {memberAddressData?.isSubscribed === false ? (
            <div className="Recommend_Subscription">
              <div className="No_Subscription">구독하고 있지 않습니다.</div>
              <Link to={`/members/${memberId}/subscribe`}>
                <CustomButton
                  bgColor="white"
                  content="지금 구독하세요!"
                  fontColor="black"
                  padding="15px"
                  fontsize="19px"
                  width="200px"
                  hoverColor="var(--hoverColor1)"
                />
              </Link>
            </div>
          ) : (
            <div>
              <InfoWrapper>
                <div className="Info_Label">구독 시작일</div>
                <div className="Info_Content">
                  {memberAddressData?.subscribedDate.slice(0, 4)}년{" "}
                  {memberAddressData?.subscribedDate.slice(5, 7)}월{" "}
                  {memberAddressData?.subscribedDate.slice(8, 10)}일
                </div>
              </InfoWrapper>
              <div className="Subscription_Summary">
                <div className="Info_Label">지금까지 받은 혜택</div>
                <div className="Subscription_Benefit">
                  <div>구독일로부터</div>
                  <span>{calcMonth * 5}개의 토너/로션 샘플</span>
                  <span>{calcMonth * 2}개의 세안 샘플</span>
                  <span>{calcMonth * 3}개의 앰플 샘플</span>을 받았습니다.
                </div>
              </div>
              <InfoWrapper>
                <CustomButton
                  bgColor="transparent"
                  content="구독 취소"
                  fontColor="gray"
                  padding="15px"
                  border="none"
                  fontsize="19px"
                  width="125px"
                  onClick={stopSubscription}
                  hoverColor="tomato"
                />
              </InfoWrapper>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
