
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import SuperAdmins from "../Layout/SuperAdminLayout";
import UsersLayout from "../Layout/UsersLayout";
import NotFound from "../NotFound";
import Login from "../Auth/Login";
import ResetPassword from '../Auth/ResetPassword'
import ForgetPasswordForm from '../Auth/ForgetPasswordForm'
import SignUpForm from "../Auth/SignUpForm";
import VerifyCodeForm from "../Auth/VerifyCodeForm";
import VerifyPasswordCoda from '../Auth/VerifyPasswordCoda'
import LoginSuper from "../Auth/LoginSuper";
import ProtectedRoute from "../Auth/ProtectedRoute";
import SuperAdminsDashboard from "../SuperAdmins/Dashboard";
// import UsersDashboard from "../Users/Dashboard";
import Admin from "../SuperAdmins/Admin/Admin";
import AddAdmin from "../SuperAdmins/Admin/AddAdmin";
import Coupon from "../SuperAdmins/Coupon/Coupon";
import AddCoupon from "../SuperAdmins/Coupon/AddCoupon";
import Payment from "../SuperAdmins/Payment/Payment";
import AddPaymentMethod from "../SuperAdmins/PaymentMethod/AddPaymentMethod";
import PaymentMethod from "../SuperAdmins/PaymentMethod/PaymentMethod";
import Plans from "../SuperAdmins/Plans/Plans";
import AddPlans from "../SuperAdmins/Plans/AddPlans";
import Subscription from "../SuperAdmins/Subscription/Subscription";
import Mainpage from '../Mainpage'
//admin
import AdminDashboard from "../Admin/Dashboard";
import Project from "../Admin/Project/Project";
import AddProject from "../Admin/Project/AddProject";
import Department from "../Admin/Department/Department";
import AddDepartment from "../Admin/Department/AddDepartment";
import Subscriptions from "../Admin/Subscriptions/Subscriptions";
//user
// import Plansuser from "../Users/Plans/Plans";
// import Paymentuser from "../Users/Payment/Payment";
// import PaymentMethodsuser from "../Users/PaymentMethods/PaymentMethods";
//public page
import Home from "../PublicPage/Home";
import Plansp from '../PublicPage/Plans/Plans'
import Paymentp from "../PublicPage/Payment/Payment";
import PaymentMethodsp from "../PublicPage/PaymentMethods/PaymentMethods";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/mainpage" replace />,
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UsersLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <Home /> },
      { path: "plan", element: <Plansp /> },
      { path: "Payment", element: <Paymentp /> },
      { path: "PaymentMethods", element: <PaymentMethodsp /> },

    ],
  },
  {
    path: "/mainpage",
    element: <Mainpage />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget",
    element: <ForgetPasswordForm />,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword />,
  },
  {
    path: "/signUp",
    element: <SignUpForm />,
  },
  {
    path: "/verifyCode",
    element: <VerifyCodeForm />,
  },
  {
    path: "/VerifyPasswordCoda",
    element: <VerifyPasswordCoda />,
  },
  {
    path: "/loginsuperadmin",
    element: <LoginSuper />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "project", element: <Project /> },
      { path: "addproject", element: <AddProject /> },
      { path: "department", element: <Department /> },
      { path: "adddepartment", element: <AddDepartment /> },
      { path: "subscriptions", element: <Subscriptions /> }
    ],
  },
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute>
        <SuperAdmins />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <SuperAdminsDashboard /> },
      {path:"admin",element:<Admin/>},
      {path:"addadmin",element:<AddAdmin/>},
      {path:"coupon",element:<Coupon/>},
      {path:"addcoupon",element:<AddCoupon/>},
      {path:"payment",element:<Payment/>},
      {path:"paymentmethod",element:<PaymentMethod/>},
      {path:"addpaymentmethod",element:<AddPaymentMethod/>},
      {path:"plans",element:<Plans/>},
      {path:"addplans",element:<AddPlans/>},
      {path:"subscription",element:<Subscription/>},
    ],
  },
 
  { path: "*", element: <NotFound /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
