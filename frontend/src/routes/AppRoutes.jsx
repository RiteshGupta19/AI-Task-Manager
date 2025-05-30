import { useRoutes} from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from '@mui/material';


// // import all modular routes

import { UserRoutes } from "./UserRoute";
import { authRoutes } from "./AuthRoutes";
import { publicRoutes } from "./PublicRoutes";

import Error404 from "../components/Common/Error404";

const AppRoutes = () => {
  const routes = useRoutes([
    ...publicRoutes,
    authRoutes,
    UserRoutes,
    { path: "*", element: <Error404 /> }
  ]);

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress sx={{ color: "#13AA52" }} />
        </Box>
      }
    >
      {routes}
    </Suspense>
  );
};

export default AppRoutes;
