import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopProductData } from "../API/ItemTopList/getTopList";
import { getTopList } from "../API/ItemTopList/getTopList";
import TopListCategoryTab from "../Components/ItemTopList/TopListCategoryTab";
import TopProductList from "../Components/ItemTopList/TopProductList";
import "./Style/itemsTopList.css";

export default function ItemsTopList() {
  const navigate = useNavigate()
  const [category, setCategory] = useState("전체");
  const [categoryENName, setCategoryENName] = useState("all");
  // 추후 변경예정
  const [topProductData, setTopProductData] = useState<any>([]);
  const [customCheck, setCustomCheck] = useState(false);

  const params = useParams()

  console.log(params)

  const topProductList = async () => {
    const result = await getTopList(categoryENName, customCheck);
    setTopProductData(result);
  };

  useEffect(() => {
    topProductList();
  }, [categoryENName]);

    // 더미 session
    const session = {
      memberId: 1,
      accountId: "abc",
    };

  return (
    <div>
      <h2 className="Top_List_Title">이 달의 Top 10 {category}</h2>
      <div className="Tab_Container">
        <ul className="Filter_Options">
          <TopListCategoryTab
            setCategory={setCategory}
            setCategoryENName={setCategoryENName}
            session={session}
            navigate={navigate}
            customCheck={customCheck}
            setCustomCheck={setCustomCheck}
            params={params}
            userCustomInfo={topProductData.member}
          />
        </ul>
      </div>
      <div className="Products_Gallery">
        <ul className="Products_Row">
          <TopProductList topProductData={topProductData.topList} />
        </ul>
      </div>
    </div>
  );
}
