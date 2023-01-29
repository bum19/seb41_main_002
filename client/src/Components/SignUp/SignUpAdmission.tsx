import { Dispatch, SetStateAction } from "react";
import { MemberType, signUp } from "../../API/SignUp";
import { useAppDispatch } from "../../Store/hooks";
import { asyncLogin, MemberInputType } from "../../Store/slices/userSlice";
import "../Style/signUp.css";

const SignUpAdmission = ({
  Member,
  setSignUpModalState,
  setModalState,
  setMessage,
}: {
  Member: MemberType;
  setSignUpModalState: Dispatch<SetStateAction<boolean>>;
  setModalState: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
}) => {
  const dispatch = useAppDispatch();

  const memberSignUp = () => {
    signUp(Member).then((res) => {
      if (res !== undefined) {
        if (res === 409) {
          setModalState(true);
          setMessage("이메일이 중복입니다.");
          setSignUpModalState(false);
        } else {
          const memberInfo: MemberInputType = {
            accountId: res.accountId,
            password: res.password,
          };
          setSignUpModalState(false);
          dispatch(asyncLogin(memberInfo));
        }
      }
    });
  };

  return (
    <div>
      <h2>회원가입 하시겠습니까?</h2>
      <div className="Select_Button">
        <button onClick={memberSignUp}>확인</button>
        <button onClick={() => setSignUpModalState(false)}>취소</button>
      </div>
    </div>
  );
};

export default SignUpAdmission;
