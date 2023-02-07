type PropsType = {
  name: string;
};

export default function LogoutIcon(props: PropsType) {
  return (
    <svg
      className={props.name}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="512"
      height="512"
      fill="white"
    >
      <g
        transform="translate(-3,-5) scale(0.002312,0.002727)"
        fill="white"
        stroke="none"
      >
        <path d="M6080 11255 c-171 -35 -306 -109 -435 -239 -100 -101 -158 -193 -199 -316 -36 -108 -46 -186 -46 -357 l0 -153 2355 0 c1694 0 2369 -3 2407 -11 167 -35 301 -170 337 -337 16 -76 16 -6808 0 -6884 -36 -167 -171 -302 -337 -337 -38 -8 -713 -11 -2407 -11 l-2355 0 0 -152 c0 -172 10 -250 46 -358 41 -122 99 -214 199 -316 133 -134 278 -211 459 -243 41 -8 807 -11 2393 -11 2569 0 2395 -4 2563 61 107 41 192 100 290 199 126 127 201 275 229 450 15 91 15 8229 0 8320 -55 348 -329 629 -677 696 -106 20 -4721 19 -4822 -1z" />
        <path d="M5825 8954 c-44 -14 -78 -43 -289 -252 -266 -265 -286 -292 -286 -397 0 -37 8 -76 19 -101 13 -28 204 -227 646 -670 l628 -629 -2574 -5 -2574 -5 -41 -22 c-56 -30 -119 -103 -133 -155 -9 -31 -11 -143 -9 -383 3 -328 4 -341 25 -381 25 -48 83 -101 129 -120 28 -12 446 -14 2604 -14 1413 0 2570 -3 2570 -7 0 -4 -281 -289 -625 -633 -478 -479 -629 -636 -644 -670 -27 -60 -27 -150 0 -210 29 -64 454 -491 523 -525 64 -32 157 -34 219 -5 31 15 363 341 1218 1197 1160 1162 1176 1179 1208 1251 30 66 33 80 30 150 -5 97 -35 161 -123 263 -35 41 -563 572 -1172 1181 -783 781 -1122 1112 -1153 1128 -57 29 -133 34 -196 14z" />
      </g>
    </svg>
  );
}
