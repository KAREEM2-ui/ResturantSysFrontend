import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Logout({setIsAuth}) {
    
    const navigate = useNavigate()

    const logout = ()=>{
        api.post("/logout")
        .then((res)=>{
            localStorage.removeItem("token")
            setIsAuth(false)
            navigate("/login");
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 position-fixed top-0 inset-s-0 w-100 bg-dark bg-opacity-50">
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px" }}>
        <p className="fs-5 mb-4">
          Are you sure you want to LOGOUT ?
        </p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-danger px-4" 
          onClick={logout} >
            Logout
          </button>
          <button
            className="btn btn-secondary px-4"
            onClick={()=>navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

}
export default Logout;