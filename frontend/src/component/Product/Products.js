import React,{ Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch  } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";


const categories = [
    "Processor",
    "Ram",
    "Motherboard",
    "Power Supply",
    "PC Casing",
    "Cooling",
    "Monitor",
    "Storage",
    "External Storage",
    "Consoles",
    "Mobile",
    "Laptops",
];

const Products = ({ match }) => {
    const dispatch = useDispatch();
    const alert = useAlert(); 
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 500000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0)
    const {products,loading,error,productsCount,resultPerPage} = useSelector((state) => state.products);
    const keyword = match.params.keyword;
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };
        useEffect(() => {
            if (error){
                alert.error(error);
                dispatch(clearErrors());
            }
            dispatch(getProduct(keyword, currentPage, price, category, ratings));
        }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);
   
        
    return (
    <Fragment>
        {loading ? (
             <Loader /> 
             ) : (
         <Fragment> 
             <MetaData title="SHOP -- REXONTECH"/>
            <h2 className="productsHeading">All Tech Items</h2>

            <div className="products">
                {products && 
                products.map((product) => (
                    <ProductCard key = {product._id} product={product} />
                ))}
            </div>

            <div className="filterBox">
            <Typography>Filter By Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={500000}
            />
            <Typography>Categories</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                className="category-link"
                                key={category}
                                onClick={() => setCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>

                    <fieldset>
                        <Typography component="legend"> Ratings </Typography>
                        <Slider
                            value={ratings}
                            onChange={(e, newRating) => {
                                setRatings(newRating);
                            }}
                            aria-labelledby="continous-slider"
                            min={0}
                            max={5}
                        />
                    </fieldset>

            </div>

            {resultPerPage < productsCount && (
                <div className="paginationBox">
                <Pagination 
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                />
                </div>
            )}

            </Fragment>
            )}
            </Fragment>
    );
    
};

export default Products;
