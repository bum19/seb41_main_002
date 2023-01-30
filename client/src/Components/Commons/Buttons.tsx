import styled from "styled-components";

const StyledButton = styled.button<{
  bgColor?: string;
  fontColor?: string;
  width?: string;
  padding?: string;
  fontsize?: string;
  border?: string;
  height?: string;
  hoverColor?: string;
  hoverBGColor?: string;
  marginRight?: string
}>`
  width: ${(props) => props.width};
  height: ${(props) => (props.height ? props.height : "100%")};
  color: ${(props) => props.fontColor};
  background-color: ${(props) => props.bgColor};
  padding: ${(props) => props.padding};
  border: ${(props) => (props.border ? props.border : "1px solid white")};
  border-radius: 5px;
  font-size: ${(props) => (props.fontsize ? props.fontsize : "17px")};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : "0")};
  &:hover {
    color: ${(props) => props.hoverColor};
    background-color: ${(props) => props.hoverBGColor};
  }
`;

interface ButtonType {
  fontColor?: string;
  bgColor?: string;
  content: string;
  width?: string;
  padding?: string;
  type?: "button" | "submit" | "reset";
  fontsize?: string;
  height?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  border?: string;
  buttonId?: string;
  idx?: string;
  hoverColor?: string;
  hoverBGColor?: string;
  marginRight?: string
}

export default function CustomButton({
  fontsize,
  fontColor,
  bgColor,
  content,
  width,
  padding,
  onClick,
  type,
  border,
  buttonId,
  idx,
  height,
  hoverColor,
  hoverBGColor,
  marginRight
}: ButtonType) {
  return (
    <StyledButton
      fontsize={fontsize}
      bgColor={bgColor}
      fontColor={fontColor}
      width={width}
      padding={padding}
      onClick={onClick}
      type={type}
      border={border}
      id={buttonId}
      name={idx}
      height={height}
      hoverColor={hoverColor}
      hoverBGColor={hoverBGColor}
      marginRight={marginRight}
    >
      {content}
    </StyledButton>
  );
}
