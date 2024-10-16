import { useContext } from "react";
import AdminContext from "../Context/AdminProvider";


export const useAdmin = () => {
    return useContext(AdminContext);
}
