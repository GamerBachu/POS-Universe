import { PATHS } from "@/routes/paths"; 
import { Navigate } from "react-router-dom";

const Index = () => {
  return <Navigate to={PATHS.START} replace />;
};

export default Index;
