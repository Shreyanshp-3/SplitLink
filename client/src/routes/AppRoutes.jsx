import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/index.jsx";
import Landing from "../pages/Landing/index.jsx";
import Login from "../pages/MemberLogin/index.jsx";
import NotFound from "../pages/NotFound/index.jsx";
import CreateGroup from "../pages/CreateGroup/index.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-group" element={<CreateGroup />} />
    {/* Public for MVP — inviteCode matches GET /api/groups/:inviteCode/ */}
    <Route path="/dashboard/:inviteCode" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
