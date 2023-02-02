import "./Style/shoppingPage.css";
import {
  getProductList,
  getMemberTagList,
} from "../API/ShoppingList/getShoppingList";
import { useEffect, useRef, useState } from "react";
import { ShoppingCategoryTab } from "../Components/ShoppingList/CategoryTab";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

export const ProductImage = styled.img`
  width: 200px;
  height: 200px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

interface ProductProps {
  itemId: number;
  itmeTitle: string;
  price: number;
  titleImageURL: string;
}

interface ProductListProps {
  products: ProductProps[];
}

const ProductList = (props: ProductListProps) => {
  return (
    <>
      {props.products.length === 0
        ? []
        : props.products.map((item, index) => (
            <li key={index}>
              <a href={`/itemDetail/${item.itemId}`}>
                <div className="Shopping_Product_Info">
                  <ProductImage src={`${item.titleImageURL}`} />
                  <div className="Product_Text_Container">
                    <h4 className="Product_Title_Content">{item.itmeTitle}</h4>
                    <p className="Product_Price_Content">
                      가격: {item.price}원
                    </p>
                  </div>
                </div>
              </a>
            </li>
          ))}
    </>
  );
};

const getProducts = async (
  categoryName: string,
  custom: boolean,
  page = 0,
  keyword = "",
  accessToken?: string | null
): Promise<ProductProps[]> => {
  const results = await getProductList({
    categoryENName: categoryName,
    custom,
    page,
    keyword,
    accessToken,
  });
  return results.map((item) => ({
    itemId: item.itemId,
    itmeTitle: item.itemTitle,
    price: item.price,
    titleImageURL: item.titleImageURL,
  }));
};

export default function ShoppingPage() {
  const [isCustom, setIsCustom] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [memberTagData, setMemberTagData] = useState<any>(null);
  const [fetchingStatus, setFetchingStatus] = useState<boolean>(false);
  const [serchWord, setSerchWord] = useState("");
  const [lock, setLock] = useState<boolean>(false);
  const bottomRef = useRef(null);
  const accessToken = sessionStorage.getItem("accessToken");
  const session = sessionStorage.getItem("memberId");
  const params = useParams();
  const navigate = useNavigate();
  const fetchMemberTagData = async () => {
    const result = await getMemberTagList({
      categoryENName: params.categoryENName as string,
      custom: isCustom,
      page: pageNumber,
      keyword: serchWord,
      accessToken: accessToken,
    });
    setMemberTagData(result);
  };

  useEffect(() => {
    fetchMemberTagData();
  }, []);

  useEffect(() => {
    setProducts([]);
    setLock(false);
    setPageNumber(1);
  }, [params.categoryENName]);

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, isCustom]);

  const fetchProducts = async () => {
    setFetchingStatus(true);
    let newProducts: ProductProps[] = [...products];
    const fetchedProducts = await getProducts(
      params.categoryENName as string,
      isCustom,
      pageNumber,
      serchWord,
      accessToken
    );
    if (fetchedProducts.length === 0) {
      setLock(true);
    } else {
      newProducts = newProducts.concat(fetchedProducts);
      setProducts(newProducts);
      setFetchingStatus(false);
    }
  };

  const tabChangeFetch = async () => {
    const result = await getProducts(
      params.categoryENName as string,
      isCustom,
      1,
      serchWord,
      accessToken
    );
    return setProducts(result);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (lock === true) {
          return;
        }
        setPageNumber(pageNumber + 1);
      }
    });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [products]);

  const serchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && serchWord.length !== 0) {
      tabChangeFetch();
      navigate(`/items-list/all?custom=${isCustom}&title=${serchWord}`);
    }
  };

  return (
    <div>
      <div className="Shopping_List_Container">
        <div className="Shopping_List_Search">
          <input
            type="text"
            placeholder="검색하세요"
            className="Search_Bar"
            defaultValue={serchWord}
            onChange={(e) => setSerchWord(e.target.value)}
            onKeyUp={(e) => {
              if (serchWord.length !== 0) {
                serchSubmit(e);
              }
            }}
          />
        </div>
        <div className="Shopping_Tab_Container">
          <ul className="Tab_List">
            <ShoppingCategoryTab
              setIsCustom={setIsCustom}
              isCustom={isCustom}
              session={session}
              serchWord={serchWord}
              pageNumber={pageNumber}
              memberTagData={memberTagData}
              params={params.categoryENName}
            />
          </ul>
        </div>
        <div className="Product_List_Container">
          <ul className="Product_List">
            {products.length !== 0 ? (
              <ProductList products={products} />
            ) : (
              <div>검색 제품이 없습니다</div>
            )}
          </ul>
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
