import styled from "styled-components";

const StyledButton = styled.button<{
  bgColor: string;
  fontColor: string;
  width: string;
  padding: string;
}>`
  width: ${(props) => props.width};
  color: ${(props) => props.fontColor};
  background-color: ${(props) => props.bgColor};
  padding: ${(props) => props.padding};
  border-radius: 5px;
  font-size: 17px;
`;

interface ButtonType {
  fontColor: string;
  bgColor: string;
  content: string;
  width: string;
  padding: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CustomButton({
  fontColor,
  bgColor,
  content,
  width,
  padding,
  onClick
}: ButtonType) {
  return (
    <StyledButton
      bgColor={bgColor}
      fontColor={fontColor}
      width={width}
      padding={padding}
      onClick={onClick}
    >
      {content}
    </StyledButton>
  );
}
