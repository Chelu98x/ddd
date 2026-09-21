import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteCartItem, fetchCartItems, updateCartItem } from "../../../global/STORE/cartSlice";
import { STATUSES } from "../../../global/mis/statuses";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items || []);
  const status = useSelector((state) => state.cart.status);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const validItems = items.filter((item) => {
    const product = item?.product || item;
    return product && product.productName;
  });

  const subtotal = validItems.reduce((total, item) => {
    const product = item.product || item;
    const qty = item.quantity || 1;
    return total + (Number(product.productPrice || 0) * qty);
  }, 0);

  const handleQtyChange = (productId, nextQty) => {
    if (nextQty < 1) return;
    dispatch(updateCartItem(productId, nextQty));
  };

  if (status === STATUSES.LOADING && validItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-10 text-slate-600 shadow-sm">
          Loading your cart...
        </div>
      </main>
    );
  }

  if (!validItems.length) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="mt-3 text-slate-600">Add a product to continue shopping.</p>
          <Link to="/" className="mt-6 inline-block rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Shopping cart</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Your items</h1>
          </div>
          <Link to="/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Continue shopping</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-4">
            {validItems.map((item) => {
              const product = item.product || item;
              const productId = product._id || item._id;
              const quantity = item.quantity || 1;

              return (
                <div key={productId} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                  <img
                    src={product.productImageUrl || "https://www.whitmorerarebooks.com/pictures/medium/2465.jpg"}
                    alt={product.productName}
                    className="h-32 w-full rounded-lg object-cover sm:w-36"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{product.productName}</h2>
                      <p className="mt-1 text-sm text-slate-600">{product.productDescription}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(productId, quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-lg text-slate-700 hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(productId, quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-lg text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-slate-900">NPR {(Number(product.productPrice || 0) * quantity).toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(deleteCartItem(productId))}
                          className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>NPR {subtotal.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
