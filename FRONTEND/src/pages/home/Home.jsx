import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../../global/STORE/cartSlice";
import { fetchAllProducts } from "../../../global/STORE/productSlice";
import { STATUSES } from "../../../global/mis/statuses";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const { data: products = [], status } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart(productId));
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const handleBuyNow = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart(productId));
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">New arrivals</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Shop our products</h1>
        </section>

        {status === STATUSES.LOADING && products.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600">Loading products...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <Link to={`/productdetails/${product._id}`} className="block">
                  <img
                    src={product.productImageUrl || "https://www.whitmorerarebooks.com/pictures/medium/2465.jpg"}
                    alt={product.productName}
                    className="h-64 w-full object-cover"
                  />
                </Link>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                      {product.productStatus || "In stock"}
                    </p>
                    <Link to={`/productdetails/${product._id}`} className="text-xl font-bold text-slate-900 hover:text-yellow-700">
                      {product.productName}
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{product.productDescription}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="text-2xl font-bold text-slate-900">NPR {Number(product.productPrice || 0).toLocaleString()}</span>
                    <span>{product.productStockQty || 0} in stock</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-yellow-950 transition hover:bg-yellow-400"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product._id)}
                      className="flex-1 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
