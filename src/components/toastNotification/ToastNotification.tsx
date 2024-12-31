import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { RootState } from "@/utils/store"; // Import RootState from your store setup
import { resetToast } from "@/utils/toastSlice";

const ToastNotification = () => {
  const dispatch = useDispatch();
  const toastState = useSelector((state: RootState) => state.toast);

  useEffect(() => {
    if (toastState.type !== "reset" && toastState.message) {
      toast[toastState.type](toastState.message); // Show toast if type is valid
      dispatch(resetToast()); // Reset toast state after displaying
    }
  }, [toastState, dispatch]);

  return <ToastContainer position='top-right' autoClose={3000} />;
};

export default ToastNotification;
